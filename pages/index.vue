<template>
  <v-container>
    <v-card v-if="$fetchState.pending">
      <v-card-title>Fetching Todos...</v-card-title>

      <v-card-text>Please wait warmly.</v-card-text>
    </v-card>

    <v-card v-else-if="$fetchState.error">
      <v-card-title>An Error Occurred.</v-card-title>

      <v-card-text>
        {{ $fetchState.error.message }}
      </v-card-text>

      <v-card-actions>
        <v-btn block href="mailto:brandon.julio.t@icloud.com">
          Contact Website Administrator
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-else-if="!user">
      <v-card-title>You Are Not Logged In</v-card-title>

      <v-card-text>
        Please login/register first by clicking the login/register button
        located at the top right side to use this app.
      </v-card-text>
    </v-card>

    <v-card v-else-if="!todos">
      <v-card-title>You don't have any todo.</v-card-title>

      <v-card-text>
        You can start creating todo by pressing the pencil button on the bottom
        right side of the screen or the button below.
      </v-card-text>

      <v-card-actions>
        <v-btn block to="/create">Start Creating Todo</v-btn>
      </v-card-actions>
    </v-card>

    <v-row v-else justify="center" align="center">
      <v-col
        v-for="todo in todos"
        :key="getTodoId(todo)"
        cols="12"
        lg="2"
        sm="4"
      >
        <v-hover v-slot:default="{ hover }">
          <v-card :elevation="hover ? 8 : 2" :loading="isWaitingForResponse">
            <v-card-title>
              {{ todo.data.title }}

              <v-spacer></v-spacer>

              <v-checkbox
                v-model="todo.data.done"
                @change="markTodoAsDone(todo)"
              ></v-checkbox>
            </v-card-title>

            <v-card-subtitle>
              Due:
              {{ prettyFormatDateTime(todo.data.due_date) }}
            </v-card-subtitle>

            <v-card-actions>
              <v-btn
                :disabled="isWaitingForResponse"
                :to="`/edit/${getTodoId(todo)}`"
                icon
              >
                <v-icon>mdi-square-edit-outline</v-icon>
              </v-btn>
              <v-btn :disabled="isWaitingForResponse" icon>
                <v-icon @click="deleteTodo(getTodoId(todo))">
                  mdi-trash-can
                </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <v-fab-transition>
      <v-btn bottom fab fixed nuxt right to="/create">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-container>
</template>

<script>
export default {
  async fetch() {
    if (this.user) {
      this.$axios.setToken(this.user.token.access_token, 'Bearer')

      const response = await this.$axios.$get(
        `${process.env.URL}/.netlify/functions/todos`
      )

      this.todos = response.data
    }
  },

  data() {
    return {
      greeting: null,
      todos: null,

      isWaitingForResponse: false
    }
  },

  computed: {
    user() {
      return this.$store.state.user
    }
  },

  watch: {
    user(val) {
      if (val) {
        this.$fetch()
      } else {
        this.todos = null
      }
    }
  },

  methods: {
    async deleteTodo(id) {
      this.isWaitingForResponse = true

      if (this.user) {
        this.$axios.setToken(this.user.token.access_token, 'Bearer')

        const url = this.$store.state.todoAPIEndpoint
        await this.$axios.$delete(url, {
          data: { todoId: id }
        })

        this.$fetch()
      }

      this.isWaitingForResponse = false
    },

    getTodoId(todo) {
      return todo.ref['@ref'].id
    },

    markTodoAsDone(todo) {
      console.log(todo.data.done)
    },

    prettyFormatDateTime(datetime) {
      return new Intl.DateTimeFormat(undefined, {
        timeStyle: 'short',
        dateStyle: 'medium'
      }).format(new Date(datetime))
    }
  }
}
</script>
