import $ from 'jquery';
import {whatInput} from 'what-input';

window.$ = $;

import Foundation from 'foundation-sites';
// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';

$(document).ready(function () {

    //Foundation.Abide.defaults.patterns['password'] = /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,})$/;

    $(document).foundation();

    // not hide do remove!
    if (Foundation.MediaQuery.is('small only')) {
        $('.hide-for-small-only').remove();
    }
    // Alert-Box auto close
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

    //only for Jura
    if (Foundation.MediaQuery.atLeast('medium')) {
      if ($("[class*='categorypath-hersteller-jura'] .mb-mana-catalog-leftnav").length) {
          var $header = $("[class*='categorypath-hersteller-jura'] .mb-mana-catalog-leftnav").first();

          // This is the odd behaviour I was speaking about. It seems as though the sizes
          // aren't being calculated when initialized programmatically. We're cathing the
          // "init" event triggered by the plug-in when it's successfully initialized on the
          // element. Then we're forcing it to run the "_calc" function manually.
          $header.one('init.zf.sticky', function () {
              console.log('initialized!');
              $(this).foundation('_calc', true);
          });

          // We're ready to initialize the plug-in, just like described in the documentation.
          $header.$sticky = new Foundation.Sticky($header, {
              anchor: 'main'
          });
      }
        $("[class*='categorypath-hersteller-jura'] .block-layered-nav .block-title").before('<img src="https://static.gastrodax.de/media/wysiwyg/manufacturer/jura-mp.png" alt="Jura Logo" width="150" class="show-for-large">');

    }

    Foundation.reInit($('.categories-grid'));
    Foundation.reInit($('.categories-home-grid'));
});