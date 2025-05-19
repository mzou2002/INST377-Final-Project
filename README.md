# INST377-Final-Project

Title: WhatWeather

Description of your project:
Weather plays a critical role in our daily lives, influencing everything from what we wear to how we plan trips or events. However, many existing weather applications are either too cluttered with unnecessary features or lack the customization options users need to get the most relevant information quickly. This creates a gap for a clean, user-friendly, and visually appealing weather application that provides real-time data and forecasts in an intuitive way. “WhatWeather” aims to solve this problem by offering a dynamic web application that aggregates real-time weather data and presents it in an easy-to-understand format. The application will cater to a variety of stakeholders, including the general public, travelers, event planners, and farmers, all of whom rely on accurate weather information for decision-making. By leveraging the OpenWeatherMap API, WhatWeather will provide current weather conditions, a 5-day forecast, and interactive weather maps, all in one place. The front end will be built using React.js for a responsive and interactive user interface, while Chart.js will be used to visualize weather trends, such as temperature fluctuations over time. Additionally, CSS/SCSS will be used to for mapping and modern formatting conventions. This solution will not only simplify access to weather data but also enhance the user experience through customizable features like saving favorite locations and setting weather alerts.

To bring WhatWeather to life, a combination of modern web technologies will be used to ensure a seamless and efficient user experience. On the front end, React.js will serve as the primary framework due to its component-based architecture, which allows for reusable UI elements and efficient state management. This will enable the creation of a dynamic and responsive interface that updates in real time as weather data changes. For data visualization, Chart.js will be integrated to display weather trends, such as temperature over time, in an engaging and easy-to-understand format. Additionally, Leaflet.js will be used to render interactive weather maps, providing users with a spatial understanding of weather patterns like precipitation and temperature. On the back end, Node.js with Express will handle server-side operations, including fetching data from the OpenWeatherMap API and serving it to the front end in a unified format. Axios will be used for making HTTP requests to the API, ensuring reliable data retrieval. To enhance user personalization, a MongoDB database will store user preferences, such as saved locations and custom alerts, with Mongoose facilitating schema-based data modeling and interaction. This combination of technologies ensures a robust, scalable, and user-friendly application that meets the needs of its stakeholders. For context, we will be using the free tiers of most of these services as we know that this project accounts for more academic services. 


Description of target browsers (iOS? Android? Which ones?): IOS


---------------------------------------------------------------------------------------------------



Developer Manual:

# Developer Manual for WeatherApp

> **Location:** `docs/Developer_Manual.md`

This manual guides future developers through setting up, running, and extending the WeatherApp—a static front-end weather dashboard with a Node.js/Express back end for persisting favorites and proxying forecast data.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running the Application](#running-the-application)
4. [Testing](#testing)
5. [API Reference](#api-reference)
6. [Known Bugs](#known-bugs)
7. [Roadmap](#roadmap)

---

## Prerequisites

* **Node.js** (v16.x or newer) and **npm**
* **Git**
* **Supabase** account (for the database)
* **OpenWeather API key** (free tier)

Optional tools:

* **serve** (npm package for serving static files)
* **Postman** or **cURL** (for API testing)

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/weather-app.git
   cd weather-app
   ```

2. **Install back-end dependencies**

   ```bash
   npm install
   ```

3. **(Optional) Install `serve` globally**

   ```bash
   npm install -g serve
   ```

4. **Environment variables**
   Create a file named `.env` in the project root with:

   ```ini
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   OPENWEATHER_KEY=your-openweather-api-key
   PORT=3000              # defaults to 3000 if omitted
   ```

5. **Database setup (Supabase)**

   * In your Supabase dashboard, create a table named `favorites` with columns:

     * `id` (UUID, primary key, default `uuid_generate_v4()`)
     * `city` (text)
     * `latitude` (float8)
     * `longitude` (float8)
     * `created_at` (timestamp with time zone, default `now()`)

---

## Running the Application

### Back-End Server

From the project root, start the API server:

```bash
npm run start
```

This launches `server.js` on `http://localhost:3000` (or `$PORT`).

### Front-End

Option 1: **Static file serving**

```bash
serve . -s
```

Then open `http://localhost:5000/HomePage.html` in your browser.

Option 2: **Open files directly**
Open `HomePage.html`, `MapPage.html`, or `AboutPage.html` via your browser’s "Open File" feature.

---

## Testing

Currently, no automated tests are included. To manually test:

1. **Fetch & display**: Open the Home page, search a city, and verify current weather, forecast, air quality, and charts.
2. **Map markers**: Navigate to Map page, ensure markers appear at the last-fetched coordinates.
3. **Favorites API**: On Home page, click "Save Favorite", then reload—saved city should appear in the list.
4. **API endpoints**: Use Postman or curl:

   ```bash
   curl http://localhost:3000/api/favorites
   curl -X POST http://localhost:3000/api/favorites \  
        -H 'Content-Type: application/json' \  
        -d '{"city":"Boston","lat":42.36,"lon":-71.06}'
   ```

For future test automation, consider adding Jest + Supertest for API tests and Cypress for end-to-end UI tests.

---

## API Reference

Base URL: `http://localhost:3000/api`

### GET `/favorites`

* **Description:** Return all saved favorite cities.
* **Response:** JSON array of objects:

  ```json
  [
    { "id": "...", "city": "New York", "latitude": 40.71, "longitude": -74.01, "created_at": "2025-05-19T12:00:00Z" },
    ...
  ]
  ```

### POST `/favorites`

* **Description:** Save a new favorite city.
* **Request Body:**

  ```json
  { "city": "Los Angeles", "lat": 34.05, "lon": -118.24 }
  ```
* **Response:** The created record:

  ```json
  { "id": "...", "city": "Los Angeles", "latitude": 34.05, "longitude": -118.24, "created_at": "..." }
  ```

### GET `/cleaned-forecast?lat=<lat>&lon=<lon>`

* **Description:** Proxy to OpenWeather’s One Call API, returns next five days’ forecast (daily array).
* **Query Params:** `lat`, `lon`.
* **Response:** Array of five forecast objects.

---

## Known Bugs

* **Overlapping Map Markers:** Markers at identical coordinates stack. Consider jittering or clustering.
* **Missing Favicon:** Browser console shows 404; add a favicon to root.
* **CSS Vendor Prefixes:** Some flex/grid rules may not apply in older browsers without autoprefixer.

---

## Roadmap

* **Automated Testing:** Add Jest/Supertest and Cypress suites.
* **User Authentication:** Integrate Supabase Auth to manage user-specific favorites.
* **UI Framework Migration:** Consider React or Vue for dynamic components.
* **Accessibility Improvements:** Audit for WCAG compliance.
* **Additional Data:** Add historical weather trends and multi-city comparison.

---

*End of Developer Manual*
