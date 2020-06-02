<template>
  <v-hover v-slot:default="{ hover }">
    <v-card :elevation="hover ? 8 : 2" :loading="loading">
      <slot></slot>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'AppHoverableCard',

  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>
