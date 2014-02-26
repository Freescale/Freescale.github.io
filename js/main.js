$('document').ready(function() {

    /****************************************** Classes declaration ******************************************/

    var Navbar = (function() {
        function Navbar() {
            elem = $("header");
            collapseButton = $('.os-navbar .navbar-toggle');
            links = $('.os-navbar #os-navbar-links');
        };

        Navbar.prototype.hide = function() {
            elem.stop().fadeOut('slow');
        }

        Navbar.prototype.show = function() {
            elem.stop().fadeIn('slow');
        }

        Navbar.prototype.getOuterHeight = function() {
            return elem.outerHeight(true);
        };

        Navbar.prototype.collapseEffect = function(cb) {
            if(!collapseButton.hasClass('collapsed')) {
                links.animate({
                    height: 1
                }, {
                    duration: 400,
                    complete: function() {
                        collapseButton.addClass('collapsed');
                        links.removeClass('in').addClass('collapse');
                        cb();
                    }
                });
            } else
                cb();
        };

        return Navbar;
    }());

    var HeaderSection = (function() {
        function HeaderSection() {
            this.elem = $("section#header-section");
        };

        HeaderSection.prototype.updateHeight = function(windowHeight, mainSectionHeight) {
            var initialHeaderHeight = windowHeight - mainSectionHeight;

            this.elem.height(initialHeaderHeight);
        };

        return HeaderSection;
    }());

    var MainSection = (function(){
        function MainSection() {
            this.elem = $("section#main-section");
        };

        MainSection.prototype.getOuterHeight = function() {
            return this.elem.outerHeight(true);
        };

        MainSection.prototype.topOfNextElement = function() {
            return this.elem.next().offset().top;
        };

        return MainSection;
    }());

    var BackButton = (function() {
        function BackButton() {
            this.elem = $(".os-back-top");
        };

        BackButton.prototype.hide = function() {
            this.elem.stop().fadeOut('slow');
        };

        BackButton.prototype.show = function() {
            this.elem.stop().fadeIn('slow');
        };

        return BackButton;
    }());

    /*******************************************************************************************************/

    /******************************** Global variables, objects and functions ******************************/

    var $window = $(window);
    var $handlerNavbar = new Navbar();
    var $handlerHeaderSection = new HeaderSection();
    var $handlerMainSection = new MainSection();
    var $handlerBackButton = new BackButton();
    var $isMobile = function() {
        if($window.width() > 767)
            return false;
        else
            return true;
    };
    // Update the navigation bar and the "back to top" button depending of window position
    var $updateNavbarAndBackButton = function() {
        var firstElementAfterMainSection = $handlerMainSection.topOfNextElement();

        if($window.scrollTop() >= (firstElementAfterMainSection - $handlerNavbar.getOuterHeight())) {
            $handlerNavbar.show();
            $handlerBackButton.show();
        } else {
            $handlerNavbar.hide();
            $handlerBackButton.hide();
        }
    }
    // Go to section according with the "targetId" parameter
    var $goToSection = function(options) {
        var targetId = options.targetId;
        var targetName = "section" + options.targetId;
        var animationTime = options.animationTime;
        var targetTop;

        // Checks whether the destination is the top
        if(targetId === "#")
            targetTop = 0;
        else
            targetTop = $(targetName).offset().top - ($handlerNavbar.getOuterHeight() - 20);

        $('html, body').animate({
            scrollTop: targetTop
        }, animationTime, function() {
            // Changes the URL
            history.replaceState(null, '', targetId);
        });
    };
    // Updates the URL
    var $updateURL = function(elem) {
        function getVisible( $els ) {
            var docViewTop = $window.scrollTop() +  $handlerNavbar.getOuterHeight() + 10;
            var docViewBottom = docViewTop + $window.height();

            return $els.filter(function(i, elem) {
                var elemTop = $(elem).offset().top;
                var elemBottom = elemTop + $(elem).height();

                // If element is partially visible
                return (elemTop >= docViewTop || ((elemTop <= docViewTop) && (elemBottom >= docViewBottom)) || ((elemBottom >= docViewTop) && (elemBottom <= docViewBottom)));
            });
        };

        var currentElement = elem.location.hash;
        var visibleElement = '#' + getVisible($('section')).attr('id');

        if($window.scrollTop()) {
            if(visibleElement && visibleElement != currentElement)
                history.replaceState(null, '', visibleElement);
        } else
            history.replaceState(null, '', '/#');
    };

    /************************************* Initializes the application *************************************/

    // Added google analytics
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                             m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-48436418-1', 'freescale.github.io');
    ga('send', 'pageview');

    if(!$isMobile()) {
        $updateNavbarAndBackButton();
        $handlerHeaderSection.updateHeight($window.height(), $handlerMainSection.getOuterHeight());
    } else {
        // Initilaize the custom scrollbar
        $('.os-code-install').perfectScrollbar({
            suppressScrollY: true
        });
        $('.os-code-setup').perfectScrollbar({
            suppressScrollY: true
        });
    }

    $goToSection({
        animationTime: 0,
        targetId: window.location.hash
    });

    /*******************************************************************************************************/

    /*************************************** Code to window 'resize' ***************************************/

    $window.resize(function() {
        if(!$isMobile()) {
            $handlerHeaderSection.updateHeight($window.height(), $handlerMainSection.getOuterHeight());
        }
    });

    /*******************************************************************************************************/

    /**************************************** Code to window 'scroll' **************************************/

    $window.scroll(function(e) {
        e.preventDefault();

        if(!$isMobile())
            $updateNavbarAndBackButton();

        $updateURL(this)
    });

    /*******************************************************************************************************/

    /***************************************** Code to links 'click' ***************************************/

    $(".os-main-links a").click(function(e) {
        e.preventDefault();

        var elem = $(this);

        $handlerNavbar.collapseEffect(function() {
            $goToSection({
                animationTime: 1000,
                targetId: elem.attr('href')
            });
        });
    });

    /*******************************************************************************************************/
});
