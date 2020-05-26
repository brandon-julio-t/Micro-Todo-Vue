<template>
  <v-container>
    <h2>Your Todo:</h2>

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

    <v-row v-else>
      <v-col
        v-for="todo in todos"
        :key="todo.ref['@ref'].id"
        cols="12"
        lg="2"
        sm="4"
      >
        <v-hover v-slot:default="{ hover }">
          <v-card :elevation="hover ? 8 : 2">
            <v-card-title>
              {{ todo.data.title }}

              <v-spacer></v-spacer>

              <v-checkbox v-model="todo.done"></v-checkbox>
            </v-card-title>

            <v-card-actions>
              <v-btn icon>
                <v-icon>mdi-square-edit-outline</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-trash-can</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <v-fab-transition>
      <v-btn bottom fab fixed right to="/create">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-container>
</template>

<script>
export default {
  async fetch() {
    const user = this.getUserFromLocalStorage()
    if (user) {
      this.$axios.setToken(user.token.access_token, 'Bearer')

      const response = await this.$axios.$get(
        `${process.env.URL}/.netlify/functions/todos-read-all`
      )

      this.todos = response.data
    } else {
      this.todos = []
    }
  },

  data() {
    return {
      greeting: null,
      overlay: false,
      todos: null
    }
  },

  methods: {
    getUserFromLocalStorage() {
      return JSON.parse(localStorage.getItem('gotrue.user'))
    }
  }
}
</script>
