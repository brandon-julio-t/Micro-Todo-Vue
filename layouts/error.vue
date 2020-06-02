<template>
  <v-card>
    <v-card-title>
      <h1>{{ error.statusCode }}</h1>
    </v-card-title>

    <v-card-text>
      <h2>{{ error.message }}</h2>
    </v-card-text>
  </v-card>
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
