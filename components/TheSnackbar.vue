<template>
  <v-snackbar :value="show" @input="$emit('update:show', false)">
    {{ message }}

    <v-btn icon color="white" @click="$emit('update:show', false)">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: 'TheSnackbar',

  props: {
    message: { type: String, required: true },
    show: { type: Boolean, required: true }
  }
}
</script>
