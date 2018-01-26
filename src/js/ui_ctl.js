function change_mode_icon() {
    if ($("#mode_icon").hasClass("tv")) {
        $("#mode_icon").removeClass("tv")
        $("#mode_icon").addClass("sticky note")
    }
    else {
        $("#mode_icon").removeClass("sticky note")
        $("#mode_icon").addClass("tv")
    }
}

function change_pres_ratio(ratio, pres_renderer) {
    pres_renderer.ratio = ratio;
    pres_renderer.scalePres();
}

function change_pres_trans_mode(trans_mode, pres_renderer) {
    pres_renderer.trans_mode = trans_mode;
}

function enter_fullscreen(pres_renderer) {
    requestFullScreen(document.documentElement);
    pres_renderer.renderPresbyMD("fullscreen");
    pres_renderer.showPage(pres_renderer.cur_page, true);
    $('.fullscreen_box').transition('fade');
}

function requestFullScreen(element) {
    var requestMethod = element.requestFullScreen || //W3C
        element.webkitRequestFullScreen || //Chrome
        element.mozRequestFullScreen || //FireFox
        element.msRequestFullScreen; //IE11
    if (requestMethod) {
        requestMethod.call(element);
    }
    else if (typeof window.ActiveXObject !== "undefined") {
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

function exitFull() {
    if (is_fullscreen) {
        $('.fullscreen_box').transition("fade");
        is_fullscreen = !is_fullscreen;
        pres_renderer.renderPresbyMD("md");
        pres_renderer.showPage(pres_renderer.cur_page, true);
        $("#pres_box").transition('fade down');
        is_norm_mode = false;

    }
}

function exitHandler()
{
    if (document.webkitIsFullScreen === false)
    {
        exitFull(); 
    }
    else if (document.mozFullScreen === false)
    {
        exitFull();
    }
    else if (document.msFullscreenElement === false)
    {
        exitFull();
    }
}