import calendar from './calendar'

const Calendar = {
  install (Vue) {
    Vue.component(calendar.name, calendar)
  }
}

export default Calendar
