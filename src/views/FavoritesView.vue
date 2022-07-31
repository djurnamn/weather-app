<template>
  <div v-if="error">FavoritesView: {{ error }}</div>
  <div v-else-if="loading">Loading...</div>
  <div class="FavoritesView" v-else>
    <header class="FavoritesView__header">
      <h1 class="FavoritesView__title">Favorites</h1>

      <p class="FavoritesView__description">
        {{ !isEmpty ? "Here's a list of your your favorite days." : 'No favorites found.' }}
      </p>
    </header>

    <section class="FavoritesView__list">
      <ListOfDays :days="data"  v-if="!isEmpty" />
    </section>
  </div>
</template>

<script>
import { computed, reactive, ref, toRefs, watch } from "vue"
import { useMainStore } from "../store/index.js"
import { getDaysSummary } from "../services/ApiService.js"
import ListOfDays from "../components/ListOfDays.vue"

export default {
    async setup() {
        const store = useMainStore();
        const loading = ref(null)
        const error = ref(null)
        const state = reactive({
          data: null
        })
        const favoriteIds = computed(() => store.getAllFavorites);

        const getViewData = async (ids) => {
          const response = await getDaysSummary(Object.values(ids))

          return response.data
        }

        watch(
          favoriteIds,
          async (newVal) => {
            state.data = await getViewData(Object.values(newVal))
          },
          { deep: true }
        )

        try {
          state.data = await getViewData(Object.values(favoriteIds.value))
        } catch (e) {
          error.value = e.response.data ?? "Not able to communicate with backend. Is the Express server running?"
        }

        return {
          loading,
          error,
          ...toRefs(state),
          isEmpty: computed(() => store.favoritesEmpty),
        }
    },
    components: { ListOfDays }
}
</script>

<style lang="scss">
.FavoritesView {
  &__header,
  &__list {
    padding: 1rem 0;
  }

  &__title {
    font-size: 1.5rem;
  }

  &__description {
    margin-top: 1rem;
  }
}
</style>