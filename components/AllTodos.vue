<template>
  <section>
    <h2>You have {{ todos.length }} todo(s)</h2>

    <v-row>
      <v-col
        v-for="(todo, index) in todos"
        :key="index"
        cols="12"
        lg="2"
        sm="4"
      >
        <TheTodoCard
          :todo="todo"
          @show-edit-todo-overlay="$emit('show-edit-todo-overlay', todo)"
        />
      </v-col>
    </v-row>
  </section>
</template>

<script>
import { mapState } from 'vuex'

import TheTodoCard from '~/components/TheTodoCard'

export default {
  name: 'AllTodos',

  components: { TheTodoCard },

  computed: {
    ...mapState(['todos'])
  }
}
</script>
