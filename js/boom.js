// class Boom {
//     constructor(config) {
//         this.range = config.range || 2; // Needs to config
//         this.x = config.x; // Needs to config
//         this.y = config.y; // Needs to config
//         this.map = config.map; // Needs to config

//         this.name = "💣";
//         this.type = "boom";
//         this.damage = config.damage || 10; // 爆炸伤害
//         this.damageReduction = config.damageReduction || 0.6; // 爆炸伤害衰减
//         this.damagePriority = config.damagePriority || 1000; // 攻击优先级，参见docs/attack.md
//         this.damageList = config.damageList || ["all"]; // 可以伤害的实体类型
//         this.taskPriority = 1000; // 决定在每tick中的更新顺序，数字越大越先更新
//         this.boomed = false;
//         this.boomedInThisTick = false; // 在本tick中是否已经爆炸
//         this.boomedByOther = false; // 在被别的炸弹引爆后用于统一清除时间
//         this.finished = false;
//         this.ticksBrforeBoom = config.ticksBrforeBoom || 15;
//         this.ticksBrforeClear = config.ticksBrforeClear || 5;
//         this.skipUpdate = 0; // 用于跳过更新的tick数
//     }

//     /**
//      * 初始化的函数
//      */
//     setup() {
//         // 向entities中添加自身
//         this.map.entities.push(this);
//     }

//     /**
//      * 负责在新的tick中更新状态的函数
//      * @memberof Boom
//      * @returns {boolean} 是否需要更新地图
//      */
//     update() {
//         // 跳过更新
//         if (this.skipUpdate > 0) {
//             this.skipUpdate--;
//             return false;
//         }

//         if (this.boomedInThisTick) {
//             this.boomedInThisTick = false;
//         }

//         if (this.boomed) {
//             if (this.ticksBrforeClear <= 0) {
//                 this.clearBoom();
//                 return true;
//             }
//             this.ticksBrforeClear--;
//         } else {
//             if (this.ticksBrforeBoom <= 0) {
//                 this.boom();
//                 return true;
//             }
//             this.ticksBrforeBoom--;
//         }
//     }

//     /**
//      * 炸弹爆炸
//      * @memberof Boom
//      * @returns {void}
//      * @description 炸弹爆炸后，会在爆炸范围内的所有地块上生成“炸”，然后变成“土”
//      */
//     boom() {
//         this.boomed = true;
//         this.boomedInThisTick = true;
//         this.name = "";
//         this.ticksBrforeBoom = 0;
//         const { blocks, entities } = this.map;
//         const { range, x, y } = this;

//         for (let i = x - range; i <= x + range; i++) {
//             for (let j = y - range; j <= y + range; j++) {
//                 if (this.map.isInMap(i, j)) {
//                     blocks[i][j].name = "炸";
//                     entities.forEach((entity) => {
//                         // 引爆别的炸弹
//                         if (entity.x === i && entity.y === j) {
//                             if (entity.type === "boom" && !entity.boomed) {
//                                 entity.boom();
//                                 entity.skipUpdate += 1;
//                             }
//                         }
//                     });
//                 }
//             }
//         }
//     }

//     canHurt(entity) {
//         // 检查实体是否能被伤害
//         if (!this.boomedInThisTick) {
//             return false;
//         }
//         if (
//             !this.damageList.includes(entity.type) &&
//             !this.damageList.includes("all")
//         ) {
//             return false;
//         }
//         // 计算实体和炸弹是否行和列之间的距离小于等于炸弹的爆炸范围
//         const distanceX = Math.abs(entity.x - this.x);
//         const distanceY = Math.abs(entity.y - this.y);
//         const distance = Math.max(distanceX, distanceY);
//         return distance <= this.range;
//     }

//     hurt(entity) {
//         if (!this.canHurt(entity)) {
//             return false;
//         }

//         const distance =
//             Math.abs(this.x - entity.x) + Math.abs(this.y - entity.y);
//         const damage = Math.floor(
//             this.damage * Math.pow(this.damageReduction, distance)
//         );
//         return damage;
//     }

//     clearBoom() {
//         // console.log(`clear x:${this.x}, y:${this.y} boom`);
//         // 遍历爆炸范围内的所有地块
//         for (let x = this.x - this.range; x <= this.x + this.range; x++) {
//             for (let y = this.y - this.range; y <= this.y + this.range; y++) {
//                 // 如果地块在地图范围内，则在地块上生成“土”
//                 if (
//                     this.map.isInMap(x, y) &&
//                     this.map.blocks[x][y].name === "炸"
//                 ) {
//                     this.map.blocks[x][y].name = "土";
//                 }
//             }
//         }

//         this.finished = true;
//         // 从entities中删除自身
//         for (let i = 0; i < this.map.entities.length; i++) {
//             const entity = this.map.entities[i];
//             if (entity === this) {
//                 this.map.entities.splice(i, 1);
//             }
//         }
//     }
// }

import { Entity } from "./entity.js";

class Boom extends Entity {
    constructor(config) {
        super(config);
        this.range = config.range || 2; // Needs to config

        this.name = "💣";
        this.type = "boom";
        this.damage = config.damage || 10; // 爆炸伤害
        this.damageReduction = config.damageReduction || 0.6; // 爆炸伤害衰减
        this.damagePriority = config.damagePriority || 1000; // 攻击优先级，参见docs/attack.md
        this.damageList = config.damageList || ["all"]; // 可以伤害的实体类型
        this.taskPriority = 1000; // 决定在每tick中的更新顺序，数字越大越先更新
        this.boomed = false;
        this.boomedInThisTick = false; // 在本tick中是否已经爆炸
        this.boomedByOther = false; // 在被别的炸弹引爆后用于统一清除时间
        this.finished = false;
        this.ticksBrforeBoom = config.ticksBrforeBoom || 15;
        this.ticksBrforeClear = config.ticksBrforeClear || 5;
        this.skipUpdate = 0; // 用于跳过更新的tick数
    }

    update() {
        // 跳过更新
        if (this.skipUpdate > 0) {
            this.skipUpdate--;
            return false;
        }

        if (this.boomedInThisTick) {
            this.boomedInThisTick = false;
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
     */
    boom() {
        this.boomed = true;
        this.boomedInThisTick = true;
        this.name = "";
        this.ticksBrforeBoom = 0;
        const { range, x, y } = this;

        for (let i = x - range; i <= x + range; i++) {
            for (let j = y - range; j <= y + range; j++) {
                this.game.map.setBlock(i, j, {
                    name: "炸",
                });
                this.game.map.getEntitiesAt(i, j).forEach((entity) => {
                    // 引爆别的炸弹
                    if (entity.type === "boom" && !entity.boomed) {
                        entity.boom();
                        entity.skipUpdate += 1;
                    }
                });
            }
        }
    }

    canHurt(entity) {
        // 检查实体是否能被伤害
        if (!this.boomedInThisTick) {
            return false;
        }
        if (
            !this.damageList.includes(entity.type) &&
            !this.damageList.includes("all")
        ) {
            return false;
        }
        // 计算实体和炸弹是否行和列之间的距离小于等于炸弹的爆炸范围
        const distanceX = Math.abs(entity.x - this.x);
        const distanceY = Math.abs(entity.y - this.y);
        const distance = Math.max(distanceX, distanceY);
        return distance <= this.range;
    }

    hurt(entity) {
        if (!this.canHurt(entity)) {
            return false;
        }

        const distance =
            Math.abs(this.x - entity.x) + Math.abs(this.y - entity.y);
        const damage = Math.floor(
            this.damage * Math.pow(this.damageReduction, distance)
        );
        return damage;
    }

    clearBoom() {
        // console.log(`clear x:${this.x}, y:${this.y} boom`);
        // 遍历爆炸范围内的所有地块
        for (let x = this.x - this.range; x <= this.x + this.range; x++) {
            for (let y = this.y - this.range; y <= this.y + this.range; y++) {
                // 如果地块在地图范围内，则在地块上生成“土”
                if (this.game.map.getBlock(x, y).name === "炸") {
                    this.game.map.setBlock(x, y, { name: "土" });

                    // 添加BUD
                    this.game.bud.queue.push({
                        x,
                        y,
                        delay: 1,
                        name: "土",
                    });
                }
            }
        }

        this.finished = true;
        // 从entities中删除自身已经在父类中实现
    }
}

export { Boom };
