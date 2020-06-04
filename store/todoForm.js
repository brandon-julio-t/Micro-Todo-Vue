export const state = () => ({
  actionName: 'Sample Action',
  date: '1970-01-01',
  id: 'Sample ID',
  time: '00:00',
  title: 'Sample Title'
})

export const getters = {
  // https://vuex.vuejs.org/guide/getters.html#method-style-access
  todayISODate: () => () => new Date().toISOString().substr(0, 10),
  nowISOHourAndMinute: () => () => new Date().toTimeString().substring(0, 5),
  toISODateTime: () => (date, time) => `${date}T${time}:00`
}

export const mutations = {
  createMode(state) {
    state.actionName = 'Create'
    state.date = getters.todayISODate()()
    state.time = getters.nowISOHourAndMinute()()
    state.title = ''
  },

  updateMode(state, { date, id, time, title }) {
    state.actionName = 'Edit'
    state.date = date
    state.id = id
    state.time = time
    state.title = title
  },

  updateDate(state, newDate) {
    state.date = newDate
  },

  updateTime(state, newTime) {
    state.time = newTime
  },

  updateTitle(state, newTitle) {
    state.title = newTitle
  }
}
