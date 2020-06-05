<template>
  <section>
    <div class="my-12">
      <h2>You have {{ undoneTodos.length }} to-do(s)</h2>

      <v-row>
        <v-col
          v-for="todo in undoneTodos"
          :key="getTodoId(todo)"
          cols="12"
          sm="auto"
        >
          <TheTodoCard
            :todo="todo"
            @show-edit-todo-overlay="$emit('show-edit-todo-overlay', todo)"
          />
        </v-col>
      </v-row>
    </div>

    <div class="my-12">
      <h2>You have done {{ doneTodos.length }} to-do(s)</h2>

      <v-row>
        <v-col
          v-for="todo in doneTodos"
          :key="getTodoId(todo)"
          cols="12"
          sm="auto"
        >
          <TheTodoCard
            :todo="todo"
            @show-edit-todo-overlay="$emit('show-edit-todo-overlay', todo)"
          />
        </v-col>
      </v-row>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import TheTodoCard from '~/components/TheTodoCard'

export default {
  name: 'TheTodos',

  components: { TheTodoCard },

  computed: {
    ...mapGetters(['doneTodos', 'getTodoId', 'undoneTodos']),
    ...mapState(['todos'])
  }
}
</script>
