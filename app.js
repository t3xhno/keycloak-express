const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));

const PORT = 5171;

app.listen(PORT, () => console.log(`Running @ ${PORT}`));

const getAccessToken = (req, res, next) => {
  let inToken = null;
  let auth = req.headers["authorization"];

  const token = {
    "access_token": "SOME_TOKEN",
    "clientId": "oauth-client-1",
    "scope": ["foo"],
  };

  req.access_token = null;

  if (auth && auth.toLowerCase().indexOf("bearer") == 0) {
    inToken = auth.slice("bearer ".length);
    console.log(inToken);

    if (inToken === "SOME_TOKEN") req.access_token = token;
  };

  next();
  return;
};

const requiresAccessToken = (req, res, next) => {
  if (req.access_token) next();
  else res.status(401).end();
};

app.all("*", getAccessToken, requiresAccessToken);

app.get("/fruit", (req, res, next) => {
  res.json(["Apple", "Pear", "Grape", "Orange", "Banana"]);
});
