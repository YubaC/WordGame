// 移动
function left() {
    if (y > 0 && contains(passable, map[x][y - 1])) { //如果不会出地图并且前面的方块可以踩上去
        if (map[x][y - 1] == "怪") {
            gameover(0);
        } else {
            block_old = block; //block_old更新为当前所在的方块（block：当前所在的方块 block_old：上一个走过的方块）
            block = map[x][y - 1]; //block更新为即将走到的方块
            x_old = x;
            y_old = y;
            y -= 1;
            drawmap();
        }
    }
}

function right() {
    if (y < map[x].length - 1 && contains(passable, map[x][y + 1])) {
        if (map[x][y + 1] == "怪") {
            gameover(0);
        } else {
            block_old = block;
            block = map[x][y + 1];
            x_old = x;
            y_old = y;
            y += 1;
            drawmap();
        }
    }
}

function up() {
    if (x > 0 && contains(passable, map[x - 1][y])) {
        if (map[x - 1][y] == "怪") {
            gameover(0);
        } else {
            block_old = block;
            block = map[x - 1][y];
            x_old = x;
            y_old = y;
            x -= 1;
            drawmap();
        }
    }
}

function down() {
    if (x < map.length - 1 && contains(passable, map[x + 1][y])) {
        if (map[x + 1][y] == "怪") {
            gameover(0);
        } else {
            block_old = block;
            block = map[x + 1][y];
            x_old = x;
            y_old = y;
            x += 1;
            drawmap();
        }
    }
}