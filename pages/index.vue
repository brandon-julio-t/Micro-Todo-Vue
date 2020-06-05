<template>
  <v-container>
    <TheNotLoggedCard v-if="!user" />
    <TheLoadingSkeletonCard v-else-if="isWaitingForResponse" />
    <TheEmptyTodoCard v-else-if="todos.length === 0" />

    <TheTodos v-else @show-edit-todo-overlay="showEditTodoOverlay" />

    <v-dialog v-model="showTodoFormDialog" persistent max-width="700px">
      <TheTodoForm
        @close="showTodoFormDialog = false"
        @refresh-todos="refreshTodos"
        @show-success-snackbar="showSnackbar"
      />
    </v-dialog>

    <TheFABButton
      v-if="user"
      @show-create-todo-overlay="showCreateTodoOverlay"
    />

    <TheSnackbar :message="snackbarMessage" :show.sync="showSuccessSnackbar" />
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

import TheEmptyTodoCard from '~/components/TheEmptyTodoCard'
import TheFABButton from '~/components/TheFABButton'
import TheLoadingSkeletonCard from '~/components/TheLoadingSkeletonCard'
import TheNotLoggedCard from '~/components/TheNotLoggedCard'
import TheSnackbar from '~/components/TheSnackbar'
import TheTodoForm from '~/components/TheTodoForm'
import TheTodos from '~/components/TheTodos'

export default {
  components: {
    TheEmptyTodoCard,
    TheFABButton,
    TheLoadingSkeletonCard,
    TheNotLoggedCard,
    TheSnackbar,
    TheTodoForm,
    TheTodos
  },

  data() {
    return {
      greeting: null,

      snackbarMessage: '',

      isWaitingForResponse: false,
      showTodoFormDialog: false,
      showSuccessSnackbar: false
    }
  },

  computed: {
    ...mapGetters(['getTodoId']),
    ...mapState(['todos', 'user'])
  },

  watch: {
    async user(user) {
      if (user) {
        this.isWaitingForResponse = true
        await this.refreshTodos()
        this.isWaitingForResponse = false
      }
    }
  },

  methods: {
    ...mapActions(['refreshTodos']),

    ...mapMutations({
      changeTodoFormToCreateMode: 'todoForm/createMode',
      changeTodoFormToUpdateMode: 'todoForm/updateMode'
    }),

    extractDate(isoDate) {
      return isoDate.substring(0, 10)
    },

    extractTime(isoDate) {
      return new Date(isoDate).toTimeString().substring(0, 5)
    },

    showCreateTodoOverlay() {
      this.changeTodoFormToCreateMode()
      this.showTodoFormDialog = true
    },

    showEditTodoOverlay(todo) {
      const { title, due_date: dueDate } = todo.data
      const id = this.getTodoId(todo)

      this.changeTodoFormToUpdateMode({
        date: this.extractDate(dueDate),
        id,
        time: this.extractTime(dueDate),
        title
      })

      this.showTodoFormDialog = true
    },

    showSnackbar(message) {
      this.showSuccessSnackbar = true
      this.snackbarMessage = message
    }
  }
}
</script>
