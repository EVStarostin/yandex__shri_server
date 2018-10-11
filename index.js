const express = require('express');
const fs = require('fs');
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/status', function (req, res) {
  let uptime = process.uptime();
  const formattedUptime = formatTime(uptime);
  res.send(formattedUptime);
});

app.get('/api/events', function (req, res) {
  const { type } = req.query;
  const types = ['info', 'critical'];
  if (type && types.indexOf(type) < 0) {
    res.status(400).send({ status: 'error', message: 'incorrect type' });
    return;
  }
  fs.readFile('./events.json', (err, data) => {
    if (err) throw err;
    if (!type) {
      res.send(JSON.parse(data));
    } else {
      let { events } = JSON.parse(data);
      events = events.filter(event => event.type === type);
      res.send({ events });
    }
  });
});

app.get('*', function (req, res) {
  res.status(404).send('<h1>Page not found</h1>');
});

app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});

function formatTime(time) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor(time % 3600 / 60);
  const seconds = Math.floor(time % 3600 % 60);
  const formattedTime = `${
    (hours / 10 < 1) ? '0' + hours : hours
  }:${
    (minutes / 10 < 1) ? '0' + minutes : minutes
  }:${
    (seconds / 10 < 1) ? '0' + seconds : seconds
  }`;
  
  return formattedTime;
};