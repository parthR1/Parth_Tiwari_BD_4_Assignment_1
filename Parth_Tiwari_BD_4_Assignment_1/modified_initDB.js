// This database seeder script has been sourced from:
// https://gist.github.com/imrhlrvndrn/0b2abb42877684e1fdc8d598364bbc9a

// Following modifications have been done:
// #1 The SQL query to create restaurants and dishes tables in the sqlite database have been modified so that isVeg, hasOutdoorSeating and isLuxury attributes are of boolean type.
// db.run(
//   `CREATE TABLE IF NOT EXISTS restaurants (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT,
//     cuisine TEXT,
//     isVeg BOOLEAN, <--- Earlier was isVeg TEXT,
//     rating REAL,
//     priceForTwo INTEGER,
//     location TEXT,
//     hasOutdoorSeating BOOLEAN, <--- Earlier was hasOutdoorSeating TEXT,
//     isLuxury BOOLEAN <--- Earlier was isLuxury TEXT,
//   )`

// #2 The data to be inserted into the tables, in json format, has been modified for the above attributes to boolean values.
// For ex:
// {
//   name: 'Olive Bistro',
//   cuisine: 'Italian',
//   isVeg: false, <--- Earlier was isVeg: 'false'
//   rating: 4.2,
//   priceForTwo: 2000,
//   location: 'Jubilee Hills',
//   hasOutdoorSeating: false, <--- Earlier was hasOutdoorSeating: 'false'
//   isLuxury: true, <--- Earlier was isLuxury: 'false'
// },

// The database generated with this script should be used with modified_index.js file only

const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database(
  './Parth_Tiwari_BD_4_Assignment_1/modified_database.sqlite',
  (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to the SQLite database.');
    }
  }
);

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS restaurants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      cuisine TEXT,
      isVeg BOOLEAN,
      rating REAL,
      priceForTwo INTEGER,
      location TEXT,
      hasOutdoorSeating BOOLEAN,
      isLuxury BOOLEAN
    )`,
    (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Restaurants table created or already exists.');
      }
    }
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS dishes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      isVeg BOOLEAN,
      rating REAL,
      price INTEGER
    )`,
    (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Dishes table created or already exists.');
      }
    }
  );

  const stmt = db.prepare(
    'INSERT INTO restaurants (name, cuisine, isVeg, rating, priceForTwo, location, hasOutdoorSeating, isLuxury) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const stmt2 = db.prepare(
    'INSERT INTO dishes (name, isVeg, rating, price) VALUES (?, ?, ?, ?)'
  );

  const restaurants = [
    {
      name: 'Spice Kitchen',
      cuisine: 'Indian',
      isVeg: true,
      rating: 4.5,
      priceForTwo: 1500,
      location: 'MG Road',
      hasOutdoorSeating: true,
      isLuxury: false,
    },
    {
      name: 'Olive Bistro',
      cuisine: 'Italian',
      isVeg: false,
      rating: 4.2,
      priceForTwo: 2000,
      location: 'Jubilee Hills',
      hasOutdoorSeating: false,
      isLuxury: true,
    },
    {
      name: 'Green Leaf',
      cuisine: 'Chinese',
      isVeg: true,
      rating: 4.0,
      priceForTwo: 1000,
      location: 'Banjara Hills',
      hasOutdoorSeating: false,
      isLuxury: false,
    },
  ];
  const dishes = [
    {
      name: 'Paneer Butter Masala',
      price: 300,
      rating: 4.5,
      isVeg: true,
    },
    {
      name: 'Chicken Alfredo Pasta',
      price: 500,
      rating: 4.7,
      isVeg: false,
    },
    {
      name: 'Veg Hakka Noodles',
      price: 250,
      rating: 4.3,
      isVeg: true,
    },
  ];

  for (let restaurant of restaurants) {
    stmt.run(
      restaurant.name,
      restaurant.cuisine,
      restaurant.isVeg,
      restaurant.rating,
      restaurant.priceForTwo,
      restaurant.location,
      restaurant.hasOutdoorSeating,
      restaurant.isLuxury
    );
  }
  for (let dish of dishes) {
    stmt2.run(dish.name, dish.isVeg, dish.rating, dish.price);
  }

  stmt.finalize();
  stmt2.finalize();

  console.log('Inserted 3 restaurants into the database.');
  console.log('Inserted 3 dishes into the database.');

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
});
