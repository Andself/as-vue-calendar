<template>
  <div class="calendar-warp">
    <div class="calendar-warp__tab">
      <button class="icon pre" :disabled="indexMonth.getFullYear() <= (new Date()).getFullYear() && indexMonth.getMonth() <= (new Date()).getMonth()" @click="prevMonth"></button>
      <span class="title">{{indexMonth.getFullYear() + localKeyString.year}}</span>
      <span class="title">{{localKeyString.month[indexMonth.getMonth()]}}</span>
      <button class="icon next" @click="nextMonth"></button>
    </div>
    <div class="calendar-warp__day">
      <!--  -->
      <div class="calendar-item gray"
        v-for="(item, index) in localKeyString.week"
        :key="index"
        v-text="item"
      ></div>
      <!--  -->
    </div>
    <div class="calendar-warp__day">
      <!--  -->
      <div class="calendar-item"
        v-for="(item, index) in drawDay"
        :key="index"
        :class="{active: value && checkActiveDate(item.date), disabled: item.disabled}"
        v-text="item.date.getDate()"
        @click="handleFeedBack(item, index)"
      ></div>
      <!--  -->
    </div>
  </div>
</template>
<script>
export default {
  name: 'as-calendar',
  props: {
    value: String,
    lang: {
      type: String,
      default: 'zh'
    }
  },
  data () {
    return {
      keyMap: {
        zh: {
          year: '年',
          month: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          week: ['日', '一', '二', '三', '四', '五', '六']
        },
        en: {
          year: '',
          month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          week: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
        }
      },
      indexMonth: new Date(),
      activeIndex: -1,
      drawDay: []
    }
  },
  computed: {
    localKeyString () {
      return this.keyMap[this.lang]
    },
    dateOfValue () {
      return this.value ? new Date(this.value.replace(/-/g, '/')) : new Date()
    }
  },
  created () {
    this.drewCalendar()
  },
  methods: {
    getFirstDate () {
      const startDate = new Date(this.indexMonth)
      startDate.setDate(1)
      const padding = startDate.getDay()
      startDate.setDate(startDate.getDate() - padding - 1)
      startDate.setHours(0)
      startDate.setMinutes(0)
      startDate.setSeconds(0)
      startDate.setMilliseconds(0)

      return startDate
    },
    drewCalendar () {
      // 生成日历列表
      const result = []
      const indexDate = this.getFirstDate()
      const today = new Date()
      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)
      today.setMilliseconds(0)
      do {
        let item = {}
        indexDate.setDate(indexDate.getDate() + 1)
        item.date = new Date(indexDate)
        item.label = indexDate.getDate()
        item.disabled = indexDate.getMonth() !== this.indexMonth.getMonth() || indexDate < today
        result.push(item)
      } while (indexDate.getMonth() === this.indexMonth.getMonth() || indexDate.getDay() !== 6)

      this.drawDay = result
      this.activeIndex = -1
    },
    prevMonth () {
      this.indexMonth.setMonth(this.indexMonth.getMonth() - 1)
      this.drewCalendar()
    },
    nextMonth () {
      this.indexMonth.setMonth(this.indexMonth.getMonth() + 1)
      this.drewCalendar()
    },
    handleFeedBack (item, index) {
      this.disabled = true
      this.activeIndex = index
      this.$emit('select', item.date)
    },
    checkActiveDate (data) {
      return (data.getFullYear() === this.dateOfValue.getFullYear() &&
        data.getMonth() === this.dateOfValue.getMonth() &&
        data.getDate() === this.dateOfValue.getDate())
    },
    reset () {
      // 用在取消时手动reset
      this.indexMonth = new Date(this.dateOfValue)
      this.drewCalendar()
    }
  },
  watch: {
    value (v) {
      const d = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(v) ? new Date(v.replace(/-/g, '/')) : new Date()
      this.indexMonth = d
    }
  }
}
</script>
<style scoped lang="scss">
.calendar {
  &-warp {
    background-color: #fff;
    padding: 1rem;

    &__tab {
      padding: 12px;
      font-size: 1.6rem;
      text-align: center;
      color: #444;

      span {
        font-weight: bold;
        margin: 0 6px;
      }
      button {
        border: none;
        background-color: transparent;

        &:disabled {
          color: #eaeaea;
        }
      }
      .title {
        user-select: none;
      }
      .icon {
        margin: 0 6px;
        cursor: pointer;
        &:before {
          content: '';
          display: inline-block;
          width: 0;
          height: 0;
          border-top-width: 8px;
          border-bottom-width: 8px;
          border-left-width: 0;
          border-right-width: 12px;
          border-color: transparent;
          border-right-color: #444;
          border-style: solid;
          transition: border-color 0.3s ease;
          border-radius: 3px;
        }
        &.next:before {
          border-right-width: 0;
          border-left-width: 12px;
          border-left-color: #444;
        }
        &:disabled:before {
          border-right-color: #eee;
        }
      }
    }

    &__day {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: flex-start;
    }
  }
  // item
  &-item {
    height: 2.6em;
    width: 10.2%;
    line-height: 2.6;
    text-align: center;
    color: #3F3C3B;;
    font-size: 1.2rem;
    border-radius: 2px;
    margin: 2%;
    cursor: pointer;
    transition: background-color 0.1s linear;

    &.active {
      color: #fff;
      background-color: #23C269;
    }
    &.disabled {
      pointer-events: none;
      color: #eaeaea;
    }
    &.gray {
      color: #bbb;
      pointer-events: none;
    }
  }
}
</style>
