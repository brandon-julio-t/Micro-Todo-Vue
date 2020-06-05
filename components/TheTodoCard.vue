<template>
  <app-hoverable-card :loading="isWaitingForResponse">
    <v-card-title>
      {{ todo.data.title }}

      <v-spacer></v-spacer>

      <v-checkbox
        :disabled="isWaitingForResponse"
        :input-value="todo.data.done"
        @change="updateTodoDoneStatus(todo)"
      ></v-checkbox>
    </v-card-title>

    <v-card-subtitle
      :class="{ 'red--text': !todoDateIsUpcoming(todo) && !todo.data.done }"
    >
      Due at:
      {{ prettyFormatDateTime(todo.data.due_date) }}
    </v-card-subtitle>

    <v-card-actions>
      <v-btn
        v-if="!todo.data.done"
        :disabled="isWaitingForResponse"
        icon
        @click="$emit('show-edit-todo-overlay', todo)"
      >
        <v-icon>mdi-square-edit-outline</v-icon>
      </v-btn>

      <v-btn :disabled="isWaitingForResponse" color="red" icon>
        <v-icon @click="deleteTodo(todo)">
          mdi-trash-can
        </v-icon>
      </v-btn>

      <v-spacer></v-spacer>

      <span v-if="!todo.data.done">
        <v-btn
          :disabled="isWaitingForResponse"
          icon
          @click="decreasePriority(todo)"
        >
          <v-icon>mdi-minus</v-icon>
        </v-btn>

        <span
          v-for="i in Array(todo.data.priority)"
          :key="i"
          class="amber--text"
        >
          !
        </span>

        <v-btn
          :disabled="isWaitingForResponse"
          icon
          @click="increasePriority(todo)"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </span>
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

    async decreasePriority(todo) {
      if (this.user) {
        const todoId = this.getTodoId(todo)

        this.isWaitingForResponse = true

        const dataCopy = Object.assign({}, todo.data)
        dataCopy.priority--

        this.$axios.setToken(this.userToken, 'Bearer')
        await this.$axios.$put(this.todoAPIEndpoint, {
          id: todoId,
          data: dataCopy
        })

        await this.refreshTodos()

        this.isWaitingForResponse = false
      }
    },

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

    async increasePriority(todo) {
      if (this.user) {
        const todoId = this.getTodoId(todo)

        this.isWaitingForResponse = true

        const dataCopy = Object.assign({}, todo.data)
        dataCopy.priority++

        this.$axios.setToken(this.userToken, 'Bearer')
        await this.$axios.$put(this.todoAPIEndpoint, {
          id: todoId,
          data: dataCopy
        })

        await this.refreshTodos()

        this.isWaitingForResponse = false
      }
    },

    todoDateIsUpcoming(todo) {
      return Date.now() < Date.parse(todo.data.due_date)
    },

    async updateTodoDoneStatus(todo) {
      if (this.user) {
        const todoId = this.getTodoId(todo)

        this.isWaitingForResponse = true

        const dataCopy = Object.assign({}, todo.data)
        dataCopy.done = !dataCopy.done

        this.$axios.setToken(this.userToken, 'Bearer')
        await this.$axios.$put(this.todoAPIEndpoint, {
          id: todoId,
          data: dataCopy
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
