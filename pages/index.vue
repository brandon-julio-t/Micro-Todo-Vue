<template>
  <v-container>
    <h1>Home</h1>

    <p v-if="data">
      {{ data }}
    </p>

    <p v-if="error">
      {{ error }}
    </p>

    <div id="identity"></div>

    <v-btn block @click="netlifyIdentity.open()">test</v-btn>
  </v-container>
</template>

<script>
import netlifyIdentity from 'netlify-identity-widget'

export default {
  data() {
    return {
      data: null,
      error: null,
      netlifyIdentity
    }
  },

  async mounted() {
    const functionName = 'hello-world'
    const endpoint = `${process.env.URL}/.netlify/functions/${functionName}`

    try {
      this.data = await this.$axios.$get(endpoint)
    } catch (e) {
      this.error = e
    }

    netlifyIdentity.init({
      container: '#identity'
    })

    console.log(endpoint, this.data)
  }
}
</script>
