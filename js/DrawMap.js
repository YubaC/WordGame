function drawmap_base() {
    map[x][y] = '人';
    if (!peace.checked && !booming) {
        map[mob_x][mob_y] = "怪";
    }
    if (boom_x != -1 && boom_y != -1) { //有人放了炸弹
        map[boom_x][boom_y] = "&#128163";
    }
    //画地图
    document.getElementById("map").innerHTML = "";
    for (i = 0; i < map.length; i++) {
        var line = "";
        for (j = 0; j < map[i].length; j++) {
            if (map[i][j] == "水_new") { //新生成的水变成普通的水，"水_new"是为了防止水蔓延的时候一次刷新多格（新手保护？）
                line += "水";
                map[i][j] = "水";
            } else if (map[i][j] == "草_new") { //新生成的草变成普通的草，"草_new"是为了防止草蔓延的时候一次刷新多格（新手保护？）
                line += "草";
                map[i][j] = "草";
            } else if ((peace.checked || booming) && map[i][j] == "怪") {
                line += "土";
                map[i][j] = "土";
            } else {
                line += map[i][j];
            }
        }
        document.getElementById("map").innerHTML += line + "<br>";

    }

    //地图着色
    for (i = 0; i < word.length; i++) {
        var oBox = document.getElementById("map");
        var oContent = oBox.innerHTML;
        var val = word[i];
        var findText = oContent.split(val);
        oBox.innerHTML = findText.join('<span style="color:' + color[i] + ';">' + val + '</span>');
    }
}

function drawmap() { //画地图
    if (map[x_old][y_old] != "炸" && map[x_old][y_old] != "土") { //如果没被爆炸波及
        map[x_old][y_old] = block_old; //上一步所在的方块
    }
    drawmap_base();
}