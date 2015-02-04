(function(p) {
    'use strict';

    var texts = [
            'using javascript.',
            'like there\'s no tomorrow.',
            'like no one\'s watching.',
            'like no one else.',
            'like crazy.',
            'like a boss.'
        ],
        i = 0,
        allowUpdateMenuIndicator = true,
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
        // source need to be visible by default for prism
        // once prism has done its job, result should be displayed
        $('#result').prop('checked', true);

        skrollr.init({
            keyframe: function(element) {
                if (allowUpdateMenuIndicator) {
                    updateMenuIndicator('#' + element.firstElementChild.id);
                }
            }
        });

        var canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1024;
        p.setup(canvas);

        $('.demo-widget code').each(function() {
            try {
                (new Function('p', this.textContent ))(p);
            } catch (e) {}
        });

        $('#flake').click(function() {
            flake();
            return false;
        });
    });

    $(document).on('click', '#header a', function() {

        var idSectionCible = this.href.replace(/.*?(#.*)$/, '$1');
        updateMenuIndicator(idSectionCible);
        allowUpdateMenuIndicator = false;

        $('html,body').stop().animate({
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

    setInterval(function() {
        i++;
        $('#swaptext').fadeOut('slow', function() {
            $('#swaptext').html(texts[i % texts.length]);
            $('#swaptext').fadeIn('slow');
        });
    }, 5000);

    // github commits
    $('#commits').commitment({
        user: 'byte-foundry',
        // split the repo name otherwise it gets rewritten by gulp-rev-all
        repo: 'plumin' + '.js',
        showCommitDate: true,
        makeCommitLink: true,
        showCommitterAvatar: true
    });

    $('#year').append((new Date()).getFullYear());

})(plumin);