export const state = () => ({
  user: null,
  todos: []
})

export const getters = {
  getTodoId: () => (todo) => todo.ref['@ref'].id,
  userToken: (state) => state.user?.token?.access_token,
  todoAPIEndpoint: () => `${process.env.URL}/.netlify/functions/todos`,

  doneTodos: (state) => state.todos.filter((todo) => todo.data.done),
  undoneTodos: (state) => state.todos.filter((todo) => !todo.data.done)
}

export const mutations = {
  refreshUser(state) {
    state.user = JSON.parse(localStorage.getItem('gotrue.user'))
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

      data.sort((a, b) => {
        if (a.data.priority > b.data.priority) return -1
        if (a.data.priority < b.data.priority) return 1

        return Date.parse(a.data.due_date) - Date.parse(b.data.due_date)
      })

      commit('setTodos', data)
    }
  }
}

// const getUnix = (date) => new Date(date).getTime()
