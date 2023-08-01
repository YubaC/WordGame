class Boom {
    constructor(config) {
        this.range = config.range || 2; // Needs to config
        this.x = config.x; // Needs to config
        this.y = config.y; // Needs to config
        this.map = config.map; // Needs to config

        this.name = "💣";
        this.type = "boom";
        this.damage = config.damage || 10; // 爆炸伤害
        this.damageReduction = config.damageReduction || 0.6; // 爆炸伤害衰减
        this.priority = 3;
        this.boomed = false;
        this.boomedInThisTick = false; // 在本tick中是否已经爆炸
        this.boomedByOther = false; // 在被别的炸弹引爆后用于统一清除时间
        this.finished = false;
        this.ticksBrforeBoom = config.ticksBrforeBoom || 15;
        this.ticksBrforeClear = config.ticksBrforeClear || 5;
    }

    /**
     * 初始化的函数
     */
    setup() {
        // 向entities中添加自身
        this.map.entities.push(this);
    }

    /**
     * 负责在新的tick中更新状态的函数
     * @memberof Boom
     * @returns {boolean} 是否需要更新地图
     */
    update() {
        if (this.boomedInThisTick) {
            this.boomedInThisTick = false;
        }

        if (this.boomedByOther) {
            this.boomed = true;
            this.boomedByOther = false;
            return true;
        }

        if (this.boomed) {
            if (this.ticksBrforeClear <= 0) {
                this.clearBoom();
                return true;
            }
            this.ticksBrforeClear--;
        } else {
            if (this.ticksBrforeBoom <= 0) {
                this.boom();
                return true;
            }
            this.ticksBrforeBoom--;
        }
    }

    /**
     * 炸弹爆炸
     * @memberof Boom
     * @returns {void}
     * @description 炸弹爆炸后，会在爆炸范围内的所有地块上生成“炸”，然后变成“土”
     */
    boom() {
        this.boomed = true;
        this.boomedInThisTick = true;
        this.name = "";
        this.ticksBrforeBoom = 0;
        const { blocks, entities } = this.map;
        const { range, x, y } = this;

        for (let i = x - range; i <= x + range; i++) {
            for (let j = y - range; j <= y + range; j++) {
                if (this.map.isInMap(i, j)) {
                    blocks[i][j].name = "炸";
                    entities.forEach((entity) => {
                        // 引爆别的炸弹
                        if (entity.x === i && entity.y === j) {
                            if (entity.type === "boom" && !entity.boomed) {
                                entity.boom();
                                entity.boomedByOther = true;
                            }

                            if (entity.type === "mob") {
                                entity.health -= this.damage;
                                if (entity.health <= 0) {
                                    entity.finished = true;
                                }
                            }
                        }
                    });
                }
            }
        }
    }

    clearBoom() {
        // console.log(`clear x:${this.x}, y:${this.y} boom`);
        // 遍历爆炸范围内的所有地块
        for (let x = this.x - this.range; x <= this.x + this.range; x++) {
            for (let y = this.y - this.range; y <= this.y + this.range; y++) {
                // 如果地块在地图范围内，则在地块上生成“土”
                if (
                    this.map.isInMap(x, y) &&
                    this.map.blocks[x][y].name === "炸"
                ) {
                    this.map.blocks[x][y].name = "土";
                }
            }
        }

        this.finished = true;
        // 从entities中删除自身
        for (let i = 0; i < this.map.entities.length; i++) {
            const entity = this.map.entities[i];
            if (entity === this) {
                this.map.entities.splice(i, 1);
            }
        }
    }
}

export { Boom };
