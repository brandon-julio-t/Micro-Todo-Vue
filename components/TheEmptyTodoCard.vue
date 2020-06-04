<template>
  <v-row justify="center">
    <v-col sm="6">
      <app-hoverable-card>
        <v-card-title>You don't have any todo.</v-card-title>

        <v-card-text>
          You can start creating todo by pressing the pencil button on the
          bottom right side of the screen.
        </v-card-text>
      </app-hoverable-card>
    </v-col>
  </v-row>
</template>

<script>
import AppHoverableCard from '~/components/common/AppHoverableCard'

export default {
  name: 'TheEmptyTodoCard',

  components: { AppHoverableCard }
}
</script>
