<template>
  <v-row justify="center">
    <v-col sm="6">
      <v-card>
        <v-card-title>
          <h1>{{ error.statusCode }}</h1>
        </v-card-title>

        <v-card-text>
          <h2>{{ error.message }}</h2>
        </v-card-text>
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
