is_norm_mode = true;
is_fullscreen = false;


norm_renderer = new NormRenderer($("#main_preview"), editor);
pres_renderer = new PresentRenderer(
    $("#init_size_box"),
    $("#main_preview"),
    $("#fullscreen_preview"),
    editor);

main_config = new Object();

read_config("./src/default_settings.json", pres_renderer);


editor.on("change", function () {
    render(false);
});

editor.on("scroll", function () {
    var scrollInfo = editor.getScrollInfo();
    var per = scrollInfo.top / (scrollInfo.height - scrollInfo.clientHeight);
    var scrollTo = per * ($("#main_preview")[0].scrollHeight - $("#main_preview").height());
    $("#main_preview").animate({
        scrollTop: scrollTo
    }, 0, 'swing');
});

function render(change_mode) {
    if (change_mode) {
        is_norm_mode = !is_norm_mode;
    }
    if (!is_norm_mode) {
        pres_renderer.renderPresbyMD("md");
        if (change_mode) {
            pres_renderer.showPage(pres_renderer.cur_page, true);
            $("#pres_box").transition('fade down');
        }
        else {
            pres_renderer.showPage(pres_renderer.cur_page, false);
            $("#pres_box").css("visibility", "visible");
        }
    }
    else {
        norm_renderer.renderNormbyMD();
    }
};

$("#pres_mode").on("click", function () {
    change_mode_icon();
    render(true);
})

window.onresize = function () {
    if (!is_norm_mode || is_fullscreen) {
        pres_renderer.scalePres()
    }
}

$("textarea").focus(function (event) {
    unsetKeyEvent();
});

$("textarea").blur(function (event) {
    for (var key in $(document).eventList) {
        if (key === "keydown") {
            return;
        }
    }
    setPreviewKeyEvent(pres_renderer);
});

editor.on("cursorActivity", function () {
    if (!is_norm_mode && pres_renderer.pageIndex.length >= 2) {
        var cursor = editor.getCursor();
        var line = cursor.line;
        for (var i = 1; i < pres_renderer.pageIndex.length; i++) {
            if (pres_renderer.pageIndex[i].line > line) {
                pres_renderer.changePage(pres_renderer.cur_page, i - 1, true);
                break;
            } else if (i == pres_renderer.pageIndex.length - 1) {
                pres_renderer.changePage(pres_renderer.cur_page, i, true);
            }
        }
    }
});

$("#ratio_sixteenbynine").on("click", function (event) {
    $(this).transition('pulse');
    change_pres_ratio(9 / 16, pres_renderer);
})

$("#ratio_fourbythree").on("click", function (event) {
    $(this).transition('pulse');
    change_pres_ratio(3 / 4, pres_renderer);
})

$("#transitions_fade").on("click", function (event) {
    $(this).transition('pulse');
    change_pres_trans_mode("fade", pres_renderer);
})

$("#transitions_drop").on("click", function (event) {
    $(this).transition('pulse');
    change_pres_trans_mode("drop", pres_renderer);
})

$("#transitions_flip").on("click", function (event) {
    $(this).transition('pulse');
    change_pres_trans_mode("horizontal flip", pres_renderer);
})

$("#style_setting_btn").on("click", function (event) {
    $(this).transition('pulse');
    $('#style_setting_modal').modal('show');
})

$("#play_btn").on("click", function (event) {
    enter_fullscreen(pres_renderer);
    is_fullscreen = !is_fullscreen;
})

$("#setting-save-btn").on("click", function (event) {
    save_setting_ui(main_config);
    set_ori_font_size(main_config, pres_renderer);
    pres_renderer.scaleFont();
    parse_config(main_config, pres_renderer);
})

var item = ["h1", "h2", "h3", "h4", "p", "li"]

item.forEach(function (e) {
    $("#setting-" + e + "-text-align-left").on("click", function (event) {
        $("#setting-" + e + "-text-align").html($(this).html());
    })
    $("#setting-" + e + "-text-align-right").on("click", function (event) {
        $("#setting-" + e + "-text-align").html($(this).html());
    })
    $("#setting-" + e + "-text-align-center").on("click", function (event) {
        $("#setting-" + e + "-text-align").html($(this).html());
    })
    $("#setting-" + e + "-text-align-justify").on("click", function (event) {
        $("#setting-" + e + "-text-align").html($(this).html());
    })
});

// import setting from file
$("#setting-import-file-btn").on("click", function () {
    console.log($("#setting-import-id").val());
    if ($("#setting-import-id").val() != "") {
        $("#setting-file-import").click();
    }
    else{
        $("#setting-import-id").transition('bounce');
    }

});

$("#setting-file-import").on('change', function () {
    var files = $(this).get(0).files;

    if (files.length > 0) {
        // create a FormData object which will be sent as the data payload in the
        // AJAX request
        var formData = new FormData();

        // loop through all the selected files and add them to the formData object
        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            // add the files to formData object for the data payload
            formData.append('upload_file', file, file.name);
            formData.append('id', $("#setting-import-id").val());
        }

        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                parse_file_response(data);
            }
        }, false);
    }
});

$(".close.icon").click(function(){
    $(this).parent().hide();
  });

function parse_file_response(res){
    res = $.parseJSON(res);
    console.log(res.data);
    if(res.flag == "true"){
        $("#setting-handler-positive-message-content").html("Import setting from file successfully!");
        $("#setting-handler-positive-message").show();
        set_default_config(res.data, pres_renderer);
    }
    else{
        $("#setting-handler-warning-message-content").html("Can not import setting from file, please try to download from server or check your setting file!");
        $("#setting-handler-warning-message").show();
    }
}

// import file from server

$("#setting-import-server-btn").on("click", function () {
    if ($("#setting-import-id").val() != "") {
        var id = {id:$("#setting-import-id").val()};
        $.get("/download", id, function (data) {
            parse_server_response(data);
        })
    }
    else{
        $("#setting-import-id").transition('bounce');
    }
    
})

function parse_server_response(res){
    console.log(res);
    if(res["flag"] == "true"){
        $("#setting-handler-positive-message-content").html("Download setting from server successfully!");
        $("#setting-handler-positive-message").show();
        set_default_config($.parseJSON(res.data.style), pres_renderer);
        
    }
    else{
        $("#setting-handler-warning-message-content").html("Can not download setting from server, please try to import from file or check your id!");
        $("#setting-handler-warning-message").show();
    }
}

// export to file

function downloadFile(aLink, fileName, content){
    aLink.attr("download", fileName);
    aLink.attr("href", "data:text/plain," + content);
    aLink[0].click();
}

$("#setting-export-btn").on("click", function(){
    var str = encode_setting(main_config);
    downloadFile($("#setting-download-a"), "config.json", str);
})

$("#menu-download-html-btn").on("click", function () {
    var send_data = {
        style:$("#pres_css").html(),
        content:pres_renderer.getPageHTML(),
        ratio:pres_renderer.ratio,
        trans:pres_renderer.trans_mode
    };
    $.get("/output", send_data, function (data) {
        downloadFile($("#setting-download-a"), "presentation.html", data);
    })
})