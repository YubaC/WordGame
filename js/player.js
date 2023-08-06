class Player {
    constructor(config) {
        this.name = "人";
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.chunkX = config.chunkX || 0;
        this.chunkY = config.chunkY || 0;
        this.health = config.health || 20;
        this.do = config.do || (() => {});
        this.game = config.game;
        this.speed = config.speed || 5; // 5 block per second

        this.type = "player";
        this.setup = this.setup.bind(this);
        this.moveSelfToChunk = this.moveSelfToChunk.bind(this);
        this.changeSpeed = this.changeSpeed.bind(this);
        this.moveUp = this.moveUp.bind(this);
        this.moveDown = this.moveDown.bind(this);
        this.moveLeft = this.moveLeft.bind(this);
        this.moveRight = this.moveRight.bind(this);
        this.do = this.do.bind(this);
    }

    setup() {
        const chunk = this.game.map.getChunkThatContains(this.x, this.y);
        chunk.entities.push(this);
        // 向chunkLoaders中添加自身
        this.game.chunkLoaders.push(this);
        // 向活跃实体列表中添加自身
        this.game.activeEntities.push(this);
    }

    moveSelfToChunk(chunk) {
        // 将实体移动到指定的区块
        // 如果实体已经在该区块中，则不移动
        const oldChunk = this.game.map.getChunkThatContains(this.x, this.y);
        if (oldChunk === chunk) {
            return;
        }

        // 从旧区块中移除
        oldChunk.entities.splice(oldChunk.entities.indexOf(this), 1);
        // 添加到新区块中
        chunk.entities.push(this);
        this.chunkX = chunk.chunkX;
        this.chunkY = chunk.chunkY;
    }

    changeSpeed() {
        // 如果在水里，则速度减半
        const block = this.game.map.getBlock(this.x, this.y);
        if (block.name === "水" && this.speed === 5) {
            this.speed = 1;
        } else if (block.name !== "水" && this.speed === 1) {
            this.speed = 5;
        }
    }

    moveUp() {
        if (this.game.map.isPassable(this.x - 1, this.y)) {
            this.x -= 1;
            this.game.centerX = this.x;
            this.game.drawMap();

            this.changeSpeed();
            this.moveSelfToChunk(
                this.game.map.getChunkThatContains(this.x, this.y)
            );
        }
    }

    moveDown() {
        if (this.game.map.isPassable(this.x + 1, this.y)) {
            this.x += 1;
            this.game.centerX = this.x;
            this.game.drawMap();

            this.changeSpeed();
            this.moveSelfToChunk(
                this.game.map.getChunkThatContains(this.x, this.y)
            );
        }
    }

    moveLeft() {
        if (this.game.map.isPassable(this.x, this.y - 1)) {
            this.y -= 1;
            this.game.centerY = this.y;
            this.game.drawMap();

            this.changeSpeed();
            this.moveSelfToChunk(
                this.game.map.getChunkThatContains(this.x, this.y)
            );
        }
    }

    moveRight() {
        if (this.game.map.isPassable(this.x, this.y + 1)) {
            this.y += 1;
            this.game.centerY = this.y;
            this.game.drawMap();

            this.changeSpeed();
            this.moveSelfToChunk(
                this.game.map.getChunkThatContains(this.x, this.y)
            );
        }
    }

    do() {}
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
        this.game = config.game;

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
        this.handleLongPress();
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
    handleLongPress() {
        let timeoutId;
        let intervalId;

        const start = (funcToExecute) => {
            funcToExecute();
            timeoutId = setTimeout(() => {
                // funcToExecute();
                run(funcToExecute);
                // intervalId = setInterval(() => {
                //     funcToExecute();
                // }, executionCycle);
            }, 1000 / this.player.speed);
        };
        const run = (funcToExecute) => {
            funcToExecute();
            intervalId = setTimeout(() => {
                run(funcToExecute);
            }, 1000 / this.player.speed);
        };
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
            this.game.gameOver();
        }
        // 两颗心的emoji: 💕
        // 一颗心的emoji: ♥️
        // 一颗心碎的emoji: 💔
        // 向healthbar中添加心
        this.helathbar.innerHTML = "";
        const heart = document.createElement("span");
        const doubleHeartNumber =
            this.player.health >= 0 ? Math.floor(this.player.health / 2) : 0;
        const singleHeartNumber =
            this.player.health >= 0 ? this.player.health % 2 : 0;
        heart.innerText =
            "💕".repeat(doubleHeartNumber) + "♥️".repeat(singleHeartNumber);
        // 添加灰色心至healthbar中的文字数为10
        const grayHeartNumber = 10 - doubleHeartNumber - singleHeartNumber;
        heart.innerText += "🖤".repeat(grayHeartNumber);
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
