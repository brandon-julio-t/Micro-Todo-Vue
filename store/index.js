import identity from 'netlify-identity-widget'

export const state = () => ({
  user: null,
  todos: []
})

export const getters = {
  getTodoId: () => (todo) => todo.ref['@ref'].id,
  userToken: (state) => state.user?.token?.access_token,
  todoAPIEndpoint: () => `${process.env.URL}/.netlify/functions/todos`
}

export const mutations = {
  refreshUser(state) {
    state.user = identity.currentUser()
  },

  setTodos(state, data) {
    state.todos = data
  },

  toggleTodoDoneStatus(state, todoId) {
    state.todos
      .filter((todo) => {
        const tId = getters.getTodoId()(todo)
        return tId === todoId
      })
      .map((t) => {
        const isDone = t.data.done
        t.data.done = !isDone
      })
  }
}

export const actions = {
  async refreshTodos({ commit, getters, state }) {
    if (state.user) {
      this.$axios.setToken(getters.userToken, 'Bearer')
      const { data } = await this.$axios.$get(getters.todoAPIEndpoint)
      commit('setTodos', data)
    }
  }
}
