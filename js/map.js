// 存储地图的类
class Map {
    constructor(config) {
        this.seed = config.seed || Math.random().toString();
        this.chunks = config.chunks || {};
        // this.blocks = config.blocks;
        // this.entities = config.entities;
        this.passable = config.passable;
        this.drawMapFunc = config.drawMapFunc || (() => {});
        this.gameOver = config.gameOverFunc || (() => {});

        this.forceLoad = [];
        this.weakLoad = [];
        this.noise = {};

        this.initGenerator = this.initGenerator.bind(this);
        this.generateBlock = this.generateBlock.bind(this);
        this.generateChunkBlock = this.generateChunkBlock.bind(this);
        this.addChunkToMap = this.addChunkToMap.bind(this);
        this.getClipedMapData = this.getClipedMapData.bind(this);
        this.getChunk = this.getChunk.bind(this);
        this.getChunksInRadius = this.getChunksInRadius.bind(this);
        this.getBlock = this.getBlock.bind(this);
        this.getEntitiesAt = this.getEntitiesAt.bind(this);
        this.getEntitiesInChunk = this.getEntitiesInChunk.bind(this);
        this.getChunkThatContains = this.getChunkThatContains.bind(this);

        // this.isInMap = this.isInMap.bind(this);
        this.isPassable = this.isPassable.bind(this);
        this.drawMap = this.drawMap.bind(this);
        this.destroy = this.destroy.bind(this);
        this.gameOver = this.gameOver.bind(this);

        this.initGenerator();
    }

    // 伪随机数生成函数
    // From http://baagoe.com/en/RandomMusings/javascript/
    Alea() {
        // From http://baagoe.com/en/RandomMusings/javascript/
        // Johannes BaagÃ¸e <baagoe@baagoe.com>, 2010
        function Mash() {
            var n = 0xefc8249d;

            var mash = function (data) {
                data = data.toString();
                for (var i = 0; i < data.length; i++) {
                    n += data.charCodeAt(i);
                    var h = 0.02519603282416938 * n;
                    n = h >>> 0;
                    h -= n;
                    h *= n;
                    n = h >>> 0;
                    h -= n;
                    n += h * 0x100000000; // 2^32
                }
                return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
            };

            mash.version = "Mash 0.9";
            return mash;
        }
        return (function (args) {
            // Johannes BaagÃ¸e <baagoe@baagoe.com>, 2010
            var s0 = 0;
            var s1 = 0;
            var s2 = 0;
            var c = 1;

            if (args.length == 0) {
                args = [+new Date()];
            }
            var mash = Mash();
            s0 = mash(" ");
            s1 = mash(" ");
            s2 = mash(" ");

            for (var i = 0; i < args.length; i++) {
                s0 -= mash(args[i]);
                if (s0 < 0) {
                    s0 += 1;
                }
                s1 -= mash(args[i]);
                if (s1 < 0) {
                    s1 += 1;
                }
                s2 -= mash(args[i]);
                if (s2 < 0) {
                    s2 += 1;
                }
            }
            mash = null;

            var random = function () {
                var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
                s0 = s1;
                s1 = s2;
                return (s2 = t - (c = t | 0));
            };
            random.uint32 = function () {
                return random() * 0x100000000; // 2^32
            };
            random.fract53 = function () {
                return (
                    random() +
                    ((random() * 0x200000) | 0) * 1.1102230246251565e-16
                ); // 2^-53
            };
            random.version = "Alea 0.9";
            random.args = args;
            return random;
        })(Array.prototype.slice.call(arguments));
    }

    initGenerator() {
        // Continentness 大陆性
        this.noise.continentalnessPoints = [
            { x: 0, y: 1 },
            { x: 0.027500000000000024, y: 0.01666666666666672 },
            { x: 0.4575, y: 0.040000000000000036 },
            { x: 0.465, y: 0.43000000000000005 },
            { x: 0.5175, y: 0.42666666666666664 },
            { x: 0.52, y: 0.9299999999999999 },
            { x: 0.54, y: 0.9666666666666667 },
            { x: 0.615, y: 0.9833333333333334 },
            { x: 0.6975, y: 0.9833333333333334 },
            { x: 0.7475, y: 0.98 },
            { x: 0.8275, y: 0.9866666666666667 },
            { x: 0.8825, y: 0.9866666666666667 },
            { x: 1, y: 1 },
        ];
        // Erosion 侵蚀性
        this.noise.erosionPoints = [
            { x: 0, y: 1 },
            { x: 0.14749999999999996, y: 0.6216666666666666 },
            { x: 0.17625000000000002, y: 0.56 },
            { x: 0.22999999999999998, y: 0.5266666666666666 },
            { x: 0.2625, y: 0.56 },
            { x: 0.3075, y: 0.94 },
            { x: 0.3625, y: 0.9916666666666667 },
            { x: 0.425, y: 0.9516666666666667 },
            { x: 0.4325, y: 0.7666666666666666 },
            { x: 0.4775, y: 0.7333333333333334 },
            { x: 0.4975, y: 0.5216666666666667 },
            { x: 0.54, y: 0.53 },
            { x: 0.55125, y: 0.45499999999999996 },
            { x: 0.59375, y: 0.44999999999999996 },
            { x: 0.6025, y: 0.3833333333333333 },
            { x: 0.61, y: 0.01666666666666672 },
            { x: 1, y: 0 },
        ];
        // Peaks and Valleys 山峰和山谷
        this.noise.pvPoints = [
            { x: 0, y: 0 },
            { x: 0.1775, y: 0.023333333333333317 },
            { x: 0.2, y: 0.9333333333333333 },
            { x: 0.23250000000000004, y: 0.05666666666666664 },
            { x: 0.3025, y: 0.2633333333333333 },
            { x: 0.3725, y: 0.9666666666666667 },
            { x: 0.43, y: 0.17666666666666664 },
            { x: 0.495, y: 0.2366666666666667 },
            { x: 0.5175, y: 0.9733333333333334 },
            { x: 0.565, y: 0.3766666666666667 },
            { x: 0.65, y: 0.8866666666666667 },
            { x: 0.685, y: 0.28 },
            { x: 0.7875, y: 0.9533333333333334 },
            { x: 0.815, y: 0.21999999999999997 },
            { x: 0.8225, y: 0.9633333333333334 },
            { x: 0.855, y: 0.9533333333333334 },
            { x: 0.8575, y: 0.013333333333333308 },
            { x: 0.9175, y: 0.9966666666666666 },
            { x: 0.9625, y: 1 },
        ];
        this.noise.outputPoints = [
            { x: 0, y: 0 },
            { x: 0.5, y: 0 },
            { x: 0.5, y: 0.5 },
            { x: 0.6, y: 0.5 },
            { x: 0.6, y: 1 },
            { x: 1, y: 1 },
        ];
        // this.noise.plantsPoints = [
        //     { x: 0, y: 0 },
        //     { x: 0.598, y: 0 },
        //     { x: 0.598, y: 0.5 },
        //     { x: 0.65, y: 0.5 },
        //     { x: 0.65, y: 1 },
        //     { x: 1, y: 1 },
        // ];
        this.noise.continentalness = new PerlinNoise({
            seed: this.seed,
            octaves: 2,
            splinePoints: this.noise.continentalnessPoints,
        });
        this.noise.erosion = new PerlinNoise({
            seed: this.seed,
            octaves: 2,
            splinePoints: this.noise.erosionPoints,
        });
        this.noise.pv = new PerlinNoise({
            seed: this.seed,
            octaves: 2,
            splinePoints: this.noise.pvPoints,
        });
        this.noise.output = new PerlinNoise({
            seed: this.seed,
            octaves: 2,
            splinePoints: this.noise.outputPoints,
        });
        // this.noise.plants = new PerlinNoise({
        //     seed: this.seed,
        //     octaves: 4,
        //     splinePoints: this.noise.plantsPoints,
        // });

        this.blockTypes = [
            {
                name: "水",
                tC: ["[]", [0.429, 0.5]],
                height: ["==", 0],
                tPlant: ["<=", 0.01],
                plants: ["🪸"],
            },
            {
                name: "水",
                tC: ["<", 0.5],
                height: ["==", 0],
            },
            {
                name: "沙",
                tC: ["<", 0.5],
                height: ["==", 0.5],
                tPlant: ["<=", 0.05],
                plants: ["🌵"],
            },
            {
                name: "沙",
                tC: ["<", 0.5],
                height: ["==", 0.5],
            },
            {
                name: "水",
                tC: [">", 0.5],
                tPV: [">", 0.4],
                height: ["<", 1],
            },
            {
                name: "草",
                tC: ["<", 0.5],
                tPlant: ["<=", 0.005],
                plants: ["🌴"],
            },
            {
                name: "草",
                tPlant: ["<=", 0.005],
                plants: ["🌳"],
            },
            {
                name: "草",
                tPlant: ["<=", 0.008],
                plants: [
                    "🌿",
                    "🌹",
                    "🥀",
                    "🌺",
                    "🌻",
                    "🌼",
                    "🌷",
                    "🌾",
                    "🌿",
                    "☘️",
                ],
            },
            {
                name: "草",
                tPlant: ["<=", 0.00001],
                plants: ["🍀"],
            },
            {
                name: "草",
            },
        ];

        this.operators = {
            ">": (key, value, data) => data[key] > value,
            ">=": (key, value, data) => data[key] >= value,
            "<": (key, value, data) => data[key] < value,
            "<=": (key, value, data) => data[key] <= value,
            "==": (key, value, data) => data[key] === value,
            "!=": (key, value, data) => data[key] !== value,
            "[]": (key, value, data) =>
                data[key] >= value[0] && data[key] <= value[1],
        };
    }

    /**
     * 获取指定坐标的高度
     * @param {Number} blockX 输入的x坐标
     * @param {Number} blockY 输入的y坐标
     * @returns {Number} 返回的高度值，0 | 0.5 | 1
     */
    generateBlock(blockX, blockY) {
        const tPV = this.noise.pv.noise2d(blockX / 140, blockY / 140);
        const tC = this.noise.continentalness.noise2d(
            blockX / 200,
            blockY / 200
        );
        const tE = this.noise.erosion.noise2d(blockX / 200, blockY / 200);
        // const tPlant = this.noise.plants.noise2d(blockX / 20, blockY / 20);
        const tPlant = this.Alea(this.seed, blockX, blockY)();
        let t = tPV * 0.25 + tC * 0.45 + tE * 0.3;
        t = this.noise.output.interpolate(t, this.noise.outputPoints);
        return { tPV, tC, tE, tPlant, height: t };
    }

    // /**
    //  * 伪随机数生成函数
    //  * @param {Number} seed 伪随机数种子
    //  * @returns {Number} 生成的伪随机数
    //  */
    // random(seed) {
    //     const x = Math.sin(seed) * 10000;
    //     return x - Math.floor(x);
    // }

    generateChunkBlock(x, y) {
        const offsetX = (x - 1) * 16;
        const offsetY = (y - 1) * 16;
        // let blocks = [];
        // for (let i = 0; i < 16; i++) {
        //     const xIndex = offsetX + i;
        //     blocks[i] = [];
        //     for (let j = 0; j < 16; j++) {
        //         const yIndex = offsetY + j;
        //         let block;
        //         const { height, tC, tE, tPlant, tPV } = this.generateBlock(
        //             xIndex,
        //             yIndex
        //         );
        //         if (height === 0 && tC < 0.5) {
        //             block = {
        //                 name: "水",
        //             };
        //         } else if (height === 0.5 && tC < 0.5) {
        //             block = {
        //                 name: "沙",
        //             };
        //             if (tPlant === 1) {
        //                 block.name = "🌵";
        //                 block.zAxis = ["🌵", "草"];
        //             }
        //         } else if (height < 1 && tC > 0.5 && tPV > 0.4) {
        //             block = {
        //                 name: "水",
        //             };
        //             if (tPlant === 1) {
        //                 block.name = "🪸";
        //                 block.zAxis = ["🪸", "水"];
        //             }
        //         } else {
        //             block = {
        //                 name: "草",
        //             };
        //             if (tPlant === 1) {
        //                 block.name = "🌳";
        //                 block.zAxis = ["🌳", "草"];
        //                 if (tC < 0.5) {
        //                     block.name = "🌴";
        //                     block.zAxis = ["🌴", "草"];
        //                 }
        //             } else if (tPlant === 0.5) {
        //                 block.name = "🌿";
        //                 block.zAxis = ["🌿", "草"];
        //             }
        //         }
        //         blocks[i][j] = block;
        //     }
        // }

        const blocks = Array.from({ length: 16 }, (_, i) =>
            Array.from({ length: 16 }, (_, j) => {
                const xIndex = offsetX + i;
                const yIndex = offsetY + j;
                const { height, tC, tE, tPlant, tPV } = this.generateBlock(
                    xIndex,
                    yIndex
                );
                for (const blockType of this.blockTypes) {
                    const { name, plants, ...conditions } = blockType;
                    let match = true;
                    for (const [key, [operator, value]] of Object.entries(
                        conditions
                    )) {
                        const func = this.operators[operator];
                        if (
                            !func(key, value, { height, tC, tE, tPlant, tPV })
                        ) {
                            match = false;
                            break;
                        }
                    }
                    if (match) {
                        const block = { name };
                        if (plants) {
                            // 从植物中随机选取一个
                            block.zAxis = [
                                plants[
                                    Math.floor(Math.random() * plants.length)
                                ],
                                name,
                            ];
                            block.name = block.zAxis[0];
                        }
                        return block;
                    }
                }
            })
        );

        return blocks;
    }

    // 新生成一个区块
    addChunkToMap(chunkX, chunkY) {
        const blocks = this.generateChunkBlock(chunkX, chunkY);
        this.chunks[`${chunkX},${chunkY}`] = {
            blocks,
            entities: [],
            chunkX,
            chunkY,
        };
        return { blocks, entities: [], chunkX, chunkY };
    }

    getClipedMapData(topLeftBlock, bottomRightBlock) {
        const chunkLength = 16;
        const left = topLeftBlock.x; // 左上角的x坐标
        const top = topLeftBlock.y; // 左上角的y坐标
        const right = bottomRightBlock.x; // 右下角的x坐标
        const bottom = bottomRightBlock.y; // 右下角的y坐标

        const mapData = []; // 存储截取出的地图格子
        for (let x = left; x <= right; x++) {
            const row = []; // 存储当前行的地图格子
            for (let y = top; y <= bottom; y++) {
                const chunkX = Math.floor(x / chunkLength); // 当前格子所在的区块的x坐标
                const chunkY = Math.floor(y / chunkLength); // 当前格子所在的区块的y坐标
                const blockX = ((x % chunkLength) + chunkLength) % chunkLength; // 当前格子在区块中的x坐标
                const blockY = ((y % chunkLength) + chunkLength) % chunkLength; // 当前格子在区块中的y坐标
                const chunkKey = `${chunkX},${chunkY}`; // 区块的键
                let chunk = this.chunks[chunkKey]; // 获取对应的区块
                if (!chunk) {
                    chunk = this.addChunkToMap(chunkX, chunkY);
                }
                const block = chunk.blocks[blockX][blockY]; // 获取对应的地图格子
                row.push(block); // 将地图格子添加到当前行中
            }
            mapData.push(row);
            // 将当前行添加到mapData中
        }
        return mapData;
    }

    getChunk(chunkX, chunkY, allowEmpty = false) {
        if (!this.chunks[`${chunkX},${chunkY}`]) {
            if (allowEmpty) {
                return {};
            }
            return this.addChunkToMap(chunkX, chunkY);
        }
        return this.chunks[`${chunkX},${chunkY}`];
    }

    getChunksInRadius(x, y, radius, allowEmpty = false) {
        const chunkLength = 16;
        const chunkX = Math.floor(x / chunkLength);
        const chunkY = Math.floor(y / chunkLength);
        const chunks = [];
        for (let i = -radius; i <= radius; i++) {
            for (let j = -radius; j <= radius; j++) {
                chunks.push(this.getChunk(chunkX + i, chunkY + j, allowEmpty));
            }
        }
        return chunks;
    }

    getBlock(blockX, blockY) {
        const chunkX = Math.floor(blockX / 16);
        const chunkY = Math.floor(blockY / 16);
        const chunk = this.getChunk(chunkX, chunkY);
        const block =
            chunk.blocks[blockX % 16 >= 0 ? blockX % 16 : 16 + (blockX % 16)][
                blockY % 16 >= 0 ? blockY % 16 : 16 + (blockY % 16)
            ];
        block.x = blockX;
        block.y = blockY;
        return block;
    }

    getEntitiesAt(blockX, blockY) {
        const chunkX = Math.floor(blockX / 16);
        const chunkY = Math.floor(blockY / 16);
        const chunk = this.getChunk(chunkX, chunkY);
        const entities = chunk.entities.filter(
            (entity) => entity.x === blockX && entity.y === blockY
        );
        return entities;
    }

    setBlock(blockX, blockY, block) {
        const chunkX = Math.floor(blockX / 16);
        const chunkY = Math.floor(blockY / 16);
        this.getChunk(chunkX, chunkY).blocks[
            blockX % 16 >= 0 ? blockX % 16 : 16 + (blockX % 16)
        ][blockY % 16 >= 0 ? blockY % 16 : 16 + (blockY % 16)] = block;
    }

    getEntitiesInChunk(chunkX, chunkY) {
        const chunk = this.getChunk(chunkX, chunkY);
        return chunk.entities;
    }

    getChunkThatContains(blockX, blockY) {
        const chunkX = Math.floor(blockX / 16);
        const chunkY = Math.floor(blockY / 16);
        return this.getChunk(chunkX, chunkY);
    }

    isPassable(blockX, blockY) {
        // 获取当前坐标所在的方块
        const block = this.getBlock(blockX, blockY);

        // 如果坐标上的方块不可通过，则不可通过
        if (!this.passable.includes(block.name)) {
            return false;
        }

        // 如果坐标上的实体不可通过，则不可通过
        // 从当前区块提取实体
        const chunkX = Math.floor(blockX / 16);
        const chunkY = Math.floor(blockY / 16);
        const entities = this.getChunk(chunkX, chunkY).entities;
        // 遍历实体
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            // 如果实体的坐标与当前坐标相同
            if (entity.x === blockX && entity.y === blockY) {
                // 如果实体不可通过，则不可通过
                if (!this.passable.includes(entity.name)) {
                    return false;
                }
            }
        }

        // 否则可通过
        return true;
    }

    drawMap() {
        this.drawMapFunc(this);
    }

    destroy() {
        this.blocks = undefined;
        this.entities = undefined;
        this.drawMap = undefined;
    }
}

class PerlinNoise {
    constructor(config) {
        this.config = config;
        this.config.seed = this.config.seed || "random seed";
        this.config.octaves = this.config.octaves || 4;
        this.perlin = new Perlin(this.config.seed);

        this.noise2d = this.noise2d.bind(this);
        this.binarySearch = this.binarySearch.bind(this);
        this.interpolate = this.interpolate.bind(this);
        this.map = this.map.bind(this);
    }

    noise2d(x, y) {
        let value = 0;
        let amplitude = 1;
        let frequency = 1;
        for (let i = 0; i < this.config.octaves; i++) {
            value += this.map(
                this.perlin.noise(x * frequency, y * frequency, 0),
                0,
                1,
                -1,
                1
            );
            amplitude /= 2;
            frequency *= 2;
        }
        value = this.map(
            value,
            -this.config.octaves,
            this.config.octaves,
            0,
            1
        );
        if (this.config.splinePoints) {
            return this.interpolate(value, this.config.splinePoints);
        }
        return value;
    }

    // 二分法查找函数
    binarySearch(points, x) {
        let left = 0;
        let right = points.length - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (points[mid].x === x) {
                return mid;
            } else if (points[mid].x < x) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return left;
    }

    // 样条插值函数
    interpolate(x, points) {
        const index = this.binarySearch(points, x);
        if (index === 0 || index === points.length) {
            return null;
        }
        const leftPoint = points[index - 1];
        const rightPoint = points[index];
        const t = (x - leftPoint.x) / (rightPoint.x - leftPoint.x);
        return leftPoint.y + (rightPoint.y - leftPoint.y) * t;
    }

    map(value, inputMin, inputMax, outputMin, outputMax) {
        return (
            ((value - inputMin) * (outputMax - outputMin)) /
                (inputMax - inputMin) +
            outputMin
        );
    }
}

export { Map };
