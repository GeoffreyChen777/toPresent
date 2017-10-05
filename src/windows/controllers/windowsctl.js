const { ipcMain } = require('electron');
const path = require('path');
const url = require('url');

window.onload = function () {
    drag();
}

function PresSize() {
    var init_box = $("#init_size_box");
    var h1 = $("<page><h1>1</h1></page>");
    init_box.append(h1);
    this.h1 = init_box.find("h1").css("font-size");

    var h2 = $("<page><h2>1</h2></page>");
    init_box.append(h2);
    this.h2 = init_box.find("h2").css("font-size");

    var h3 = $("<page><h3>1</h3></page>");
    init_box.append(h3);
    this.h3 = init_box.find("h3").css("font-size");

    var p = $("<page><p>1</p></page>");
    init_box.append(p);
    this.p = init_box.find("p").css("font-size");


    var li = $("<page><li>1</li></page>");
    init_box.append(li);
    this.li = init_box.find("li").css("font-size");

};

var origin_size = new PresSize();


var preview_mode = false;
var cur_page = 0;
var max_page = 0;
var origin_page_width = 0;

origin_page_width = $("#md_preview").width();
// try to resize pres holder

function resizeHolder() {
    try {
        $("#holder_box").height(($("#md_preview").height() - $("#page1").height()) / 2);

        scaleFont($("#md_preview").width() / origin_page_width, origin_size);
    } catch (e) {

    }
}


// set preview mode btn event

function setPageNum() {
    var pagenum = 0;
    $('#pres_box > page').each(function () {
        $(this).attr('id', 'page' + pagenum);
        pagenum++;
    });
    max_page = pagenum - 1;
}

function renderNormMD() {
    marked.setOptions({
        renderer: norm_renderer
    });
    $("#md_preview").empty();
    document.getElementById('md_preview').innerHTML =
        marked(editor.getValue());
}

function renderPreMD() {
    marked.setOptions({
        renderer: pres_renderer
    });
    $("#md_preview").empty();
    var $pres_box = $("<div id='pres_box'></div>");

    var $holder_box = $("<div id='holder_box'></div>");

    $("#md_preview").append($holder_box);
    $("#md_preview").append($pres_box);
    document.getElementById('pres_box').innerHTML =
        marked(editor.getValue());

    setPageNum();
    resizeHolder();
}

var close_btn = document.getElementById("close_btn");
var max_btn = document.getElementById("max_btn");
var min_btn = document.getElementById("min_btn");
close_btn.onclick = function () {
    console.log("close");
    remote.BrowserWindow.getFocusedWindow().close();
}
var isBig = false;
max_btn.onclick = function () {
    if (isBig) {
        remote.BrowserWindow.getFocusedWindow().maximize();
    } else {
        remote.BrowserWindow.getFocusedWindow().unmaximize();
    }
    isBig = !isBig;
}
min_btn.onclick = function () {
    remote.BrowserWindow.getFocusedWindow().minimize();
    console.log("min");
}
editor.on("change", function () {
    if (!preview_mode) {
        renderNormMD();
    } else {
        renderPreMD();

        showPage(cur_page, cur_page);
    }
});

function showPage(old_page_num, new_page_num) {
    if (new_page_num < 0)
        new_page_num = 0;
    if (new_page_num > max_page)
        new_page_num = max_page;
    $("#page" + old_page_num).css("visibility", "hidden");
    $("#page" + new_page_num).css("visibility", "visible");
    cur_page = new_page_num;
}

function setPresKeyEvent() {
    $(document).on('keydown', function (event) {
        var keyNum = event.which; //获取键值
        switch (keyNum) { //判断按键
            case 37:
                {
                    console.log(cur_page);
                    showPage(cur_page, cur_page - 1);
                    break;
                }
            case 38:
                {
                    console.log(cur_page);
                    showPage(cur_page, cur_page - 1);
                    break;
                }
            case 39:
                {
                    console.log(cur_page);
                    showPage(cur_page, cur_page + 1);
                    break;
                }
            case 40:
                {

                    console.log(cur_page);
                    showPage(cur_page, cur_page + 1);
                    break;
                }
            default:
                break;

        }
    });
}

function unsetPresKeyEvent() {
    console.log("unSet");
    $(document).off("keydown");
}

$("#preview_mode_btn").click(function (event) {

    if (!preview_mode) {
        renderPreMD();
        showPage(0, 0);

    } else {
        renderNormMD();
        unsetPresKeyEvent();
    }
    preview_mode = !preview_mode;

});

// bind pres key event
$("page").click(function (event) {
    setPresKeyEvent();
});
$("textarea").focus(function (event) {
    unsetPresKeyEvent();
});

$("textarea").blur(function (event) {
    for (var key in $(document).eventList) {
        if (key === "keydown") {
            return;
        }
    }
    setPresKeyEvent();

});
// preview window scroll follow editor window

editor.on("scroll", function () {
    var scrollInfo = editor.getScrollInfo();
    var per = scrollInfo.top / (scrollInfo.height - scrollInfo.clientHeight);

    var scrollTo = per * ($("#md_preview")[0].scrollHeight - $("#md_preview").height());
    $("#md_preview").animate({
        scrollTop: scrollTo
    }, 0, 'swing');
})

window.addEventListener('resize', function (e) {
    console.log("resize");
    var right_panel_width = $("#main_panel").width() - $("#left_panel").width();
    $("#right_panel").width(right_panel_width);
    resizeHolder();
})

const ipc = require('electron').ipcRenderer;

$("#pres_play_btn").click(function (event) {
    let Data = {
        md: editor.getValue(),
        origin_font_size: origin_size,
        origin_page_width: origin_page_width
    };

    ipc.send('pres-show', Data);
});

