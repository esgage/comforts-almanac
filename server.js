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
          console.log(response.data);
          res.json(response.data);
      }).catch(function (error) {
          console.error(error);
      });
});

app.listen(PORT, () => console.log('running on PORT ' + PORT));