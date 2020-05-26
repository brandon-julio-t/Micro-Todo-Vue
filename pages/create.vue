<template>
  <v-container>
    <v-hover v-slot:default="{ hover }">
      <v-card :elevation="hover ? 8 : 2">
        <v-card-title>Create Todo</v-card-title>

        <v-subheader v-if="!newTodoDateTimeIsValid" class="red--text">
          Todo due date and time must be before now
        </v-subheader>

        <v-card-text>
          <v-form ref="form" v-model="formIsValid">
            <v-text-field
              v-model="newTodoTitle"
              :rules="rulesTodoTitle"
              clearable
              label="Todo Name"
              required
            ></v-text-field>

            <v-row justify="space-around" align="center">
              <v-col sm="auto">
                <h2>Due Date</h2>

                <v-date-picker
                  v-model="newTodoDate"
                  :min="getTodayDate()"
                  scrollable
                ></v-date-picker>
              </v-col>

              <v-col sm="auto">
                <h2>Due Time</h2>

                <v-time-picker
                  v-model="newTodoTime"
                  :min="
                    newTodoDate === getTodayDate() ? getCurrentTime() : '00:00'
                  "
                  scrollable
                ></v-time-picker>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-row justify="center">
            <v-col>
              <v-btn block @click="submitTodo">
                Submit
              </v-btn>
            </v-col>
            <v-col>
              <v-btn block to="/">Cancel</v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-hover>

    <v-snackbar v-model="showSuccessSnackbar">
      Todo created

      <v-btn icon color="white" @click="showSuccessSnackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      error: null,
      formIsValid: false,

      newTodoTitle: '',
      newTodoDate: this.getTodayDate(),
      newTodoTime: this.getCurrentTime(),

      showSuccessSnackbar: true,

      rulesTodoTitle: [(text) => !!text || 'Todo Title is required.']
    }
  },

  computed: {
    newTodoISODateTime() {
      return `${this.newTodoDate}T${this.newTodoTime}:00Z`
    },

    newTodoDateTimeIsValid() {
      return new Date().getTime() < new Date(this.newTodoISODateTime).getTime()
    }
  },

  methods: {
    getTodayDate() {
      return new Date().toISOString().substr(0, 10)
    },

    getCurrentTime() {
      return new Date().toTimeString().substring(0, 5)
    },

    async submitTodo() {
      try {
        this.$refs.form.validate()

        const user = JSON.parse(
          localStorage.getItem(this.$store.state.userLocalStorageKey)
        )

        if (user && this.formIsValid && this.newTodoDateTimeIsValid) {
          const todoData = {
            title: this.newTodoTitle,
            done: false,
            due_date: this.newTodoISODateTime,
            user_id: user.id
          }

          this.$axios.setToken(user.token.access_token, 'Bearer')

          await this.$axios.$post(
            `${process.env.URL}/.netlify/functions/todos-create`,
            todoData
          )

          this.showSuccessSnackbar = true
        }
      } catch (e) {
        this.error = e
      }
    }
  }
}
</script>
