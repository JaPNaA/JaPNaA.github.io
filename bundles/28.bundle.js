(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{20:function(e,t,c){e.exports={checkboxLabeled:"checkboxLabeled__1BF8echeckbox",label:"label__1THPicheckbox",checkbox:"checkbox__24NPEcheckbox",checked:"checked__3MBtBcheckbox",focused:"focused__78v0Ocheckbox",hiddenCheckbox:"hiddenCheckbox__16lnrcheckbox",check:"check__74fx6checkbox"}},41:function(e,t,c){"use strict";c.r(t);var n,o=c(20),i=c.n(o),h=c(4),s=c(6),r=(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var c in t)t.hasOwnProperty(c)&&(e[c]=t[c])})(e,t)},function(e,t){function c(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(c.prototype=t.prototype,new c)}),a=function(e){function t(){var t=e.call(this)||this;return t.cssName=i.a.checkbox,t.elm=document.createElement("div"),t.checkElm=t.createCheck(),t.input=t.createInput(),t.changedHandlers=new s.a,t.checked=!1,t}return r(t,e),t.prototype.setup=function(){e.prototype.setup.call(this),this.elm.appendChild(this.input),this.elm.appendChild(this.checkElm),this.elm.addEventListener("click",this.clickHandler.bind(this)),this.input.addEventListener("change",this.inputChangeHandler.bind(this)),this.input.addEventListener("focus",this.focusHandler.bind(this)),this.input.addEventListener("blur",this.blurHandler.bind(this))},t.prototype.isChecked=function(){return this.checked},t.prototype.setChecked=function(e){this.checked!==e&&(this.checked=e,this.updateState(),this.changedHandlers.dispatch(e))},t.prototype.setLabel=function(e){this.input.title=e},t.prototype.toggleChecked=function(){this.checked=!this.checked,this.updateState(),this.changedHandlers.dispatch(this.checked)},t.prototype.onChange=function(e){this.changedHandlers.add(e)},t.prototype.offChange=function(e){this.changedHandlers.remove(e)},t.prototype.createInput=function(){var e=document.createElement("input");return e.type="checkbox",e.classList.add(i.a.hiddenCheckbox),e},t.prototype.createCheck=function(){var e=document.createElement("div");return e.classList.add(i.a.check),e},t.prototype.clickHandler=function(){this.toggleChecked()},t.prototype.inputChangeHandler=function(){this.setChecked(this.input.checked)},t.prototype.focusHandler=function(){this.elm.classList.add(i.a.focused)},t.prototype.blurHandler=function(){this.elm.classList.remove(i.a.focused)},t.prototype.updateState=function(){this.checked?this.elm.classList.add(i.a.checked):this.elm.classList.remove(i.a.checked),this.input.checked=this.checked},t}(h.a),d=function(){var e=function(t,c){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var c in t)t.hasOwnProperty(c)&&(e[c]=t[c])})(t,c)};return function(t,c){function n(){this.constructor=t}e(t,c),t.prototype=null===c?Object.create(c):(n.prototype=c.prototype,new n)}}(),p=function(e){function t(t){var c=e.call(this)||this;return c.cssName=i.a.checkboxLabeled,c.elm=document.createElement("div"),c.label=t,c.labelElm=c.createLabelElm(),c.checkbox=new a,c}return d(t,e),t.prototype.setup=function(){e.prototype.setup.call(this),this.checkbox.setup(),this.checkbox.appendTo(this.elm),this.label&&(this.checkbox.setLabel(this.label),this.elm.appendChild(this.labelElm))},t.prototype.setChecked=function(e){this.checkbox.setChecked(e)},t.prototype.toggleChecked=function(){this.checkbox.toggleChecked()},t.prototype.onChange=function(e){this.checkbox.onChange(e)},t.prototype.offChange=function(e){this.checkbox.offChange(e)},t.prototype.isChecked=function(){return this.checkbox.isChecked()},t.prototype.createLabelElm=function(){if(this.label){var e=document.createElement("div");return e.classList.add(i.a.label),e.innerText=this.label,e.setAttribute("aria-hidden","true"),e}},t}(h.a);t.default=p}}]);