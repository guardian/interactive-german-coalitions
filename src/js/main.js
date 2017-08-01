var el = document.createElement('script');
el.src = '<%= path %>/app.js';
document.body.appendChild(el);

var parentwindow = window.parent;
var parentdoc = window.parent.window.document;

var s = parentdoc.createElement('link');
s.type = 'text/css';
s.rel = 'stylesheet';
s.href = '<%= path %>/main.css';
parentdoc.head.appendChild(s);