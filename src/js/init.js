var editor = CodeMirror.fromTextArea(document.getElementById("input_field"), {
    mode: "markdown",
    lineNumbers: true,
    theme: "neo",
    lineWrapping: "true"
});

$(".title_btn").on("mouseover mouseout", function (event) {
    if (event.type == "mouseover") {
        $(this).css("background", "#2E2E2F")
    } else if (event.type == "mouseout") {
        $(this).css("background", "#1C1C1D")
    }
})

$(".title_btn").on("click", function (event) {
    $(this).transition('pulse')
})

$('.ui.checkbox').checkbox();

$('.ui.accordion').accordion();

if (document.addEventListener)
{
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
}