import $ from 'jquery';
import {whatInput} from 'what-input';
import {owlCarousel} from '../../../node_modules/owl.carousel/dist/owl.carousel.js';
import {lightGallery} from '../../../node_modules/lightgallery/dist/js/lightgallery-all.js';
import {mousewheel} from '../../../node_modules/lightgallery/lib/jquery.mousewheel.min.js';
import {pwstrength} from '../../../node_modules/pwstrength-foundation/dist/pwstrength-foundation.js';
import googleFonts from '../../../node_modules/google-fonts/index.js';

window.$ = $;

import Foundation from 'foundation-sites';
// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';

$(document).ready(function() {
    $(document).foundation();

    // Verwenden Sie Ihre Tracking-ID, wie oben beschrieben.
    var gaProperty = 'UA-40811127-1';

    // Deaktiviere das Tracking, wenn das Opt-out cookie vorhanden ist.
    var disableStr = 'ga-disable-' + gaProperty;
    if (document.cookie.indexOf(disableStr + '=true') > -1) {
        window[disableStr] = true;
    }

    // Die eigentliche Opt-out Funktion.
    function gaOptout(){
        document.cookie = disableStr + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
        window[disableStr] = true;
    }

    //focus on search input
    $("#search").focus();
    $("#search").get(0).setSelectionRange(0,0);

    // not hide do remove!
    if (Foundation.MediaQuery.is('small only')) {
        $('.hide-for-small-only').remove();
    }

    // Alert-Box auto_close
    $('.callout.messages').slideDown({
        duration: 1500,
        complete: function () {
            $('.callout.messages').delay(7000).slideUp(1500);
        }
    });

    // Product page / wishlist - quantity increase/decrease
    $('.quantity .input-group').append('<span class="input-group-label plus"><i id="add1" class="fa fa-plus" /></span>').prepend('<span class="input-group-label minus"><i id="minus1" class="fa fa-minus" /></span>');
    $('.quantity .plus').click(function () {
        var currentVal = parseInt($(".qty").val());
        if (!currentVal || currentVal == "" || currentVal == "NaN") currentVal = 0;
        $(".qty").val(currentVal + 1);
    });

    $('.quantity .minus').click(function () {
        var currentVal = parseInt($(".qty").val());
        if (currentVal == "NaN") currentVal = 0;
        if (currentVal > 1) {
            $(".qty").val(currentVal - 1);
        }
    });

    //Grid / List view
    $('.view-mode strong.grid').after('<i class="fa fa-th"></i>');
    $('.view-mode strong.list').after('<i class="fa fa-align-justify"></i>');

    $('.view-mode a.list').each(function () {
        if ($(this).text() == 'List')
            $(this).text('');
        $(this).append('<i class="fa fa-align-justify"></i>');
    });

    $('.view-mode a.grid').each(function () {
        if ($(this).text() == 'Grid')
            $(this).text('');
        $(this).append('<i class="fa fa-th"></i>');
    });

    //owl.carousel
    //Sort random function for owl.carousel
    function random(owlSelector) {
        owlSelector.children().sort(function () {
            return Math.round(Math.random()) - 0.5;
        }).each(function () {
            $(this).appendTo(owlSelector);
        });
    }

    //Home Slider Top Products
    $('.homeslider').owlCarousel({
        items: 1,
        loop: true,
        nav: true,
        navText: ['<i class="fa fa-chevron-left" aria-hidden="true"></i>','<i class="fa fa-chevron-right" aria-hidden="true"></i>'],
        dots: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
    });

    var $slider1 = $('.top-products-slider');
    $slider1.on('initialize.owl.carousel', function (event) {
        var selector1 = $('.top-products-slider');
        random(selector1);
    });
    $('.top-products-slider').owlCarousel({
        items: 5,
        lazyLoad: true,
        margin: 10,
        loop: true,
        nav: true,
        navText: ['<i class="fa fa-chevron-left" aria-hidden="true"></i>','<i class="fa fa-chevron-right" aria-hidden="true"></i>'],
        dots: false,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsiveClass: true,
        responsive: {
            0: {items: 1},
            640: {items: 3},
            1024: {items: 5}
        }
    });
    //Home Slider credentials
    var $slider2 = $('.credentials-slider');
    $slider2.on('initialize.owl.carousel', function (event) {
        var selector2 = $('.credentials-slider');
        random(selector2);
    });
    $('.credentials-slider').owlCarousel({
        items: 16,
        lazyLoad: true,
        loop: true,
        nav: true,
        navText: ['<i class="fa fa-chevron-left" aria-hidden="true"></i>','<i class="fa fa-chevron-right" aria-hidden="true"></i>'],
        dots: false,
        autoplay: true,
        autoplayTimeout: 1000,
        autoplayHoverPause: true,
        responsiveClass: true,
        responsive: {
            0: {items: 2},
            640: {items: 5},
            1024: {items: 12}
        }
    });

    //Home Slider credentials
    var $slider3 = $('.credentials-slider-cms');
    $slider3.on('initialize.owl.carousel', function (event) {
        var selector3 = $('.credentials-slider-cms');
        random(selector3);
    });
    $('.credentials-slider-cms').owlCarousel({
        items: 6,
        lazyLoad: true,
        loop: true,
        nav: true,
        navText: ['<i class="fa fa-chevron-left" aria-hidden="true"></i>','<i class="fa fa-chevron-right" aria-hidden="true"></i>'],
        dots: false,
        autoplay: true,
        autoplayTimeout: 1000,
        autoplayHoverPause: true,
        responsiveClass: true,
        responsive: {
            0: {items: 2},
            640: {items: 6}
        }
    });

    //LightGallery
    $('.product-img-box').lightGallery({
        selector: '.item',
        thumbnail: true,
        hash: false
    });

    $('#lightgallery').lightGallery({
        thumbnail: true,
        hash: false
    });

    $('#password').focus(function () {
        $('#toolTipPasswordStrength').css("display", "inline");
    });
    $('#password').blur(function () {
        $('#toolTipPasswordStrength').css("display", "none");
    });

    var options = {};
    options.ui = {
        container: "#toolTipPasswordStrength",
        viewports: {
            progress: "#passwordStrengthBar",
            verdict: ".progress-meter",
            errors: "#passwordStrengthHeadLine"
        },
        errorMessages: {
            wordLength: "Ihr Passwort ist zu kurz",
            wordNotEmail: "Keine Email",
            wordSimilarToUsername: "Kein Benutzername",
            wordTwoCharacterClasses: "Keine gleichen Wortgruppen",
            wordRepetitions: "Zu viele Wiederholungen",
            wordSequences: "Ihr Passwort enthält Sequenzen"
        },
        verdicts: ["zu kurz", "schwach", "gut", "stark", "sehr stark"],
        showVerdictsInsideProgressBar: true,
        scores: [16, 26, 38, 45],
        showErrors: true,
    };
    options.rules = {
        activated: {
            wordNotEmail: true,
            wordLength: true,
            wordSimilarToUsername: true,
            wordSequences: true,
            wordTwoCharacterClasses: true,
            wordRepetitions: true,
            wordLowercase: true,
            wordUppercase: true,
            wordOneNumber: true,
            wordThreeNumbers: true,
            wordOneSpecialChar: true,
            wordTwoSpecialChar: true,
            wordUpperLowerCombo: true,
            wordLetterNumberCombo: true,
            wordLetterNumberCharCombo: true
        }
    };
    options.common = {
        minChar: 8
    };
    $('#password').pwstrength(options);

    //Product Option show more and less
    $('ul.options-list').each(function () {
        var max = 2;
        if ($(this).find("li").length > max) {
            $(this)
                .find('li:gt(' + max + ')')
                .hide()
                .end()
                .append(
                    $('<li class="show-more">weitere Optionen anzeigen</li>').click(function () {
                        $(this).siblings(':hidden').show().end().remove();
                    })
                );
        }
    });

    googleFonts.add({
        'Roboto': ['300', '400', '700'],
    })

});