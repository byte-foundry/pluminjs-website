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

    plumin.paper.setup('hidden-canvas');

    var cm = CodeMirror.fromTextArea( document.getElementById('editor-live-demo'), {
        autoCloseBrackets: true
    });
    cm.setSize( '100%', 400 );

    $('textarea.editor').each(function() {
        if ( this.id === 'editor-live-demo' ) {
            return;
        }

        CodeMirror.fromTextArea( this, {
            readOnly: 'nocursor'

        }).setSize(this.parentNode.parentNode.clientWidth - 20, 280);
    });
    $('form input[type="radio"]:first-of-type').attr('checked', 'checked');

    window.runLiveDemo = function(event) {
        /*jslint evil: true */
        try {
            ( new Function( cm.getValue() ) )();
        } catch(e) {
            console.error(e);
        }

        if ( event ) {
            event.preventDefault();
        }
    };

    var demo = new p.Font({
            familyName: 'Dem1',
            ascender: 500
        }),
        glyph = demo.addGlyph(new p.Glyph({
            name: 'A', unicode: 'A',
            advanceWidth: 500
        }));

    window.drawFlake = function(event) {
        glyph.contours = [];
        glyph.addContour(new p.Path.Star({
            center: [250, 250],
            points: 3 + Math.round( Math.random() * 8 ),
            radius1: 150 + ( Math.random() * 100 ),
            radius2: 20 + ( Math.random() * 100 )
        })).simplify( - Math.random() * 10 );

        demo.updateOTCommands()
            .addToFonts();

        if ( event ) {
            event.preventDefault();
        }
    };
    window.drawFlake();

    function updateMenuIndicator( sectionId ) {
        var $menuItem = $('#header a[href=' + sectionId + ']'),
            bbox = $menuItem[0].getBoundingClientRect(),
            middle = bbox.left + bbox.width / 2,
            totalWidth = $(document.body).width();

        currentSectionId = sectionId;

        $('#menu-indicator .left').css( 'width', Math.floor(middle) );
        $('#menu-indicator .right').css( 'width', Math.floor(totalWidth - middle) );
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
            },
            // disable skrollr on mobile
            mobileCheck: function() { return false; }
        });

        var canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1024;
        p.setup(canvas);
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
        repo: 'plumin.js',
        showCommitDate: true,
        makeCommitLink: true,
        showCommitterAvatar: true
    });

    $('#year').append((new Date()).getFullYear());

})(plumin);