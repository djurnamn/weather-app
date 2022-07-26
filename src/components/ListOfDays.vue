<template>
  <div class="ListOfDays">
    <ul class="ListOfDays__items">
      <li
        v-for="day in days"
        :key="`${day.id}`"
        class="ListOfDays__item"
      >
        <router-link
          :to="`/${day.dateDescription === 'Today' ? '' : day.id}`"
          class="ListOfDays__item-link"
        >
          <h2 class="ListOfDays__item-date-description">
            {{ day.dateDescription }}
          </h2>

          <img
            class="ListOfDays__item-icon"
            :src="require(`@/assets/weather-icons/svg/${day.icon}.svg`)"
            :alt="day.description"
          >

          <button @click="(event) => toggleFavorite(day.id, event)">
            <IconButton
              name="heart"
              :type="inFavorites(day.id) ? 'outline' : 'full'"
              hover
            />
          </button>

          <div
            v-for="timeOfDay of ['night', 'day']"
            :key="`${day.id}-temp-${timeOfDay}`"
            class="ListOfDays__item-temperature"
            :class="`ListOfDays__item-temperature--${timeOfDay}`"
          >
            {{ timeOfDay === 'night' ? day.temperatureNight : day.temperatureDay }}°
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { useMainStore } from '../store/index.js'
import IconButton from './IconButton.vue'

export default {
  components: {
    IconButton
  },
  props: {
    days: {
      default: null,
      type: Array
    }
  },
  setup () {
    const store = useMainStore()

    const inFavorites = (id) => {
      return store.favoritesInclude(id)
    }

    const toggleFavorite = (id, event) => {
      event.preventDefault()

      if (!store.favoritesInclude(id)) {
        store.addFavorite(id)
      } else {
        store.removeFavorite(id)
      }
    }

    return {
      inFavorites,
      toggleFavorite
    }
  }
}
</script>

<style lang="scss">
.ListOfDays {
  &__items {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__item {
    &-link {
      display: flex;
      align-items: center;
      margin: 0 -1rem;
      padding: 0 1rem;
      border-radius: 0.5rem;
      transition: background-color 0.2s ease-in-out;

      &:hover {
        background-color: rgb(var(--c-text-rgb), 0.05);
      }

      &.router-link-exact-active {
        background-color: rgb(var(--c-text-rgb), 0.1);
      }
    }

    &--current &-link {
      background-color: rgba(var(--c-text-rgb), 0.1);
    }

    &-date-description {
      width: 15rem;
    }

    &-icon {
      width: 3rem;
      height: auto;
      margin-left: auto;
      margin-right: auto;
    }

    &-temperature {
      width: 2.5rem;
      text-align: right;

      &--night {
        opacity: 0.6;
      }
    }
  }
}
</style>
