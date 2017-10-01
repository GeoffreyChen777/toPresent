window.onload = function () {
    drag();
}

function renderMD() {
    document.getElementById('md_preview').innerHTML =
        marked(editor.getValue());
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
    renderMD();
});


// set preview mode btn event

function setPageNum() {
    var pagenum = 0;
    $('#md_preview > page').each(function () {
        $(this).attr('id', 'page' + pagenum);
        pagenum ++;
    });
}

var preview_mode = false;
$("#preview_mode_btn").click(function (event) {
    console.log("click");
    if (!preview_mode) {
        marked.setOptions({
            renderer: pres_renderer
        });
        renderMD();
        setPageNum();
    } else {
        marked.setOptions({
            renderer: norm_renderer
        });
        renderMD();
    }
    preview_mode = !preview_mode;

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