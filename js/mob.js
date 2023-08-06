import { Entity } from "./entity.js";

class Mob extends Entity {
    constructor(config) {
        super(config);
        this.damage = config.damage || 3; // 攻击力
        this.damagePriority = config.damagePriority || 500; // 攻击优先级，参见docs/attack.md
        this.damageList = config.damageList || ["player"]; // 可以伤害的实体类型
        this.health = config.health || 2; // 生命值

        this.name = "怪";
        this.type = "mob";
        this.taskPriority = 800; // 决定在每tick中的更新顺序，数字越大越先更新

        // 移动相关
        this.probability = config.probability || 0.1; // 想要移动的概率
        this.maxStep = config.maxStep || 5; // 一次最多移动的步数
        this.speed = config.speed || 1; // 移动速度，每刻移动的步数
        this.direction = 0; // 移动方向，0-上，1-右，2-下，3-左

        this.update = this.update.bind(this);
        this.canHurt = this.canHurt.bind(this);
        this.hurt = this.hurt.bind(this);
    }

    update() {
        // 1. 判断是否可以移动
        // 2. 判断是否想要移动
        // 3. 移动
        // 4. 更新地图

        // 如果还有剩余步数，则继续移动
        if (this.stepsStillneedToMove > 0) {
            return this.move();
        }

        // 1. 判断是否可以移动
        // 遍历四周的地块，如果有一个是可通行的，则可以移动
        const { x, y } = this;
        const canMove =
            this.game.map.isPassable(x - 1, y) ||
            this.game.map.isPassable(x, y + 1) ||
            this.game.map.isPassable(x + 1, y) ||
            this.game.map.isPassable(x, y - 1);

        // 2. 判断是否想要移动
        // 如果不想移动，则返回false
        if (!canMove) {
            return false;
        } else {
            // 如果想移动，则以probability的概率移动
            if (Math.random() > this.probability) {
                return false;
            }
        }

        // console.log("Mob move");

        // 3. 移动
        // 随机生成移动的步数
        this.stepsStillneedToMove = Math.floor(Math.random() * this.maxStep);
        // 随机生成移动的方向
        this.direction = Math.floor(Math.random() * 4);
        return this.move();
    }

    canHurt(entity) {
        // 判断实体类型，从this.damageList中获取可以伤害该实体的实体类型
        if (
            !this.damageList.includes(entity.type) &&
            !this.damageList.includes("all")
        ) {
            return false;
        }

        // 判断距离是否小于等于1
        const distance =
            Math.abs(this.x - entity.x) + Math.abs(this.y - entity.y);
        if (distance > 1) {
            return false;
        }
        return true;
    }

    // 判断是否能伤害某个实体
    hurt(entity) {
        if (!this.canHurt(entity)) {
            return false;
        }
        return this.damage;
    }
}

// 生成怪物的函数
class SummonMob {
    constructor(config) {
        this.game = config.game;
        this.maxMob = config.maxMob || 3; // 最大怪物数量
        this.summonSpeed = config.summonSpeed || 100; // 最大召唤速度，多少刻召唤一次
        this.summonProbability = config.summonProbability || 0.01; // 召唤的概率
        this.lastSummoned = 0; // 上一次召唤的距离现在的刻数

        this.taskPriority = 600;

        this.setup = this.setup.bind(this);
        this.update = this.update.bind(this);
    }

    setup() {
        // 向ticker中添加自身
        this.game.ticker.taskList.push(this);
    }

    /**
     * 更新状态的函数
     * @memberof SummonMob
     * @returns {boolean} 是否需要更新地图
     */
    update() {
        // 遍历entities，如果怪物数量小于最大怪物数量，则以summonSpeed的概率召唤怪物
        const entities = this.game.activeEntities;
        const mobs = entities.filter((entity) => entity.type === "mob");
        if (
            mobs.length < this.maxMob &&
            this.lastSummoned >= this.summonSpeed &&
            Math.random() < this.summonProbability
        ) {
            let mobX, mobY;
            do {
                // 获取一个距离玩家不超过10的随机位置
                const { x, y } =
                    this.game.players[
                        Math.floor(Math.random() * this.game.players.length)
                    ];
                const randomX = Math.floor(Math.random() * 10) - 5;
                const randomY = Math.floor(Math.random() * 10) - 5;
                mobX = x + randomX;
                mobY = y + randomY;
            } while (!this.game.map.isPassable(mobX, mobY));

            // 生成怪物
            const mob = new Mob({
                x: mobX,
                y: mobY,
                game: this.game,
            });
            mob.setup();
            this.lastSummoned = 0;
            return true;
        } else {
            this.lastSummoned++;
            return false;
        }
    }
}

export { Mob, SummonMob };
