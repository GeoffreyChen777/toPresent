const path = require('path');
const url = require('url');
const ipc = require('electron').ipcRenderer;

window.onload = function () {
    drag();
}

var preview_mode = false;
var cur_page = 0;
var max_page = 0;

var editor = CodeMirror.fromTextArea(document.getElementById("md_input"), {
    mode: "markdown",
    lineNumbers: true,
    theme: "neo",
    lineWrapping: "true",
    scrollbarStyle: "simple"
});

norm = new Normmd($("#md_preview"));

present = new Present(
    $("#init_size_box"),
    $("#md_preview"),
    $("#md_preview"));

var ori_pres_style = present.getOriPresSize();
var origin_page_width = present.getOriPresWidth();


var close_btn = $("#close_btn");
var max_btn = $("#max_btn");
var min_btn = $("#min_btn");

close_btn.click(function () {
    console.log("close");
    remote.BrowserWindow.getFocusedWindow().close();
})

var isBig = false;

max_btn.click(function () {
    if (isBig) {
        remote.BrowserWindow.getFocusedWindow().maximize();
    } else {
        remote.BrowserWindow.getFocusedWindow().unmaximize();
    }
    isBig = !isBig;
})

min_btn.click(function () {
    remote.BrowserWindow.getFocusedWindow().minimize();
    console.log("min");
})

editor.on("change", function () {
    if (!preview_mode) {
        norm.renderNormbyMD(editor.getValue());
    } else {
        present.renderPrebyMD(editor.getValue());

        present.showPage(present.cur_page, present.cur_page);
    }
});

function setPresKeyEvent() {
    $(document).on('keydown', function (event) {
        var keyNum = event.which; //获取键值
        switch (keyNum) { //判断按键
            case 37:
                {
                    console.log(cur_page);
                    present.showPage(present.cur_page, present.cur_page - 1);
                    break;
                }
            case 38:
                {
                    console.log(cur_page);
                    present.showPage(present.cur_page, present.cur_page - 1);
                    break;
                }
            case 39:
                {
                    console.log(cur_page);
                    present.showPage(present.cur_page, present.cur_page + 1);
                    break;
                }
            case 40:
                {

                    console.log(cur_page);
                    present.showPage(present.cur_page, present.cur_page + 1);
                    break;
                }
            default:
                break;

        }
    });
}

function unsetPresKeyEvent() {
    $(document).off("keydown");
}

$("#preview_mode_btn").click(function (event) {

    if (!preview_mode) {
        present.renderPrebyMD(editor.getValue());
        present.showPage(0, 0);

    } else {
        norm.renderNormbyMD(editor.getValue());
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
    present.onPresResize();
})

$("#pres_play_btn").click(function (event) {
    if (present.hasPage(editor.getValue())) {
        let Data = {
            md: editor.getValue(),
            origin_font_size: present.orinSize,
            origin_page_width: present.orin_pres_width
        };
        ipc.send('pres-show', Data);
    }else{
        alert("Nothing to show!");
    }
});