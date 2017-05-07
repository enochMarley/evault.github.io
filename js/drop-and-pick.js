function openNav() {
    $("#mySidenav").css({"width":"250px","z-index":"1999"});
    $(".menuBtn").animate({opacity: '0',},"slow");
    $("body").css("background-color","rgba(1,1,1,0.6)");
}

function closeNav() {
    $("#mySidenav").css("width","0px");
    $(".menuBtn").animate({opacity: '1',},"slow");
    $("body").css("background-color","#fff");
}

var windowHeight = $(window).height();
$(window).on("scroll", function(){
    if ($(this).scrollTop() >= (windowHeight/12)) {
        $(".navbar").addClass("change-navbar-bg");
    }else{
        $(".navbar").removeClass("change-navbar-bg");
    }
});
