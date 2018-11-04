import express from "express";
import fs from "fs";
import { promisify } from "util";
import { Event, EventsData } from "../models";

const readFileAsync = promisify(fs.readFile);
const router = express.Router();

router.get("/", handeEventsRequest);
router.post("/", handeEventsRequest);

function handeEventsRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
  let type: string | null = null;
  let page: string | null = null;
  let limit: string | null = null;
  if (req.method === "POST") {
    ({ type, page, limit } = req.body);
  } else if (req.method === "GET") {
    ({ type, page, limit } = req.query);
  }

  const types = ["info", "critical"];

  let wrongQuery = false;
  let reqTypes: string[] = [];
  if (type) {
    reqTypes = type.split(":");
    wrongQuery = false;
    reqTypes.forEach((reqType) => {
      if (!types.includes(reqType)) {
        wrongQuery = true;
        return;
      }
    });
  }

  if (wrongQuery) {
    res.status(400).send("incorrect type");
    return;
  }

  readFileAsync("data/events.json")
    .then((data: Buffer) => {
      let { events }: EventsData = JSON.parse(String(data));
      let paginatedEvents: Event[] = [];
      if (!type) {
        paginatedEvents = paginate(events, Number(page), Number(limit));
      } else {
        events = events.filter((event) => reqTypes.includes(event.type));
        paginatedEvents = paginate(events, Number(page), Number(limit));
      }
      res.json({ events: paginatedEvents, total: events.length });
    })
    .catch((err: Error) => next(err));
}

function paginate(array: Event[], page: number, limit: number): Event[] {
  const defaultLimit = 10;
  let respondData: Event[] = [];
  if (isFinite(page) && isFinite(limit)) {
    respondData = array.slice((page - 1) * limit, page * limit);
  } else if (isFinite(page)) {
    respondData = array.slice((page - 1) * defaultLimit, page * defaultLimit);
  } else if (isFinite(limit)) {
    respondData = array.slice(0, limit);
  } else {
    respondData = array;
  }
  return respondData;
}

export default router;
