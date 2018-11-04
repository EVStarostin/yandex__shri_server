import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import logger from "morgan";

import eventsRouter from "./routes/events";
import statusRouter from "./routes/status";
import stateRouter from "./routes/state";

const app = express();
const PORT = process.env.PORT || "8000";

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/status", statusRouter);
app.use("/api/events", eventsRouter);
app.use("/api/state", stateRouter);

// catch 404
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(404).type("text/html").send("<h1>Page not found</h1>");
});

// error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(500);
  res.send("error");
});

/* tslint:disable-next-line:no-console */
app.listen(PORT, () => console.log(`Example app listening on port ${ PORT }!`));
