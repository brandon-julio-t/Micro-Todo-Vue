<template>
  <v-container>
    <h1>Home</h1>

    <p v-if="data">
      {{ data }}
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
      netlifyIdentity
    }
  },

  async mounted() {
    const functionName = 'hello-world?name=donald duck'
    const endpoint = `http://localhost:8888/.netlify/functions/${functionName}`

    this.data = await this.$axios.$get(endpoint)

    netlifyIdentity.init({
      container: '#identity'
    })

    console.log(endpoint, this.data)
  }
}
</script>
