function scaleFont(scale, origin_size){
    console.log(scale);
    $("page>h1").css("font-size", parseFloat(origin_size.h1) * scale + "px");
    
    $("page>h2").css("font-size", parseFloat(origin_size.h2) * scale + "px");
    
    $("page>h3").css("font-size", parseFloat(origin_size.h3) * scale + "px");

    $("page>p").css("font-size", parseFloat(origin_size.p) * scale + "px");

    $("page>ul>li").css("font-size", parseFloat(origin_size.li) * scale + "px");
    
}