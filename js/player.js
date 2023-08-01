class Player {
    constructor(config) {
        this.name = "人";
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.map = config.map; // Need to be set
        this.speed = config.speed || 5; // 5 block per second

        this.setup = this.setup.bind(this);
        this.moveUp = this.moveUp.bind(this);
        this.moveDown = this.moveDown.bind(this);
        this.moveLeft = this.moveLeft.bind(this);
        this.moveRight = this.moveRight.bind(this);
        this.do = this.do.bind(this);
    }

    setup() {
        // 向entities中添加自身
        this.map.entities.push(this);
    }

    moveUp() {
        if (this.map.isPassable(this.x - 1, this.y)) {
            this.x -= 1;
            this.map.drawMap();
        }
    }

    moveDown() {
        if (this.map.isPassable(this.x + 1, this.y)) {
            this.x += 1;
            this.map.drawMap();
        }
    }

    moveLeft() {
        if (this.map.isPassable(this.x, this.y - 1)) {
            this.y -= 1;
            this.map.drawMap();
        }
    }

    moveRight() {
        if (this.map.isPassable(this.x, this.y + 1)) {
            this.y += 1;
            this.map.drawMap();
        }
    }

    do() {
        const boom = new Boom({
            x: this.x,
            y: this.y,
            power: 2,
            map: this.map,
        });
        boom.setup();
        ticker.taskList.push(boom);
        this.map.drawMap();
    }
}

class PlayerController {
    constructor(config) {
        this.leftBtn = config.leftBtn || document.getElementById("leftBtn");
        this.rightBtn = config.rightBtn || document.getElementById("rightBtn");
        this.upBtn = config.upBtn || document.getElementById("upBtn");
        this.downBtn = config.downBtn || document.getElementById("downBtn");
        this.doBtn = config.doBtn || document.getElementById("doBtn");
        // 默认为a键、d键、w键、s键、空格键
        this.leftKey = config.leftKey || 65;
        this.rightKey = config.rightKey || 68;
        this.upKey = config.upKey || 87;
        this.downKey = config.downKey || 83;
        this.doKey = config.doKey || 32;
        this.player = config.player;
        this.map = config.map;
        this.setup = this.setup.bind(this);
        this.handleShortPress = this.handleShortPress.bind(this);
        this.handleLongPress = this.handleLongPress.bind(this);
        this.setup();
    }

    setup() {
        this.handleShortPress();
        this.handleLongPress(1000 / this.player.speed);
        // console.log("PlayerController setup" + this.player.speed);
    }

    handleShortPress() {
        this.doBtn.addEventListener("click", () => {
            this.player.do();
        });

        // 键盘
        document.addEventListener("keydown", (e) => {
            switch (e.keyCode) {
                case this.doKey:
                    // 避免按下空格键后页面滚动
                    e.preventDefault();
                    this.player.do();
                    break;
                default:
                    break;
            }
        });
    }

    /**
     * 处理长按的函数，长按时每隔 executionCycle 毫秒执行一次给定的函数(即 funcToExecute)
     */
    handleLongPress(executionCycle) {
        let timeoutId;
        let intervalId;
        function start(funcToExecute) {
            funcToExecute();
            timeoutId = setTimeout(() => {
                funcToExecute();
                intervalId = setInterval(() => {
                    funcToExecute();
                }, executionCycle);
            }, executionCycle);
        }
        const end = () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };

        // PC端
        // 按钮
        this.leftBtn.addEventListener("mousedown", () => {
            start(this.player.moveLeft);
        });
        this.leftBtn.addEventListener("mouseup", end);
        this.leftBtn.addEventListener("mouseleave", end);

        this.rightBtn.addEventListener("mousedown", () => {
            start(this.player.moveRight);
        });
        this.rightBtn.addEventListener("mouseup", end);
        this.rightBtn.addEventListener("mouseleave", end);

        this.upBtn.addEventListener("mousedown", () => {
            start(this.player.moveUp);
        });
        this.upBtn.addEventListener("mouseup", end);
        this.upBtn.addEventListener("mouseleave", end);

        this.downBtn.addEventListener("mousedown", () => {
            start(this.player.moveDown);
        });
        this.downBtn.addEventListener("mouseup", end);
        this.downBtn.addEventListener("mouseleave", end);

        // 键盘
        let moving = false;
        document.addEventListener("keydown", (e) => {
            if (moving) return;
            moving = true;

            switch (e.keyCode) {
                case this.leftKey:
                    start(this.player.moveLeft);
                    break;
                case this.rightKey:
                    start(this.player.moveRight);
                    break;
                case this.upKey:
                    start(this.player.moveUp);
                    break;
                case this.downKey:
                    start(this.player.moveDown);
                    break;
                default:
                    break;
            }
        });

        document.addEventListener("keyup", (e) => {
            end();
            moving = false;
        });

        // 移动端
        this.leftBtn.addEventListener("touchstart", () => {
            start(this.player.moveLeft);
        });
        this.leftBtn.addEventListener("touchend", end);
        this.leftBtn.addEventListener("touchcancel", end);

        this.rightBtn.addEventListener("touchstart", () => {
            start(this.player.moveRight);
        });
        this.rightBtn.addEventListener("touchend", end);
        this.rightBtn.addEventListener("touchcancel", end);

        this.upBtn.addEventListener("touchstart", () => {
            start(this.player.moveUp);
        });
        this.upBtn.addEventListener("touchend", end);
        this.upBtn.addEventListener("touchcancel", end);

        this.downBtn.addEventListener("touchstart", () => {
            start(this.player.moveDown);
        });
        this.downBtn.addEventListener("touchend", end);
        this.downBtn.addEventListener("touchcancel", end);
    }
}
