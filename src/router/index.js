import { createRouter, createWebHistory } from 'vue-router'
import WeatherView from '../views/WeatherView.vue'

const routes = [
  {
    path: '/',
    name: 'current',
    component: WeatherView
  },
  {
    path: '/:id',
    name: 'day',
    component: WeatherView
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import(/* webpackChunkName: "about" */ '../views/FavoritesView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior () {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ left: 0, top: 0 })
      }, 500)
    })
  }
})

export default router
