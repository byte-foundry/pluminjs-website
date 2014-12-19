(function() {
    'use strict';

    var texts = ['using javascript.', 'like there\'s no tomorrow.', 'like no one\'s watching. '],
        i = 0;

    setInterval(function() {
        i++;
        $('#swaptext').fadeOut('slow', function() {
            $('#swaptext').html(texts[i % texts.length]);
            $('#swaptext').fadeIn('slow');
        });
    }, 5000);

    var allowUpdateMenuIndicator = true,
        currentSectionId;

    function updateMenuIndicator( sectionId ) {
        var $menuItem = $('#header a[href=' + sectionId + ']'),
            bbox = $menuItem[0].getBoundingClientRect(),
            middle = bbox.left + bbox.width / 2,
            totalWidth = $(document.body).width();

        currentSectionId = sectionId;

        $('#menu-indicator .left').css( 'width', middle );
        $('#menu-indicator .right').css( 'width', totalWidth - middle );
        $('.nav-active').removeClass('nav-active');
        $('#header a[href=' + sectionId + ']').addClass('nav-active');
    }

    $(function() {
        // set defaults
        $('#result').prop('checked', true);

        skrollr.init({
            keyframe: function(element) {
                if (allowUpdateMenuIndicator) {
                    updateMenuIndicator('#' + element.firstElementChild.id);
                }
            }
        });

        /*if ( window.location.hash !== '' ) {
            setTimeout(function() {
                $(document.body).animate({
                    scrollTop: $(window.location.hash).offset().top - scrollAdjust
                }, 200);
            }, 1000);

        }*/
    });

    $(document).on('click', '#header a', function() {

        var idSectionCible = this.href.replace(/.*?(#.*)$/, '$1');
        updateMenuIndicator(idSectionCible);
        allowUpdateMenuIndicator = false;

        $(document.body).stop().animate({
            scrollTop: $(idSectionCible).offset().top

        }, 1000, function() {
            allowUpdateMenuIndicator = true;
        });

        history.replaceState(null, null, idSectionCible);
        return false;
    });

    $(document).on('click', 'label', function() {
        $(this).closest('ul').find('label').removeClass('label-active');
        $(this).addClass('label-active');
    });

    $(window).on('resize', $.debounce(300, function() {
        updateMenuIndicator(currentSectionId);
    }));
})();