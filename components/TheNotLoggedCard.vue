<template>
  <v-row justify="center">
    <v-col sm="6">
      <app-hoverable-card>
        <v-card-title>You Are Not Logged In</v-card-title>

        <v-card-text>
          Please login/sign up first by clicking the login/sign up button
          located at the top right side to use this app.
        </v-card-text>
      </app-hoverable-card>
    </v-col>
  </v-row>
</template>

<script>
import AppHoverableCard from '~/components/common/AppHoverableCard'

export default {
  name: 'TheNotLoggedCard',

  components: { AppHoverableCard }
}
</script>
