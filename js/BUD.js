import { Eco } from "./ecosystem.js";

class BlockUpdateDetector {
    constructor(config) {
        this.game = config.game;

        // 待检查的队列
        // !注意！block在存储的时候是没有x、y和delay属性的，因此不能直接把block推上去
        // !需要对其进行处理，添加x和y属性和delay属性
        // !最好是在原有block的基础上添加，而不是新建一个对象，因为原有的方块可能含有其他属性
        // !比如说zAxis属性，表明垂直方向上的方块列表
        this.queue = [];
        // 检查项目列表
        this.checkList = [
            (block) => this.eco.updateWaterFlow(block),
            // (block) => this.eco.updateGrassSpread(block),
        ];

        this.eco = new Eco({
            game: this.game,
            bud: this,
        });

        this.taskPriority = 500;

        this.setup = this.setup.bind(this);
        this.update = this.update.bind(this);
        this.checkQueue = this.checkQueue.bind(this);
    }

    setup() {
        // 向ticker中添加自身
        this.game.ticker.taskList.push(this);
    }

    update() {
        // 每次更新，都检查一次队列
        return this.checkQueue();
    }

    checkQueue() {
        // 如果队列为空，则返回false
        if (this.queue.length == 0) {
            return false;
        }
        // 队列中为一个个方块的字典，其中x,y是触发BUD的方块坐标，
        // delay为延时的 tick 数,updatedInThisTick为是否在这一刻已经更新过
        // 如果delay为0，则立即触发BUD，否则将delay减1
        // 现在我们需要遍历队列，生成一个待检查的方块的队列，然后检查这些方块
        // 如果这其中产生了新的BUD，则将新的BUD加入队列，继续检查
        // 反复这么做，直到队列中delay为0的方块全部被检查完毕
        this.queue.forEach((block) => {
            const { x, y, delay } = block;
            // if (delay == 0 && !updatedInThisTick) {
            if (delay == 0) {
                // blocksToCheckInThisTick.push(block);
                // 从队列中删除这个方块
                // this.queue.splice(this.queue.indexOf(block), 1);
            } else {
                this.queue[this.queue.indexOf(block)].delay -= 1;
            }
        });

        while (this.queue.some(({ delay }) => delay == 0)) {
            let blocksToCheckInThisTick = this.queue.filter(
                ({ delay }) => delay == 0
            );
            // 遍历队列，提取所有delay为0的方块
            // this.queue.forEach(({ x, y, delay, updatedInThisTick }) => {

            // 删除所有delay=0的方块
            this.queue = this.queue.filter(({ delay }) => delay != 0);
            // this.queue.forEach(({ x, y }) => {
            //     // 将队列中的方块的上下左右四个方向的方块加入待检查队列
            //     blocksToCheck.push(
            //         { x, y: y + 1 },
            //         { x, y: y - 1 },
            //         { x: x + 1, y },
            //         { x: x - 1, y }
            //     );
            // });
            // 去重，但是因为js中对象是引用类型，因此不能直接用Set去重
            // blocksToCheckInThisTick = [...new Set(blocksToCheckInThisTick)];
            // blocksToCheckInThisTick = blocksToCheckInThisTick.filter(
            //     (block, index, self) =>
            //         self.findIndex((b) => b.x == block.x && b.y == block.y) ===
            //         index
            // );

            // console.log("待检查方块", blocksToCheckInThisTick);
            // 现在我们为这个新队列排一下序，按照x坐标从小到大，y坐标从小到大的顺序排列
            // 这样可以保证我们检查的顺序是从左到右，从上到下的
            blocksToCheckInThisTick.sort((a, b) => {
                if (a.x == b.x) {
                    return a.y - b.y;
                }
                return a.x - b.x;
            });

            // console.log("待检查方块", blocksToCheckInThisTick);
            // 现在我们开始检查这些方块，只要有一项检查返回了true就终止剩下的检查
            // 我们在最后一并更新方块，以免在检查过程中方块被更新导致检查出错
            let updateFunctionsForBlocks = [];
            // 这个数组用来存储更新方块用的操作，每个元素是一个数组，第一个元素是方块，第二个元素是更新方块的函数
            blocksToCheckInThisTick.forEach((block) => {
                this.checkList.forEach((check) => {
                    const returnFromCheck = check(block);
                    if (typeof returnFromCheck === "function") {
                        updateFunctionsForBlocks.push([block, returnFromCheck]);
                        return true;
                    }
                });
            });

            // 现在我们开始更新方块
            updateFunctionsForBlocks.forEach(([block, updateFunction]) => {
                // console.log("更新方块", block, updateFunction);
                updateFunction(this.game, block);
            });
            // blocksToCheckInThisTick.forEach((block) => {
            //     const updateFunction = this.checkList.find((check) =>
            //         check(block)
            //     );
            //     if (updateFunction) {
            //         updateFunction(block);
            //     }
            //     // // 标记为已经更新过
            //     // this.queue[this.queue.indexOf(block)].updatedInThisTick = true;
            // });

            // 直到没有在这一刻需要更新的方块为止（即队列中没有delay=0的方块）
        }
        this.game.drawMap();
    }
}

export { BlockUpdateDetector };
