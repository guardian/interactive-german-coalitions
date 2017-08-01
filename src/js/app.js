console.log('firenze')

var xhr = new XMLHttpRequest;

xhr.open('GET','<%= path %>/embed2.html',false);
xhr.send(); 



var figures = [].slice.apply(parent.document.querySelectorAll('figure'));

var REPLACEOR = figures.find(function(f){
    return f.getAttribute("data-alt") == "REPLACEOR";
})

var msg = parent.document.createElement('div');
msg.innerHTML = xhr.responseText;

REPLACEOR.parentNode.replaceChild(msg,REPLACEOR);
