const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/status', function (req, res) {
  let uptime = process.uptime();
  const formattedUptime = formatTime(uptime);
  res.send(formattedUptime);
});

app.get('/api/events', handeEventsRequest);

app.post('/api/events', handeEventsRequest);

function handeEventsRequest(req, res) {
  let type, page, limit;
  if (req.method === 'POST') {
    ({ type, page, limit } = req.body);
  } else if (req.method === 'GET') {
    ({ type, page, limit } = req.query);
  }
  
  const types = ['info', 'critical'];

  let wrongQuery = false;
  let reqTypes = [];
  if (type) {
    reqTypes = type.split(':');
    wrongQuery = false;
    reqTypes.forEach(type => {
      if (types.indexOf(type) < 0) {
        wrongQuery = true;
        return;
      }
    });
  }

  if (wrongQuery) {
    res.status(400).json({ msg: 'incorrect type' });
    return;
  }

  fs.readFile('./events.json', (err, data) => {
    if (err) throw err;
    let { events } = JSON.parse(data);
    let paginatedEvents = [];
    if (!type) {
      paginatedEvents = paginate(events, Number(page), Number(limit));
    } else {
      events = events.filter(event => reqTypes.indexOf(event.type) >= 0);
      paginatedEvents = paginate(events, Number(page), Number(limit));
    }
    res.json({ events: paginatedEvents, total: events.length });
  });
};

app.get('*', function (req, res) {
  res.status(404).send('<h1>Page not found</h1>');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, function () {
  console.log(`Example app listening on port ${ PORT }!`);
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

function paginate(array, page, limit) {
  const defaultLimit = 10;
  let respondData = [];
  if (Number.isFinite(page) && Number.isFinite(limit)) {
    respondData = array.slice( (page - 1) * limit, page * limit );
  } else if (Number.isFinite(page)) {
    respondData = array.slice( (page - 1) * defaultLimit, page * defaultLimit );
  } else if (Number.isFinite(limit)) {
    respondData = array.slice( 0, limit );
  } else {
    respondData = array;
  }
  return respondData;
}
