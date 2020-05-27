<template>
  <v-container>
    <v-hover v-slot:default="{ hover }">
      <v-card :elevation="hover ? 8 : 2" :loading="isWaitingForResponse">
        <v-card-title>Create Todo</v-card-title>

        <v-subheader v-if="!newTodoDateTimeIsValid" class="red--text">
          Todo due date and time must be before now
        </v-subheader>

        <v-form ref="form" v-model="formIsValid">
          <v-card-text>
            <v-text-field
              v-model="newTodoTitle"
              :rules="rulesTodoTitle"
              clearable
              label="Todo Title"
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
          </v-card-text>

          <v-card-actions>
            <v-row justify="center">
              <v-col>
                <v-btn
                  :disabled="isWaitingForResponse"
                  block
                  @click="submitTodo"
                >
                  Submit
                </v-btn>
              </v-col>
              <v-col>
                <v-btn block nuxt to="/">Cancel</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-form>
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

      newTodoTitle: '',
      newTodoDate: this.getTodayDate(),
      newTodoTime: this.getCurrentTime(),

      isWaitingForResponse: false,
      formIsValid: false,
      showSuccessSnackbar: false,

      rulesTodoTitle: [(text) => !!text || 'Todo title is required']
    }
  },

  computed: {
    newTodoISODateTime() {
      return `${this.newTodoDate}T${this.newTodoTime}:00`
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
      this.isWaitingForResponse = true

      try {
        this.$refs.form.validate()

        const user = this.$store.state.user
        if (user && this.formIsValid && this.newTodoDateTimeIsValid) {
          const todoData = {
            title: this.newTodoTitle,
            done: false,
            due_date: this.newTodoISODateTime,
            user_id: user.id
          }

          this.$axios.setToken(user.token.access_token, 'Bearer')
          await this.$axios.$post(this.$store.state.todoAPIEndpoint, todoData)

          this.$refs.form.reset()
          this.showSuccessSnackbar = true
        }
      } catch (e) {
        this.error = e
      }

      this.isWaitingForResponse = false
    }
  }
}
</script>
