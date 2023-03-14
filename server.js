const PORT = 3000;
const axios = require("axios").default;
const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');
const options = {
  /*key: fs.readFileSync(process.env.SSLKEY),
  cert: fs.readFileSync(process.env.SSLCERT),*/
}

/*app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self' https://localhost:4000;");
  next();
});*/

console.log('say something!!!!!');

app.use(cors());

app.get('/home', (req, res) => {
    console.log('request for /home');
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

app.get('/mealCategories', (req, res) => {
  console.log('request for /mealcategories');
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

app.get('/areas', (req, res) => {
  console.log('request for /areas');
  const options = {
    method: 'GET',
    url: 'https://themealdb.p.rapidapi.com/list.php',
    params: {a: 'list'},
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'themealdb.p.rapidapi.com'
    }
  };
  axios.request(options).then(function (response){
    res.json(response.data);
  }).catch(function (error){
    console.error(error);
  });
});

app.get('/search/:query', (req, res) => {
  console.log('request for search query');
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
  }).catch(function (error) {
    console.error(error);
  });
});

app.get('/category/:id', (req, res) =>{
  console.log('request for category');
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
  }).catch(function (error) {
    console.error(error);
  });
});

app.get('/areas/:id', (req, res) =>{
  console.log('request for area');
  const id = req.params.id;
  const options = {
    method: 'GET',
    url: 'https://themealdb.p.rapidapi.com/filter.php',
    params: {a: id},
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

app.get('/recipe/:id', (req, res) => {
  console.log('request for recipe');
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

/*app.listen(PORT, () => console.log('running on PORT ' + PORT));*/

http.createServer(options, app).listen(PORT, ()=> console.log('server is runing at port ' + PORT));