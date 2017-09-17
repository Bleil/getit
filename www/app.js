var GETIT = {};

GETIT = (function () {
    return {

        DELTA: 5,
        DID_SCROLL: false,
        HEADER_HEIGHT: 100,
        LAST_SCROLL_POSITION: 0,


        init: function () {
            google.maps.event.addDomListener(window, 'load', this.loadMap);
            this.loadCarousel();
        },
        loadCarousel: function () {
            $('.carousel').slick({
                dots: false,
                infinite: true,
                speed: 300,
                prevArrow: $('#previous'),
                nextArrow: $('#next'),
                slidesToShow: 1,
                slidesToScroll: 1
            });
        },
        loadMap: function () {
            var latLang = new google.maps.LatLng(-30.029634, -51.211616);
            var map = new google.maps.Map(
                document.getElementById('map'), {
                    center: latLang,
                    zoom: 16,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
            var marker = new google.maps.Marker({
                position: latLang,
                map: map,
                title: 'Warren'
            });
        },
        scroll: function () {
            consol
            this.DID_SCROLL = true;
        },
        hasScrolled: function () {
            var nav = $('getit-navbar');
            var scroll = $(window).scrollTop();
            if (Math.abs(this.LAST_SCROLL_POSITION - scroll) <= this.DELTA) {
                return;
            }
            if (scroll > this.LAST_SCROLL_POSITION && scroll > this.HEADER_HEIGHT){
                nav.addClass('hide');
                nav.removeClass('white');
            } else {
                if(scroll + $(window).height() < $(document).height()) {
                    nav.removeClass('hide');
                    nav.addClass('white');
                }
            }
            if (scroll <= 40) {
                nav.removeClass('hide');
                nav.removeClass('white');
            }
            this.LAST_SCROLL_POSITION = scroll;
        },
        toggleMenu: function () {
            var menuButton = $('#menu-button');
            var backdrop = $('#backdrop');
            var menu = $('#mobile-menu');
            if (menu.hasClass('open')) {
                backdrop.removeClass('open');
                menu.removeClass('open');
                menuButton.removeClass('open');
                $('body').css('overflow', 'auto');
            } else {
                backdrop.addClass('open');
                menu.addClass('open');
                menuButton.addClass('open');
                $('body').css('overflow', 'hidden');
            }
        }
    };
}());

(function () {
    GETIT.init();

    $(window).scroll(function (event){
        GETIT.DID_SCROLL = true;
    });

    setInterval(function () {
        if (GETIT.DID_SCROLL) {
            GETIT.hasScrolled();
            GETIT.DID_SCROLL = false;
        }
    }.bind(this), 250);

    $('header').on('click', 'a', function (event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 500);
    });
}());