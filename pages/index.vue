<template>
  <v-container>
    <v-row v-if="!user" justify="center">
      <v-col sm="6">
        <app-hoverable-card>
          <v-card-title>You Are Not Logged In</v-card-title>

          <v-card-text>
            Please login/sign up first by clicking the login/sign up button
            located at the top right side to use this app.
          </v-card-text>
        </app-hoverable-card>
      </v-col>
    </v-row>

    <VSkeletonLoader v-else-if="!todos" type="card" />

    <app-hoverable-card v-else-if="todos.length === 0">
      <v-card-title>You don't have any todo.</v-card-title>

      <v-card-text>
        You can start creating todo by pressing the pencil button on the bottom
        right side of the screen or the button below.
      </v-card-text>

      <v-card-actions>
        <v-btn block @click="showCreateTodoOverlay">Start Creating Todo</v-btn>
      </v-card-actions>
    </app-hoverable-card>

    <div v-else>
      <h2>You have {{ todos.length }} todo(s)</h2>

      <v-row>
        <v-col
          v-for="todo in todos"
          :key="getTodoId(todo)"
          cols="12"
          lg="2"
          sm="4"
        >
          <app-hoverable-card :loading="isWaitingForResponse">
            <v-card-title>
              {{ todo.data.title }}

              <v-spacer></v-spacer>

              <v-checkbox
                v-model="todo.data.done"
                :disabled="isWaitingForResponse"
                @change="markTodoDoneStatus(todo)"
              ></v-checkbox>
            </v-card-title>

            <v-card-subtitle>
              Due:
              {{ prettyFormatDateTime(todo.data.due_date) }}
            </v-card-subtitle>

            <v-card-actions>
              <v-btn
                :disabled="isWaitingForResponse"
                icon
                @click="showEditTodoOverlay(todo)"
              >
                <v-icon>mdi-square-edit-outline</v-icon>
              </v-btn>
              <v-btn :disabled="isWaitingForResponse" icon>
                <v-icon @click="deleteTodo(getTodoId(todo))">
                  mdi-trash-can
                </v-icon>
              </v-btn>
            </v-card-actions>
          </app-hoverable-card>
        </v-col>
      </v-row>
    </div>

    <v-overlay :value="showOverlay">
      <TheTodoForm
        @close-overlay="showOverlay = false"
        @refresh-todos="refreshTodos"
        @show-success-snackbar="showSnackbar"
      />
    </v-overlay>

    <v-fab-transition v-if="user">
      <v-btn bottom fab fixed right @click="showCreateTodoOverlay">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-fab-transition>

    <v-snackbar v-model="showSuccessSnackbar">
      {{ snackbarMessage }}

      <v-btn icon color="white" @click="showSuccessSnackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import AppHoverableCard from '~/components/common/AppHoverableCard'
import TheTodoForm from '~/components/TheTodoForm'

export default {
  components: { TheTodoForm, AppHoverableCard },
  data() {
    return {
      greeting: null,
      todos: null,

      snackbarMessage: '',

      isWaitingForResponse: false,
      showOverlay: false,
      showSuccessSnackbar: false
    }
  },

  computed: {
    user() {
      return this.$store.state.user
    }
  },

  watch: {
    user(user) {
      if (user) {
        this.refreshTodos()
      } else {
        this.todos = []
      }
    }
  },

  mounted() {
    this.refreshTodos()
  },

  methods: {
    async deleteTodo(id) {
      this.isWaitingForResponse = true

      if (this.user) {
        this.$axios.setToken(this.user.token.access_token, 'Bearer')

        const url = this.$store.getters.todoAPIEndpoint
        await this.$axios.$delete(url, {
          data: { id }
        })

        await this.refreshTodos()
      }

      this.isWaitingForResponse = false
    },

    extractDate(isoDate) {
      return isoDate.substring(0, 10)
    },

    extractTime(isoDate) {
      return new Date(isoDate).toTimeString().substring(0, 5)
    },

    getTodoId(todo) {
      return todo.ref['@ref'].id
    },

    async markTodoDoneStatus(todo) {
      if (this.user) {
        const { data } = todo

        this.isWaitingForResponse = true
        this.$axios.setToken(this.user.token.access_token, 'Bearer')

        await this.$axios.$put(this.$store.getterse.todoAPIEndpoint, {
          id: this.getTodoId(todo),
          data
        })

        this.isWaitingForResponse = false
        this.showSnackbar(`Todo marked as ${data.done ? '' : 'not'} done`)
      }
    },

    prettyFormatDateTime(datetime) {
      return new Intl.DateTimeFormat(undefined, {
        timeStyle: 'short',
        dateStyle: 'medium'
      }).format(new Date(datetime))
    },

    showCreateTodoOverlay() {
      this.$store.commit('oldTodo/createTodo')
      this.showOverlay = true
    },

    showEditTodoOverlay(todo) {
      const { title, due_date: dueDate } = todo.data
      const id = this.getTodoId(todo)

      this.$store.commit('oldTodo/updateTodo', {
        date: this.extractDate(dueDate),
        id,
        time: this.extractTime(dueDate),
        title
      })

      this.showOverlay = true
    },

    showSnackbar(message) {
      this.showSuccessSnackbar = true
      this.snackbarMessage = message
    },

    async refreshTodos() {
      if (this.user) {
        this.$axios.setToken(this.user.token.access_token, 'Bearer')

        const { data } = await this.$axios.$get(
          this.$store.getters.todoAPIEndpoint
        )

        this.todos = data
      } else {
        this.todos = []
      }
    }
  }
}
</script>
