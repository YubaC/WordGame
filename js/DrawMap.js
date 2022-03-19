function drawmap_base() {
    map_print = JSON.parse(JSON.stringify(map));

    map_print[x][y] = '人';
    if (!peace.checked && !booming) {
        map_print[mob_x][mob_y] = "怪";
    }
    if (boom_x != -1 && boom_y != -1) { //有人放了炸弹
        map_print[boom_x][boom_y] = "&#128163";
    }
    //画地图
    document.getElementById("map").innerHTML = "";
    for (i = 0; i < map.length; i++) {
        var line = "";
        for (j = 0; j < map[i].length; j++) {
            if (clickplace[0] == i && clickplace[1] == j && moving && mousemove.checked) {
                t = j + '" style="background-color:yellow; text-decoration:none';
            } else {
                t = j + '" style="text-decoration:none';
            }
            if (map_print[i][j] == "水_new") { //新生成的水变成普通的水，"水_new"是为了防止水蔓延的时候一次刷新多格（新手保护？）
                // line += "水";
                if (mousemove.checked) {
                    line += '<a name="' + i + ',' + t + '" href="javascript:void(0);" onclick="returnplace(this.name)">' + '水' + '</a>';
                } else {
                    line += "水";
                }
                map_print[i][j] = "水";
                map[i][j] = "水";
            } else if (map_print[i][j] == "草_new") { //新生成的草变成普通的草，"草_new"是为了防止草蔓延的时候一次刷新多格（新手保护？）
                // line += "草";
                if (mousemove.checked) {
                    line += '<a name="' + i + ',' + t + '" href="javascript:void(0);" onclick="returnplace(this.name)">' + '草' + '</a>';
                } else {
                    line += "草";
                }
                map_print[i][j] = "草";
                map[i][j] = "草";
            } else if ((peace.checked || booming) && map_print[i][j] == "怪") {
                // line += "土";
                if (mousemove.checked) {
                    line += '<a name="' + i + ',' + t + '" href="javascript:void(0);" onclick="returnplace(this.name)">' + '土' + '</a>';
                } else {
                    line += "土";
                }
                map_print[i][j] = "土";
            } else {
                // line += map_print[i][j];
                if (mousemove.checked) {
                    line += '<a name="' + i + ',' + t + '" href="javascript:void(0);" onclick="returnplace(this.name)">' + map_print[i][j] + '</a>';
                } else {
                    line += map_print[i][j];
                }
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
    // if (map[x_old][y_old] != "炸" && map[x_old][y_old] != "土") { //如果没被爆炸波及
    //     map[x_old][y_old] = block_old; //上一步所在的方块
    // }
    drawmap_base();
}