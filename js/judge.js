function gameover(reason) { //0：碰到mob 1：被炸死
    if (!unmatched.checked) {
        if (reason == 0) {
            map[x][y] = '<span style="color: red;">怪</span>';
            point_out = "你 被 怪物 击败了！";
        } else {
            point_out = "你 爆炸了！";
        }


        //画地图
        document.getElementById("map").innerHTML = "";
        for (i = 0; i < map.length; i++) {
            var line = "";
            for (j = 0; j < map[i].length; j++) {
                if (map[i][j] != "水_new") {
                    line += map[i][j];
                } else { //新生成的水变成普通的水，"水_new"是为了防止水蔓延的时候一次刷新多格（新手保护？）
                    line += "水";
                    map[i][j] = "水";
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

        var os = getOs(); //获取浏览器信息
        if (os == 'FF' || os == 'SF') { //FireFox、谷歌浏览器用这个
            alert('游戏结束！\n' + point_out);
        } else { //IE系列用这个
            alert('游戏结束！\r\n' + point_out);
        }
        location.reload();
    }
}