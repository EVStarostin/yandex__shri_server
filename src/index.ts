import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import fs from "fs";
import { Event, EventsData } from "./models";

const PORT: string = process.env.PORT || "8000";
const app: express.Application = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/status", (req: express.Request, res: express.Response): void => {
  const uptime: number = process.uptime();
  const formattedUptime: string = formatTime(uptime);
  res.send(formattedUptime);
});

app.get("/api/events", handeEventsRequest);
app.post("/api/events", handeEventsRequest);

app.get("*", (req: express.Request, res: express.Response): void => {
  res.status(404).send("<h1>Page not found</h1>");
});

app.listen(PORT, (): void => {
  /* tslint:disable-next-line:no-console */
  console.log(`Example app listening on port ${ PORT }!`);
});

function handeEventsRequest(req: express.Request, res: express.Response, next: express.NextFunction): void {
  let type: string | null = null;
  let page: string | null = null;
  let limit: string | null = null;
  if (req.method === "POST") {
    ({ type, page, limit } = req.body);
  } else if (req.method === "GET") {
    ({ type, page, limit } = req.query);
  }

  const types: string[] = ["info", "critical"];

  let wrongQuery: boolean = false;
  let reqTypes: string[] = [];
  if (type) {
    reqTypes = type.split(":");
    wrongQuery = false;
    reqTypes.forEach((reqType: string) => {
      if (!types.includes(reqType)) {
        wrongQuery = true;
        return;
      }
    });
  }

  if (wrongQuery) {
    res.status(400).json({ msg: "incorrect type" });
    return;
  }

  try {
    fs.readFile("data/events.json", (err: NodeJS.ErrnoException, data: Buffer) => {
      if (err) { throw err; }
      let { events }: EventsData = JSON.parse(String(data));
      let paginatedEvents: Event[] = [];
      if (!type) {
        paginatedEvents = paginate(events, Number(page), Number(limit));
      } else {
        events = events.filter((event) => reqTypes.includes(event.type));
        paginatedEvents = paginate(events, Number(page), Number(limit));
      }
      res.json({ events: paginatedEvents, total: events.length });
    });
  } catch (error) {
    next(error);
  }
}

function formatTime(time: number): string {
  const hours: number = Math.floor(time / 3600);
  const minutes: number = Math.floor(time % 3600 / 60);
  const seconds: number = Math.floor(time % 3600 % 60);
  const formattedTime: string = `${
    (hours / 10 < 1) ? "0" + hours : hours
    }:${
    (minutes / 10 < 1) ? "0" + minutes : minutes
    }:${
    (seconds / 10 < 1) ? "0" + seconds : seconds
    }`;

  return formattedTime;
}

function paginate(array: Event[], page: number, limit: number): Event[] {
  const defaultLimit: number = 10;
  let respondData: Event[] = [];
  if (isFinite(page) && isFinite(limit)) {
    respondData = array.slice( (page - 1) * limit, page * limit );
  } else if (isFinite(page)) {
    respondData = array.slice( (page - 1) * defaultLimit, page * defaultLimit );
  } else if (isFinite(limit)) {
    respondData = array.slice( 0, limit );
  } else {
    respondData = array;
  }
  return respondData;
}
