const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;
app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/list", (req, res) => {
  let data = { data: [] };
  try {
    data = JSON.parse(fs.readFileSync("test.json", "utf-8"));
  } catch (err) {
    data = { data: [] };
  }
  res.render("list", { posts: data.data });
});

app.get("/create", (req, res) => {
  res.render("create");
});

// POST 요청으로부터 데이터를 받기 위해 설정
app.use(express.urlencoded({ extended: true }));

app.post("/create", (req, res) => {
  const { title, content, author } = req.body;
  let readed;
  try {
    readed = JSON.parse(fs.readFileSync("test.json", "utf-8"));
  } catch (err) {
    readed = {
      data: [],
    };
    console.log(err);
  }
  const nId = getNextId();
  const newPost = {
    id: nId,
    title,
    content,
    author,
    createdAt: new Date(),
    count: 0,
  };
  readed.data.push(newPost);
  fs.writeFileSync("test.json", JSON.stringify(readed), "utf-8");
  res.redirect("/list");
});
let maxId;
const initId = () => {
  try {
    const result = fs.readFileSync("test.json", "utf-8");
    const data = JSON.parse(result);
    const posts = data["data"];
    const idList = posts.map((x) => parseInt(x.id));
    console.log("idList", idList);
    maxId = Math.max(...idList);
  } catch (e) {
    maxId = 0;
  }
};
initId();

const getNextId = () => {
  return ++maxId;
};

app.listen(PORT);
