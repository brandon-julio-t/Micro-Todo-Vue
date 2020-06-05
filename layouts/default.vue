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

      <v-btn v-if="user" @click="showLogoutProgressAndLogout">
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

    <TheLogoutDialog :is-logging-out="isLoggingOut" />
  </v-app>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

import identity from 'netlify-identity-widget'
import TheLogoutDialog from '~/components/TheLogoutDialog'

export default {
  components: { TheLogoutDialog },
  data() {
    return {
      accountDrawer: false,
      isLoggingOut: false,
      identity
    }
  },

  computed: {
    ...mapState(['user']),

    darkTheme() {
      return this.$vuetify.theme.dark
    },

    username() {
      return this.user?.user_metadata?.full_name ?? 'There'
    }
  },

  mounted() {
    identity.on('init', this.refreshTokenAndUser)
    identity.on('login', this.refreshTokenAndUser)
    identity.on('logout', () => {
      this.resetStore()
      this.isLoggingOut = false
    })

    identity.init()
  },

  methods: {
    ...mapActions(['refreshTokenAndUser']),
    ...mapMutations(['resetStore']),

    showLogoutProgressAndLogout() {
      this.isLoggingOut = true
      identity.logout()
    },

    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    }
  }
}
</script>
