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
    maxId = Math.max(...idList);
  } catch (e) {
    maxId = 0;
  }
};
initId();

const getNextId = () => {
  return ++maxId;
};

app.get("/view/:id", (req, res) => {
  const { id } = req.params;
  let data = { data: [] };
  try {
    data = JSON.parse(fs.readFileSync("test.json", "utf-8"));
  } catch (e) {
    data = { data: [] };
  }
  let post = {};
  data.data.forEach((item) => {
    if (item.id == id) {
      post = item;
      item.count = item.count + 1;
    }
  });
  fs.writeFileSync("test.json", JSON.stringify(data), "utf-8");
  res.render("view", { post });
});

app.get("/edit/:id", (req, res) => {
  const { id } = req.params;
  let data = { data: [] };
  try {
    data = JSON.parse(fs.readFileSync("test.json", "utf-8"));
  } catch (e) {
    data = { data: [] };
  }
  let post = {};
  data.data.forEach((item) => {
    if (item.id == id) {
      post = item;
    }
  });

  res.render("edit", { post });
});

app.post("/edit/:id", (req, res) => {
  const { id } = req.params;
  const { title, content, author } = req.body;
  const data = JSON.parse(fs.readFileSync("test.json", "utf-8"));
  data.data.forEach((item) => {
    if (item.id == id) {
      item.title = title;
      item.content = content;
      item.author = author;
    }
  });
  fs.writeFileSync("test.json", JSON.stringify(data), "utf-8");
  res.redirect(`/view/${id}`);
});
app.get("/delete/:id", (req, res) => {
  const { id } = req.params;
  const data = JSON.parse(fs.readFileSync("test.json", "utf-8"));
  const result = data.data.filter((item) => item.id !== id);
  fs.writeFileSync("test.json", JSON.stringify(result), "utf-8");
  res.redirect(`/list`);
});
app.listen(PORT);
