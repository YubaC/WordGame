class MapDrawer {
    constructor(config) {
        this.$mapElement =
            config.mapElement instanceof jQuery
                ? config.mapElement
                : $(config.mapElement);
        this.game = config.game;
        this.outputXLength = config.outputXLength || 40;
        this.outputYLength = config.outputYLength || 50;
        this.colorDict = config.colorDict;
        this.emojis = ["☘️", "🍀"]; // 识别不出来的emoji

        this.setStyle();

        this.isEmoji = this.isEmoji.bind(this);
        this.drawMap = this.drawMap.bind(this);
    }

    /**用于判断一个字符是否是Emoji，如果是，则返回true，否则返回false
     * 可能会有遗漏或误判，但是不影响使用
     * @returns {boolean} 是否是 Emoji
     * @memberof MapDrawer
     */
    isEmoji(content) {
        // 1. 在 emojis 中
        if (this.emojis.includes(content)) {
            return true;
        }
        // 2. 本身就是 Emoji 字符，如“😀”
        if (content.length == 1) {
            const charCode = content.charCodeAt(0);
            return charCode >= 0x1f000 && charCode <= 0x1ffff;
        }
        // 3. 由两个或多个字符组成，如“🌲”由“🌳”和“🌴”组成，“👨‍👩‍👧‍👦”由“👨”、“👩”、“👧”和“👦”组成
        if (content.length > 1) {
            // 使用正则表达式匹配是否由多个 Unicode 字符组成
            const regex = /[\u{1F000}-\u{1FFFF}]/u;
            return regex.test(content);
        }
        // 4. 是 HTML 实体，如“&#128163;”
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
    getFontSize() {
        const text = "草";
        // 添加至body中
        const span = document.createElement("span");
        span.style.visibility = "hidden";
        span.innerText = text;
        this.$mapElement.append(span);

        const rect = span.getBoundingClientRect();
        const textWidth = rect.width;
        const textLineHeight = rect.height;
        // 移除span
        this.$mapElement.remove(span);
        // 计算字体大小(em)
        return { width: textWidth, height: textLineHeight };
    }

    setStyle() {
        const $style = $("<style></style>");
        // Get emoji font size
        const emojiSize = this.getFontSize();
        // Add emoji font size
        // $style.append(`.emoji-${emoji} { font-size: ${emojiSize}em; }`);
        $style.append(
            `.emoji { display:inline-block; width: ${emojiSize.width}px; }`
        );

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
    drawMap(centerX, centerY) {
        // console.error("drawMap");
        // 裁取地图
        // 1. 获取地图的大小
        const xLength = this.outputXLength;
        const yLength = this.outputYLength;
        // 2. 计算裁取的范围
        const x1 = centerX - Math.floor(xLength / 2);
        const x2 = centerX + Math.floor(xLength / 2);
        const y1 = centerY - Math.floor(yLength / 2);
        const y2 = centerY + Math.floor(yLength / 2);
        // 3. 裁取地图
        let outputMap = this.game.map.getClipedMapData(
            {
                x: x1,
                y: y1,
            },
            {
                x: x2,
                y: y2,
            }
        );

        // let outputMap = JSON.parse(JSON.stringify(map.blocks));
        outputMap = outputMap.map((line) => line.map((block) => block.name));
        // 2. 在人和怪物的位置上标记图标
        for (const entity of this.game.ticker.taskList) {
            // 如果实体没有名字，则跳过
            if (!entity.name) {
                continue;
            }
            // 如果实体不在裁取的范围内，则跳过
            if (
                entity.x < x1 ||
                entity.x > x2 ||
                entity.y < y1 ||
                entity.y > y2
            ) {
                continue;
            }
            const { x, y, name } = entity;
            outputMap[x - x1][y - y1] = name ? name : outputMap[x - x1][y - y1];
        }
        outputMap[this.game.centerX - x1][this.game.centerY - y1] = "人";
        // for (const entity of map.entities) {
        //     const { x, y, name } = entity;
        //     outputMap[x][y] = name ? name : outputMap[x][y];
        // }
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
                    // line += `<span class="color-${this.colorDict[content]} x-${
                    //     y + x1
                    // } y-${x + y1}"">${content}</span>`;
                    line += `<span class="color-${this.colorDict[content]}">${content}</span>`;
                }
            }
            mapHtml += `<p>${line}</p>`;
        }
        // 4. 将地图 HTML 添加至页面
        this.$mapElement.html(mapHtml);
    }
}

export { MapDrawer };
