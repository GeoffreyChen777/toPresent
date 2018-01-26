function read_config(path, pres_renderer){
    $.getJSON(path, function (data){
        set_default_config(data, pres_renderer);
        main_config = data;
    }) 
}

function set_default_config(conf, pres_renderer){
    console.log(conf)
    set_ori_font_size(conf, pres_renderer);
    parse_config(conf, pres_renderer);
    set_setting_ui(conf);
}

function em2px(em){
    return (em * 14) + "px";
}

function num2per(num){
    if(num != null){
        var per = (num * 100) + "%";
    }
    else{
        var per = "";
    }
    return per;
}

function make_css_item(conf){
    css_str = "";
    for(var key in conf){
        if(key != "page"){
            var css_item = ".page>" + key + "{";
        }
        else{
            var css_item = ".page{"
        }
        for(var name in conf[key]){
            if(conf[key][name] == null){
                continue;
            }
            if(name == "font-size"){
                var tmp = conf[key][name] + "em";
            }
            else if(name.indexOf("margin") >= 0 || name.indexOf("padding") >= 0 || name.indexOf("width") >= 0 || name.indexOf("height") >= 0){
                var tmp = num2per(conf[key][name]);
            }
            else{
                var tmp = conf[key][name];
            }
            css_item += name + ":" + tmp + ";"
        }
        css_item += "}"
        css_str += css_item;
    }
    return css_str;
}

function set_ori_font_size(conf, pres_renderer){
    pres_renderer.orinSize.h1 = em2px(conf.h1["font-size"]);
    pres_renderer.orinSize.h2 = em2px(conf.h2["font-size"]);
    pres_renderer.orinSize.h3 = em2px(conf.h3["font-size"]);
    pres_renderer.orinSize.h4 = em2px(conf.h4["font-size"]);
    pres_renderer.orinSize.li = em2px(conf.li["font-size"]);
    pres_renderer.orinSize.p = em2px(conf.p["font-size"]);
}

function parse_config(conf, pres_renderer){
    // Set style
    css_str = make_css_item(conf);
    console.log(css_str);
    $("#pres_css").empty();
    $("#pres_css").html(css_str);
}

function set_setting_ui(conf){
    for(var key in conf){
        for(var name in conf[key]){
            if(conf[key][name] == null){
                continue;
            }
            if(name.indexOf("align") != -1){
                $("#setting-"+key+"-"+name).html(conf[key][name]); 
            }
            $("#setting-"+key+"-"+name).val(conf[key][name]);
        }
    }
}

function save_setting_ui(conf){
    for(var key in conf){
        for(var name in conf[key]){
            if(conf[key][name] == null){
                continue;
            }
            if(name.indexOf("align") != -1){
                conf[key][name] = $("#setting-"+key+"-"+name).html();
            }
            else{
                conf[key][name] = $("#setting-"+key+"-"+name).val();
            }
        }
    }
}

function encode_setting(conf){
    var tmp = conf;
    for(var key in tmp){
        for(var name in tmp[key]){
            if(name.indexOf("align") != -1){
                tmp[key][name] = $("#setting-"+key+"-"+name).html(); 
            } 
            else if($("#setting-"+key+"-"+name).val() == ""){
                tmp[key][name] = null;
            }
            else{
                tmp[key][name] = $("#setting-"+key+"-"+name).val();
            }
        }
    }
    return JSON.stringify(tmp);
}