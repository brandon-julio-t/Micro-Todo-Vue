<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Micro Todo Vue</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn v-if="user" @click="identity.logout">
        Logout
      </v-btn>
      <span v-else>
        <v-btn @click="identity.open('signup')">Sign up</v-btn>
        <v-btn @click="identity.open('login')">Login</v-btn>
      </span>
    </v-app-bar>

    <v-content>
      <v-container>
        <h1>Hello, {{ username }}</h1>

        <v-divider></v-divider>
      </v-container>

      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
import identity from 'netlify-identity-widget'

export default {
  data() {
    return {
      accountDrawer: false,
      identity
    }
  },

  computed: {
    user() {
      return this.$store.state.user
    },

    username() {
      return this.user ? this.user.user_metadata.full_name : 'Guest'
    }
  },

  mounted() {
    identity.on('init', this.refreshUserStore)
    identity.on('login', this.refreshUserStore)
    identity.on('logout', this.refreshUserStore)

    identity.init()
  },

  methods: {
    refreshUserStore() {
      this.$store.commit('refreshUser')
    }
  }
}
</script>
