import express from "express";
import { State } from "../models";

const router = express.Router();
let store: State = { page: "events" };

router.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.json(store);
});

router.post("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  store = req.body;
  res.json(store);
});

export default router;
