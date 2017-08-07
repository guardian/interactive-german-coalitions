import iframemessenger from 'iframe-messenger'

var metadata = 1;
if (document.location.href.slice(-4) != 'html') {
    metadata = document.location.href.split("=")[1];
}

var xhr = new XMLHttpRequest;
var path = '<%= path %>/assets/embed' + metadata + '.html';

xhr.open('GET',path,false);
xhr.send();

if (xhr.status == 200){
    var chart = xhr.responseText

var widgetdiv = document.querySelector('.gv-widget');
console.log(widgetdiv);
widgetdiv.innerHTML = chart;



};

console.log('pressburg');



iframemessenger.enableAutoResize()