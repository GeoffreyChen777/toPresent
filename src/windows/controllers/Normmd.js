function Normmd(md_pre){

    // Constructor
    this.md_preview = md_pre;
    this.norm_marked = require('marked');
    this.norm_renderer = new this.norm_marked.Renderer();

    //==========================================================================

    // Create marked obj by normal renderer
    this.createNormRenderer = function () {
        this.norm_renderer.heading = function (text, level, raw) {
            if (level == 1 && text == "ps") {
                return ""
            }
            if (level == 1 && text == "sp") {
                return "<hr></hr>"
            }
            if (level == 1 && text == "pe") {
                return ""
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

    this.createNormMarked = function () {

        this.norm_marked.setOptions({
            renderer: this.norm_renderer,
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false
        });
    }
    this.createNormRenderer();
    this.createNormMarked();

     // Render Normal markdown
     this.renderNormbyMD = function (md_string) {
        this.md_preview.empty();
        this.norm_marked.setOptions({
            renderer: this.norm_renderer
        });
        
        this.md_preview.html(this.norm_marked(md_string));
    }
}