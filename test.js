const express = require('express');
const request = require('request');
const app = express();

app.use(express.json());

app.get('/example', (req, res) => {
  try {
    request('https://last-airbender-api.fly.dev/api/v1/characters', (error, response, payload) => {
    const obj = JSON.parse(payload);
    const name = obj[0].name
    res.send(name)
    });
  } catch (e) {
    res.status(404).send(e);
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
