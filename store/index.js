import identity from 'netlify-identity-widget'

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
    // The reason I'm using `Object.assign` here is because
    // `identity.currentUser()` returns an 'e' or 'event' object and by
    // assigning it to `state.user`, `state.user` becomes and 'event' object,
    // and mutating `state.user`, that is now and 'event' object, somehow
    // results in Vuex error:
    // "[vuex] do not mutate vuex store state outside mutation handlers."
    //
    // Hence I'm converting and 'event' object into a regular object by using
    // `Object.assign`, and it works ¯\_(ツ)_/¯.
    state.user = Object.assign({}, identity.currentUser())
  },

  resetStore(state) {
    state.user = null
    state.todos = []
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
  },

  async refreshTokenAndUser({ commit }) {
    await identity.refresh()
    commit('refreshUser')
  }
}
