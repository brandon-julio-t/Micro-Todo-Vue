<template>
  <v-card :loading="isWaitingForResponse" :light="!darkTheme">
    <v-card-title>
      {{ todoForm.actionName }} todo

      <v-spacer></v-spacer>

      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-subheader v-if="!todoDateAndTimeIsLater" class="red--text">
      Todo due date and time must be before now
    </v-subheader>

    <v-form ref="form" v-model="formIsValid">
      <v-card-text>
        <v-text-field
          :rules="rulesTodoTitle"
          :value="todoForm.title"
          clearable
          label="Todo Title"
          @input="updateTitle"
        ></v-text-field>

        <v-row justify="center">
          <v-col cols="auto">
            <h2>Due Date</h2>

            <v-date-picker
              :value="todoForm.date"
              :min="getTodayDate()"
              scrollable
              @input="updateDate"
            ></v-date-picker>
          </v-col>

          <v-col cols="auto">
            <h2>Due Time</h2>

            <v-time-picker
              :min="minTimeForTimePicker"
              :value="todoForm.time"
              scrollable
              @input="updateTime"
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
              color="error"
              @click="$emit('close')"
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
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  name: 'TheTodoForm',

  data() {
    return {
      oldForm: null,

      formIsValid: false,
      isWaitingForResponse: false,

      rulesTodoTitle: [(text) => !!text || 'Todo title is required']
    }
  },

  computed: {
    ...mapGetters({
      nowISOHourAndMinute: 'todoForm/nowISOHourAndMinute',
      toISODateTime: 'todoForm/toISODateTime',
      todayISODate: 'todoForm/todayISODate',
      todoAPIEndpoint: 'todoAPIEndpoint',
      userToken: 'userToken'
    }),

    ...mapState(['todoForm', 'user']),

    darkTheme() {
      return this.$vuetify.theme.dark
    },

    formHasAnyChange() {
      const keys = Object.keys(this.todoForm)
      for (const key of keys) {
        const oldFormValue = this.oldForm[key]
        const newFormValue = this.todoForm[key]

        if (oldFormValue !== newFormValue) {
          return true
        }
      }

      return false
    },

    minTimeForTimePicker() {
      return this.todoForm.date === this.getTodayDate()
        ? this.getCurrentTime()
        : '00:00'
    },

    todoISODateTime() {
      const { date, time } = this.todoForm
      return this.toISODateTime(date, time)
    },

    todoDateAndTimeIsLater() {
      return Date.now() < new Date(this.todoISODateTime).getTime()
    }
  },

  mounted() {
    this.oldForm = Object.assign({}, this.todoForm)
  },

  methods: {
    ...mapMutations({
      updateDate: 'todoForm/updateDate',
      updateTime: 'todoForm/updateTime',
      updateTitle: 'todoForm/updateTitle'
    }),

    async createOrUpdateTodoByAction() {
      this.$refs.form.validate()

      if (
        this.user &&
        this.formHasAnyChange &&
        this.formIsValid &&
        this.todoDateAndTimeIsLater
      ) {
        this.isWaitingForResponse = true

        let snackbarMessage = 'Todo '
        switch (this.todoForm.actionName) {
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

        this.$emit('close')
        this.$emit('refresh-todos')
        this.$emit('show-success-snackbar', snackbarMessage)
      }
    },

    async createTodo() {
      const todoData = {
        done: false,
        due_date: this.todoISODateTime,
        priority: 0,
        title: this.todoForm.title,
        user_id: this.user.id
      }

      this.$axios.setToken(this.userToken, 'Bearer')
      await this.$axios.$post(this.todoAPIEndpoint, todoData)
    },

    getTodayDate() {
      return this.todayISODate()
    },

    getCurrentTime() {
      return this.nowISOHourAndMinute()
    },

    async updateTodo() {
      const todoData = {
        title: this.todoForm.title,
        done: false,
        due_date: this.todoISODateTime,
        user_id: this.user.id
      }

      this.$axios.setToken(this.userToken, 'Bearer')
      await this.$axios.$put(this.todoAPIEndpoint, {
        id: this.todoForm.id,
        data: todoData
      })
    }
  }
}
</script>
