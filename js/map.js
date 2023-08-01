// 存储地图的类
class Map {
    constructor(config) {
        this.blocks = config.blocks;
        this.entities = config.entities;
        this.passable = config.passable;
        this.drawMapFunc = config.drawMapFunc;

        this.isInMap = this.isInMap.bind(this);
        this.isPassable = this.isPassable.bind(this);
        this.drawMap = this.drawMap.bind(this);
        this.destroy = this.destroy.bind(this);
    }

    isInMap(x, y) {
        // 如果坐标超出地图范围，则不在地图内
        if (
            x < 0 ||
            x >= this.blocks.length ||
            y < 0 ||
            y >= this.blocks[0].length
        ) {
            return false;
        }
        return true;
    }

    isPassable(x, y) {
        // 如果坐标超出地图范围，则不可通过
        if (!this.isInMap(x, y)) {
            return false;
        }

        // 如果坐标上的方块不可通过，则不可通过
        if (!this.passable.includes(this.blocks[x][y].name)) {
            return false;
        }

        // 如果坐标上的实体不可通过，则不可通过
        for (const entity of this.entities) {
            if (entity.x === x && entity.y === y && entity.passable === false) {
                return false;
            }
        }

        // 否则可通过
        return true;
    }

    drawMap() {
        this.drawMapFunc(this);
    }

    destroy() {
        this.blocks = undefined;
        this.entities = undefined;
        this.drawMap = undefined;
    }
}
