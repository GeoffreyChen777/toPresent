function setPreviewKeyEvent(pres_renderer) {
    $(document).on('keydown', function (event) {
        var keyNum = event.which;
        switch (keyNum) {
            case 37:
                {
                    pres_renderer.changePage(pres_renderer.cur_page, pres_renderer.cur_page - 1, 'fade');
                    break;
                }
            case 38:
                {
                    pres_renderer.changePage(pres_renderer.cur_page, pres_renderer.cur_page - 1, 'fade');
                    break;
                }
            case 39:
                {
                    pres_renderer.changePage(pres_renderer.cur_page, pres_renderer.cur_page + 1, 'fade');
                    break;
                }
            case 40:
                {
                    pres_renderer.changePage(pres_renderer.cur_page, pres_renderer.cur_page + 1, 'fade');
                    break;
                }
            default:
                break;

        }
    });
}

function unsetKeyEvent() {
    $(document).off("keydown");
}
