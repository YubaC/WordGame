// 绘制地图
function drawmap() {
    // 克隆地图数组
    map_print = JSON.parse(JSON.stringify(map));

    // 在人和怪物的位置上标记图标
    map_print[x][y] = "人";
    if (!peace.checked && !booming) {
        map_print[mob_x][mob_y] = "怪";
    }

    // 如果有炸弹，则在炸弹的位置上标记炸弹图标
    if (boom_x != -1 && boom_y != -1) {
        map_print[boom_x][boom_y] = "&#128163";
    }

    // 生成地图 HTML
    let mapHtml = "";
    for (let i = 0; i < map_print.length; i++) {
        let line = "";
        for (let j = 0; j < map_print[i].length; j++) {
            let content = map_print[i][j];
            // 将“水_new”替换为“水”，将“草_new”替换为“草”，并更新地图数组
            if (content == "水_new") {
                content = "水";
                map_print[i][j] = "水";
                map[i][j] = "水";
            } else if (content == "草_new") {
                content = "草";
                map_print[i][j] = "草";
                map[i][j] = "草";
            } else if ((peace.checked || booming) && content == "怪") {
                // 如果游戏处于和平模式或正在爆炸，将怪物替换为土，并更新地图数组
                content = "土";
                map_print[i][j] = "土";
            }
            const coords = `${i},${j}"`;
            const style = `text-decoration:none`;
            // 当前坐标是鼠标选中的坐标，且允许鼠标点击移动，则将当前坐标的背景颜色设置为黄色
            if (
                clickplace[0] == i &&
                clickplace[1] == j &&
                moving &&
                mousemove.checked
            ) {
                line += `<a name="${coords} href="javascript:void(0);" onclick="returnplace(this.name)" style="background-color:yellow;${style}">${content}</a>`;
            } else {
                line += `<a name="${coords} href="javascript:void(0);" onclick="returnplace(this.name)" style="${style}">${content}</a>`;
            }
        }
        mapHtml += line + "<br>";
    }

    // 着色
    for (let i = 0; i < word.length; i++) {
        const val = word[i];
        // 将所有匹配到的字符串替换为彩色的 span 标签
        const findText = mapHtml.split(val);
        mapHtml = findText.join(
            `<span style="color:${color[i]};">${val}</span>`
        );
    }

    // 更新地图 HTML
    document.getElementById("map").innerHTML = mapHtml;
}
