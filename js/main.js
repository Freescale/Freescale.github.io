$('document').ready(function() {

    /************************************ Global variables and functions ***********************************/

    var $window = $(window);
    var $headerSection = $("section#header-section");
    var $headerSectionHeight = $("section#header-section").outerHeight();
    var $mainSectionHeight = $("section#main-section").outerHeight();
    var $navbarHeight = $('.os-navbar').outerHeight();
    var $initialWindowHeight;
    var $updateMainSectionHeight = function() {
        $initialWindowHeight = $window.height() - ($mainSectionHeight + $navbarHeight);
        $headerSection.height($initialWindowHeight);
    }

    /*******************************************************************************************************/

    /****************************** Initializes the height of the main section *****************************/

    $updateMainSectionHeight();

    /*******************************************************************************************************/

    /********************************** Code executed when window 'resize' *********************************/

    $window.resize(function() {
        $updateMainSectionHeight();
    });

    /*******************************************************************************************************/

});
