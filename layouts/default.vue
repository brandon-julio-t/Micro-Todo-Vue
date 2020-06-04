<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>
        <v-btn icon @click="toggleTheme">
          <v-icon v-if="darkTheme">mdi-brightness-7</v-icon>
          <v-icon v-else>mdi-brightness-3</v-icon>
        </v-btn>
      </v-toolbar-title>

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
import { mapMutations, mapState } from 'vuex'

import identity from 'netlify-identity-widget'

export default {
  data() {
    return {
      accountDrawer: false,
      identity
    }
  },

  computed: {
    ...mapState(['user']),

    darkTheme() {
      return this.$vuetify.theme.dark
    },

    username() {
      return this.user?.user_metadata?.full_name ?? 'Guest'
    }
  },

  mounted() {
    identity.on('init', this.refreshUser)
    identity.on('login', this.refreshUser)
    identity.on('logout', this.refreshUser)

    identity.init()
  },

  methods: {
    ...mapMutations(['refreshUser']),

    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    }
  }
}
</script>
