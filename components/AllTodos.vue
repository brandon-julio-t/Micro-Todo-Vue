<template>
  <section>
    <div>
      <h2>You have {{ undoneTodos.length }} todo(s)</h2>

      <v-row>
        <v-col v-for="todo in undoneTodos" :key="getTodoId(todo)" cols="auto">
          <TheTodoCard
            :todo="todo"
            @show-edit-todo-overlay="$emit('show-edit-todo-overlay', todo)"
          />
        </v-col>
      </v-row>
    </div>

    <div>
      <h2>You have done {{ doneTodos.length }} todo(s)</h2>

      <v-row>
        <v-col v-for="todo in doneTodos" :key="getTodoId(todo)" cols="auto">
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
  name: 'AllTodos',

  components: { TheTodoCard },

  computed: {
    ...mapGetters(['doneTodos', 'getTodoId', 'undoneTodos']),
    ...mapState(['todos'])
  }
}
</script>
