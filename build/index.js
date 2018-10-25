"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var fs_1 = __importDefault(require("fs"));
var PORT = process.env.PORT || '8000';
var app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.get('/status', function (req, res) {
    var uptime = process.uptime();
    var formattedUptime = formatTime(uptime);
    res.send(formattedUptime);
});
app.get('/api/events', handeEventsRequest);
app.post('/api/events', handeEventsRequest);
app.get('*', function (req, res) {
    res.status(404).send('<h1>Page not found</h1>');
});
app.listen(PORT, function () {
    console.log("Example app listening on port " + PORT + "!");
});
function handeEventsRequest(req, res, next) {
    var _a, _b;
    var type = null, page = null, limit = null;
    if (req.method === 'POST') {
        (_a = req.body, type = _a.type, page = _a.page, limit = _a.limit);
    }
    else if (req.method === 'GET') {
        (_b = req.query, type = _b.type, page = _b.page, limit = _b.limit);
    }
    var types = ['info', 'critical'];
    var wrongQuery = false;
    var reqTypes = [];
    if (type) {
        reqTypes = type.split(':');
        wrongQuery = false;
        reqTypes.forEach(function (type) {
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
    try {
        fs_1.default.readFile('data/events.json', function (err, data) {
            if (err)
                throw err;
            var events = JSON.parse(String(data)).events;
            var paginatedEvents = [];
            if (!type) {
                paginatedEvents = paginate(events, Number(page), Number(limit));
            }
            else {
                events = events.filter(function (event) { return reqTypes.indexOf(event.type) >= 0; });
                paginatedEvents = paginate(events, Number(page), Number(limit));
            }
            res.json({ events: paginatedEvents, total: events.length });
        });
    }
    catch (error) {
        next(error);
    }
}
;
function formatTime(time) {
    var hours = Math.floor(time / 3600);
    var minutes = Math.floor(time % 3600 / 60);
    var seconds = Math.floor(time % 3600 % 60);
    var formattedTime = ((hours / 10 < 1) ? '0' + hours : hours) + ":" + ((minutes / 10 < 1) ? '0' + minutes : minutes) + ":" + ((seconds / 10 < 1) ? '0' + seconds : seconds);
    return formattedTime;
}
;
function paginate(array, page, limit) {
    var defaultLimit = 10;
    var respondData = [];
    if (isFinite(page) && isFinite(limit)) {
        respondData = array.slice((page - 1) * limit, page * limit);
    }
    else if (isFinite(page)) {
        respondData = array.slice((page - 1) * defaultLimit, page * defaultLimit);
    }
    else if (isFinite(limit)) {
        respondData = array.slice(0, limit);
    }
    else {
        respondData = array;
    }
    return respondData;
}
