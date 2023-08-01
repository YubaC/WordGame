class MapDrawer {
    constructor(config) {
        this.$map = config.map instanceof jQuery ? config.map : $(config.map);
        this.colorDict = config.colorDict;

        this.setStyle();

        this.drawMap = this.drawMap.bind(this);
    }

    /**用于判断一个字符是否是Emoji，如果是，则返回true，否则返回false
     * 可能会有遗漏或误判，但是不影响使用
     * @returns {boolean} 是否是 Emoji
     * @memberof MapDrawer
     */
    isEmoji(content) {
        // 1. 本身就是 Emoji 字符，如“😀”
        if (content.length == 1) {
            const charCode = content.charCodeAt(0);
            return charCode >= 0x1f000 && charCode <= 0x1ffff;
        }
        // 2. 由两个或多个字符组成，如“🌲”由“🌳”和“🌴”组成，“👨‍👩‍👧‍👦”由“👨”、“👩”、“👧”和“👦”组成
        if (content.length > 1) {
            // 使用正则表达式匹配是否由多个 Unicode 字符组成
            const regex = /[\u{1F000}-\u{1FFFF}]/u;
            return regex.test(content);
        }
        // 3. 是 HTML 实体，如“&#128163;”
        if (content.startsWith("&#")) {
            // 将 HTML 实体转换为 Unicode 字符
            const charCode = parseInt(content.substring(2, content.length - 1));
            return charCode >= 0x1f000 && charCode <= 0x1ffff;
        }
        return false;
    }

    /**
     * 获取 Emoji 字体大小
     * 在一些浏览器中，Emoji 的字体大小与普通字符不同，因此需要调整
     * @returns {number} Emoji 字体大小
     * @memberof MapDrawer
     */
    getEmojiFontSize() {
        const emojiText = "😀";
        const text = "草";
        // 添加至body中
        const span = document.createElement("span");
        span.style.visibility = "hidden";
        span.innerText = emojiText;
        document.body.appendChild(span);
        // 分别获取两个元素的宽度和高度
        const emojiWidth = span.offsetWidth;
        const emojiHeight = span.offsetHeight;
        span.innerText = text;
        const textWidth = span.offsetWidth;
        const textLineHeight = span.offsetHeight;
        // 移除span
        document.body.removeChild(span);
        // 计算字体大小(em)
        const emojiSize = textWidth / emojiWidth;
        const emojiLineHeight = textLineHeight / emojiHeight;
        return Math.min(emojiSize, emojiLineHeight);
    }

    setStyle() {
        const $style = $("<style></style>");
        // Get emoji font size
        const emojiSize = this.getEmojiFontSize();
        // Add emoji font size
        $style.append(`.emoji { font-size: ${emojiSize}em; }`);
        for (const key in this.colorDict) {
            if (this.colorDict.hasOwnProperty(key)) {
                const color = this.colorDict[key];
                $style.append(`.color-${color} { color: ${color}; }`);
            }
        }
        // Add style to head
        $("head").append($style);
    }

    /**
     * 绘制地图
     * @param {Array} blocks 地图块的数组
     * @param {Dict} entities 实体的字典
     * @returns {void}
     * @memberof MapDrawer
     * @todo 优化绘制地图的性能
     */
    drawMap(map) {
        // console.error("Draw map"); //用于查找触发绘制地图的函数
        // 叠加entities至blocks
        // 1. 深拷贝blocks
        let outputMap = JSON.parse(JSON.stringify(map.blocks));
        outputMap = outputMap.map((line) => line.map((block) => block.name));
        // TODO: 为大地图截取部分地图
        // 2. 在人和怪物的位置上标记图标
        for (const entity of map.entities) {
            const { x, y, name } = entity;
            outputMap[x][y] = name ? name : outputMap[x][y];
        }
        // 3. 生成地图 HTML
        let mapHtml = "";
        for (let y = 0; y < outputMap.length; y++) {
            let line = "";
            for (let x = 0; x < outputMap[y].length; x++) {
                let content = outputMap[y][x];
                // 如果是 Emoji，则调整字体大小
                if (this.isEmoji(content)) {
                    line += `<span class="emoji">${content}</span>`;
                } else {
                    line += `<span class="color-${this.colorDict[content]}">${content}</span>`;
                }
            }
            mapHtml += `<p>${line}</p>`;
        }
        // 4. 将地图 HTML 添加至页面
        this.$map.html(mapHtml);
    }
}
