class Eco {
    constructor(config) {
        this.game = config.game;
        this.bud = config.bud;

        // 最大水流距离
        this.maxWaterFlowDistance = 5;

        this.updateWaterFlow = this.updateWaterFlow.bind(this);
    }

    updateWaterFlow(block) {
        if (block.name !== "土") {
            return false;
        }
        const neighborBlocks = [-1, 0, 1].flatMap((i) =>
            [-1, 0, 1]
                .filter((j) => j !== 0 || i !== 0)
                .map((j) => {
                    const newX = block.x + i;
                    const newY = block.y + j;
                    return this.game.map.getBlock(newX, newY);
                })
        );

        const waterBlocks = neighborBlocks.filter(
            (block) => block.name === "水"
        );

        let returnFunc = false;
        if (waterBlocks.length >= 1) {
            returnFunc = function (game, block) {
                game.map.setBlock(block.x, block.y, { name: "水" });
            };
        }
        if (returnFunc) {
            // 把四方的方块添加到BUD队列
            [-1, 0, 1].flatMap((i) =>
                [-1, 0, 1]
                    .filter((j) => j !== 0 || i !== 0)
                    .map((j) => {
                        const newX = block.x + i;
                        const newY = block.y + j;
                        const isBlockInQueue = this.bud.queue.some(
                            (blockInQueue) =>
                                blockInQueue.x === newX &&
                                blockInQueue.y === newY
                        );
                        if (isBlockInQueue) {
                            return;
                        }

                        const blockName = this.game.map.getBlock(
                            newX,
                            newY
                        ).name;
                        this.bud.queue.push({
                            x: newX,
                            y: newY,
                            delay: 5,
                            name: blockName,
                        });
                    })
            );
        }

        return returnFunc;
    }
}

export { Eco };
