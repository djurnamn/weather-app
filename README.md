# Weather App
A nice little Vue app with a node backend, using Axios, Express and Redis (for caching).

## Getting started

Create a `.env` file, based on `.env.example` and make sure to fill in any missing values.

Register an account on [Open Weather Map](https://openweathermap.org/), if you don't have an API key.

Install dependencies:
```
npm install
// or
yarn install
```

Start up a [Redis instance via Docker](https://hub.docker.com/_/redis) on default port:
```
docker run --name my-redis -p 6379:6379 -d redis
```

Serve the Weather API (on port 3000)
```
npm run api-serve
// or
yarn api-serve
```

Open up another terminal window and run the Vue app:
```
npm run serve
// or
yarn serve
```

## Next steps
Some things I would add/improve if I continue working on this project:

**Front-end:**
- Prettier error, empty and loading states (skeleton loaders)
- Transitions between views in the frontend
- Make dark mode functionality choosable, instead of just assumed based on preference
- Make available locations into a variable (array of objects) that can be implemented as a select (instead of the fixed set of latitude/longitude values we're passing currently)
- Handle blank items returned from backend, representing data for days no longer available in the response
- Implement tooltips throughout the UI, explaining what the different icons and values represent
- Fix bug preventing Weather view error to reset on router navigation

**Back-end:**
- Apart from caching, actually store the data being returned to future proof favoriting functionality
- Force cache refresh when a new day starts

## Resources
Some things I've used or found helpful while working on this project:
- This video on [Caching API Responses with Redis](https://www.youtube.com/watch?v=hRecenOBYlE) by Redis University
- This animated SVG weather icon library called [Meteocons](https://bas.dev/work/meteocons) by Bas Milius
- This [Weather Conceptual App Design](https://dribbble.com/shots/15217317-Weather-Conceptual-App-Design) by Adin Yanuar (that I've loosely based the layout and design of this app on)
- This SVG icon library called [Typicons](https://www.s-ings.com/typicons/) by Stephen Hutchings
- This video on [How to Fetch Data with Vue 3 Suspense, Fallbacks & Error Boundary](https://www.youtube.com/watch?v=LvOYCjpMQ10) by Modus Create, Inc.
- This article on [Handling Asynchrony in Vue 3 / Composition API](https://javascript.plainenglish.io/handling-asynchrony-in-vue-3-composition-api-part-1-managing-async-state-e993842ebf8f) by Martin Malinda