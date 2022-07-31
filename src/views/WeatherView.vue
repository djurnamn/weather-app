<template>
  <div v-if="error">WeatherView: {{ error }}</div>
  <div v-else-if="loading">Loading...</div>
  <div class="WeatherView" v-else>
    <header class="WeatherView__header">
      <div class="WeatherView__header-content">
        <h1 class="WeatherView__location">The Royal Palace</h1>
        <p class="WeatherView__temperature">{{ data.temperatureDay }}°</p>
        <p class="WeatherView__description">{{ data.description }}</p>
      </div>

      <div class="WeatherView__header-icon-wrapper">
        <img
          class="WeatherView__icon"
          :src="data.icon ? require(`@/assets/weather-icons/svg/${data.icon}.svg`) : null"
          :alt="data.description"
        />
      </div>
    </header>

    <section class="WeatherView__meta">
      <ul class="WeatherView__attributes">
        <li class="WeatherView__attribute" v-for="attribute in data.attributes" :key="attribute.key">
          <img
            class="WeatherView__attribute-icon"
            :src="require(`@/assets/weather-icons/svg/${attribute.icon}.svg`)"
            :alt="attribute.description"
          />
          <div class="WeatherView__attribute-value">
            {{ attribute.value }}{{ attribute.unit }}
          </div>
        </li>
      </ul>
    </section>

    <section class="WeatherView__twilight">
      <ul class="WeatherView__twilight-items">
        <li
          v-for="twilight in ['sunrise', 'sunset']"
          class="WeatherView__twilight-item"
          :class="`WeatherView__twilight-item--${twilight}`"
          :key="twilight"
        >
          <img
            class="WeatherView__twilight-icon"
            :src="require(`@/assets/weather-icons/svg/${twilight}.svg`)"
            :alt="twilight"
          />
          <h3 class="WeatherView__twilight-label">{{ data.twilight === 'sunset' ? data.sunset : data.sunrise }}</h3>
        </li>
      </ul>
    </section>

    <section class="WeatherView__hourly">
      <h2 class="WeatherView__date-description">{{ data.dateDescription }}</h2>

      <div class="WeatherView__hours-wrapper">
        <ul class="WeatherView__hours">
          <li class="WeatherView__hour" v-for="hour in data.hours" :key="hour.id">
            <h3 class="WeatherView__hour-title">{{ hour.time }}</h3>
  
            <img
              class="WeatherView__day-icon"
              :src="require(`@/assets/weather-icons/svg/${hour.icon}.svg`)"
              :alt="hour.description"
            />
  
            <p class="WeatherView__hour-temperature">{{ hour.temperature }}°</p>
          </li> 
        </ul>
      </div>
    </section>

    <section class="WeatherView__daily">
      <ListOfDays :days="data.days" />
    </section>
  </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { getDayFull } from '../services/ApiService.js'
import ListOfDays from '../components/ListOfDays.vue'

export default {
  async setup() {
    const error = ref(null)
    const loading = ref(null)
    const route = useRoute()
    const state = reactive({
      data: null
    })

    const getViewData = async (id) => {
      const response = await getDayFull(id || null)

      return response.data
    }

    onBeforeRouteUpdate(async (to, from) => {
      if (to.params.id !== from.params.id) {
        loading.value = true
        state.data = await getViewData(to.params.id)
        loading.value = false
      }
    })

    try {
      state.data = await getViewData(route.params.id)
    } catch (e) {
      error.value = e.response.data ?? "Not able to communicate with backend. Is the Express server running?"
    }

    return {
      error,
      loading,
      ...toRefs(state),
    }
  },
  components: {
    ListOfDays
}
}
</script>

<style lang="scss">
.WeatherView {
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &__header,
  &__twilight,
  &__meta,
  &__hourly,
  &__daily {
    padding: 1rem 0;
  }

  &__header {
    display: flex;
    align-items: center;

    &-icon-wrapper {
      margin-left: auto;
      flex-shrink: 0;
    }
  }

  &__location {
    font-size: 1.5rem;
  }

  &__temperature {
    font-size: 8rem;
  }

  &__description {
    position: relative;
    padding: 0.75rem 1.5rem;
    display: inline-flex;
    font-size: 1.25rem;
    border-radius: 420rem;
    background-color: rgba(var(--c-text-rgb), 0.1);
    text-align: center;
  }

  &__icon {
    float: right;
    width: 14rem;
    height: auto;
  }

  &__twilight {
    &-items {
      display: flex;
      justify-content: space-around;
    }

    &-item {
      display: flex;
      align-items: center;
    }

    &-icon {
      width: 3rem;
      height: auto;
    }
  }

  &__attributes {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__attribute {
    display: flex;
    align-items: center;

    &-icon {
      width: 3rem;
      height: auto;
    }
  }

  &__date-description {
    margin-bottom: 1rem;
    opacity: 0.6;
  }

  &__hours-wrapper {
    padding-bottom: 1rem;
    margin: 0 -1rem -1rem;
    position: relative;

    &:before,
    &:after {
      content: '';
      position: absolute;
      top: 0;
      height: 100%;
      width: 1rem;
      pointer-events: none;
    }

    &:before {
      left: 0;
      background: linear-gradient(
        to right,
        rgba(var(--c-background-rgb), 1) 0%,
        rgba(var(--c-background-rgb), 0) 100%
      );
    }

    &:after {
      right: 0;
      background: linear-gradient(
        to right,
        rgba(var(--c-background-rgb), 0) 0%,
        rgba(var(--c-background-rgb), 1) 100%
      );
    }
  }

  &__hours {
    display: flex;
    white-space: nowrap;
    gap: 1rem;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  }

  &__hour {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 1rem;

    &-temperature {
      font-size: 1.5rem;
    }
  }
}
</style>