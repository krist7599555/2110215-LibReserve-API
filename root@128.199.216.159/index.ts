import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import _ from "lodash";

mongoose
  .connect(
    "mongodb://localhost:27017/2110215",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("mongodb connect db 2110215");
  });

const tableSchema = new mongoose.Schema({
  username: { type: String, required: true },
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
  position: { type: String, required: true }
});
const table = mongoose.model("table", tableSchema);

const app = express();

app.use(morgan("dev"));
app.listen(3721, () => {
  console.log("express connect port 3721");
});

app.get("/", (req, res) => {
  return res.sendStatus(200);
});

app.get("/table", async (req, res) => {
  const docs = (await table.find({}).catch(() => [])) || [];
  const result = _.chain(docs)
    .map(doc =>
      _.pickBy(doc, (v, k) =>
        _.includes(["position", "startTime", "endTime"], k)
      )
    )
    .groupBy("position")
    .value();
  const bigresult = _.chain(result)
    .values()
    .flatten()
    // @ts-ignore
    .groupBy(obj => {
      return String(_.get(obj, "position", "-")).slice(0, 1);
    })
    .value();
  return res.status(200).send(_.assign(result, bigresult));
});
app.get("/table/:position", async (req, res) => {
  let position: string = req.params.position;
  const docs = await table.find({
    position: position.length == 1 ? RegExp(`^${position}[0-9]+$`) : position
  });
  return res.status(200).send(docs);
});
app.get("/history/:username", async (req, res) => {
  const username = req.params.username;
  return res.status(200).send(await table.find({ username }));
});

app.get("/add", async (req, res) => {
  const data = req.query;
  if (!(await checkValid(data.position, data.startTime, data.endTime))) {
    return res.status(400).send("position or time can not be apply");
  }
  return await table
    .create(new table(data))
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(400));
});

app.get("/remove", async (req, res) => {
  const data = req.query;
  return await table
    .deleteOne(data)
    .then(({ n }) => res.status(200).send(String(n)))
    .catch(() => res.sendStatus(400));
});

function checkValid(position: string, s: Number, t: Number) {
  return table.find({ position }).then(docs =>
    _.every(docs, doc => {
      return t <= _.get(doc, "startTime") || _.get(doc, "endTime") <= s;
    })
  );
}
