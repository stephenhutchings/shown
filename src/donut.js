function pug_attr(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
function pug_classes(s,r){return Array.isArray(s)?pug_classes_array(s,r):s&&"object"==typeof s?pug_classes_object(s):s||""}
function pug_classes_array(r,a){for(var s,e="",u="",c=Array.isArray(a),g=0;g<r.length;g++)(s=pug_classes(r[g]))&&(c&&a[g]&&(s=pug_escape(s)),e=e+u+s,u=" ");return e}
function pug_classes_object(r){var a="",n="";for(var o in r)o&&r[o]&&pug_has_own_property.call(r,o)&&(a=a+n+o,n=" ");return a}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_has_own_property=Object.prototype.hasOwnProperty;
var pug_match_html=/["&<>]/;function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;
    var locals_for_with = (locals || {});
    
    (function (Math, colors, data, description, minVal, offset, sort, stroke, styles, title, values) {
      minVal = minVal || 4
offset = offset || -25
stroke = stroke || 20
styles = styles || true
values = (sort ? [...data].sort((a, b) => a < b ? 1 : -1) : data)
const radius = (100 - stroke) / 2
const π = Math.PI
const sum = data.reduce((m, v) => m + v, 0)
const format = (v) => +v.toFixed(0)
const percent = (v) => +v.toFixed(2) + "%"
const rotate = (v) => percent(v * π * (radius / 50))
pug_html = pug_html + "\u003Csvg xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" width=\"200\" height=\"200\"\u003E";
if (styles) {
pug_html = pug_html + "\u003Cdefs\u003E\u003Cstyle\u003Esvg { overflow: visible }\ntext { text-anchor: middle; transform: translateY(0.33em); }\n.segment-arc { fill: none; }\n.segment-arc-" + (pug_escape(null == (pug_interp = stroke) ? "" : pug_interp)) + " { stroke-width: " + (pug_escape(null == (pug_interp = percent(stroke)) ? "" : pug_interp)) + " }\n\u003C\u002Fstyle\u003E\u003C\u002Fdefs\u003E";
}
if (title) {
pug_html = pug_html + "\u003Ctitle\u003E" + (pug_escape(null == (pug_interp = title) ? "" : pug_interp)) + "\u003C\u002Ftitle\u003E";
}
if (description) {
pug_html = pug_html + "\u003Cdesc\u003E" + (pug_escape(null == (pug_interp = description) ? "" : pug_interp)) + "\u003C\u002Fdesc\u003E";
}
pug_html = pug_html + "\u003Csvg x=\"50%\" y=\"50%\" role=\"presentation\"\u003E";
if (title && stroke < 50) {
pug_html = pug_html + "\u003Ctext role=\"presentation\"\u003E" + (pug_escape(null == (pug_interp = title) ? "" : pug_interp)) + "\u003C\u002Ftext\u003E";
}
// iterate values
;(function(){
  var $$obj = values;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var value = $$obj[pug_index0];
var i = data.indexOf(value)
var v = value / sum * 100
var t = i / (data.length - 1)
var key = ("0" + (~~(t * 255)).toString(16)).slice(-2)
var dashoffset = -offset
var dasharray = [v, 100 - v]
var theta = π * 2 * ((offset + v / 2) / 100)
var scale = stroke === 50 && v < 25 ? 1.2 : 1
var x = Math.cos(theta) * scale * radius
var y = Math.sin(theta) * scale * radius
offset += v
pug_html = pug_html + "\u003Cg" + (pug_attr("class", pug_classes(["segment",`segment-${key}`], [false,true]), false, false)+pug_attr("aria-label", `${format(v)}%`, true, false)+pug_attr("aria-description", i, true, false)) + "\u003E\u003Ccircle" + (pug_attr("class", pug_classes(["segment-arc",`segment-arc-${stroke}`], [false,true]), false, false)+pug_attr("r", percent(radius), true, false)+pug_attr("stroke-dashoffset", rotate(dashoffset), true, false)+pug_attr("stroke-dasharray", dasharray.map(rotate).join(" "), true, false)+pug_attr("stroke", colors && colors[i], true, false)+" role=\"presentation\"") + "\u003E\u003C\u002Fcircle\u003E";
if (v > minVal) {
pug_html = pug_html + "\u003Ctext" + (" class=\"segment-label\""+pug_attr("x", percent(x), true, false)+pug_attr("y", percent(y), true, false)+" role=\"presentation\"") + "\u003E" + (pug_escape(null == (pug_interp = format(v)) ? "" : pug_interp)) + "\u003C\u002Ftext\u003E";
}
pug_html = pug_html + "\u003C\u002Fg\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var value = $$obj[pug_index0];
var i = data.indexOf(value)
var v = value / sum * 100
var t = i / (data.length - 1)
var key = ("0" + (~~(t * 255)).toString(16)).slice(-2)
var dashoffset = -offset
var dasharray = [v, 100 - v]
var theta = π * 2 * ((offset + v / 2) / 100)
var scale = stroke === 50 && v < 25 ? 1.2 : 1
var x = Math.cos(theta) * scale * radius
var y = Math.sin(theta) * scale * radius
offset += v
pug_html = pug_html + "\u003Cg" + (pug_attr("class", pug_classes(["segment",`segment-${key}`], [false,true]), false, false)+pug_attr("aria-label", `${format(v)}%`, true, false)+pug_attr("aria-description", i, true, false)) + "\u003E\u003Ccircle" + (pug_attr("class", pug_classes(["segment-arc",`segment-arc-${stroke}`], [false,true]), false, false)+pug_attr("r", percent(radius), true, false)+pug_attr("stroke-dashoffset", rotate(dashoffset), true, false)+pug_attr("stroke-dasharray", dasharray.map(rotate).join(" "), true, false)+pug_attr("stroke", colors && colors[i], true, false)+" role=\"presentation\"") + "\u003E\u003C\u002Fcircle\u003E";
if (v > minVal) {
pug_html = pug_html + "\u003Ctext" + (" class=\"segment-label\""+pug_attr("x", percent(x), true, false)+pug_attr("y", percent(y), true, false)+" role=\"presentation\"") + "\u003E" + (pug_escape(null == (pug_interp = format(v)) ? "" : pug_interp)) + "\u003C\u002Ftext\u003E";
}
pug_html = pug_html + "\u003C\u002Fg\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fsvg\u003E\u003C\u002Fsvg\u003E";
    }.call(this, "Math" in locals_for_with ?
        locals_for_with.Math :
        typeof Math !== 'undefined' ? Math : undefined, "colors" in locals_for_with ?
        locals_for_with.colors :
        typeof colors !== 'undefined' ? colors : undefined, "data" in locals_for_with ?
        locals_for_with.data :
        typeof data !== 'undefined' ? data : undefined, "description" in locals_for_with ?
        locals_for_with.description :
        typeof description !== 'undefined' ? description : undefined, "minVal" in locals_for_with ?
        locals_for_with.minVal :
        typeof minVal !== 'undefined' ? minVal : undefined, "offset" in locals_for_with ?
        locals_for_with.offset :
        typeof offset !== 'undefined' ? offset : undefined, "sort" in locals_for_with ?
        locals_for_with.sort :
        typeof sort !== 'undefined' ? sort : undefined, "stroke" in locals_for_with ?
        locals_for_with.stroke :
        typeof stroke !== 'undefined' ? stroke : undefined, "styles" in locals_for_with ?
        locals_for_with.styles :
        typeof styles !== 'undefined' ? styles : undefined, "title" in locals_for_with ?
        locals_for_with.title :
        typeof title !== 'undefined' ? title : undefined, "values" in locals_for_with ?
        locals_for_with.values :
        typeof values !== 'undefined' ? values : undefined));
    ;;return pug_html;};
export default template;