var texts = ["using javascript.", "like there's no tomorrow.", "like no one's watching. "];
var i = 0;
setInterval(function() {
    i++;
    $('#swaptext').fadeOut('slow', function(){
        $('#swaptext').html(texts[i % texts.length]);
        $('#swaptext').fadeIn('slow');
    });
},5000);

var allowUpdateMenuIndicator = true,
    currentSectionId;

function updateMenuIndicator( sectionId ) {
    var $menuItem = $('#header a[href=' + sectionId + ']'),
        bbox = $menuItem[0].getBoundingClientRect(),
        middle = bbox.left + bbox.width / 2,
        totalWidth = $(document.body).width();

    currentSectionId = sectionId;

    $('#menu-indicator .left').css('width', middle );
    $('#menu-indicator .right').css('width', totalWidth - middle );
    $('.nav_active').removeClass();
    $('#header a[href=' + sectionId + ']').addClass('nav_active');
}

$(function(){
    // set defaults
    $('#a_home').addClass('nav_active');
    $('.result').addClass('label_active');
    $( "#result" ).prop( "checked", true );

    // does menu shrink ?
    //if(($(window).width()) < 950){
    //    var headerHeight = 100;
    //} else {
    //    headerHeight = 100;
    //}

    var speed=1000;

    skrollr.init({
        keyframe: function(element, name, direction) {
            if (allowUpdateMenuIndicator){
                updateMenuIndicator('#' + element.id);
            }
        }
    });

    $(document).on('click', '#header a', function(){

        var idSectionCible = this.href.replace(/.*?(#.*)$/, '$1');
        updateMenuIndicator(idSectionCible);
        allowUpdateMenuIndicator = false;

        $(document.body).stop().animate({
            // TODO: 70 ne devrait pas être en dur
            scrollTop: $(idSectionCible).offset().top - 70

        }, 1000, function() {
            allowUpdateMenuIndicator = true;
        });

        return false;
    });

    $(document).on('click', 'label', function(){
        $(this).closest('ul').find('label').removeClass('label_active');
        $(this).addClass('label_active');
    });

    $(window).on('resize', function() {
        updateMenuIndicator(currentSectionId);
    });


//    $(document).on('click', '#source', function(){
//        if ($("#source").text() == 'Source'){
//            $("#source").text("Run");
//            $(".CodeMirror").css('display', 'block');
//        } else if ($("#source").text() == 'Run'){
//            $("#source").text("Source");
//            $(".CodeMirror").css('display', 'none');
//        }
//
//        return false;
//    });

});