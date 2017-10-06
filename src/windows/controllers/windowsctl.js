const path = require('path');
const url = require('url');
const ipc = require('electron').ipcRenderer;
const fs = require("fs");
window.onload = function () {
    drag();
}

var save_flag;
var origin_file_path = "";
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
    $("#md_preview"),
    editor);

var ori_pres_style = present.getOriPresSize();
var origin_page_width = present.getOriPresWidth();
var ifExit = false;

var close_btn = $("#close_btn");
var max_btn = $("#max_btn");
var min_btn = $("#min_btn");

close_btn.click(function () {
    if (editor.isClean(save_flag)) {
        remote.BrowserWindow.getFocusedWindow().close();
    } else {
        ifExit = true;
        ipc.send('open-if-save-dialog');
    }

    save_flag = editor.changeGeneration();
})

function saveFile(path, md_string) {
    try {
        fs.writeFileSync(path, md_string);
        save_flag = editor.changeGeneration();
    } catch (error) {
        console.log("Save File Error");
    }
}

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
    if (!present.preview_mode) {
        norm.renderNormbyMD(editor.getValue());
    } else {
        present.renderPrebyMD();
        present.showPage(present.cur_page, present.cur_page);
    }
});

editor.on("cursorActivity", function () {
    if (present.preview_mode && present.pageIndex.length >= 2) {
        var cursor = editor.getCursor();
        var line = cursor.line;
        for (var i = 1; i < present.pageIndex.length; i++) {
            if (present.pageIndex[i].line > line) {
                present.showPage(-1, i - 1);
                console.log("showpage:" + i);
                break;
            } else if (i == present.pageIndex.length - 1) {
                present.showPage(-1, i);
            }
        }
    }
});

function setPresKeyEvent() {
    $(document).on('keydown', function (event) {
        var keyNum = event.which; //获取键值
        switch (keyNum) { //判断按键
            case 37:
                {
                    present.showPage(present.cur_page, present.cur_page - 1);
                    break;
                }
            case 38:
                {
                    present.showPage(present.cur_page, present.cur_page - 1);
                    break;
                }
            case 39:
                {
                    present.showPage(present.cur_page, present.cur_page + 1);
                    break;
                }
            case 40:
                {
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

    console.log(present.preview_mode);
    if (!present.preview_mode) {

        console.log("pre");
        present.renderPrebyMD();
        present.showPage(0, 0);

    } else {
        norm.renderNormbyMD(editor.getValue());
        unsetPresKeyEvent();
    }
    present.preview_mode = !present.preview_mode;

});

// bind pres key event
$("page").click(function (event) {
    console.log("set");
    setPresKeyEvent();
});
$("textarea").focus(function (event) {
    unsetPresKeyEvent();
    console.log("unset");
});

$("textarea").blur(function (event) {
    for (var key in $(document).eventList) {
        if (key === "keydown") {
            return;
        }
    }
    setPresKeyEvent();
    console.log("set");
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
    } else {
        alert("Nothing to show!");
    }
});

var menu = $("#menu_btn").PopupLayer({
    to: 'right',
    blur: true,
    screenRatio: 0.0,
    heightOrWidth: 350,
    color: "#000",
    backgroundColor: "#fff",
    content: "<div id='menu_title'>TO PRESENT</div><div id='menu_box'>\
    <div class='menu_item' id='open_file'>Open File</div>\
    <div class='menu_item' id='save_file'>Save File</div></div>"
});

$("#open_file").click(function () {
    ipc.send('open-file-dialog');
});

$("#save_file").click(function () {
    if (origin_file_path != "") {
        saveFile(origin_file_path, editor.getValue());
    } else {
        ipc.send('save-dialog');
    }
    $(".popup-layer").click();
});


ipc.on('selected-directory', function (event, path) {
    fs.readFile(path[0], function (err, data) {
        if (err) {
            return console.error(err);
        }

        editor.setValue(data.toString());
        save_flag = editor.changeGeneration();
    });
    $(".popup-layer").click();
    origin_file_path = path[0];
});

ipc.on('if-save-dialog-selection', function (event, index) {
    if (index === 0) {
        if (origin_file_path != "") {
            saveFile(origin_file_path, editor.getValue());
            if (ifExit) remote.BrowserWindow.getFocusedWindow().close();
        } else {
            ipc.send('save-dialog');
        }
    } else {
        remote.BrowserWindow.getFocusedWindow().close();
    }
});

ipc.on('saved-file', function (event, path) {
    if (!path) path = './.md.md'
    console.log(path);
    saveFile(path, editor.getValue());
    if (ifExit) remote.BrowserWindow.getFocusedWindow().close();
})