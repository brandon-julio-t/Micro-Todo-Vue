<template>
  <v-row justify="center">
    <v-col sm="6">
      <app-hoverable-card>
        <v-card-title>You Are Not Logged In</v-card-title>

        <v-card-subtitle>
          Please login/sign up first by clicking the login/sign up button
          located at the top right side to use this app.
        </v-card-subtitle>

        <v-card-text>
          <h2>What Can This App Do?</h2>

          <ul>
            <li>
              Track things that you want
              <em>to do.</em>
            </li>
            <li>Set due time for each to-do.</li>
            <li>Set priority to each to-do.</li>
            <li>Mark a to-do as done.</li>
            <li>Keep track of done to-dos.</li>
            <li>Your to-dos are sorted by priority and due date by default.</li>
            <li>Your to-dos are different from other's to-dos.</li>
          </ul>
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
