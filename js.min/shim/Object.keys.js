Object.keys||(Object.keys=function(){var e=Object.prototype.hasOwnProperty,t=!{toString:null}.propertyIsEnumerable("toString"),n=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],i=n.length;return function(o){if("object"!=typeof o&&"function"!=typeof o||null===o)throw new TypeError("Object.keys called on non-object");var r=[];for(var s in o)e.call(o,s)&&r.push(s);if(t)for(var u=0;i>u;u++)e.call(o,n[u])&&r.push(n[u]);return r}}());