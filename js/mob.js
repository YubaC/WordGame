class Mob {
    constructor(config) {
        this.x = config.x; // Needs to config
        this.y = config.y; // Needs to config
        this.map = config.map; // Needs to config

        this.damage = config.damage || 3; // 攻击力
        this.damagePriority = config.damagePriority || 500; // 攻击优先级，参见docs/attack.md
        this.damageList = config.damageList || ["player"]; // 可以伤害的实体类型
        this.health = config.health || 2; // 生命值

        this.name = "怪";
        this.type = "mob";
        this.taskPriority = 800; // 决定在每tick中的更新顺序，数字越大越先更新
        this.finished = false;

        // 移动相关
        this.probability = config.probability || 0.1; // 想要移动的概率
        this.maxStep = config.maxStep || 5; // 一次最多移动的步数
        this.speed = config.speed || 1; // 移动速度，每刻移动的步数
        this.direction = 0; // 移动方向，0-上，1-右，2-下，3-左
        this.stepsToMove = 0; // 距离下一次移动还需要的步数

        this.update = this.update.bind(this);
        this.move = this.move.bind(this);
        this.canHurt = this.canHurt.bind(this);
        this.hurt = this.hurt.bind(this);
    }

    /**
     * 初始化的函数
     * @memberof Mob
     * @returns {void}
     */
    setup() {
        // 向entities中添加自身
        this.map.entities.push(this);
    }

    /**
     * 负责在新的tick中更新状态的函数
     * @memberof Mob
     * @returns {boolean} 是否需要更新地图
     */
    update() {
        // 1. 判断是否可以移动
        // 2. 判断是否想要移动
        // 3. 移动
        // 4. 更新地图

        // 如果还有剩余步数，则继续移动
        if (this.stepsToMove > 0) {
            return this.move();
        }

        // 1. 判断是否可以移动
        // 遍历四周的地块，如果有一个是可通行的，则可以移动
        const { x, y } = this;
        const canMove =
            this.map.isPassable(x - 1, y) ||
            this.map.isPassable(x, y + 1) ||
            this.map.isPassable(x + 1, y) ||
            this.map.isPassable(x, y - 1);

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
        this.stepsToMove = Math.floor(Math.random() * this.maxStep);
        // 随机生成移动的方向
        this.direction = Math.floor(Math.random() * 4);
        return this.move();
    }

    /**
     * 移动
     * @memberof Mob
     * @returns {boolean} 是否移动成功
     */
    move() {
        // 移动
        switch (this.direction) {
            case 0: {
                // 上
                this.stepsToMove -= this.speed;
                if (this.map.isPassable(this.x - 1, this.y)) {
                    this.x -= this.speed;
                    return true;
                }
                return false;
            }
            case 1: {
                // 右
                this.stepsToMove -= this.speed;
                if (this.map.isPassable(this.x, this.y + 1)) {
                    this.y += this.speed;
                    return true;
                }
                return false;
            }
            case 2: {
                // 下
                this.stepsToMove -= this.speed;
                if (this.map.isPassable(this.x + 1, this.y)) {
                    this.x += this.speed;
                    return true;
                }
                return false;
            }
            case 3: {
                // 左
                this.stepsToMove -= this.speed;
                if (this.map.isPassable(this.x, this.y - 1)) {
                    this.y -= this.speed;
                    return true;
                }
                return false;
            }
        }
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

    /**
     * 清除自身
     * @memberof Mob
     * @returns {void}
     */
    teardown() {
        // 从entities中删除自身
        const index = this.map.entities.indexOf(this);
        this.map.entities.splice(index, 1);
    }
}

// 生成怪物的函数
class SummonMob {
    constructor(config) {
        this.map = config.map; // Needs to config
        this.ticker = config.ticker; // Needs to config
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
        this.ticker.taskList.push(this);
    }

    /**
     * 更新状态的函数
     * @memberof SummonMob
     * @returns {boolean} 是否需要更新地图
     */
    update() {
        // 遍历entities，如果怪物数量小于最大怪物数量，则以summonSpeed的概率召唤怪物
        const { entities } = this.map;
        const mobs = entities.filter((entity) => entity.type === "mob");
        if (
            mobs.length < this.maxMob &&
            this.lastSummoned >= this.summonSpeed &&
            Math.random() < this.summonProbability
        ) {
            // 获取一个随机的空地块
            const { blocks } = this.map;
            const { length: xLength } = blocks;
            const { length: Ylength } = blocks[0];

            do {
                var x = Math.floor(Math.random() * xLength);
                var y = Math.floor(Math.random() * Ylength);
            } while (!this.map.isPassable(x, y));

            // 生成怪物
            const mob = new Mob({
                x: x,
                y: y,
                map: this.map,
            });
            mob.setup();
            this.ticker.taskList.push(mob);
            this.lastSummoned = 0;
            return true;
        } else {
            this.lastSummoned++;
            return false;
        }
    }
}

export { Mob, SummonMob };
