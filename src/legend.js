function pug_attr(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;
    var locals_for_with = (locals || {});
    
    (function (colors, keys, type) {
      pug_html = pug_html + "\u003Cul\u003E";
// iterate keys
;(function(){
  var $$obj = keys;
  if ('number' == typeof $$obj.length) {
      for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
        var key = $$obj[i];
pug_html = pug_html + "\u003Cli\u003E\u003Csvg role=\"presentation\" width=\"1.5em\" height=\"0.75em\"\u003E";
if (type === "solid") {
pug_html = pug_html + "\u003Crect" + (" width=\"100%\" height=\"100%\""+pug_attr("fill", colors && colors[i], true, false)) + "\u003E\u003C\u002Frect\u003E";
}
if (type === "line") {
pug_html = pug_html + "\u003Cline" + (" x2=\"100%\" y1=\"50%\" y2=\"50%\""+pug_attr("stroke", colors && colors[i], true, false)) + "\u003E\u003C\u002Fline\u003E";
}
pug_html = pug_html + "\u003C\u002Fsvg\u003E\u003Cspan\u003E" + (null == (pug_interp = key) ? "" : pug_interp) + "\u003C\u002Fspan\u003E\u003C\u002Fli\u003E";
      }
  } else {
    var $$l = 0;
    for (var i in $$obj) {
      $$l++;
      var key = $$obj[i];
pug_html = pug_html + "\u003Cli\u003E\u003Csvg role=\"presentation\" width=\"1.5em\" height=\"0.75em\"\u003E";
if (type === "solid") {
pug_html = pug_html + "\u003Crect" + (" width=\"100%\" height=\"100%\""+pug_attr("fill", colors && colors[i], true, false)) + "\u003E\u003C\u002Frect\u003E";
}
if (type === "line") {
pug_html = pug_html + "\u003Cline" + (" x2=\"100%\" y1=\"50%\" y2=\"50%\""+pug_attr("stroke", colors && colors[i], true, false)) + "\u003E\u003C\u002Fline\u003E";
}
pug_html = pug_html + "\u003C\u002Fsvg\u003E\u003Cspan\u003E" + (null == (pug_interp = key) ? "" : pug_interp) + "\u003C\u002Fspan\u003E\u003C\u002Fli\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ful\u003E";
    }.call(this, "colors" in locals_for_with ?
        locals_for_with.colors :
        typeof colors !== 'undefined' ? colors : undefined, "keys" in locals_for_with ?
        locals_for_with.keys :
        typeof keys !== 'undefined' ? keys : undefined, "type" in locals_for_with ?
        locals_for_with.type :
        typeof type !== 'undefined' ? type : undefined));
    ;;return pug_html;};
export default template;