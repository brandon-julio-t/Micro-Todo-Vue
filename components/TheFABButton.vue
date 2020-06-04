<template>
  <v-fab-transition>
    <v-btn
      bottom
      color="primary"
      fab
      fixed
      right
      @click="$emit('show-create-todo-overlay')"
    >
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
export default {
  name: 'TheFABButton'
}
</script>
