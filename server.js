const PORT = 8000;
const axios = require("axios").default;
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(cors());

app.get('/home', (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://themealdb.p.rapidapi.com/randomselection.php',
        headers: {
          'X-RapidAPI-Key': process.env.RAPID_API_KEY,
          'X-RapidAPI-Host': 'themealdb.p.rapidapi.com'
        }
      };
      axios.request(options).then(function (response) {
          res.json(response.data);
      }).catch(function (error) {
          console.error(error);
      });
});

app.get('/mealCategories', (req, res) =>{
  const options = {
    method: 'GET',
    url: 'https://themealdb.p.rapidapi.com/categories.php',
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'themealdb.p.rapidapi.com'
    }
  };
  axios.request(options).then(function (response) {
    res.json(response.data);
  }).catch(function (error) {
    console.error(error);
  });
});

app.get('/search/:query', (req, res) => {
  const query = req.params.query;
  const options = {
    method: 'GET',
    url: 'https://themealdb.p.rapidapi.com/search.php',
    params: {s: query},
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'themealdb.p.rapidapi.com'
    }
  };
  axios.request(options).then(function (response) {
    res.json(response.data);
    console.log(response.data);
  }).catch(function (error) {
    console.error(error);
  });
});

app.get('/category/:id', (req, res) =>{
  const id = req.params.id;
  const options = {
    method: 'GET',
    url: 'https://themealdb.p.rapidapi.com/filter.php',
    params: {c: id},
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'themealdb.p.rapidapi.com'
    }
  };
  axios.request(options).then(function (response) {
    res.json(response.data);
    console.log(response.data);
  }).catch(function (error) {
    console.error(error);
  });
});

app.get('/recipe/:id', (req, res) => {
  const id = req.params.id;
    const options = {
      method: 'GET',
      url: 'https://themealdb.p.rapidapi.com/lookup.php',
      params: {i: id},
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'themealdb.p.rapidapi.com'
      }
    };
    axios.request(options).then(function (response) {
      res.json(response.data);
    }).catch(function (error) {
      console.error(error);
    });
});

app.listen(PORT, () => console.log('running on PORT ' + PORT));