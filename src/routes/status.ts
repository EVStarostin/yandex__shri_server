import express from "express";
const router = express.Router();

router.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const uptime = getUptime();
  res.send(uptime);
});

function getUptime(): string {
  const uptime = new Date();
  uptime.setTime(process.uptime() * 1000);
  return uptime.toLocaleTimeString("ru-RU", {timeZone: "UTC"});
}

export default router;
