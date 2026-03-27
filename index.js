var express = require("express");
var app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

// ── 2.1 Route /test/* ──────────────────────────────────────────
app.get("/test/*", function (req, res) {
  var after = req.url.substr(6); // supprime "/test/"
  res.json({ msg: after });
});

// ── 2.3 Compteur ───────────────────────────────────────────────
var cpt = 0;

app.get("/cpt/query", function (req, res) {
  res.json({ value: cpt });
});

app.get("/cpt/inc", function (req, res) {
  if (req.query.v !== undefined) {
    if (req.query.v.match(/^-?[0-9]+$/)) {
      cpt += parseInt(req.query.v);
      res.json({ code: 0 });
    } else {
      res.json({ code: -1 });
    }
  } else {
    cpt += 1;
    res.json({ code: 0 });
  }
});

// ── 2.4 Messages ───────────────────────────────────────────────
var allMsgs = ["Hello World", "foobar", "CentraleSupelec Forever"];

// Récupérer un message par numéro
app.get("/msg/get/*", function (req, res) {
  var n = parseInt(req.url.substr(9)); // supprime "/msg/get/"
  if (!isNaN(n) && n >= 0 && n < allMsgs.length) {
    res.json({ code: 1, msg: allMsgs[n] });
  } else {
    res.json({ code: 0 });
  }
});

// Nombre de messages
app.get("/msg/nber", function (req, res) {
  res.json(allMsgs.length);
});

// Tous les messages
app.get("/msg/getAll", function (req, res) {
  res.json(allMsgs);
});

// Poster un message
app.get("/msg/post/*", function (req, res) {
  var message = unescape(req.url.substr(10)); // supprime "/msg/post/"
  allMsgs.push(message);
  res.json({ code: 1, index: allMsgs.length - 1 });
});

// Supprimer un message
app.get("/msg/del/*", function (req, res) {
  var n = parseInt(req.url.substr(9)); // supprime "/msg/del/"
  if (!isNaN(n) && n >= 0 && n < allMsgs.length) {
    allMsgs.splice(n, 1);
    res.json({ code: 1 });
  } else {
    res.json({ code: 0 });
  }
});

// ── Démarrage ──────────────────────────────────────────────────
app.listen(5000);
console.log("App listening on port 5000...");
