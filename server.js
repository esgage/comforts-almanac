const PORT = 3000;
const axios = require("axios").default;
const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');
const options = {}

app.use(cors());

app.get('/fetch-home', (req, res) => {
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

app.get('/fetch-areas', (req, res) => {
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

app.get('/fetch-search/:query', (req, res) => {
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

app.get('/fetch-category/:id', (req, res) =>{
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

app.get('/fetch-areas/:id', (req, res) =>{
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

app.get('/fetch-recipe/:id', (req, res) => {
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

http.createServer(options, app).listen(PORT, ()=> console.log('server is runing at port ' + PORT));