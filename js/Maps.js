if (getCookie("map_list") == "") {
    map_list_input = [];
} else {
    map_list_input = decodeURIComponent(escape(window.atob(getCookie("map_list")))).split(",");
    map_list = JSON.parse(JSON.stringify(map_list_input)); //https://www.cnblogs.com/Blogzlj/p/13031677.html
}

if (getCookie("map_id") == "") {
    map_id_input = [];
} else {
    map_id_input = decodeURIComponent(escape(window.atob(getCookie("map_id")))).split(",");
    map_id = JSON.parse(JSON.stringify(map_id_input)); //https://www.cnblogs.com/Blogzlj/p/13031677.html
}

if (getCookie("map_order") == "") {
    map_order_input = [];
} else {
    map_order_input = decodeURIComponent(escape(window.atob(getCookie("map_order")))).split(",");
    map_order = JSON.parse(JSON.stringify(map_order_input)); //https://www.cnblogs.com/Blogzlj/p/13031677.html
}

function getmap(value) {
    var os = getOs(); //获取浏览器信息
    if (os == 'FF' || os == 'SF') { //FireFox、谷歌浏览器用这个
        confirm_text = map_list[map_id.indexOf(value)] + "\n读取这个地图？\n请确保您已经保存好了当前地图！"
        confirm_text = map_list[map_id.indexOf(value)] + "\r\n读取这个地图？\r\n请确保您已经保存好了当前地图！";
    }
    if (confirm(confirm_text)) {
        read(value);
    }
}

function setlist(list_input, id_input, order_input) {
    maplist.innerHTML = "";
    for (i = 0; i < list_input.length; i++) {
        //在ul中添加标签
        //获取ul标签
        let maplist = document.getElementById('maplist');
        //添加li元素
        let liObj = document.createElement('li');
        //设置标签样式，当然也可以设置其他的属性值
        // liObj.setAttribute('id', '01');
        //设置标签的文本信息
        liObj.innerHTML = '<a name="' + id_input[id_input.indexOf(order_input[i])] + '" href="javascript:void(0);" onclick="getmap(this.name)">' + list_input[id_input.indexOf(order_input[i])] + '</a>';
        // 把js新建的li放到ul下
        maplist.appendChild(liObj);

    }
}

function edit(list_input, id_input, order_input) { //显示地图列表
    document.getElementById('edit').style.display = "none";
    document.getElementById('exit_editing').style.display = "block";

    maplist.innerHTML = "";
    for (i = 0; i < list_input.length; i++) {
        //在ul中添加标签
        //获取ul标签
        let maplist = document.getElementById('maplist');
        //添加li元素
        let liObj = document.createElement('li');
        //设置标签样式，当然也可以设置其他的属性值
        // liObj.setAttribute('id', '01');
        //设置标签的文本信息
        liObj.innerHTML = '<a name="' + id_input[id_input.indexOf(order_input[i])] + '" href="javascript:void(0);" onclick="getmap(this.name)">' + list_input[id_input.indexOf(order_input[i])] + '</a>';
        liObj.innerHTML += '<a name="' + id_input[id_input.indexOf(order_input[i])] + '" href="javascript:void(0);" onclick="rename(this.name)">&nbsp;&nbsp;&nbsp;重命名</a>';
        liObj.innerHTML += '<a name="' + id_input[id_input.indexOf(order_input[i])] + '" href="javascript:void(0);" onclick="delete_map(this.name)">&nbsp;&nbsp;&nbsp;删除</a>';
        // 把js新建的li放到ul下
        maplist.appendChild(liObj);

    }
}

function exit_editing() {
    setlist(map_list, map_id, map_order);
    document.getElementById('edit').style.display = "block";
    document.getElementById('exit_editing').style.display = "none";
}

function rename(rename_map_id) {
    new_worldname = prompt("请输入新的地图名称", "World");
    if (new_worldname != null) {
        map_list[map_id.indexOf(rename_map_id)] = new_worldname;
        map_list_output = btoa(unescape(encodeURIComponent(map_list.join(","))));
        setCookie("map_list", map_list_output, 30 * 365);

        edit(map_list, map_id, map_order);
    }
}

function delete_map(delete_id) {
    if (confirm('删除"' + map_list[map_id.indexOf(delete_id)] + '"?')) {
        map_list.splice(map_id.indexOf(delete_id), 1);
        map_id.splice(map_id.indexOf(delete_id), 1);
        map_order.splice(map_order.indexOf(delete_id), 1);

        map_list_output = btoa(unescape(encodeURIComponent(map_list.join(","))));
        setCookie("map_list", map_list_output, 30 * 365);
        map_id_output = btoa(unescape(encodeURIComponent(map_id.join(","))));
        setCookie("map_id", map_id_output, 30 * 365);
        map_order_output = btoa(unescape(encodeURIComponent(map_order.join(","))));
        setCookie("map_order", map_order_output, 30 * 365);

        setCookie(delete_id, map_order_output, -1);
        setCookie(delete_id + "_settings", map_order_output, -1);

        edit(map_list, map_id, map_order);
    }
}

function save() {
    map_length = map.length - 1;
    map_output = [];
    map_output = JSON.parse(JSON.stringify(map)); //https://www.cnblogs.com/Blogzlj/p/13031677.html
    map_output[x][y] = block;
    if (!peace.checked) {
        map_output[mob_x][mob_y] = mob_block;
    }
    map_output[map_length + 1] = word;
    map_output[map_length + 2] = color;
    map_output[map_length + 3] = passable;

    settings = [];
    settings[0] = [x, y, x_old, y_old, block, block_old];
    settings[1] = [mob_x, mob_y, mob_x_old, mob_y_old, mob_block, mob_block_old];
    settings[2] = score;
    settings[3] = ["waterrun", "grassrun", "left_main", "peace", "unmatched", "boom_power"]
    settings[4] = [waterrun.checked, grassrun.checked, left_main.checked, peace.checked, unmatched.checked, Number(document.getElementById("boom_power").value)];
    save_output = btoa(unescape(encodeURIComponent(map_output.join(";")))); //https://www.itdaan.com/blog/2014/04/22/34c1a969a1dadf56cf6767d4ae48e402.html
    save_output_settings = btoa(unescape(encodeURIComponent(settings.join(";"))));
    // window.alert(save_output);
    if (!saved_before) {
        worldname = prompt("请输入地图名称", "World");
        if (worldname != null) {
            this_map_id = map_id.length;
            map_id[map_id.length] = this_map_id.toString();
            map_order.unshift(this_map_id.toString());

            map_list[map_list.length] = worldname;
            saved_before = true;
            map_list_output = btoa(unescape(encodeURIComponent(map_list.join(","))));
            setCookie("map_list", map_list_output, 30 * 365);
            map_id_output = btoa(unescape(encodeURIComponent(map_id.join(","))));
            setCookie("map_id", map_id_output, 30 * 365);
            map_order_output = btoa(unescape(encodeURIComponent(map_order.join(","))));
            setCookie("map_order", map_order_output, 30 * 365);

            setCookie(this_map_id, save_output, 30 * 365);
            setCookie(this_map_id + "_settings", save_output_settings, 30 * 365);

            setlist(map_list, map_id, map_order);
        }
    } else {
        map_order.forEach(function(item, index, arr) {
            if (item === this_map_id.toString()) {
                arr.splice(index, 1);
            }
        });
        map_order.unshift(this_map_id.toString());

        map_list_output = btoa(unescape(encodeURIComponent(map_list.join(","))));
        setCookie("map_list", map_list_output, 30 * 365);
        map_id_output = btoa(unescape(encodeURIComponent(map_id.join(","))));
        setCookie("map_id", map_id_output, 30 * 365);
        map_order_output = btoa(unescape(encodeURIComponent(map_order.join(","))));
        setCookie("map_order", map_order_output, 30 * 365);

        setCookie(this_map_id, save_output, 30 * 365);
        setCookie(this_map_id + "_settings", save_output_settings, 30 * 365);

        setlist(map_list, map_id, map_order);
    }
}

function read(map_id_input) {
    settings_input = decodeURIComponent(escape(window.atob(getCookie(map_id_input + "_settings")))).split(";");

    this_map_id = Number(map_id_input);
    saved_before = true;

    document.getElementById('edit').style.display = "block";
    document.getElementById('exit_editing').style.display = "none";

    map_order.forEach(function(item, index, arr) {
        if (item === map_id_input.toString()) {
            arr.splice(index, 1);
        }
    });
    map_order.unshift(map_id_input.toString());

    setlist(map_list, map_id, map_order);

    for (i = 0; i < settings_input.length; i++) {
        settings_input[i] = settings_input[i].split(","); //沿","分割
    }
    for (ch = 0; ch < settings_input[3].length - 1; ch++) {
        document.getElementById(settings_input[3][ch]).checked = eval(settings_input[4][ch]);
    }
    boom_power = Number(settings_input[4][settings_input[4].length - 1]);
    document.getElementById("boom_power").value = boom_power;
    document.getElementById("power").innerText = boom_power + 1;

    if (IsPc()) {
        document.getElementById('leftmain').style.display = "block";
        document.getElementById("button").style.cssFloat = "right";
    }
    document.getElementById("in").value = decodeURIComponent(escape(window.atob(getCookie(map_id_input))));
    var ee = document.getElementById("in");
    var lines = ee.value.split(";"); //沿";"分割
    for (i = 0; i < lines.length; i++) {
        map_input[i] = lines[i].split(","); //沿","分割
    }
    for (g = 0; g < map_input.length - 3; g++) { //除去最后三行，剩下的赋值给map数组
        map[g] = map_input[g];
    }
    word = map_input[map_input.length - 3]; //倒数第三行是新的word数组
    color = map_input[map_input.length - 2]; //倒数第二行是新的color数组
    passable = map_input[map_input.length - 1]; //倒数第一行是新的passable数组

    map[x][y] = map_input[x][y];
    // map[0][0] = map_input[0][0];
    x = Number(settings_input[0][0]);
    y = Number(settings_input[0][1]);
    x_old = Number(settings_input[0][2]);
    y_old = Number(settings_input[0][3]);
    block = settings_input[0][4];
    block_old = settings_input[0][5];
    mob_x = Number(settings_input[1][0]);
    mob_y = Number(settings_input[1][1]);
    mob_x_old = Number(settings_input[1][2]);
    mob_y_old = Number(settings_input[1][3]);
    mob_block = settings_input[1][4];
    mob_block_old = settings_input[1][5];
    score = Number(settings_input[2]);
    document.getElementById("score").innerHTML = "Score:" + score;
    drawmap();

    map_order_output = btoa(unescape(encodeURIComponent(map_order.join(","))));
    setCookie("map_order", map_order_output, 30 * 365);
}

function process() { //加载导入的地图
    var ee = document.getElementById("in");
    var lines = ee.value.split(";"); //沿";"分割
    for (i = 0; i < lines.length; i++) {
        map_input[i] = lines[i].split(","); //沿","分割
    }
    for (g = 0; g < map_input.length - 3; g++) { //除去最后三行，剩下的赋值给map数组
        map[g] = map_input[g];
    }
    word = map_input[map_input.length - 3]; //倒数第三行是新的word数组
    color = map_input[map_input.length - 2]; //倒数第二行是新的color数组
    passable = map_input[map_input.length - 1]; //倒数第一行是新的passable数组

    x = 0; //“人”回到初始位置
    y = 0;

    block = map_input[0][0];
    mob_block = map_input[mob_x][mob_y];

    drawmap_base();
}