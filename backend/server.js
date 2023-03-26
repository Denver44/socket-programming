import express from "express";
import nanobuffer from "nanobuffer";
import morgan from "morgan";

const port = process.env.PORT || 3000;

const app = express();
// get express ready to run
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("view"));

// set up a limited array
const msg = new nanobuffer(50);
const getMsgs = () => Array.from(msg).reverse();

// feel free to take out, this just seeds the server with at least one message
msg.push({
  user: "brian",
  text: "hi",
  time: Date.now(),
});

app.get("/poll", function (req, res) {
  res.json({
    msg: getMsgs(),
  });
});

app.post("/poll", function (req, res) {
  const { user, text } = req.body;
  console.log("req.body  ", req.body);
  console.log("user  ", user);
  console.log("text  ", text);
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
app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
