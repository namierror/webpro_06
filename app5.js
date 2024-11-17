const express = require("express");
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

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
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 || num==3 ) luck = '中吉';
  else if( num==4 || num==5 ) luck = '末吉';
  else luck = '凶';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  // 今はダミーで人間の勝ちにしておく
  if( hand == cpu ) judgement = '引き分け';
  else if( hand == 'グー' ){
    if( cpu == 'チョキ') judgement = '勝ち';
    else judgement = '負け';
  }
  else if( hand == 'チョキ' ){
    if( cpu == 'グー' ) judgement = '負け';
    else judgement = '勝ち';
  }
  else{
    if( cpu == 'グー' ) judgement = '勝ち';
    else judgement = '負け';
  }

  if( judgement == '勝ち' ) win += 1;

  total += 1;

  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});

// ロシアンルーレットゲームのロジック
function startRussianRoulette(playerChoice) {
    const totalChambers = 6;
    let bulletPosition = Math.floor(Math.random() * totalChambers) + 1;
    let cpuChoice;
    let resultMessage = '';

    // CPUの選択をプレイヤーと重複しないようにランダムに選ぶ
    const availableChoices = [1, 2, 3, 4, 5, 6].filter(choice => choice !== playerChoice);
    cpuChoice = availableChoices[Math.floor(Math.random() * availableChoices.length)];

    // 結果の判定
    if (playerChoice === bulletPosition) {
        resultMessage = 'プレイヤーが銃弾を引きました！プレイヤーの負けです。';
    } else if (cpuChoice === bulletPosition) {
        resultMessage = 'CPUが銃弾を引きました！CPUの負けです。';
    } else {
        resultMessage = '銃弾はまだ引かれませんでした。次の選択をお願いします。';
    }

    return { playerChoice, cpuChoice, bulletPosition, resultMessage };
}

// プレイヤーが選択肢を選んだ後の処理
app.get('/play', (req, res) => {
    const playerChoice = parseInt(req.query.choice);

    // ロシアンルーレットゲームの結果を取得
    const result = startRussianRoulette(playerChoice);

    // 結果を返す
    res.render('roulette', {
        message: result.resultMessage,
        playerChoice: result.playerChoice,
        cpuChoice: result.cpuChoice,
        bulletPosition: result.bulletPosition
    });
});

// ルートエンドポイント（初期表示）
app.get('/', (req, res) => {
    // 初期表示ではcolorCodeをrgb(255, 255, 255)に設定
    res.send(`
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>背景色変更アプリ</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    transition: background-color 0.5s ease;
                }

                .container {
                    text-align: center;
                    padding: 20px;
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                }

                h1 {
                    margin-bottom: 20px;
                }

                input {
                    width: 60px;
                    padding: 5px;
                    margin: 5px;
                    font-size: 16px;
                }

                .buttons {
                    margin-top: 20px;
                }

                .buttons button {
                    padding: 10px 20px;
                    font-size: 16px;
                    cursor: pointer;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                }

                .buttons button:hover {
                    background-color: #45a049;
                }
            </style>
        </head>
        <body style="background-color: rgb(255, 255, 255);">
            <div class="container">
                <h1>背景色をRGBで設定</h1>
                <form action="/set-color" method="POST">
                    <label for="red">Red:</label>
                    <input type="number" id="red" name="red" min="0" max="255" required>

                    <label for="green">Green:</label>
                    <input type="number" id="green" name="green" min="0" max="255" required>

                    <label for="blue">Blue:</label>
                    <input type="number" id="blue" name="blue" min="0" max="255" required>

                    <div class="buttons">
                        <button type="submit">背景色を変更</button>
                    </div>
                </form>
            </div>
        </body>
        </html>
    `);
});

// RGBの入力を受け取ってレスポンスするエンドポイント
app.post('/set-color', (req, res) => {
    const { red, green, blue } = req.body;

    // RGB値が正しい範囲かチェック
    if (
        red >= 0 && red <= 255 &&
        green >= 0 && green <= 255 &&
        blue >= 0 && blue <= 255
    ) {
        // RGBを使用してカラーコードを作成
        const colorCode = `rgb(${red}, ${green}, ${blue})`;
        console.log('Received colorCode:', colorCode); // デバッグ用ログ
        // EJSにcolorCodeを渡して背景色を変更
        res.send(`
            <!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>背景色変更アプリ</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        transition: background-color 0.5s ease;
                    }

                    .container {
                        text-align: center;
                        padding: 20px;
                        background-color: white;
                        border-radius: 8px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    }

                    h1 {
                        margin-bottom: 20px;
                    }

                    input {
                        width: 60px;
                        padding: 5px;
                        margin: 5px;
                        font-size: 16px;
                    }

                    .buttons {
                        margin-top: 20px;
                    }

                    .buttons button {
                        padding: 10px 20px;
                        font-size: 16px;
                        cursor: pointer;
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 5px;
                    }

                    .buttons button:hover {
                        background-color: #45a049;
                    }
                </style>
            </head>
            <body style="background-color: ${colorCode};">
                <div class="container">
                    <h1>背景色をRGBで設定</h1>
                    <form action="/set-color" method="POST">
                        <label for="red">Red:</label>
                        <input type="number" id="red" name="red" min="0" max="255" required>

                        <label for="green">Green:</label>
                        <input type="number" id="green" name="green" min="0" max="255" required>

                        <label for="blue">Blue:</label>
                        <input type="number" id="blue" name="blue" min="0" max="255" required>

                        <div class="buttons">
                            <button type="submit">背景色を変更</button>
                        </div>
                    </form>
                </div>
            </body>
            </html>
        `);
    } else {
        // 範囲外の場合はデフォルト色（白）に戻す
        const colorCode = 'rgb(255, 255, 255)';
        console.log('Invalid RGB values. Setting colorCode to default (white).');
        res.send(`
            <!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>背景色変更アプリ</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        transition: background-color 0.5s ease;
                    }

                    .container {
                        text-align: center;
                        padding: 20px;
                        background-color: white;
                        border-radius: 8px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    }

                    h1 {
                        margin-bottom: 20px;
                    }

                    input {
                        width: 60px;
                        padding: 5px;
                        margin: 5px;
                        font-size: 16px;
                    }

                    .buttons {
                        margin-top: 20px;
                    }

                    .buttons button {
                        padding: 10px 20px;
                        font-size: 16px;
                        cursor: pointer;
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 5px;
                    }

                    .buttons button:hover {
                        background-color: #45a049;
                    }
                </style>
            </head>
            <body style="background-color: ${colorCode};">
                <div class="container">
                    <h1>背景色をRGBで設定</h1>
                    <form action="/set-color" method="POST">
                        <label for="red">Red:</label>
                        <input type="number" id="red" name="red" min="0" max="255" required>

                        <label for="green">Green:</label>
                        <input type="number" id="green" name="green" min="0" max="255" required>

                        <label for="blue">Blue:</label>
                        <input type="number" id="blue" name="blue" min="0" max="255" required>

                        <div class="buttons">
                            <button type="submit">背景色を変更</button>
                        </div>
                    </form>
                </div>
            </body>
            </html>
        `);
    }
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
