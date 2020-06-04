<template>
  <app-hoverable-card :loading="isWaitingForResponse">
    <v-card-title>
      {{ todo.data.title }}

      <v-spacer></v-spacer>

      <v-checkbox
        :disabled="isWaitingForResponse"
        :input-value="todo.data.done"
        color="success"
        @change="updateTodoDoneStatus(todo)"
      ></v-checkbox>
    </v-card-title>

    <v-card-subtitle>
      Due:
      {{ prettyFormatDateTime(todo.data.due_date) }}
    </v-card-subtitle>

    <v-card-actions>
      <v-btn
        :disabled="todo.data.done || isWaitingForResponse"
        color="secondary"
        icon
        @click="$emit('show-edit-todo-overlay', todo)"
      >
        <v-icon>mdi-square-edit-outline</v-icon>
      </v-btn>
      <v-btn :disabled="isWaitingForResponse" color="error" icon>
        <v-icon @click="deleteTodo(todo)">
          mdi-trash-can
        </v-icon>
      </v-btn>
    </v-card-actions>
  </app-hoverable-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

import AppHoverableCard from '~/components/common/AppHoverableCard'

export default {
  name: 'TheTodoCard',

  components: { AppHoverableCard },

  props: {
    todo: { type: Object, required: true }
  },

  data() {
    return {
      isWaitingForResponse: false
    }
  },

  computed: {
    ...mapGetters(['getTodoId', 'todoAPIEndpoint', 'userToken']),
    ...mapState(['user'])
  },

  methods: {
    ...mapActions(['refreshTodos']),
    ...mapMutations(['toggleTodoDoneStatus']),

    async deleteTodo(todo) {
      if (this.user) {
        const todoId = this.getTodoId(todo)

        this.isWaitingForResponse = true

        this.$axios.setToken(this.userToken, 'Bearer')
        await this.$axios.$delete(this.todoAPIEndpoint, {
          data: { id: todoId }
        })

        await this.refreshTodos()

        this.isWaitingForResponse = false
      }
    },

    async updateTodoDoneStatus(todo) {
      if (this.user) {
        const todoId = this.getTodoId(todo)

        this.isWaitingForResponse = true

        this.toggleTodoDoneStatus(todoId)

        this.$axios.setToken(this.userToken, 'Bearer')
        await this.$axios.$put(this.todoAPIEndpoint, {
          id: todoId,
          data: todo.data
        })

        await this.refreshTodos()

        this.isWaitingForResponse = false
      }
    },

    prettyFormatDateTime(datetime) {
      return new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        day: 'numeric',
        month: 'long',

        hour: 'numeric',
        minute: '2-digit'
      }).format(new Date(datetime))
    }
  }
}
</script>
