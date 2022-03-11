function mob_move_prepare() { //怪物移动的方向与步数确定
    if (find_direction_times < 10) { //尝试10次寻找方向
        mob_direction = Math.floor(Math.random() * 4);

        switch (mob_direction) {
            case 0:
                { //上
                    if (mob_x - 1 > -1 && (contains(passable, map[mob_x - 1][mob_y]))) {
                        mob_step = Math.floor(Math.random() * map.length);
                        mob_move(-mob_step, 0);
                        // console.log("0");
                        find_direction_times = 0;
                    } else {
                        find_direction_times += 1;
                        mob_move_prepare();
                    }
                    break;
                }
            case 1:
                { //下
                    if (mob_x + 1 < map.length && (contains(passable, map[mob_x + 1][mob_y]))) {
                        mob_step = Math.floor(Math.random() * map.length);
                        mob_move(mob_step, 0);
                        // console.log("1");
                        find_direction_times = 0;
                    } else {
                        find_direction_times += 1;
                        mob_move_prepare();
                    }
                    break;
                }
            case 2:
                { //左
                    if (mob_y - 1 > -1 && (contains(passable, map[mob_x][mob_y - 1]))) {
                        mob_step = Math.floor(Math.random() * map[0].length);
                        mob_move(0, -mob_step);
                        // console.log("2");
                        find_direction_times = 0;
                    } else {
                        find_direction_times += 1;
                        mob_move_prepare();
                    }
                    break;
                }
            case 3:
                { //右
                    if (mob_y + 1 < map.length && (contains(passable, map[mob_x][mob_y + 1]))) {
                        mob_step = Math.floor(Math.random() * map[0].length);
                        mob_move(0, mob_step);
                        // console.log("3");
                        find_direction_times = 0;
                    } else {
                        find_direction_times += 1;
                        mob_move_prepare();

                    }
                    break;
                }
        }
        console.log(1);
    } else { //10次都没找到能走的方向(运气不佳)
        //依次将上下左右检测一遍
        if (mob_x - 1 > -1 && (contains(passable, map[mob_x - 1][mob_y]))) {
            mob_step = Math.floor(Math.random() * map.length);
            mob_move(-mob_step, 0);
        } else if (mob_x + 1 < map.length && (contains(passable, map[mob_x + 1][mob_y]))) {
            mob_step = Math.floor(Math.random() * map.length);
            mob_move(mob_step, 0);
        } else if (mob_y - 1 > -1 && (contains(passable, map[mob_x][mob_y - 1]))) {
            mob_step = Math.floor(Math.random() * map[0].length);
            mob_move(0, -mob_step);
        } else if (mob_y + 1 < map.length && (contains(passable, map[mob_x][mob_y + 1]))) {
            mob_step = Math.floor(Math.random() * map[0].length);
            mob_move(0, mob_step);
        } else { //上下左右都走不了(不是运气的事了)
            // 休眠，每隔一秒重新检测一次
            console.log("sleep");
            setTimeout("mob_move_prepare()", 1000);
        }
    }
    // console.log(mob_direction, mob_step);
}

// 怪物运动解算
function mob_move(x_add, y_add) {
    if (x_add != 0) { //计算在x轴方向上需要走的步数
        x_step = x_add / Math.abs(x_add);
        y_step = 0;
    } else { //计算在y轴方向上需要走的步数
        x_step = 0;
        y_step = y_add / Math.abs(y_add);
    }

    d = 0;

    do_mob_onmove = setTimeout("mob_onmove()", 1000);

}

function mob_onmove() { //怪物运动绘图
    if (!peace.checked) { //如果不是和平模式
        if (-1 < mob_x + x_step && mob_x + x_step < map.length && -1 < mob_y + y_step && mob_y + y_step < map[0].length) { //如果能走
            if (contains(passable, map[mob_x + x_step][mob_y + y_step])) {
                mob_x_old = mob_x;
                mob_y_old = mob_y;
                mob_block_old = mob_block; //下一步将要走到的方块
                mob_block = map[mob_x + x_step][mob_y + y_step]; //走一步

                map[mob_x_old][mob_y_old] = mob_block_old; //上一步所在的方块

                mob_x += x_step;
                mob_y += y_step;

                if (mob_x == x && mob_y == y) { //如果下一步碰到了"人"
                    gameover(0);
                }

                drawmap_base();
            }
        }
    }

    d++;

    if (d < Math.abs(mob_step)) { //没走完步数
        do_mob_onmove = setTimeout("mob_onmove()", 200); //200毫秒后走下一步
    } else {
        setTimeout("mob_move_prepare()", 200); //重新走
    }
}

function mobrestart() { //mob被击杀后刷新
    booming = false; //炸完了
    find_place_times = 0;

    do { //寻找落脚点，最多重复10次
        new_mob_x = Math.floor(Math.random() * map.length);
        new_mob_y = Math.floor(Math.random() * map[0].length);
        find_place_times += 1;
        if (find_place_times < 10) {
            break;
        }
    } while (contains(passable, map[new_mob_x][new_mob_y]));
    outer:
        if (find_place_times != 0) { //运气不好，10次都没找到可以落脚的方块
            for (f = map.length - 1; f > -1; f--) { //把整个地图都检查一遍，寻找可以落脚的方块
                for (s = map[0].length - 1; s > -1; s--) {
                    if (contains(passable, map[f][s])) { //找到了就在这里落脚
                        new_mob_x = f;
                        new_mob_y = s;
                        break outer;
                    }
                }
            }
        }

        //如果还没找到的话就放弃，直接在随机到的方块上落脚(不是运气的事了)
    mob_x = new_mob_x;
    mob_y = new_mob_y;
    mob_block = map[mob_x][mob_y];
}