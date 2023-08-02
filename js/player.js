class Player {
    constructor(config) {
        this.name = "人";
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.health = config.health || 20;
        this.do = config.do || (() => {});
        this.map = config.map; // Need to be set
        this.ticker = config.ticker; // Need to be set
        this.speed = config.speed || 5; // 5 block per second

        this.type = "player";
        this.setup = this.setup.bind(this);
        this.moveUp = this.moveUp.bind(this);
        this.moveDown = this.moveDown.bind(this);
        this.moveLeft = this.moveLeft.bind(this);
        this.moveRight = this.moveRight.bind(this);
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

        this.helathbar =
            config.healthbar || document.getElementById("game-healthbar");
        this.maxInvincibleTime = config.maxInvincibleTime || 5; // 无敌时间

        // this.player.health发生改变时，更新healthbar
        Object.defineProperty(this.player, "health", {
            set: (value) => {
                this.player._health = value;
                this.updateHealthBar();
            },
            get: () => {
                return this.player._health;
            },
        });

        this.setup = this.setup.bind(this);
        this.handleShortPress = this.handleShortPress.bind(this);
        this.handleLongPress = this.handleLongPress.bind(this);
        this.updateHealthBar = this.updateHealthBar.bind(this);
        this.setup();
        this.updateHealthBar();
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

    isPC() {
        const userAgentInfo = navigator.userAgent;
        const Agents = [
            "Android",
            "iPhone",
            "SymbianOS",
            "Windows Phone",
            "iPad",
            "iPod",
        ];
        let flag = true;
        for (let v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
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
        if (this.isPC()) {
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
        } else {
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

    updateHealthBar() {
        if (this.player.health <= 0) {
            // 游戏结束
            this.map.gameOver();
        }
        // 两颗心的emoji: 💕
        // 一颗心的emoji: 💗
        // 一颗心碎的emoji: 💔
        // 向healthbar中添加心
        this.helathbar.innerHTML = "";
        const heart = document.createElement("span");
        const doubleHeartNumber =
            this.player.health >= 0 ? Math.floor(this.player.health / 2) : 0;
        const singleHeartNumber =
            this.player.health >= 0 ? this.player.health % 2 : 0;
        heart.innerText =
            "💕".repeat(doubleHeartNumber) + "💗".repeat(singleHeartNumber);
        this.helathbar.appendChild(heart);
    }
}

// class PlayerLive {
//     constructor(config) {
//         this.player = config.player;
//         this.map = config.map;
//         this.ticker = config.ticker;

//         this.taskPriority = 0;

//         this.setup = this.setup.bind(this);
//         this.update = this.update.bind(this);
//         this.updateHealthBar = this.updateHealthBar.bind(this);
//     }

//     setup() {
//         this.ticker.taskList.push(this);
//         this.updateHealthBar();
//     }

//     update() {
//         // 这里一律返回false，因为player生命值的更新不会导致地图更新
//         if (this.lastHurtTick < this.Invincibility) {
//             this.lastHurtTick++;
//             return false;
//         }

//         // 遍历entities，如果有怪物在player的位置，则player受伤
//         const { entities } = this.map;
//         const mobs = entities.filter((entity) => entity.type === "mob");
//         const hurtMobs = mobs.filter(
//             (mob) => mob.x === this.player.x && mob.y === this.player.y
//         );

//         // 检查怪物
//         if (hurtMobs.length > 0) {
//             this.player.health -= hurtMobs[0].damage;
//             this.lastHurtTick = 0;
//             this.updateHealthBar();

//             if (this.player.health <= 0) {
//                 // 游戏结束
//                 this.gameOverReason =
//                     "不幸被怪物殴打致死 <del>欧拉欧拉欧拉！</del>";
//                 this.player.map.gameOver();
//             }
//         }

//         // 检查炸弹
//         const booms = entities.filter((entity) => entity.type === "boom");
//         // 在爆炸范围内的炸弹
//         const hurtBooms = booms.filter(
//             (boom) =>
//                 boom.boomed &&
//                 boom.x - boom.range <= this.player.x &&
//                 boom.x + boom.range >= this.player.x &&
//                 boom.y - boom.range <= this.player.y &&
//                 boom.y + boom.range >= this.player.y
//         );
//         for (let boom of hurtBooms) {
//             // 计算伤害，伤害随距离的增加而衰减
//             const distance =
//                 Math.abs(boom.x - this.player.x) +
//                 Math.abs(boom.y - this.player.y);
//             const damage = Math.floor(
//                 boom.damage * Math.pow(boom.damageReduction, distance)
//             );
//             this.player.health -= damage;

//             this.lastHurtTick = 0;
//             this.updateHealthBar();
//             if (this.player.health <= 0) {
//                 this.gameOverReason =
//                     "被自己放置的炸弹炸死 <del>疯狂伊万</del>";
//                 this.map.gameOver();
//             }
//         }
//         return false;
//     }

//     updateHealthBar() {
//         if (this.player.health <= 0) {
//             this.player.health = 0;
//             // 游戏结束
//             this.map.gameOver();
//         }
//         // 两颗心的emoji: 💕
//         // 一颗心的emoji: 💗
//         // 一颗心碎的emoji: 💔
//         // 向healthbar中添加心
//         this.helathbar.innerHTML = "";
//         const heart = document.createElement("span");
//         const doubleHeartNumber = Math.floor(this.player.health / 2);
//         const singleHeartNumber = this.player.health % 2;
//         heart.innerText =
//             "💕".repeat(doubleHeartNumber) + "💗".repeat(singleHeartNumber);
//         this.helathbar.appendChild(heart);
//     }
// }

export { Player, PlayerController };
