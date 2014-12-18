(function() {
    'use strict';

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
        // set default color for a_home
        $('#a_home').addClass('nav_active');

        // does menu shrink ?
        //if(($(window).width()) < 950){
        //    var headerHeight = 100;
        //} else {
        //    headerHeight = 100;
        //}

        skrollr.init({
            keyframe: function(element) {
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
                // TODO: 90 ne devrait pas être en dur
                scrollTop: $(idSectionCible).offset().top - 90

            }, 1000, function() {
                allowUpdateMenuIndicator = true;
            });
        });

        $(window).on('resize', $.debounce(300, function() {
            updateMenuIndicator(currentSectionId);
        }));

    });

})();