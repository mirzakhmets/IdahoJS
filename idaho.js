/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

// add new controllers here
var idahoControllers = [];

function htmlGet(selector) {
    var r = [];

    document.querySelectorAll(selector).forEach((e) => {
        r.push(e.value);
    });

    return r;
}

function htmlSet(selector, v) {
    document.querySelectorAll(selector).forEach((e) => {
        if (e.value != null) e.value = v;
    });
}


function ajaxGet(selector, url) {
    const xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        htmlSet(selector, this.responseText);
    };

    xhttp.open("GET", url);
    xhttp.send();
    
    return null;
}

function ajaxSet(o, v) {
    const xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        htmlSet(o.html_selector, this.responseText);
    };

    xhttp.open("POST", o.url);
    xhttp.send(JSON.stringify(v));
}

function idahoGetValue(o) {
    return htmlGet(o.html_selector);
}

function idahoSetValue(o, v) {
    if (o.url == null) {
        htmlSet(o.html_selector, v);
    } else {
        htmlSet(o.html_selector, v);
        ajaxSet(o.url, v);
    }
}

// add persistent objects here
var idahoObjects = [];

function decodeURLSymbol(c) {
    if (c.charCodeAt(0) >= '0'.charCodeAt(0)
            && c.charCodeAt(0) <= '9'.charCodeAt(0))
                return c.charCodeAt(0) - '0'.charCodeAt(0);
    
    if (c.charCodeAt(0) >= 'a'.charCodeAt(0)
            && c.charCodeAt(0) <= 'f'.charCodeAt(0))
                return c.charCodeAt(0) - 'a'.charCodeAt(0) + 10;

    if (c.charCodeAt(0) >= 'A'.charCodeAt(0)
            && c.charCodeAt(0) <= 'F'.charCodeAt(0))
                return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
    
    return -1;
}

function decodeURLString(s) {
    var i = 0;
    var r = "";
    
    while (i < s.length) {
        if (s.charAt(i) == '%') {
            ++i;
            
            var k = 0, p;
            
            while ((p = decodeURLSymbol(s.charAt(i))) != -1) {
                k = (k << 4) | p;
                ++i;
            }
            
            r += String.fromCharCode(k);
        } else {
            r += s.charAt(i);
            
            ++i;
        }
    }
    
    return r;
}

function argsEquivalent(a, b) {
    var sza = a == null ? 0 : a.length;
    var szb = b == null ? 0 : b.length;
    
    if (sza != szb) return false;
    
    for (var i = 0; i < sza; ++i) {
        if (a.at(i) != b.at(i).key) return false;
    }
    
    return true;
}

function idahoInitialize() {
    var h = window.location.href + "";
    
    if (h.indexOf('?') >= 0) {
        h = h.substring (0, h.indexOf('?'));
    }
    
    if (h.indexOf('/') >= 0) {
        h = h.substring(h.lastIndexOf('/') + 1);
    }
    
    var queryString = window.location.search + "";
    
    if (queryString.indexOf('?') == 0) {
        queryString = queryString.substring(1);
    }
    
    var e = queryString.split('+').join(' ').split('&');
    
    var args = [];
    
    for (var t in e) {
        var p = e[t].split('=');
        
        for (var i in p) {
            p[i] = decodeURLString (p[i]);
        }
        
        var j = -1;
        
        for (var i = 0; i < args.length; ++i) {
            if (args.at(i).key == p[0]) {
                j = i;
                break;
            }
        }
        
        if (j == -1) {
            args.push({ key : p[0], values: [p.length >= 2 ? p.slice(1).join('') : null] });            
        } else {
            args.at(j).values.push(p.length >= 2 ? p.slice(1).join('') : null);
        }
    }

    args.sort();

    for (var t in idahoControllers) {
        if (idahoControllers[t].args != null)
            idahoControllers[t].args.sort();
    }
    
    for (var t in idahoControllers) {
        if (idahoControllers[t].path != h || !argsEquivalent (idahoControllers[t].args, args)) {
            document.querySelectorAll(idahoControllers[t].html_selector).forEach(
                    (e) => { e.remove(); });
        }
    }
    
    for (var t in idahoControllers) {
        if (idahoControllers[t].path == h && argsEquivalent (idahoControllers[t].args, args)) {
            idahoControllers[t].controller (args);
        }
    }
    
    for (var t in idahoObjects) {
        if (idahoObjects[t].url != null) {
            ajaxGet(idahoObjects[t].html_selector, idahoObjects[t].url);
        }
    }
}
