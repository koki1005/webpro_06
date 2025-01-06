"use strict";
const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use("/public", express.static(__dirname + "/public"));

let bbs = []; // 投稿データ

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor(Math.random() * 6 + 1);
  let luck = '';
  if (num == 1) luck = '大吉';
  else if (num == 2) luck = '中吉';
  else if (num == 3) luck = '吉';
  else if (num == 4) luck = '凶';
  else if (num == 5) luck = '小吉';
  else if (num == 6) luck = '大凶';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;  
  let win = Number(req.query.win);  
  let total = Number(req.query.total);  

  const num = Math.floor(Math.random() * 3 + 1);
  let cpu = '';
  if (num == 1) cpu = 'グー';
  else if (num == 2) cpu = 'チョキ';
  else cpu = 'パー';

  let judgement = '';
  if (hand === cpu) {
    judgement = '引き分け';
  } else if (
    (hand === 'グー' && cpu === 'チョキ') ||
    (hand === 'チョキ' && cpu === 'パー') ||
    (hand === 'パー' && cpu === 'グー')
  ) {
    judgement = '勝ち';
    win += 1;
  } else {
    judgement = '負け';
  }

  total += 1;  

  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  };

  res.render('janken', display);
});

app.get('/nazonazo', (req, res) => {
  const userAnswer = req.query.text ? req.query.text.trim() : ''; 
  const correctAnswer = 'ふらいぱん'; 

  let resultMessage = '';  

  if (userAnswer) {
    if (userAnswer === correctAnswer) {
      resultMessage = '正解！よくできました！';
    } else {
      resultMessage = '残念，不正解です．';
    }
  }

  res.render('nazonazo', { resultMessage: resultMessage });
});

app.get("/dentaku", (req, res) => {
  res.render('dentaku');  
});

app.get("/get_test", (req, res) => {
  res.json({
    answer: 0
  })
});

app.get("/add", (req, res) => {
  console.log("GET");
  console.log( req.query );
  const num1 = Number( req.query.num1 );
  const num2 = Number( req.query.num2 );
  console.log( num1 );
  console.log( num2 );
  res.json( {answer: num1+num2} );
});

app.post("/add", (req, res) => {
  console.log("POST");
  console.log( req.body );
  const num1 = Number( req.body.num1 );
  const num2 = Number( req.body.num2 );
  console.log( num1 );
  console.log( num2 );
  res.json( {answer: num1+num2} );
});

// これより下はBBS関係
app.post("/check", (req, res) => {
  // 本来はここでDBMSに問い合わせる
  res.json( {number: bbs.length });
});

app.post("/read", (req, res) => {
  // 本来はここでDBMSに問い合わせる
  const start = Number( req.body.start );
  console.log( "read -> " + start );
  if( start==0 ) res.json( {messages: bbs });
  else res.json( {messages: bbs.slice( start )});
});

app.post("/post", (req, res) => {
  const name = req.body.name;
  const message = req.body.message;
  console.log( [name, message] );
  // 本来はここでDBMSに保存する
  bbs.push( { name: name, message: message } );
  res.json( {number: bbs.length } );
});

app.get("/bbs", (req,res) => {
    console.log("GET /BBS");
    res.json( {test: "GET /BBS" });
});

app.post("/bbs", (req,res) => {
    console.log("POST /BBS");
    res.json( {test: "POST /BBS"});
})

app.get("/bbs/:id", (req,res) => {
    console.log( "GET /BBS/" + req.params.id );
    res.json( {test: "GET /BBS/" + req.params.id });
});

app.put("/bbs/:id", (req,res) => {
    console.log( "PUT /BBS/" + req.params.id );
    res.json( {test: "PUT /BBS/" + req.params.id });
});

app.delete("/bbs/:id", (req,res) => {
    console.log( "DELETE /BBS/" + req.params.id );
    res.json( {test: "DELETE /BBS/" + req.params.id });
});

app.post("/edit", (req, res) => {
  const id = req.body.id;
  const message = req.body.message;
  console.log("編集 ->", id, message);

  // 本来はここでDBMSを使ってメッセージを更新する
  bbs = bbs.map(item => item.id == id ? { ...item, message } : item);
  res.json({ status: "success" });
});

app.post("/delete", (req, res) => {
  const id = req.body.id;
  console.log("削除 ->", id);

  // 本来はここでDBMSを使ってメッセージを削除する
  bbs = bbs.filter(item => item.id != id);
  res.json({ status: "success" });
});

app.post("/like", (req, res) => {
  const id = req.body.id; // 投稿のID
  if (bbs[id]) {
      bbs[id].likes = (bbs[id].likes || 0) + 1; // いいねカウントを増加
      res.json({ likes: bbs[id].likes });
  } else {
      res.status(404).json({ error: "Post not found" });
  }
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
