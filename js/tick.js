// 处理游戏内事件的函数
class Ticker {
    /**
     * 创建一个记刻器，用于处理游戏内事件
     * @param {Object} config 配置
     * @param {Array} config.taskList 任务列表
     * @param {Function} config.updateMapFunc 更新地图的函数
     * @param {number} config.tickPerSecond （可选）每秒记刻的次数
     * @memberof Ticker
     * @constructor
     */
    constructor(config) {
        this.taskList = config.taskList || [];
        this.updateMapFunc = config.updateMapFunc || (() => {});

        this.tickPerSecond = config.tickPerSecond || 5;

        this.start = this.start.bind(this);
        this.doTask = this.doTask.bind(this);
        this.stop = this.stop.bind(this);
    }

    /**
     * 开始记刻，一秒有this.tickPerSecond个记刻
     * @memberof Ticker
     * @returns {void}
     */
    start() {
        // console.error("Start ticking");
        // 写一个定时器，每秒执行this.tickPerSecond次
        let count = 0;
        const interval = 1000 / this.tickPerSecond;
        const startTime = new Date().getTime();
        let timeCounter;

        const tick = () => {
            count++;
            const offset =
                new Date().getTime() - (startTime + count * interval);
            let nextTime = interval - offset;
            if (nextTime < 0) {
                nextTime = 0;
            }

            this.doTask();

            timeCounter = setTimeout(tick, nextTime);
            this.ticker = timeCounter;
            // console.log("Tick!");
            // console.log(`误差：${offset} ms，下一次执行：${nextTime} ms 后`);
        };

        tick();
    }

    /**
     * 执行在每刻都要执行的任务
     * @memberof Ticker
     * @returns {void}
     */
    doTask() {
        // console.log("Tick +1");
        // 排序task, 优先级高的先执行，优先级为task.taskPriority
        this.taskList.sort((a, b) => {
            const priorityA = a.taskPriority || 0;
            const priorityB = b.taskPriority || 0;
            return priorityB - priorityA;
        });

        // 遍历task，执行task，并判断是否需要更新地图
        // !以下代码中，这里在获取到一个 true 后就不再继续遍历了，
        // !我也不知道为什么，所以弃用了
        // const needToUpdateMap = this.taskList.reduce(
        //     (acc, task) =>
        //         acc ||
        //         (typeof task.update === "function" ? task.update() : task()) ||
        //         false,
        //     false
        // );

        let needToUpdateMap = false;
        for (let i = 0; i < this.taskList.length; i++) {
            const task = this.taskList[i];
            const isUpdated =
                (typeof task.update === "function" ? task.update() : task()) ||
                false;
            // console.log("Task updated: ", task, isUpdated);
            if (isUpdated) {
                needToUpdateMap = true;
            }
        }

        // 遍历task，删除已经完成的task
        // 倒着遍历，这样可以避免删除元素后数组长度变化导致的问题
        for (let i = this.taskList.length - 1; i >= 0; i--) {
            const task = this.taskList[i];
            const isFinished =
                (typeof task.finished === "function"
                    ? task.finished()
                    : task.finished) || false;
            if (isFinished) {
                // console.log("Task finished: ", task);
                // 删除task
                // 如果task存在teardown函数，则执行teardown函数
                if (typeof task.teardown === "function") {
                    task.teardown();
                }
                this.taskList.splice(i, 1);
            }
        }

        if (needToUpdateMap) {
            this.updateMapFunc();
        }
    }

    /**
     * 停止记刻
     * @memberof Ticker
     * @returns {void}
     */
    stop() {
        clearTimeout(this.ticker);
    }
}

export { Ticker };
