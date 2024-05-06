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
    $('#offCanvas').on('opened.zf.offCanvas', function() {
        $('.hamburger').addClass('is-active');
    });
    $('#offCanvas').on('closed.zf.offCanvas', function() {
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
    $('ul.options-list').not('ul.product-bundle-radio').each(function(){

        var LiN = $(this).find('li').length;

        if( LiN > 1){
            $('li', this).eq(0).nextAll().hide().addClass('toggleable');
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

    $.fn.visible = function(partial) {

            var $t            = $(this),
                $w            = $(window),
                viewTop       = $w.scrollTop(),
                viewBottom    = viewTop + $w.height(),
                _top          = $t.offset().top,
                _bottom       = _top + $t.height(),
                compareTop    = partial === true ? _bottom : _top,
                compareBottom = partial === true ? _top : _bottom;

            return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
    };

    $('.lazy').Lazy();

    Foundation.reInit($('.categories-grid'));
    Foundation.reInit($('.categories-home-grid'));

});