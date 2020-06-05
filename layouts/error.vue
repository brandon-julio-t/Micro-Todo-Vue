<template>
  <v-row justify="center">
    <v-col sm="6">
      <v-card>
        <v-card-title>
          <h1>Error {{ error.statusCode }}</h1>
        </v-card-title>

        <v-card-subtitle>
          <h2>{{ error.message }}</h2>
        </v-card-subtitle>

        <v-card-text>
          An has error occurred. Sorry for the inconvenience. In the mean time,
          you can try refreshing this page. If the error persists, you can try
          to contact the website's administrator by clicking the buttom below
        </v-card-text>

        <v-card-actions>
          <v-btn href="mailto:brandon.julio.t@icloud.com">
            Contact website admin
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null
    }
  },

  head() {
    return {
      title: this.error.statusCode
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
