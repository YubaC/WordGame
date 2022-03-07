function IsPc() { //是PC→false，是移动端→true
    let userAgent = navigator.userAgent,
        Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    console.log('userAgent:', userAgent)
    return Agents.some((i) => {
        return userAgent.includes(i)
    })
}

// 判断元素是否在数组内的函数，使用方法：contains(Array，元素)，返回true或false
function contains(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}

// cookie操作
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getOs() { //浏览器类型判定
    if (navigator.userAgent.indexOf("MSIE") > 0) {
        return "IE"; //InternetExplor
    } else if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) {
        return "FF"; //firefox
    } else if (isSafari = navigator.userAgent.indexOf("Safari") > 0) {
        return "SF"; //Safari
    } else if (isCamino = navigator.userAgent.indexOf("Camino") > 0) {
        return "C"; //Camino
    } else if (isMozilla = navigator.userAgent.indexOf("Gecko/") > 0) {
        return "G"; //Gecko
    } else if (isMozilla = navigator.userAgent.indexOf("Opera") >= 0) {
        return "O"; //opera
    } else {
        return 'Other';
    }
}

function browser_alert() { //如果是微信或者QQ或者新浪微博内置的浏览器就提醒
    var browser = {
        versions: function() {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return { //移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }

    if (browser.versions.mobile) { //判断是否是移动设备打开。browser代码在下面
        var ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
        if (ua.match(/MicroMessenger/i) == "micromessenger") { //在微信中打开
            window.alert("您正在使用微信内置的浏览器，将无法进行存档，如需存档请在浏览器里打开本网页！");
        }
        if (ua.match(/WeiBo/i) == "weibo") { //在新浪微博客户端打开
            window.alert("您正在使用新浪微博客户端内置的浏览器，将无法进行存档，如需存档请在浏览器里打开本网页！");
        }
        if (ua.match(/QQ/i) == "qq") { //在QQ空间打开
            window.alert("您正在使用QQ内置的浏览器，将无法进行存档，如需存档请在浏览器里打开本网页！");
        }
    }
}