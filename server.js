const express = require("express");

const app = express();
app.use(express.json({ limit: "16kb" }));

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET,PUT,POST,OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Cache-Control", "no-store");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

let state = { stage: "idle", num: "", code: "", email: "", t: 0 };

app.get("/", (req, res) => res.type("text").send("channel up"));

app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/session", (req, res) => res.json(state));

app.put("/session", (req, res) => {
  const body = req.body || {};
  state = {
    stage: typeof body.stage === "string" ? body.stage : state.stage,
    num: typeof body.num === "string" ? body.num.slice(0, 2) : state.num,
    code: typeof body.code === "string" ? body.code.slice(0, 6) : state.code,
    email: typeof body.email === "string" ? body.email.slice(0, 120) : state.email,
    t: Date.now()
  };
  res.json(state);
});

app.post("/reset", (req, res) => {
  state = { stage: "idle", num: "", code: "", email: "", t: Date.now() };
  res.json(state);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("listening " + port));