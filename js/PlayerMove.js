T = 180;

var btn_left = document.getElementById("left");
var btn_right = document.getElementById("right");
var btn_up = document.getElementById("up");
var btn_down = document.getElementById("down");

document.oncontextmenu = function(e) {
    e.preventDefault();
};

function run(key) {
    switch (key) {
        case 87: //w→up
            button_up();
            break;

        case 65: //a→left
            button_left();
            break;

        case 83: //s→down
            button_down();
            break;

        case 68: //d→right
            button_right();
            break;

        case 32: //space→boom
            event.preventDefault();
            if (!boom_exist) {
                boom();
            }
            break;

        default:
            break
    }

};

var date, debug = document.getElementById('debug');

document.onkeydown = function(event) {
    var key = event || window.event || arguments.callee.caller.arguments[0],
        // var key = event ? event.charCode : window.event.keyCode,

        _date = new Date().getTime();

    key = key.keyCode;
    if (!date) {
        run(key);
        date = _date;

    } else if (_date >= date + T) {

        run(key);
        console.log(key);

        date = _date;

    }

}

document.onkeyup = function() {
    date = 0;
}

//left按钮事件--鼠标按下
btn_left.onmousedown = function() {
    var i = 0; //变量i
    mouseTime = setInterval(function() { //setInterval可一直执行内部函数
        button_left();
        i++ //若过T，执行一次i++
    }, T);
    if (i == 0) { //i=0时证明无长按事件为单击事件
        button_left();
    }
}

btn_left.onmouseup = function() { //鼠标抬起，执行清除
    clearInterval(mouseTime); //清除setInterval的时间
}

//right按钮事件（内容基本同上，不予注释）    
btn_right.onmousedown = function() {
    var i = 0;
    mouseTime = setInterval(function() {
        button_right();
        i++ //i=0时证明无长按事件为单击事件
    }, T);
    if (i == 0) {
        button_right();
    }
}

btn_right.onmouseup = function() {
    clearInterval(mouseTime);
}

//up按钮事件（内容基本同上，不予注释）    
btn_up.onmousedown = function() {
    var i = 0;
    mouseTime = setInterval(function() {
        button_up();
        i++ //i=0时证明无长按事件为单击事件
    }, T);
    if (i == 0) {
        button_up();
    }
}

btn_up.onmouseup = function() {
    clearInterval(mouseTime);
}

//down按钮事件（内容基本同上，不予注释）    
btn_down.onmousedown = function() {
    var i = 0;
    mouseTime = setInterval(function() {
        button_down();
        i++ //i=0时证明无长按事件为单击事件
    }, T);
    if (i == 0) {
        button_down();
    }
}

btn_down.onmouseup = function() {
    clearInterval(mouseTime);
}

//移动端适配
//left按钮事件--touch
var touch_left = document.getElementById('left');
touch_left.addEventListener('touchstart', function() {
    // document.getElementById("left").disabled = true;
    document.getElementById("right").disabled = true;
    document.getElementById("up").disabled = true;
    document.getElementById("down").disabled = true;
    var i = 0; //变量i
    mouseTime = setInterval(function() { //setInterval可一直执行内部函数
        button_left();
        i++ //若过T，执行一次i++
    }, T);
    if (i == 0) { //i=0时证明无长按事件为单击事件
        // button_left();
    }
}, false);

var end_left = document.getElementById('left');
end_left.addEventListener('touchend', function() { //抬起，执行清除
    clearInterval(mouseTime); //清除setInterval的时间
    document.getElementById("left").disabled = false;
    document.getElementById("right").disabled = false;
    document.getElementById("up").disabled = false;
    document.getElementById("down").disabled = false;
}, false);

//right
var touch_right = document.getElementById('right');
touch_right.addEventListener('touchstart', function() {
    document.getElementById("left").disabled = true;
    //  document.getElementById("right").disabled = true;
    document.getElementById("up").disabled = true;
    document.getElementById("down").disabled = true;
    var i = 0; //变量i
    mouseTime = setInterval(function() { //setInterval可一直执行内部函数
        button_right();
        i++ //若过T，执行一次i++
    }, T);
    if (i == 0) { //i=0时证明无长按事件为单击事件
        // button_right();
    }
}, false);

var end_right = document.getElementById('right');
end_right.addEventListener('touchend', function() { //鼠标抬起，执行清除
    clearInterval(mouseTime); //清除setInterval的时间
    document.getElementById("left").disabled = false;
    document.getElementById("right").disabled = false;
    document.getElementById("up").disabled = false;
    document.getElementById("down").disabled = false;
}, false);

// up
var touch_up = document.getElementById('up');
touch_up.addEventListener('touchstart', function() {
    document.getElementById("left").disabled = true;
    document.getElementById("right").disabled = true;
    //  document.getElementById("up").disabled = true;
    document.getElementById("down").disabled = true;
    var i = 0; //变量i
    mouseTime = setInterval(function() { //setInterval可一直执行内部函数
        button_up();
        i++ //若过T，执行一次i++
    }, T);
    if (i == 0) { //i=0时证明无长按事件为单击事件
        // button_up();
    }
}, false);

var end_up = document.getElementById('up');
end_up.addEventListener('touchend', function() { //鼠标抬起，执行清除
    clearInterval(mouseTime); //清除setInterval的时间
    document.getElementById("left").disabled = false;
    document.getElementById("right").disabled = false;
    document.getElementById("up").disabled = false;
    document.getElementById("down").disabled = false;
}, false);

//down
var touch_down = document.getElementById('down');
touch_down.addEventListener('touchstart', function() {
    document.getElementById("left").disabled = true;
    document.getElementById("right").disabled = true;
    document.getElementById("up").disabled = true;
    //  document.getElementById("down").disabled = true;
    var i = 0; //变量i
    mouseTime = setInterval(function() { //setInterval可一直执行内部函数
        button_down();
        i++ //若过T，执行一次i++
    }, T);
    if (i == 0) { //i=0时证明无长按事件为单击事件
        // button_down();
    }
}, false);

var end_down = document.getElementById('down');
end_down.addEventListener('touchend', function() { //鼠标抬起，执行清除
    clearInterval(mouseTime); //清除setInterval的时间
    document.getElementById("left").disabled = false;
    document.getElementById("right").disabled = false;
    document.getElementById("up").disabled = false;
    document.getElementById("down").disabled = false;
}, false);

function button_up() {
    moving = false;
    up();
}

function button_down() {
    moving = false;
    down();
}

function button_left() {
    moving = false;
    left();
}

function button_right() {
    moving = false;
    right();
}

// 移动
function left() {
    if (y > 0 && contains(passable, map[x][y - 1])) { //如果不会出地图并且前面的方块可以踩上去
        // if (map[x][y - 1] == "怪") {
        if (x == mob_x && y - 1 == mob_y && !peace.checked) {
            gameover(0);
        } else {
            block_old = block; //block_old更新为当前所在的方块（block：当前所在的方块 block_old：上一个走过的方块）
            block = map[x][y - 1]; //block更新为即将走到的方块
            x_old = x;
            y_old = y;
            y -= 1;
            drawmap();
        }
    }
}

function right() {
    if (y < map[x].length - 1 && contains(passable, map[x][y + 1])) {
        // if (map[x][y + 1] == "怪") {
        if (x == mob_x && y + 1 == mob_y && !peace.checked) {
            gameover(0);
        } else {
            block_old = block;
            block = map[x][y + 1];
            x_old = x;
            y_old = y;
            y += 1;
            drawmap();
        }
    }
}

function up() {
    if (x > 0 && contains(passable, map[x - 1][y])) {
        // if (map[x - 1][y] == "怪") {
        if (x - 1 == mob_x && y == mob_y && !peace.checked) {
            gameover(0);
        } else {
            block_old = block;
            block = map[x - 1][y];
            x_old = x;
            y_old = y;
            x -= 1;
            drawmap();
        }
    }
}

function down() {
    if (x < map.length - 1 && contains(passable, map[x + 1][y])) {
        // if (map[x + 1][y] == "怪") {
        if (x + 1 == mob_x && y == mob_y && !peace.checked) {
            gameover(0);
        } else {
            block_old = block;
            block = map[x + 1][y];
            x_old = x;
            y_old = y;
            x += 1;
            drawmap();
        }
    }
}

function returnplace(name) { //接收点击的坐标
    // alert(name);

    position = name.split(",");
    // map2d

    // function returnplace(name) { //接收点击的坐标
    // alert(name);
    // map2d


    input_x = Number(position[0]);
    input_y = Number(position[1]);

    clickplace = [input_x, input_y];

    map2d.data = JSON.parse(JSON.stringify(map));
    map2d.w = map.length;
    map2d.h = map[0].length;

    aStar = [];
    aStar = AStar(map2d, Point(x, y), Point(input_x, input_y));
    var pathList = aStar.start();
    if (pathList != null) {
        k = 0;
        movepath_x = [];
        movepath_y = [];
        for (var point of pathList) {
            movepath_x[k] = point.x;
            movepath_y[k] = point.y;
            k += 1;
            // console.log(point.x);
            // map2d.data[point.x][point.y] = "走";
        }
        console.log(movepath_x);
        n = 0;
        if (!moving) {
            moving = true;
            move();
        }

    } else {
        console.log("none");
        console.log(0)
    }
}

function move() {
    if (moving) {
        console.log(Number(movepath_x[n]) - x);
        console.log(Number(movepath_y[n]) - y);
        if (Number(movepath_x[n]) - x == 1) {
            down();
            console.log('down');
        } else if (Number(movepath_x[n]) - x == -1) {
            up();
            console.log('up');
        } else if (Number(movepath_y[n]) - y == 1) {
            right();
            console.log('right');
        } else if (Number(movepath_y[n]) - y == -1) {
            left();
            console.log('left');
        }
        n++;
        // // x_add = movepath_x[n] - x;
        // // y_add = movepath_y[n] - y;

        // if (n < 18) {
        if (n < movepath_x.length) {
            // drawmap_base();
            setTimeout("move()", T);

        } else {
            movepath_x = [];
            movepath_y = [];
            clickplace = [];
            drawmap_base();
            moving = false;
        }
    }
}

/* Astar算法 https://blog.csdn.net/qq_39687901/article/details/85697127*/
//二维数组
function Array2D(w, h, num) {
    var data = [];
    return {
        w: w,
        h: h,
        data: data,
    }
}

//点
function Point(x, y) {
    return {
        x: x,
        y: y,
        eq: function(other) {
            return this.x === other.x && this.y === other.y;
        }
    }
}

/*
    功能：
        创建AStar对象，进行寻路
    参数：
        map2d:Array2D类型的地图数组
        startPoint:Point类型的寻路起点
        endPoint:Point类型的寻路终点
        passTag:int类型的可行走标记（若地图数据!=passTag即为障碍）
 */
function AStar(map2d, startPoint, endPoint, passTag) {
    var tag = passTag || 0;

    var Node = function(point, endPoint, g) { //描述AStar中的节点
        var tG = g || 0;
        return {
            point: point, //节点的坐标
            father: null, //父节点
            g: tG, //G值，g值在用到的时候会重新算
            h: (Math.abs(endPoint.x - point.x) + Math.abs(endPoint.y - point.y)) * 10 //计算H值
        }
    };

    return {
        map2d: map2d,
        startPoint: startPoint,
        endPoint: endPoint,
        passTag: tag,
        openList: [], //开启表
        closeList: [], //关闭表

        //获得openList中F值最小的节点
        getMinNode: function() {
            var currentNode = this.openList[0];
            for (var node of this.openList) {
                if (node.g + node.h < currentNode.g + currentNode.h)
                    currentNode = node;
            }
            return currentNode;
        },

        //判断point是否在关闭表中
        pointInCloseList: function(point) {
            for (var node of this.closeList) {
                if (node.point.eq(point))
                    return true;
            }
            return false;
        },

        //判断point是否在开启表中
        pointInOpenList: function(point) {
            for (var node of this.openList) {
                if (node.point.eq(point))
                    return node;
            }
            return null;
        },

        //判断终点是否在关闭表中
        endPointInCloseList: function() {
            for (var node of this.closeList) {
                if (node.point.eq(this.endPoint))
                    return node;
            }
            return null;
        },
        //搜索节点周围的点
        searchNear: function(minF, offsetX, offsetY) {
            //越界检测
            if (minF.point.x + offsetX < 0 || minF.point.x + offsetX > this.map2d.w - 1 || minF.point.y + offsetY < 0 || minF.point.y + offsetY > this.map2d.h - 1)
                return null;
            //如果是障碍就忽略
            // if (this.map2d.data[minF.point.x + offsetX][minF.point.y + offsetY] !== this.passTag) {
            //     console.log(this.map2d.data[minF.point.x + offsetX][minF.point.y + offsetY]);
            //     console.log(this.passTag);
            //     console.log(3);
            //     return null;
            // }

            if (!contains(passable, this.map2d.data[minF.point.x + offsetX][minF.point.y + offsetY]))
                return null;
            //如果在关闭表中就忽略
            var currentPoint = Point(minF.point.x + offsetX, minF.point.y + offsetY);
            if (this.pointInCloseList(currentPoint))
                return null;
            //设置单位花费
            var step = 0;
            if (offsetX === 0 || offsetY === 0)
                step = 10;
            else
                step = 14;
            //如果不在openList中，就把它加入openList
            var currentNode = this.pointInOpenList(currentPoint);
            if (currentNode == null) {
                currentNode = Node(currentPoint, this.endPoint, minF.g + step);
                currentNode.father = minF;
                this.openList.push(currentNode);
                return null;
            }
            //如果在openList中，判断minF到当前点的G是否更小
            if (minF.g + step < currentNode.g) {
                currentNode.g = minF + step;
                currentNode.father = minF;
            }

        },

        //开始寻路
        start: function() {
            //1.将起点放入开启列表
            var startNode = Node(this.startPoint, this.endPoint);
            this.openList.push(startNode);
            //2.主循环逻辑
            while (true) {
                //找到F值最小的节点
                var minF = this.getMinNode();
                //把这个点加入closeList中，并且在openList中删除它
                this.closeList.push(minF);
                var index = this.openList.indexOf(minF);
                this.openList.splice(index, 1);
                //搜索这个节点的上下左右节点
                this.searchNear(minF, 0, -1);
                this.searchNear(minF, 0, 1);
                this.searchNear(minF, -1, 0);
                this.searchNear(minF, 1, 0);
                // 判断是否终止
                var point = this.endPointInCloseList();
                if (point) { //如果终点在关闭表中，就返回结果
                    var cPoint = point;
                    var pathList = [];
                    while (true) {
                        if (cPoint.father) {
                            pathList.push(cPoint.point);
                            cPoint = cPoint.father;
                        } else {
                            return pathList.reverse();
                        }
                    }
                }
                //开启表为空
                if (this.openList.length === 0)
                    return null;
            }
        }
    }
}