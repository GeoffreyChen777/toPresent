function Present(init_box, pres_box, md_pre) {
    // Constructor
    this.orinSize = new Object();
    var h1 = $("<page><h1>1</h1></page>");
    init_box.append(h1);
    this.orinSize.h1 = init_box.find("h1").css("font-size");

    var h2 = $("<page><h2>1</h2></page>");
    init_box.append(h2);
    this.orinSize.h2 = init_box.find("h2").css("font-size");

    var h3 = $("<page><h3>1</h3></page>");
    init_box.append(h3);
    this.orinSize.h3 = init_box.find("h3").css("font-size");

    var p = $("<page><p>1</p></page>");
    init_box.append(p);
    this.orinSize.p = init_box.find("p").css("font-size");

    var li = $("<page><li>1</li></page>");
    init_box.append(li);
    this.orinSize.li = init_box.find("li").css("font-size");

    this.orin_pres_width = pres_box.width();

    this.md_preview = md_pre;

    this.holder_box = new Object();

    this.max_page = 0;
    this.cur_page = 0;

    this.pres_marked = require('marked');
    this.pres_renderer = new this.pres_marked.Renderer();
    //==============================================================================================

    // return width of presentation box.
    this.getOriPresWidth = function () {
        return this.orin_pres_width;
    }

    // return origin prestention style size.
    this.getOriPresSize = function () {
        return this.orin_pres_width;
    };

    //scale presentation font.
    this.scaleFont = function (scale) {

        $("page>h1").css("font-size", parseFloat(this.orinSize.h1) * scale + "px");

        $("page>h2").css("font-size", parseFloat(this.orinSize.h2) * scale + "px");

        $("page>h3").css("font-size", parseFloat(this.orinSize.h3) * scale + "px");

        $("page>p").css("font-size", parseFloat(this.orinSize.p) * scale + "px");

        $("page>ul>li").css("font-size", parseFloat(this.orinSize.li) * scale + "px");

    }

    // To resize holder and scale font when presentation box is resizing.
    this.onPresResize = function () {
        try {
            this.holder_box.height((this.md_preview.height() - $("#page0").height()) / 2);
            this.scaleFont(this.md_preview.width() / this.orin_pres_width);
        } catch (e) {
            console.log("[X] Can not resize holder and font size.");
        }
    }

    // Create marked obj by presentation renderer
    this.createPresRenderer = function () {
        this.pres_renderer.heading = function (text, level, raw) {
            if (level == 1 && text == "ps") {
                return "<page>"
            }
            if (level == 1 && text == "sp") {
                return "</page><page>"
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

    // Render Presentation by markdown
    this.renderPrebyMD = function (md_string) {
        this.md_preview.empty();
        var $pres_box = $("<div id='pres_box'></div>");
        var $holder_box = $("<div id='holder_box'></div>");
        this.md_preview.append($holder_box);
        this.md_preview.append($pres_box);
        this.pres_marked.setOptions({
            renderer: this.pres_renderer
        })
        $("#pres_box").html(this.pres_marked(md_string));

        var pagenum = 0;
        $('#pres_box > page').each(function () {
            $(this).attr('id', 'page' + pagenum);
            pagenum++;
        });
        this.max_page = pagenum - 1;

        this.holder_box = $("#holder_box");
        this.onPresResize();
    }

    // Show page by pagenum
    this.showPage = function (old_page_num, new_page_num) {
        if (new_page_num < 0)
            new_page_num = 0;
        if (new_page_num > this.max_page)
            new_page_num = this.max_page;
        $("#page" + old_page_num).css("visibility", "hidden");
        $("#page" + new_page_num).css("visibility", "visible");
        this.cur_page = new_page_num;
    }

    this.hasPage = function(md_string){
        this.pres_marked.setOptions({
            renderer: this.pres_renderer
        })
        var html = $(this.pres_marked(md_string));
        console.log(html);
        if(html.find('page').length){
            return true;
        }else{
            return false;
        }
    }
};