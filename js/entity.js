class EntityLive {
    constructor(config) {
        this.map = config.map;
        this.ticker = config.ticker;
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
        this.ticker.taskList.push(this);
    }

    update() {
        // 遍历实体列表，计算每个实体受到的伤害
        this.map.entities.forEach((entity) => {
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
        let damageSourceList = this.map.entities
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

export { EntityLive };
