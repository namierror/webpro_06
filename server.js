"use strict";
const express = require("express");
const app = express();

let bbs = [];  // 投稿データと「いいね」数を管理
let favorites = [];  // お気に入り投稿を管理

app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.post("/check", (req, res) => {
  res.json({ number: bbs.length });
});

app.post("/read", (req, res) => {
  const start = Number(req.body.start);
  console.log("read -> " + start);
  if (start === 0) {
    res.json({ messages: bbs });
  } else {
    res.json({ messages: bbs.slice(start) });
  }
});

app.post("/post", (req, res) => {
  const name = req.body.name;
  const message = req.body.message;
  console.log([name, message]);

  bbs.push({ name: name, message: message, likes: 0 });
  res.json({ number: bbs.length });
});

app.post("/good", (req, res) => {
  const postId = Number(req.body.postId);
  console.log(`Received like for postId: ${postId}`);
  
  if (bbs[postId]) {
    bbs[postId].likes++;
    res.json({ likes: bbs[postId].likes });
  }
});

app.post("/favorite", (req, res) => {
  const postId = Number(req.body.postId);
  if (bbs[postId]) {
    const post = bbs[postId];
    if (!favorites.some(fav => fav === post)) {
      favorites.push(post);
    }
    res.json({ favorites });
  }
});

app.post("/getFavorites", (req, res) => {
  res.json({ favorites });
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));


