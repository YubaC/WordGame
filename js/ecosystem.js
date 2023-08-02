class Eco {
    constructor(config) {
        this.map = config.map;
        this.ticker = config.ticker;

        this.taskPriority = 700;

        this.lastWaterSpreadTick = 0; // 上一次水蔓延距现在的tick数
        this.waterSpreadInterval = 5; // 水蔓延的间隔
        this.lastGrassSpreadTick = 0; // 上一次草蔓延距现在的tick数
        this.grassSpreadInterval = 25; // 草蔓延的间隔
        this.grassSpreadProbability = 0.1; // 草蔓延的概率

        this.setup = this.setup.bind(this);
        this.update = this.update.bind(this);
        this.spreadWater = this.spreadWater.bind(this);
        this.spreadGrass = this.spreadGrass.bind(this);
    }

    setup() {
        this.ticker.taskList.push(this);
    }

    update() {
        let mapNeedUpdate = false;
        if (this.lastWaterSpreadTick >= this.waterSpreadInterval) {
            this.lastWaterSpreadTick = 0;
            mapNeedUpdate = this.spreadWater();
        } else {
            this.lastWaterSpreadTick++;
        }

        if (this.lastGrassSpreadTick >= this.grassSpreadInterval) {
            this.lastGrassSpreadTick = 0;
            mapNeedUpdate = this.spreadGrass();
        } else {
            this.lastGrassSpreadTick++;
        }

        return mapNeedUpdate;
    }

    spreadWater() {
        let mapNeedToBeUpdated = false;

        // 将所有水的new属性设为false
        this.map.blocks.forEach((row) => {
            row.forEach((block) => {
                if (block.name === "水") {
                    block.new = false;
                }
            });
        });

        // 遍历地图，寻找水
        this.map.blocks.forEach((row, x) => {
            row.forEach((block, y) => {
                if (block.name === "水" && !block.new) {
                    // 如果该点是水，向四周蔓延
                    [-1, 0, 1].forEach((i) => {
                        [-1, 0, 1].forEach((j) => {
                            if (j !== 0 || i !== 0) {
                                const newX = x + i;
                                const newY = y + j;
                                // 检查该点是否在地图内
                                if (
                                    this.map.isInMap(newX, newY) &&
                                    this.map.blocks[newX][newY].name === "土"
                                ) {
                                    this.map.blocks[newX][newY].name = "水";
                                    this.map.blocks[newX][newY].new = true;
                                    mapNeedToBeUpdated = true;
                                }
                            }
                        });
                    });
                }
            });
        });

        return mapNeedToBeUpdated;
    }

    spreadGrass() {
        let mapNeedToBeUpdated = false;

        // 将所有草的new属性设为false
        this.map.blocks.forEach((row) => {
            row.forEach((block) => {
                if (block.name === "草") {
                    block.new = false;
                }
            });
        });

        // 遍历地图，寻找草
        this.map.blocks.forEach((row, x) => {
            row.forEach((block, y) => {
                if (block.name === "草" && !block.new) {
                    // 如果该点是草，向四周蔓延
                    [-1, 0, 1].forEach((i) => {
                        [-1, 0, 1].forEach((j) => {
                            if (j !== 0 || i !== 0) {
                                const newX = x + i;
                                const newY = y + j;
                                // 检查该点是否在地图内
                                if (
                                    this.map.isInMap(newX, newY) &&
                                    this.map.blocks[newX][newY].name === "土" &&
                                    Math.random() < this.grassSpreadProbability
                                ) {
                                    this.map.blocks[newX][newY].name = "草";
                                    this.map.blocks[newX][newY].new = true;
                                    mapNeedToBeUpdated = true;
                                }
                            }
                        });
                    });
                } else if (block.new) {
                    block.new = false;
                }
            });
        });

        return mapNeedToBeUpdated;
    }
}

export { Eco };
