import $ from 'jquery';
import {whatInput} from 'what-input';

window.$ = $;

import Foundation from 'foundation-sites';
// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';

$(document).ready(function () {

    $(document).foundation();

    // Hamburgers is-active on OffCanvas
    $('#offCanvas').on('opened.zf.offcanvas', function() {
        $('.hamburger').addClass('is-active');
    });
    $('#offCanvas').on('closed.zf.offcanvas', function() {
        $('.hamburger').removeClass('is-active');
    });

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
    $('ul.options-list').each(function(){

        var LiN = $(this).find('li').length;

        if( LiN > 3){
            $('li', this).eq(2).nextAll().hide().addClass('toggleable');
            $(this).append('<li class="more">weitere Optionen anzeigen</li>');
        }

    });


    $('ul.options-list').on('click','.more', function(){
        if( $(this).hasClass('less') ){
            $(this).text('weitere Optionen anzeigen').removeClass('less');
        }else{
            $(this).text('weitere Optionen ausblenden').addClass('less');
        }
        $(this).siblings('li.toggleable').slideToggle();
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
              $(this).foundation('_calc', true);
          });

          // We're ready to initialize the plug-in, just like described in the documentation.
          $header.$sticky = new Foundation.Sticky($header, {
              anchor: 'main'
          });
      }
        $("[class*='categorypath-hersteller-jura'] .block-layered-nav .block-title").before('<img src="https://www.gastrodax.de/media/wysiwyg/manufacturer/jura-mp.png" alt="Jura Logo" width="150" class="show-for-large">');

    }

    Foundation.reInit($('.categories-grid'));
    Foundation.reInit($('.categories-home-grid'));
});