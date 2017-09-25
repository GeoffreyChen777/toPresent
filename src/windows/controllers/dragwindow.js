var offsetLeft, offsetTop, timer, mouse_x, mouse_y, margin_left, margin_top;
var to_x, to_y;

function drag() {
    var center_line = document.getElementById("center_line");
    document.onmousemove = function (e) {
        var e = e || window.event;
        mouse_x = e.pageX;
        mouse_y = e.pageY;
    };
    center_line.onmousedown = function () {    
        offsetLeft = center_line.offsetLeft;
        offsetTop = center_line.offsetTop;
        margin_top = mouse_y - offsetTop;
        margin_left = mouse_x - offsetLeft;
        timer = setInterval(function () {
            if (timer) {
                var main_panel_w = document.getElementById("main_panel").offsetWidth;
                var max_with = main_panel_w * 3 / 4, min_width = main_panel_w * 1 / 4, max_height = 600;
                left_width = mouse_x - margin_left;
                left_width = Math.min(left_width, max_with);
                left_width = Math.max(left_width, min_width);
                center_line.style.left = left_width + "px";

                right_width = main_panel_w - left_width;
                document.getElementById("left_panel").style.width = left_width + "px";
                document.getElementById("right_panel").style.width = right_width + "px";
            }
        }, 5);
    };
    document.onmouseup = function () {
        clearInterval(timer);
        timer = 0;
    }
}