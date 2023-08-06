class Entity {
    constructor(config) {
        this.x = config.x; // Needs to config
        this.y = config.y; // Needs to config
        this.game = config.game; // Needs to config

        this.damage = config.damage || 0; // 攻击力
        this.damagePriority = config.damagePriority || 0; // 攻击优先级，参见docs/attack.md
        this.damageList = config.damageList || ["player"]; // 可以伤害的实体类型
        // this.health = config.health || 0; // 生命值

        // 无敌时间
        this.invincibleTime = 0;
        this.maxInvincibleTime = config.maxInvincibleTime || 5;

        this.name = ""; // 显示在地图上的名字
        this.type = ""; // 实体的类型
        this.taskPriority = 0; // 决定在每tick中的更新顺序，数字越大越先更新
        this.finished = false; // 是否已经完成，如果完成则会被清除

        // 移动相关
        this.speed = config.speed || 1; // 移动速度，每刻移动的步数
        this.direction = 0; // 移动方向，0-上，1-右，2-下，3-左
        this.stepsStillneedToMove = 0; // 还没走完的步数
        this.lastMoveTick = 0; // 上一次移动的距离现在的tick数，如果speed < 1，则用于处理多个tick移动一步的情况

        this.update = this.update.bind(this);
        this.moveEntityToChunk = this.moveEntityToChunk.bind(this);
        this.move = this.move.bind(this);
    }

    /**
     * 初始化的函数
     * @memberof Entity
     * @returns {void}
     */
    setup() {
        // 向所在的区块中添加自身
        const chunk = this.game.map.getChunkThatContains(this.x, this.y);
        chunk.entities.push(this);
        this.game.ticker.taskList.push(this);
        // 向活跃实体列表中添加自身
        this.game.activeEntities.push(this);
    }

    update() {}

    moveEntityToChunk(oldChunk, newChunk) {
        // 将实体移动到指定的区块
        // 如果实体已经在该区块中，则不移动
        // console.log("移动实体到新的区块", this, newChunk);
        if (oldChunk === newChunk) {
            return;
        }

        // 从旧区块中移除
        oldChunk.entities.splice(oldChunk.entities.indexOf(this), 1);
        // 添加到新区块中
        newChunk.entities.push(this);
        // console.log("实体移动到了新的区块", this, newChunk);

        // 如果实体跑出了强加载区块，则将自己从taskList中移除
        for (let fChunk of this.game.map.forceLoad) {
            // console.log(fChunk === newChunk, fChunk, newChunk);
            if (newChunk === fChunk) {
                return;
            }
        }
        // console.log("实体跑出了强加载区块，将自己从taskList中移除", this);
        this.game.ticker.taskList.splice(
            this.game.ticker.taskList.indexOf(this),
            1
        );
    }

    /**
     * 移动
     * @memberof Entity
     * @returns {boolean} 是否移动成功
     */
    move() {
        // 移动
        // 计算每多少个tick要移动一步
        const stepsPerTick = 1 / this.speed;
        // this.speed的意思是每刻移动的步数，因此如果 stepsPerTick > 1，则需要多个tick才能移动一步
        // 否则，每个tick都移动一步或多步
        // 当前所在的区块位置
        if (stepsPerTick < 1) {
            // 如果上一次移动距离现在的tick数小于stepsPerTick，则不移动
            if (this.lastMoveTick < stepsPerTick) {
                this.lastMoveTick++;
                return false;
            }
            this.lastMoveTick = 0;
        }

        const oldChunk = this.game.map.getChunkThatContains(this.x, this.y);
        // stepsToMove为这一步需要走的长度，当speed >=1 时，stepsToMove = speed，否则stepsToMove = 1
        const stepsToMove = this.speed >= 1 ? this.speed : 1;
        switch (this.direction) {
            case 0: {
                let i = 0;
                while (
                    i < stepsToMove &&
                    this.game.map.isPassable(this.x - 1, this.y)
                ) {
                    this.x -= 1;
                    this.stepsStillneedToMove -= 1;
                    i++;
                }
                // 将自身移动到新的区块中，这个函数会自动判断是否需要移动
                this.moveEntityToChunk(
                    oldChunk,
                    this.game.map.getChunkThatContains(this.x, this.y)
                );
                // 如果一步也没走，则返回false，否则返回true
                return i > 0;
            }
            case 1: {
                // 右
                let i = 0;
                while (
                    i < stepsToMove &&
                    this.game.map.isPassable(this.x, this.y + 1)
                ) {
                    this.y += 1;
                    this.stepsStillneedToMove -= 1;
                    i++;
                }
                // 将自身移动到新的区块中，这个函数会自动判断是否需要移动
                this.moveEntityToChunk(
                    oldChunk,
                    this.game.map.getChunkThatContains(this.x, this.y)
                );
                // 如果一步也没走，则返回false，否则返回true
                return i > 0;
            }
            case 2: {
                // 下
                let i = 0;
                while (
                    i < stepsToMove &&
                    this.game.map.isPassable(this.x + 1, this.y)
                ) {
                    this.x += 1;
                    this.stepsStillneedToMove -= 1;
                    i++;
                }
                // 将自身移动到新的区块中，这个函数会自动判断是否需要移动
                this.moveEntityToChunk(
                    oldChunk,
                    this.game.map.getChunkThatContains(this.x, this.y)
                );
                // 如果一步也没走，则返回false，否则返回true
                return i > 0;
            }
            case 3: {
                // 左
                let i = 0;
                while (
                    i < stepsToMove &&
                    this.game.map.isPassable(this.x, this.y - 1)
                ) {
                    this.y -= 1;
                    this.stepsStillneedToMove -= 1;
                    i++;
                }
                // 将自身移动到新的区块中，这个函数会自动判断是否需要移动
                this.moveEntityToChunk(
                    oldChunk,
                    this.game.map.getChunkThatContains(this.x, this.y)
                );
                // 如果一步也没走，则返回false，否则返回true
                return i > 0;
            }
        }
    }

    teardown() {
        // 从当前所在的区块中移除自身
        const chunk = this.game.map.getChunkThatContains(this.x, this.y);
        chunk.entities.splice(chunk.entities.indexOf(this), 1);
        // 从活跃实体列表中移除自身
        this.game.activeEntities.splice(
            this.game.activeEntities.indexOf(this),
            1
        );
    }
}

class EntityLive {
    constructor(config) {
        this.game = config.game;
        this.taskPriority = 900;

        // 不同类型的实体可以伤害的实体不同
        // 例如，玩家可以伤害怪物，但是敌人不能伤害怪物
        // 这个字典用于记录不同类型的实体可以被造成伤害的实体
        this.damageDict = {
            player: ["mob", "bomb"],
            mob: ["bomb"],
        };

        this.setup = this.setup.bind(this);
        this.update = this.update.bind(this);
        this.checkDamage = this.checkDamage.bind(this);
    }

    setup() {
        this.game.ticker.taskList.push(this);
    }

    update() {
        // 遍历实体列表，计算每个实体受到的伤害
        this.game.activeEntities.forEach((entity) => {
            // 如果实体没有health属性，则不检查伤害
            if (!entity.health) {
                return;
            }

            // 如果entity仍然处于无敌状态（无敌时间>0），则无敌时间减少
            if (entity.invincibleTime && entity.invincibleTime > 0) {
                entity.invincibleTime--;
                return;
            }

            this.checkDamage(entity);
        });
    }

    checkDamage(targetEntity) {
        // 遍历实体列表，获取可以伤害当前实体的实体
        let damageSourceList = this.game.activeEntities
            .map((entity) => {
                if (!entity.hurt) {
                    return { damageCaused: false };
                }
                return {
                    priority: entity.damagePriority,
                    damageCaused: entity.hurt(targetEntity) || false,
                    hurter: entity,
                };
            })
            .filter((source) => source.damageCaused !== false);

        // 清除其中damageCaused为false的实体，并将剩下的实体按照priority排序
        damageSourceList = damageSourceList
            .filter((damageSource) => damageSource.damageCaused)
            .sort((a, b) => b.priority - a.priority);
        // 清除priority低于最大值的实体
        // 如果这时候没有实体了，则不造成伤害
        if (damageSourceList.length === 0) {
            return;
        }

        damageSourceList = damageSourceList.filter(
            (damageSource) =>
                damageSource.priority === damageSourceList[0].priority
        );

        // 依次造成伤害
        targetEntity.hurtedBy = damageSourceList[0].hurter;

        damageSourceList.forEach((damageSource) => {
            targetEntity.health -= damageSource.damageCaused;
            targetEntity.invincibleTime = targetEntity.maxInvincibleTime || 5;
        });

        if (targetEntity.health <= 0) {
            targetEntity.finished = true;
        }
    }
}

export { Entity, EntityLive };
