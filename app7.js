"use strict";

const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + "/public"));

let bbs = [];

app.post("/post", (req, res) => {
    const { name, message } = req.body;
    const newPost = { id: bbs.length, name, message, likes: 0 };
    bbs.push(newPost);
    res.json({ number: bbs.length, newPost });
});

app.post("/read", (req, res) => {
    const { start = 0 } = req.body;
    res.json({ messages: bbs.slice(Number(start)) });
});

app.post("/edit", (req, res) => {
    const { id, message } = req.body;
    const post = bbs.find(p => p.id == id);
    post ? (post.message = message, res.json({ status: "success" })) : res.status(404).json({ error: "Post not found" });
});

app.post("/like", (req, res) => {
    const { id } = req.body;
    const post = bbs.find(p => p.id == id);
    post ? (post.likes++, res.json({ likes: post.likes })) : res.status(404).json({ error: "Post not found" });
});

app.post("/delete", (req, res) => {
    const { id } = req.body;
    bbs = bbs.filter(p => p.id != id);
    res.json({ status: "success" });
});

app.listen(8080, () => console.log("Server running on port 8080!"));