function PresentRenderer(init_box, md_pre, fullscreen_preview, editor) {
    // Constructor
    this.ratio = 9 / 16;

    this.editor = editor;

    this.orinSize = new Object();
    this.orinSize.h1 = null;
    this.orinSize.h2 = null;
    this.orinSize.h3 = null;
    this.orinSize.h4 = null;
    this.orinSize.p = null;
    this.orinSize.li = null;

    this.orin_pres_width = 745;

    this.md_preview = md_pre;
    this.fullscreen_preview = fullscreen_preview;

    this.holder_box = new Object();

    this.max_page = 0;
    this.cur_page = 0;

    this.pres_marked = marked;
    this.pres_renderer = new this.pres_marked.Renderer();

    this.trans_mode = 'fade';

    this.pageIndex = new Array();

    //==============================================================================================

    // return width of presentation box.
    this.getOriPresWidth = function () {
        return this.orin_pres_width;
    }

    // return origin prestention style size.
    this.getOriPresSize = function () {
        return this.orinSize;
    };

    //scale presentation font.
    this.scaleFont = function () {
        scale_ratio = $("#pres_box").width() / this.orin_pres_width;

        $(".page>h1").css("font-size", parseFloat(this.orinSize.h1) * scale_ratio + "px");

        $(".page>h2").css("font-size", parseFloat(this.orinSize.h2) * scale_ratio + "px");

        $(".page>h3").css("font-size", parseFloat(this.orinSize.h3) * scale_ratio + "px");

        $(".page>h4").css("font-size", parseFloat(this.orinSize.h4) * scale_ratio + "px");

        $(".page>p").css("font-size", parseFloat(this.orinSize.p) * scale_ratio + "px");

        $(".page>ul>li").css("font-size", parseFloat(this.orinSize.li) * scale_ratio + "px");

    }

    // Create marked obj by presentation renderer
    this.createPresRenderer = function () {
        this.pres_renderer.heading = function (text, level, raw) {
            if (level == 1 && text == "ps") {
                return "<page class='page'>"
            }
            if (level == 1 && text == "sp") {
                return "</page><page class='page'>"
            }
            if (level == 1 && text == "pe") {
                return "</page>"
            }
            if (level == 1 && (text == "/ps" || text == "/ps" || text == "/ps")) {
                return '<h' +
                    level +
                    ' id="' +
                    this.options.headerPrefix +
                    raw.toLowerCase().replace(/[^\w]+/g, '-') +
                    '">' +
                    text.replace("/", "") +
                    '</h' +
                    level +
                    '>\n';
            }
            return '<h' +
                level +
                ' id="' +
                this.options.headerPrefix +
                raw.toLowerCase().replace(/[^\w]+/g, '-') +
                '">' +
                text +
                '</h' +
                level +
                '>\n';
        };
    }

    this.createPresMarked = function () {
        this.pres_marked.setOptions({
            renderer: this.pres_renderer,
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false
        });
    }
    this.createPresRenderer();
    this.createPresMarked();

    // Create page index
    this.createPageIndex = function () {
        this.pageIndex.splice(0, this.pageIndex.length);
        var startcursor = this.editor.getSearchCursor("# ps");
        if (startcursor.findNext()) {
            var page = new Object();
            var from = startcursor.from();
            page.line = from.line;
            this.pageIndex.push(page);
        } else {
            return false;
        }
        var pagecursor = this.editor.getSearchCursor("# sp");
        while (pagecursor.findNext()) {
            var page = new Object();
            var from = pagecursor.from();
            page.line = from.line;
            this.pageIndex.push(page);
        }
    }

    // Render Presentation by markdown
    this.renderPresbyMD = function (mode) {
        $('.h1:first-child').css('margin-top', '');
        this.createPageIndex();
        this.md_preview.empty();
        this.fullscreen_preview.empty();

        var $pres_box = $("<div class='ui grid nomargin pres_grid'><div class='centered row'><div id='pres_column' class='middle aligned nopadding column'><div id='pres_box'></div></div></div></div>");
        if(mode == "md"){
            this.md_preview.append($pres_box);
        }
        else{
            this.fullscreen_preview.append($pres_box)
        }
        this.pres_marked.setOptions({
            renderer: this.pres_renderer
        })
        $("#pres_box").html(this.pres_marked(this.editor.getValue()));

        var pagenum = 0;
        $('#pres_box > page').each(function () {
            $(this).attr('id', 'page' + pagenum);
            pagenum++;
        });
        this.max_page = pagenum - 1;
        this.scalePres();
        this.md_preview.css("overflow-y", "hidden");
        this.fullscreen_preview.css("overflow-y", "hidden");
    }


    this.scalePres = function () {
        $("#pres_box").css("width", "");
        $("#pres_box").css("height", "");

        if($(".pres_grid").height()/$(".pres_grid").width() >= this.ratio){
            $("#pres_column").addClass("hperwidth");
            $("#pres_box").css("width", "100%");
            $("#pres_box").height($(".pres_grid").width() * this.ratio);
        } 
        else{
            $("#pres_column").addClass("hperheight");
            $("#pres_box").css("height", "100%");
            $("#pres_box").width($(".pres_grid").height() / this.ratio); 
        }
        this.scaleFont();
    }

    this.pagetrans = function (page_num, trans_type) {
        if (trans_type) {
            $("#page" + page_num).transition(this.trans_mode);
        }
        else {
            if ($("#page" + page_num).transition("is visible")) {
                $("#page" + page_num).transition("hide");
            } else {
                $("#page" + page_num).transition("show");
            };
        }
    }
    // Show page by pagenum
    this.changePage = function (old_page_num, new_page_num, trans_type) {

        if (new_page_num < 0 || new_page_num > this.max_page || old_page_num == new_page_num)
            return;
        this.pagetrans(old_page_num, trans_type)
        $("#page" + old_page_num).css("display", "none");
        $("#page" + new_page_num).css("display", "block");
        this.pagetrans(new_page_num, trans_type)
        this.cur_page = new_page_num;
    }

    this.showPage = function (page_num, trans_type){
        this.pagetrans(page_num, trans_type)
        $("#page" + page_num).css("display", "block");
    }

    this.hasPage = function (md_string) {
        this.pres_marked.setOptions({
            renderer: this.pres_renderer
        })
        var html = $(this.pres_marked(md_string));
        console.log(html);
        if (html.is('page')) {
            return true;
        } else {
            return false;
        }
    }

    this.getPageHTML = function () {
        this.pres_marked.setOptions({
            renderer: this.pres_renderer
        });
        this.cur_page = new_page_num;
    }

    this.hasPage = function (md_string) {
        this.pres_marked.setOptions({
            renderer: this.pres_renderer
        })
        var html = $(this.pres_marked(md_string));
        console.log(html);
        if (html.is('page')) {
            return true;
        } else {
            return false;
        }
    }

    this.getPageHTML = function () {
        var $pres_box = "<div id='pres_box'></div>"
        this.pres_marked.setOptions({
            renderer: this.pres_renderer
        });
        return "<div id='pres_box'>" + this.pres_marked(this.editor.getValue()) + "</div>";
    }

};