export const state = () => ({
  user: null,
  userLocalStorageKey: 'gotrue.user',
  todoAPIEndpoint: `${process.env.URL}/.netlify/functions/todos`
})

export const mutations = {
  refreshUser(state) {
    state.user = JSON.parse(localStorage.getItem('gotrue.user'))
  }
}
