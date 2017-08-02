import iframemessenger from 'iframe-messenger'

window.onload = function() {
    if (parent) {
        var oHead = document.getElementsByTagName("head")[0];
        var arrStyleSheets = parent.document.getElementsByTagName("style");
        for (var i = 0; i < arrStyleSheets.length; i++)
            oHead.appendChild(arrStyleSheets[i].cloneNode(true));
    }
}

var metadata = 1;
if (document.location.href.split("=")[1].length > 0) {
    metadata = document.location.href.split("=")[1];
}

var xhr = new XMLHttpRequest;
var path = '<%= path %>/assets/embed' + metadata + '.html';

xhr.open('GET',path,false);
xhr.send();

var chart = xhr.responseText;

console.log('wien')

var widgetdiv = document.querySelector('.gv-widget');
console.log(widgetdiv);
widgetdiv.innerHTML = chart;


iframemessenger.enableAutoResize()