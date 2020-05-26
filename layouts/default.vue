<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Micro Todo Vue</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn v-if="user" icon @click="accountDrawer = !accountDrawer">
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <span v-else>
        <v-btn text @click="identity.open('signup')">
          Sign up
        </v-btn>
        <v-btn text @click="identity.open('login')">Login</v-btn>
      </span>
    </v-app-bar>

    <v-navigation-drawer v-if="user" v-model="accountDrawer" app right>
      <v-list>
        <v-list-item-group>
          <v-subheader class="title">{{ username }}</v-subheader>

          <v-divider></v-divider>

          <v-list-item @click="identity.logout()">
            <v-list-item-content>
              <v-list-item-title>
                Logout
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

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
    identity.init()
    identity.on('login', this.refreshUserStore)
    identity.on('logout', this.refreshUserStore)

    this.refreshUserStore()
  },

  methods: {
    getUserFromLocalStorage() {
      return JSON.parse(localStorage.getItem('gotrue.user'))
    },

    refreshUserStore() {
      this.$store.commit('setUser', this.getUserFromLocalStorage())
    }
  }
}
</script>
