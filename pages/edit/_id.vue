<template>
  <v-container>
    <v-card v-if="$fetchState.pending">
      <v-card-title>Fetching your Todo</v-card-title>
      <v-card-text>Please wait warmly.</v-card-text>
    </v-card>

    <v-card v-else-if="$fetchState.error">
      <v-card-title>An Error Occurred</v-card-title>

      <v-card-text>{{ $fetchState.error.message }}</v-card-text>

      <v-card-actions>
        <v-btn block href="mailto:brandon.julio.t@icloud.com">
          Contact Website Administrator
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-if="todo" :loading="isWaitingForResponse">
      <v-card-title>Edit Todo</v-card-title>

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
          <v-row>
            <v-col>
              <v-btn :disabled="isWaitingForResponse" block @click="updateTodo">
                Submit
              </v-btn>
            </v-col>
            <v-col>
              <v-btn :disabled="isWaitingForResponse" block nuxt to="/">
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-form>
    </v-card>

    <v-snackbar v-model="showSuccessSnackbar">
      Todo updated

      <v-btn icon color="white" @click="showSuccessSnackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  async fetch() {
    this.todoId = this.$route.params.id

    const user = this.$store.state.user
    if (user) {
      this.$axios.setToken(user.token.access_token, 'Bearer')

      const response = await this.$axios.$get(
        this.$store.state.todoAPIEndpoint,
        {
          params: {
            todoId: this.todoId
          }
        }
      )

      this.todo = response.data
      this.newTodoTitle = this.todo.title
      this.newTodoDate = this.extractDate(this.todo.due_date)
      this.newTodoTime = this.extractTime(this.todo.due_date)
    }
  },

  data() {
    return {
      todoId: null,
      todo: null,

      newTodoTitle: '',
      newTodoDate: '1970-01-01',
      newTodoTime: '00:00',

      formIsValid: false,
      isWaitingForResponse: false,
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
    extractDate(isoDate) {
      return isoDate.substring(0, 10)
    },

    extractTime(isoDate) {
      return new Date(isoDate).toTimeString().substring(0, 5)
    },

    getTodayDate() {
      return new Date().toISOString().substr(0, 10)
    },

    getCurrentTime() {
      return new Date().toTimeString().substring(0, 5)
    },

    async updateTodo() {
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
          const response = await this.$axios.$put(
            this.$store.state.todoAPIEndpoint,
            {
              id: this.$route.params.id,
              data: todoData
            }
          )

          console.log(response)

          this.$fetch()
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
