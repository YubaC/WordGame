// 放炸弹
function boom() {
    if (boom_x == -1 && boom_y == -1) { //如果没有炸弹（炸弹只能存在一个）
        boom_x = x;
        boom_y = y;
        boom_x_old = x;
        boom_y_old = y;
        document.getElementById("boom").disabled = true;
        boom_exist = true;
        setTimeout("explode()", 3000); //延时3秒爆炸
    }
    drawmap_base();
}

// 爆炸特效（周围一圈“炸”）
function explode() {
    for (q = -1 - boom_power; q < 2 + boom_power; q++) {
        for (w = -1 - boom_power; w < 2 + boom_power; w++) {
            if (boom_x + q > -1 && boom_y + w > -1 && boom_x + q < map.length && boom_y + w < map[boom_x].length) {
                if (boom_x + q == x && boom_y + w == y) {
                    var over = true;
                } else if (boom_x + q == mob_x && boom_y + w == mob_y && !peace.checked) {
                    booming = true;
                    score += 1;
                    document.getElementById("score").innerHTML = "Score:" + score;
                    setTimeout("mobrestart()", 3000);
                }
                map[boom_x + q][boom_y + w] = "炸";
            }
        }
    }
    boom_x = -1; //清除炸弹
    boom_y = -1;
    if (over) {
        gameover(1);
    }
    drawmap();
    setTimeout("replace()", 1000); //过一秒后清除特效，替换为“土”
}

// 清除特效，替换为“土”
function replace() {
    for (e = -1 - boom_power; e < 2 + boom_power; e++) {
        for (r = -1 - boom_power; r < 2 + boom_power; r++) {
            if (boom_x_old + e > -1 && boom_y_old + r > -1 && boom_x_old + e < map.length && boom_y_old + r < map[boom_x_old].length) {
                map[boom_x_old + e][boom_y_old + r] = "土";
            }
        }
    }
    drawmap();
    boom_exist = false;
    document.getElementById("boom").disabled = false;
}

// 河水蔓延
function findwarter() {
    if (waterrun.checked) { //如果开启河水蔓延
        for (o = 0; o < map.length; o++) { //遍历全图，寻找“土”
            for (u = 0; u < map[o].length; u++) {
                if (map[o][u] == "土") {
                    for (q = -1; q < 2; q++) { //找到“土”，在土周围3x3区域寻找“水”
                        for (w = -1; w < 2; w++) {
                            if (o + q > -1 && u + w > -1 && o + q < map.length && u + w < map[o].length) {
                                if (map[o + q][u + w] == "水") { //如果周围有水
                                    map[o][u] = "水_new"; //“土”替换为“水_new”（“水_new”是新生成的水源，绘图时会被刷新为普通水源）
                                }
                            }
                        }
                    }
                }
            }
        }
        drawmap_base();

    }
    setTimeout("findwarter()", 1000); //间隔一秒重复执行
}

// 草地蔓延
function findgrass() {
    if (grassrun.checked) { //如果开启草地蔓延
        for (o = 0; o < map.length; o++) { //遍历全图，寻找“土”
            for (u = 0; u < map[o].length; u++) {
                if (map[o][u] == "土") {
                    for (q = -1; q < 2; q++) { //找到“土”，在土周围3x3区域寻找“草”
                        for (w = -1; w < 2; w++) {
                            if (o + q > -1 && u + w > -1 && o + q < map.length && u + w < map[o].length) {
                                if (map[o + q][u + w] == "草") { //如果周围有草地
                                    if (Math.floor(Math.random() * 10) == 9) {
                                        map[o][u] = "草_new"; //“土”替换为“草_new”(一半概率)(“草_new”是新生成的草地，绘图时会被刷新为普通草地)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        drawmap_base();

    }
    setTimeout("findgrass()", 5000); //间隔五秒重复执行
}