<template>
  <v-card :loading="isWaitingForResponse">
    <v-card-title>
      {{ actionName }} todo
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('close-overlay')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-subheader v-if="!newTodoDateAndTimeIsLater" class="red--text">
      Todo due date and time must be before now
    </v-subheader>

    <v-form ref="form" v-model="formIsValid">
      <v-card-text>
        <v-text-field
          v-model="todoTitle"
          :rules="rulesTodoTitle"
          clearable
          label="Todo Title"
          required
        ></v-text-field>

        <v-row justify="center" align="center">
          <v-col>
            <h2>Due Date</h2>

            <v-date-picker
              v-model="todoDate"
              :min="getTodayDate()"
              scrollable
            ></v-date-picker>
          </v-col>

          <v-col>
            <h2>Due Time</h2>

            <v-time-picker
              v-model="todoTime"
              :min="todoDate === getTodayDate() ? getCurrentTime() : '00:00'"
              scrollable
            ></v-time-picker>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-row>
          <v-col>
            <v-btn
              :disabled="isWaitingForResponse"
              block
              @click="createOrUpdateTodoByAction"
            >
              Submit
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              :disabled="isWaitingForResponse"
              block
              @click="$emit('close-overlay')"
            >
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: 'TheTodoForm',

  data() {
    return {
      todoId: null,
      todoDate: null,
      todoTime: null,
      todoTitle: null,

      formIsValid: false,
      isWaitingForResponse: false,

      rulesTodoTitle: [(text) => !!text || 'Todo title is required']
    }
  },

  computed: {
    actionName() {
      return this.$store.state.oldTodo.actionName
    },

    todoHasAnyChange() {
      const {
        date: oldDate,
        time: oldTime,
        title: oldTitle
      } = this.$store.state.oldTodo

      const oldTodoISODateTime = this.$store.getters['oldTodo/toISODateTime'](
        oldDate,
        oldTime
      )

      return (
        this.todoTitle !== oldTitle ||
        oldTodoISODateTime !== this.newTodoISODateTime
      )
    },

    newTodoISODateTime() {
      return this.$store.getters['oldTodo/toISODateTime'](
        this.todoDate,
        this.todoTime
      )
    },

    newTodoDateAndTimeIsLater() {
      return Date.now() < new Date(this.newTodoISODateTime).getTime()
    },

    user() {
      return this.$store.state.user
    }
  },

  mounted() {
    const { date, id, time, title } = this.$store.state.oldTodo
    this.todoId = id
    this.todoTitle = title
    this.todoDate = date
    this.todoTime = time
  },

  methods: {
    getTodayDate() {
      return this.$store.getters['oldTodo/todayISODate']()
    },

    getCurrentTime() {
      return this.$store.getters['oldTodo/nowISOHourAndMinute']()
    },

    async createOrUpdateTodoByAction() {
      this.$refs.form.validate()

      if (
        this.user &&
        this.formIsValid &&
        this.todoHasAnyChange &&
        this.newTodoDateAndTimeIsLater
      ) {
        this.isWaitingForResponse = true

        let snackbarMessage = 'Todo '
        switch (this.actionName) {
          case 'Create':
            await this.createTodo()
            snackbarMessage += 'created'
            break

          case 'Edit':
            await this.updateTodo()
            snackbarMessage += 'updated'
            break
        }

        this.$refs.form.reset()
        this.isWaitingForResponse = false

        this.$emit('close-overlay')
        this.$emit('refresh-todos')
        this.$emit('show-success-snackbar', snackbarMessage)
      }
    },

    async createTodo() {
      const todoData = {
        title: this.todoTitle,
        done: false,
        due_date: this.newTodoISODateTime,
        user_id: this.user.id
      }

      this.$axios.setToken(this.user.token.access_token, 'Bearer')
      await this.$axios.$post(this.$store.getters.todoAPIEndpoint, todoData)
    },

    async updateTodo() {
      const todoData = {
        title: this.todoTitle,
        done: false,
        due_date: this.newTodoISODateTime,
        user_id: this.user.id
      }

      this.$axios.setToken(this.user.token.access_token, 'Bearer')
      await this.$axios.$put(this.$store.getters.todoAPIEndpoint, {
        id: this.todoId,
        data: todoData
      })
    }
  }
}
</script>
