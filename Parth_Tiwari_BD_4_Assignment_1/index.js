const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const app = express();
const port = 3000;

app.use(cors);
app.use(express.json());

// db initialisation
let db;

(async () => {
  db = await open({
    filename: './Parth_Tiwari_BD_4_Assignment_1/database.sqlite',
    driver: sqlite3.Database,
  });
})();

// Fetch all restaurants from the database and return the results
async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);

  return { restaurants: response };
}

// Given target id as argument, fetch a specific restaurant by its ID from the database and return the results
async function fetchRestaurantById(targetId) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.all(query, [targetId]);

  return { restaurants: response };
}

// Given target id as argument, fetch restaurants based on their cuisine from the database and return the results
async function fetchRestaurantsByCuisine(targetCuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [targetCuisine]);

  return { restaurants: response };
}

// Given isVeg, hasOutdoorSeating, isLuxury as arguments, fetch restaurants based on filters such as veg/non-veg, outdoor seating, luxury, from the database and return the results
async function fetchRestaurantsByFeatures(
  isRestoVeg,
  hasRestoOutSeating,
  isRestoLuxury
) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  let response = await db.all(query, [
    isRestoVeg,
    hasRestoOutSeating,
    isRestoLuxury,
  ]);

  return { restaurants: response };
}

// Fetch restaurants sorted by their rating (highest to lowest), from the database and return the results
async function fetchRestaurantsOrderedByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);

  return { restaurants: response };
}

// Fetch all dishes from the database and return the results
async function fetchAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);

  return { dishes: response };
}

// Given target id as argument, fetch a specific dish by its ID from the database and return the results
async function fetchDishById(targetId) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.all(query, [targetId]);

  return { dishes: response };
}

// Given target id as argument, fetch dishes based on veg/non-veg from the database and return the results
async function fetchDishByVegType(isDishVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?';
  let response = await db.all(query, [isDishVeg]);

  return { dishes: response };
}

// Fetch dishes sorted by their price (lowest to highest) from the database and return the results
async function fetchDishSortedByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price ASC';
  let response = await db.all(query, []);

  return { dishes: response };
}

// Endpoint 1: Fetch all restaurants from the database and display the results
app.get('/restaurants', async (req, res) => {
  try {
    let results = await fetchAllRestaurants();

    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Endpoint 2: Fetch a specific restaurant by its ID, given specified id as path param
app.get('/restaurants/details/:id', async (req, res) => {
  try {
    let targetId = parseInt(req.params.id);
    let results = await fetchRestaurantById(targetId);

    if (results.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: `No restaurant found by id: ${targetId}` });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Endpoint 3: Fetch restaurants based on their cuisine, given specified cuisine as path param
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    let targetCuisine = req.params.cuisine;
    let results = await fetchRestaurantsByCuisine(targetCuisine);

    if (results.restaurants.length === 0) {
      return res.status(404).json({
        message: `No restaurants found offering ${targetCuisine} cuisine`,
      });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Endpoint 4: Fetch restaurants based on filters such as veg/non-veg, outdoor seating and luxury, given isVeg, hasOutdoorSeating and isLuxury as query param
app.get('/restaurants/filter', async (req, res) => {
  try {
    let isRestoVeg = req.query.isVeg;
    let hasRestoOutSeating = req.query.hasOutdoorSeating;
    let isRestoLuxury = req.query.isLuxury;
    let results = await fetchRestaurantsByFeatures(
      isRestoVeg,
      hasRestoOutSeating,
      isRestoLuxury
    );

    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No such restaurant found:' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Endpoint 5: Fetch restaurants sorted by their rating (highest to lowest)
app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let results = await fetchRestaurantsOrderedByRating();

    if (results.restaurants.length === 0) {
      return res.status(404).json({
        message: 'No restaurants found ordered by rating high to low:',
      });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Endpoint 6: Fetch all dishes from the database.
app.get('/dishes', async (req, res) => {
  try {
    let results = await fetchAllDishes();

    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Endpoint 7: Fetch a specific dish by its ID from the database.
app.get('/dishes/details/:id', async (req, res) => {
  try {
    let targetId = parseInt(req.params.id);
    let results = await fetchDishById(targetId);

    if (results.dishes.length === 0) {
      return res
        .status(404)
        .json({ message: `No dish found by id: ${targetId}` });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Endpoint 8: Fetch dishes based on filters such as veg/non-veg.
app.get('/dishes/filter', async (req, res) => {
  try {
    let isDishVeg = req.query.isVeg;
    let results = await fetchDishByVegType(isDishVeg);

    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No such dishes found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Endpoint 9: Fetch dishes sorted by their price (lowest to highest)
app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let results = await fetchDishSortedByPrice();

    if (results.dishes.length === 0) {
      return res
        .status(404)
        .json({ message: 'No dishes found with price low to high' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
