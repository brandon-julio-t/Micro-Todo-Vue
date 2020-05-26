export const state = () => ({
  user: null,
  userLocalStorageKey: 'gotrue.user'
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  }
}
