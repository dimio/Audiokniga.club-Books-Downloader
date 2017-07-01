// ==UserScript==
// @name         Audiokniga.club downloader
// @name:ru	 Audiokniga.club загрузчик книг
// @namespace    http://dimio.org/
// @version      0.0.6
// @description  Adds links for downloading chapters of the current book on audiokniga.club website
// @description:ru  Добавляет ссылки для скачивания глав текущей книги на сайте audiokniga.club
// @author       dimio (dimio@dimio.org)
// @license      MIT
// @homepage     none
// @supportURL   dimio.org
// @encoding     utf-8
// @match        http*://audiokniga.club/*
// @run-at       document-end
// ==/UserScript==
//*jshint esversion: 6 */

(function (window) {
    'use strict';

    window.unsafeWindow = window.unsafeWindow || window;
    const w = unsafeWindow;

    let book = {};
    book.name = $('#dle-content > div > div.fullstory > div.info > h1')[0].innerText;
    book.chapters = $("div.item");
    book.chapter_prefix_size = book.chapters.length.toString().length;

    book.chapters.removeClass('item');
    //book.chapters.css( "style", "float:left" );
    //book.chapters.wrap('<div class="item dl-container" style="position:relative;width:auto;margin:0 auto"></div>');
    book.chapters.wrap('<div class="item" style="cursor:default"></div>');

    $.each( book.chapters, function(key, value) {
        book.chapter_div = $(value);
        book.chapter_div.css({
            "margin-left": "auto",
            "display": "inline-block",
            "cursor": "pointer",
        });

        book.chapter_name = book.chapter_div[0].innerText;
        book.download_link = book.chapter_div[0].outerHTML.split("'")[1];
        book.chapter_prefix = numSizeToFixed( ++key, book.chapter_prefix_size );

        let file_name = book.chapter_prefix + '-' + book.name + '_' + book.chapter_name + '.mp3';
        file_name = file_name.replace(/\s/g, '_');

        let a = document.createElement('a');
        a.href = w.location.origin + book.download_link;
        a.download = file_name;
        a.innerText = 'DL #' + book.chapter_prefix;
        a.title = 'Download chapter ' + parseInt( book.chapter_prefix, 10 );

        book.chapter_div[0].innerText = 'Play: ' + book.chapter_div[0].innerText;
        book.chapter_div.parent().prepend(a);

        const dl_div = $('<div></div>').css({
            "class": "dl-chapter",
            "cursor": "default",
            "display": "inline-block",
            "margin-right": "10%",
        });
        $(a).wrap(dl_div);
    } ); // end of each

})(window);

function numSizeToFixed( num, num_size ){
    num = num.toString();
    num_size = parseInt( num_size, 10 );

    if ( num.length < num_size ){
        return addLeadingZeros( num, num_size );
    }

    if ( num.length === num_size ){
        return num;
    }

    return num.substring( 0, num_size );
}

function addLeadingZeros( str, str_size ){
    return Array.apply( null, {
        length: str_size - str.length + 1
    } ).join('0') + str;
}
