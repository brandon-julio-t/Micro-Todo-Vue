<template>
  <!-- This dude is a genius https://stackoverflow.com/a/57241541/10644595 -->
  <v-dialog v-model="isLoggingOut" persistent width="unset">
    <v-card>
      <v-card-title>
        Logging out.
        <br />
        Please wait warmly...
      </v-card-title>

      <v-card-text class="d-flex justify-center">
        <VProgressCircular indeterminate />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'TheLogoutDialog',

  props: {
    isLoggingOut: Boolean
  }
}
</script>
