import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useMainStore = defineStore({
  id: 'main',
  state: () => ({
    favorites: useStorage('favorites', [])
  }),
  getters: {
    getAllFavorites () {
      return this.favorites
    },
    favoritesInclude: (state) => {
      return (id) => state.favorites.includes(id)
    },
    favoritesEmpty () {
      return this.favorites.length <= 0
    }
  },
  actions: {
    addFavorite (id) {
      this.favorites.push(id)
    },
    removeFavorite (id) {
      const index = this.favorites.findIndex(favorite => id === favorite)

      if (index || index === 0) {
        this.favorites.splice(index, 1)
      }
    }
  }
})
