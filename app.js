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

const posts = [
  { title: "테스트 타이틀 1", content: "테스트 컨텐트 1" },
  { title: "테스트 타이틀 2", content: "테스트 컨텐트 2" },
  { title: "테스트 타이틀 3", content: "테스트 컨텐트 3" },
];

app.get("/sample", (req, res) => {
  res.render("sample", { data: posts });
});

app.listen(PORT);
