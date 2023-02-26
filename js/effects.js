// 放炸弹
function boom() {
    if (boom_x == -1 && boom_y == -1) {
        // 如果没有炸弹（炸弹只能存在一个）
        boom_x = x;
        boom_y = y;
        boom_x_old = x;
        boom_y_old = y;
        document.getElementById("boom").disabled = true;
        boom_exist = true;
        setTimeout("explode()", 3000); // 延时3秒爆炸
    }
    drawmap();
}

// 爆炸特效（周围一圈“炸”）
function explode() {
    for (q = -1 - boom_power; q < 2 + boom_power; q++) {
        for (w = -1 - boom_power; w < 2 + boom_power; w++) {
            // 检查该点是否在地图内
            if (
                boom_x + q > -1 &&
                boom_y + w > -1 &&
                boom_x + q < map.length &&
                boom_y + w < map[boom_x].length
            ) {
                // 如果该点不是当前位置
                if (boom_x + q == x && boom_y + w == y) {
                    var over = true;
                }
                // 如果该点是怪兽位置
                else if (
                    boom_x + q == mob_x &&
                    boom_y + w == mob_y &&
                    !peace.checked
                ) {
                    booming = true;
                    score += 1;
                    document.getElementById("score").innerHTML =
                        "得分：" + score;
                    setTimeout("mobrestart()", 3000);
                }
                // 把该点变为“炸”
                map[boom_x + q][boom_y + w] = "炸";
            }
        }
    }
    // 清除炸弹
    boom_x = -1;
    boom_y = -1;
    if (over) {
        gameover(1);
    }
    drawmap();
    setTimeout("replace()", 1000); // 过一秒后清除特效，替换为“土”
}

// 清除特效，替换为“土”
function replace() {
    for (e = -1 - boom_power; e < 2 + boom_power; e++) {
        for (r = -1 - boom_power; r < 2 + boom_power; r++) {
            // 检查该点是否在地图内
            if (
                boom_x_old + e > -1 &&
                boom_y_old + r > -1 &&
                boom_x_old + e < map.length &&
                boom_y_old + r < map[boom_x_old].length
            ) {
                // 把该点变为“土”
                map[boom_x_old + e][boom_y_old + r] = "土";
            }
        }
    }
    drawmap();
    boom_exist = false;
    document.getElementById("boom").disabled = false;
}

// 河水蔓延
function findWater() {
    setTimeout(findWater, 1000); // 每隔一秒重复执行函数
    if (!waterrun.checked) return; // 如果河水蔓延未开启，则退出函数

    // 遍历全图，寻找“土”
    for (let o = 0; o < map.length; o++) {
        for (let u = 0; u < map[o].length; u++) {
            if (map[o][u] !== "土") continue; // 如果当前格子不是“土”，则继续遍历下一个格子

            // 找到“土”，在土周围3x3区域寻找“水”
            for (let q = -1; q < 2; q++) {
                for (let w = -1; w < 2; w++) {
                    const row = o + q;
                    const col = u + w;
                    if (
                        row < 0 ||
                        col < 0 ||
                        row >= map.length ||
                        col >= map[o].length
                    )
                        continue; // 如果当前格子在地图外，则继续遍历下一个格子
                    if (map[row][col] === "水") {
                        // 如果周围有水
                        map[o][u] = "水_new"; // 将“土”替换为“水_new”
                    }
                }
            }
        }
    }

    drawmap();
}

// 草地蔓延
function findGrass() {
    setTimeout(findGrass, 5000); // 每隔五秒重复执行函数
    if (!grassrun.checked) return; // 如果草地蔓延未开启，则退出函数

    // 遍历全图，寻找“土”
    for (let o = 0; o < map.length; o++) {
        for (let u = 0; u < map[o].length; u++) {
            if (map[o][u] !== "土") continue; // 如果当前格子不是“土”，则继续遍历下一个格子

            // 找到“土”，在土周围3x3区域寻找“草”
            for (let q = -1; q < 2; q++) {
                for (let w = -1; w < 2; w++) {
                    const row = o + q;
                    const col = u + w;
                    if (
                        row < 0 ||
                        col < 0 ||
                        row >= map.length ||
                        col >= map[o].length
                    )
                        continue; // 如果当前格子在地图外，则继续遍历下一个格子
                    if (
                        map[row][col] === "草" &&
                        Math.floor(Math.random() * 10) === 9
                    ) {
                        // 如果周围有草地，并且随机数等于9
                        map[o][u] = "草_new"; // 将“土”替换为“草_new”
                    }
                }
            }
        }
    }

    drawmap();
}
