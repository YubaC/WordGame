document.getElementById('exit_editing').style.display = "none";

if (!IsPc()) { //是PC端
    document.getElementById("boom").style.marginTop = '10px';
    document.getElementById("down").style.marginBottom = '10px';
    document.getElementById('leftmain').style.display = "none";
} else { //是移动端
    document.getElementById('leftmain').style.display = "block";
    document.getElementById("button").style.cssFloat = "right";
}

function ischeck(e) { //惯用左手
    if (e.checked) {
        document.getElementById("button").style.cssFloat = "left";
    } else {
        document.getElementById("button").style.cssFloat = "right";
    }
}

function map_list_show() {
    document.getElementById('editor').style.display = "block";
    document.getElementById('map_list_show').style.display = "none";
    document.getElementById('map_list_hide').style.display = "block";
}

function map_list_hide() {
    document.getElementById('editor').style.display = "none";
    document.getElementById('map_list_show').style.display = "block";
    document.getElementById('map_list_hide').style.display = "none";
}

function show() { //显示地图组件
    document.getElementById('show').style.display = "none";
    document.getElementById('hide').style.display = "block";
}

function hide() { //隐藏地图组件
    document.getElementById('show').style.display = "block";
    document.getElementById('hide').style.display = "none";
}

function boompowerchange() {
    boom_power = Number(document.getElementById("boom_power").value);
    document.getElementById("power").innerText = boom_power + 1;
}