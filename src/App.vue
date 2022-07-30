<template>
  <div class="App">
    <main class="App__main">
      <div v-if="error">App: {{ error }}</div>
      <RouterView v-slot="{ Component }" v-else>
        <template v-if="Component">
          <Transition mode="out-in">
            <KeepAlive>
              <Suspense>
                <component :is="Component"></component>

                <template #fallback>
                  Loading...
                </template>
              </Suspense>
            </KeepAlive>
          </Transition>
        </template>
      </RouterView>
    </main>
  
    <nav class="App__navigation">
      <ul class="App__navigation-items">
        <li class="App__navigation-item">
          <router-link class="App__navigation-link" to="/"><IconButton name="home" type="outline" /> Weather</router-link>
        </li>
        <li class="App__navigation-item">
          <router-link class="App__navigation-link" to="/favorites"><IconButton name="heart" type="outline" /> Favorites</router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { onErrorCaptured, ref } from 'vue'
import IconButton from './components/IconButton.vue'

export default {
  name: "App",
  setup() {
    const error = ref(null)

    onErrorCaptured((e) => {
      error.value = e
    })

    return { error }
  },
  components: {
    IconButton
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');

:root {
  --c-background-rgb: 241, 241, 247;
  --c-text-rgb: 68, 64, 110;

  @media (prefers-color-scheme: dark) {
    --c-background-rgb: 22, 21, 35;
    --c-text-rgb: 241, 241, 247;
  }
}

html {
  font-size: 3vmin;
  background-color: rgb(var(--c-background-rgb));
  color: rgb(var(--c-text-rgb));
  font-family: 'Montserrat', sans-serif;

  @media (prefers-color-scheme: dark) {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a, button {
    cursor: pointer;
  }
}

.App {
  display: flex;
  flex-direction: column;
  padding-bottom: 3rem;

  &__main {
    width: 30rem;
    margin-left: auto;
    margin-right: auto;
  }

  &__navigation {
    background-color: rgb(var(--c-background-rgb));
    position: fixed;
    left: 0;
    width: 100%;
    bottom: 0;

    &:before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgb(var(--c-text-rgb), 0.1);
    }

    &-items {
      position: relative;
      width: 30rem;
      margin-left: auto;
      margin-right: auto;
      margin-left: auto;
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: 1rem;
      height: 3rem;
    }

    &-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      height: 3rem;
      padding: 0 2rem;
      background-color: rgb(var(--c-text-rgb), 0);
      font-weight: 600;
      transition: background-color 0.2s ease-in-out;

      &:hover {
        background-color: rgb(var(--c-text-rgb), 0.05);
      }

      &.router-link-exact-active {
        background-color: rgb(var(--c-text-rgb), 0.1);
      }
    }
  }
}
</style>
