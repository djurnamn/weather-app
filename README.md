# Weather App
A nice little weather app with a node backend, using Axios, Express and Redis (for caching).

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
node api.js
```