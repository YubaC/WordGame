// 丰泽加载和卸载区块/实体的类
// 这个类负责在玩家移动的时候动态加载和卸载区块和实体
// !实体自己移动出了加载区块的时候，会自动从taskList中删除自己，不在这里实现
class ChunkLoadManager {
    constructor(config) {
        this.game = config.game;
        this.taskPriority = 500;

        // Loader所在的区块坐标数组
        this.loaderChunks = [];

        this.setup = this.setup.bind(this);
        this.update = this.update.bind(this);
        this.resetChunks = this.resetChunks.bind(this);
    }

    setup() {
        // 向ticker中添加自身
        this.game.ticker.taskList.push(this);
    }

    update() {
        // 遍历所有的loader，计算出他们所在的区块
        const loaderChunks = this.game.chunkLoaders.map((loader) => {
            const chunk = this.game.map.getChunkThatContains(
                loader.x,
                loader.y
            );
            const { chunkX, chunkY } = chunk;
            return { chunkX, chunkY };
        });
        // 如果loader所在的区块发生了变化，则重设所有区块的加载状态
        if (
            JSON.stringify(loaderChunks) !== JSON.stringify(this.loaderChunks)
        ) {
            this.loaderChunks = loaderChunks;
            this.resetChunks();
        }
        // 1. 遍历this.game.chunkLoaders，计算所有需要加载的区块
        // 区块有三种状态：强加载、弱加载、卸载
        // 计算强加载区块，半径为this.game.config.forceLoadRadius
        // 计算弱加载区块，半径为this.game.config.weakLoadRadius
        // 距离任意一个loader距离在forceLoadRadius以内的区块都是强加载区块
        // 距离任意一个loader距离在weakLoadRadius以内且不是强加载区块的区块都是弱加载区块
        // 其他区块都是卸载区块

        // // 遍历this.game.chunkLoaders，检查距离最近的chunkLoader的距离
        // // 如果距离小于等于chunkLoader的加载距离，则卸载自己
        // console.log("检查是否需要卸载实体", this);
        // for (let chunkLoader of this.game.chunkLoaders) {
        //     const distance = Math.sqrt(
        //         Math.pow(this.x - chunkLoader.x, 2) +
        //             Math.pow(this.y - chunkLoader.y, 2)
        //     );
        //     if (distance <= chunkLoader.loadDistance) {
        //         console.log("不卸载实体", this);
        //         return;
        //     }
        // }
        // // 如果没有找到，则卸载自己
        // this.finished = true;
    }

    // 重设所有区块的加载状态
    resetChunks() {
        let forceLoadChunks = [];
        let weakLoadChunks = [];
        for (let loader of this.game.chunkLoaders) {
            // 计算强加载区块
            forceLoadChunks = forceLoadChunks.concat(
                this.game.map.getChunksInRadius(
                    loader.x,
                    loader.y,
                    this.game.config.forceLoadRadius,
                    true
                )
            );
            // 计算弱加载区块
            weakLoadChunks = weakLoadChunks.concat(
                this.game.map.getChunksInRadius(
                    loader.x,
                    loader.y,
                    this.game.config.weakLoadRadius,
                    true
                )
            );
        }
        // 删除没有blocks的空区块
        forceLoadChunks = forceLoadChunks.filter((chunk) => chunk.blocks);
        weakLoadChunks = weakLoadChunks.filter((chunk) => chunk.blocks);
        // 从弱加载区块中排除强加载区块
        for (let chunk of forceLoadChunks) {
            const index = weakLoadChunks.indexOf(chunk);
            if (index !== -1) {
                weakLoadChunks.splice(index, 1);
            }
        }
        // 遍历this.game.map.forceLoad和this.game.map.weakLoad，计算需要变更状态的区块
        let newForceLoadChunks = [];
        let newWeakLoadChunks = [];
        let newUnloadChunks = [];
        for (let chunk of this.game.map.forceLoad) {
            if (
                !forceLoadChunks.includes(chunk) &&
                !weakLoadChunks.includes(chunk)
            ) {
                newUnloadChunks.push(chunk);
                chunk.loadState = undefined;
            }
        }
        for (let chunk of this.game.map.weakLoad) {
            if (
                !weakLoadChunks.includes(chunk) &&
                !forceLoadChunks.includes(chunk)
            ) {
                newUnloadChunks.push(chunk);
                chunk.loadState = undefined;
            }
        }
        for (let chunk of forceLoadChunks) {
            if (!this.game.map.forceLoad.includes(chunk)) {
                newForceLoadChunks.push(chunk);
                chunk.loadState = "force";
            }
        }
        for (let chunk of weakLoadChunks) {
            if (!this.game.map.weakLoad.includes(chunk)) {
                newWeakLoadChunks.push(chunk);
                chunk.loadState = "weak";
            }
        }

        // 更新this.game.map.forceLoad和this.game.map.weakLoad
        this.game.map.forceLoad = forceLoadChunks;
        this.game.map.weakLoad = weakLoadChunks;

        // console.log(
        //     "newForceLoadChunks",
        //     newForceLoadChunks.map((chunk) => chunk.chunkX + "," + chunk.chunkY)
        // );
        // console.log(
        //     "newWeakLoadChunks",
        //     newWeakLoadChunks.map((chunk) => chunk.chunkX + "," + chunk.chunkY)
        // );
        // console.log(
        //     "newUnloadChunks",
        //     newUnloadChunks.map((chunk) => chunk.chunkX + "," + chunk.chunkY)
        // );

        // 更新实体
        for (let chunk of newUnloadChunks) {
            if (!chunk.entities) {
                continue;
            }
            for (let entity of chunk.entities) {
                // 如果是玩家，则不卸载
                if (entity.type === "player") {
                    continue;
                }
                // console.log("将实体改为卸载状态", entity);
                // 从taskList中删除实体
                const index = this.game.ticker.taskList.indexOf(entity);
                if (index !== -1) {
                    this.game.ticker.taskList.splice(index, 1);
                }
                // 从activeEntities中删除实体
                const index2 = this.game.activeEntities.indexOf(entity);
                if (index2 !== -1) {
                    this.game.activeEntities.splice(index2, 1);
                }
            }
        }
        for (let chunk of newForceLoadChunks) {
            if (!chunk.entities) {
                continue;
            }
            for (let entity of chunk.entities) {
                // 如果是玩家，则不加载
                if (entity.type === "player") {
                    continue;
                }
                // console.log("将实体改为强加载状态", entity);
                entity.loadState = "force";
                // 将实体添加到taskList中，如果已经存在，则不添加
                if (!this.game.ticker.taskList.includes(entity)) {
                    this.game.ticker.taskList.push(entity);
                }
                // 将实体添加到activeEntities中，如果已经存在，则不添加
                if (!this.game.activeEntities.includes(entity)) {
                    this.game.activeEntities.push(entity);
                }
            }
        }
        for (let chunk of newWeakLoadChunks) {
            if (!chunk.entities) {
                continue;
            }
            for (let entity of chunk.entities) {
                // 如果是玩家，则不加载
                if (entity.type === "player") {
                    continue;
                }
                // console.log("将实体改为弱加载状态", entity);
                entity.loadState = "weak";
                // 从taskList中删除实体
                const index = this.game.ticker.taskList.indexOf(entity);
                if (index !== -1) {
                    this.game.ticker.taskList.splice(index, 1);
                }
                // 将实体添加到activeEntities中，如果已经存在，则不添加
                if (!this.game.activeEntities.includes(entity)) {
                    this.game.activeEntities.push(entity);
                }
            }
        }
    }
}

export { ChunkLoadManager };
