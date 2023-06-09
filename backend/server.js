import express from "express";
import nanobuffer from "nanobuffer";
import morgan from "morgan";

const port = process.env.PORT || 4000;

const app = express();
// get express ready to run
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("view"));

// set up a limited array
const msg = new nanobuffer(50);
const getMsgs = () => Array.from(msg).reverse();

msg.push({
  text: "hi",
  user: "denver",
  time: Date.now(),
});

app.get("/poll", function (req, res) {
  res.json({
    msg: getMsgs(),
  });
});

app.post("/poll", function (req, res) {
  const { user, text } = req.body;

  msg.push({
    user,
    text,
    time: Date.now(),
  });

  res.json({
    status: "ok",
  });
});

// start the server
app.listen(port, () => console.log(`listening on http://localhost:${port}`));
