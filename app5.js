const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use("/public", express.static(__dirname + "/public"));

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

app.listen(8080, () => {
  console.log("Example app listening on port 8080!");
});
