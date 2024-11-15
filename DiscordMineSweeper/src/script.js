const NUM = {
    1: ["one", 3],
    2: ["two", 3],
    3: ["three", 5],
    4: ["four", 4],
    5: ["five", 4],
    6: ["six", 3],
    7: ["seven", 5],
    8: ["eight", 5]
}
let total = 0;

function generate() {
    const widthIn = document.getElementById("width");
    const heightIn = document.getElementById("height");
    const bombIn = document.getElementById("bomb");
    const emojiIn = document.getElementById("emoji");

    const outText = document.getElementById("outText");

    let minesweeper = createMinesweeper(parseInt(widthIn.value), parseInt(heightIn.value), parseInt(bombIn.value));
    total = 0;
    let emojisweeper = createEmojisweeper(minesweeper, emojiIn.value);

    let resultText = "";
    for (let i = 0; i < emojisweeper.length; i++) {
        for (let j = 0; j < emojisweeper[i].length; j++) {
            resultText += emojisweeper[i][j];
        }
        resultText += "\n";
        total += 1;
    }

    outText.innerHTML = resultText;
    const totalOut = document.getElementById("total");
    if (total > 2000 || (parseInt(widthIn.value) * parseInt(heightIn.value)) > 99) {
        totalOut.innerHTML = "文字数 " + total + "　絵文字数 " + (parseInt(widthIn.value) * parseInt(heightIn.value)) +
            "　注意！discordメッセージの最大数を超えています！もっと小さくオナシャス！";
    } else {
        totalOut.innerHTML = "文字数 " + total + "　絵文字数 " + (parseInt(widthIn.value) * parseInt(heightIn.value));
    }

}

// -1 := bomb
function createMinesweeper(width, height, bomb) {
    if (width * height < bomb) {
        alert("爆弾数が多すぎます");
        return undefined;
    }

    // ランダムに配置
    let rangeAry = [];
    let indexDivOne = [];
    for (let i = 0; i < width * height; i++) {
        rangeAry.push(i);
    }
    for (let i = 0; i < bomb; i++) {
        let r = Math.floor(Math.random() * rangeAry.length);
        indexDivOne.push(rangeAry[r]);
        rangeAry.splice(r, 1);
    }
    let minesweeper = Array(height);
    for (let i = 0; i < height; i++) {
        minesweeper[i] = Array(width);
    }
    for (let i = 0; i < indexDivOne.length; i++) {
        minesweeper[Math.floor(indexDivOne[i] / width)][indexDivOne[i] % width] = -1;
    }

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (minesweeper[i][j] !== -1) {
                let cnt = 0;
                cnt += countSurroundBomb(minesweeper, i - 1, j - 1);
                cnt += countSurroundBomb(minesweeper, i - 1, j);
                cnt += countSurroundBomb(minesweeper, i - 1, j + 1);
                cnt += countSurroundBomb(minesweeper, i, j - 1);
                cnt += countSurroundBomb(minesweeper, i, j + 1);
                cnt += countSurroundBomb(minesweeper, i + 1, j - 1);
                cnt += countSurroundBomb(minesweeper, i + 1, j);
                cnt += countSurroundBomb(minesweeper, i + 1, j + 1);
                minesweeper[i][j] = cnt;
            }
        }
    }
    console.log(minesweeper);
    return minesweeper;
}

function countSurroundBomb(minesweeper, i, j) {
    if (i >= 0 && i < minesweeper.length && j >= 0 && j < minesweeper[0].length) {
        if (minesweeper[i][j] === -1) {
            return 1;
        } else {
            return 0;
        }
    } else {
        return 0;
    }
}

// 数字x -> :number_x:
function createEmojisweeper(minesweeper, emoji) {
    if (minesweeper === undefined) {
        return [["エラー"]];
    }

    let emojisweeper = Array(minesweeper.length);
    for (let i = 0; i < minesweeper.length; i++) {
        emojisweeper[i] = Array(minesweeper[i].length);
    }

    for (let i = 0; i < minesweeper.length; i++) {
        for (let j = 0; j < minesweeper[i].length; j++) {
            if (minesweeper[i][j] === -1) {
                emojisweeper[i][j] = "||:" + emoji + ":||";
                total += 6 + emoji.length;
            } else if (minesweeper[i][j] === 0) {
                emojisweeper[i][j] = "||:zero:||";//"||:black_large_square:||";
                total += 9;
            } else {
                emojisweeper[i][j] = "||:" + NUM[minesweeper[i][j]][0] + ":||";
                total += 6 + NUM[minesweeper[i][j]][1];
            }
        }
    }
    console.log(emojisweeper);
    return emojisweeper;
}

function clipboardCopy() {
    const text = document.getElementById("outText");
    /*
    text.select();
    document.execCommand("Copy");
    */
    console.log(text.value);
    navigator.clipboard.writeText(text.value);
    alert("はい\nコピーした");
}