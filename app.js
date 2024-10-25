const express = require("express");
const fs = require("fs");
const { title } = require("process");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("index", { title: "안녕하세요", message: "반갑습니다." });
});

app.listen(PORT);
