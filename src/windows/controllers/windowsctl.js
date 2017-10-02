window.onload = function () {
    drag();
}

var cur_page = 0;
var max_page = 0;

// try to resize pres holder

function resizeHolder() {
    try {
        $("#holder_box").height(($("#md_preview").height() - $("#page1").height()) / 2);
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
    renderNormMD();
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

var preview_mode = false;
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
    for (var key in $(document).eventList)
    {
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
    resizeHolder();
})