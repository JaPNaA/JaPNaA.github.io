"use strict";(self.webpackChunkjapnaa_github_io=self.webpackChunkjapnaa_github_io||[]).push([[110,954],{7992:(t,e,n)=>{function r(t,e,n){return e.classList.add(t.beforeTransitionIn),requestAnimationFrame((function(){return requestAnimationFrame((function(){return e.classList.add(t.afterTransitionIn)}))})),new Promise((function(r){setTimeout((function(){e.classList.remove(t.beforeTransitionIn),e.classList.remove(t.afterTransitionIn),r()}),n)}))}n.d(e,{Z:()=>r})},5110:(t,e,n)=>{n.r(e),n.d(e,{default:()=>d});const r={FrameView:"FrameView__CRYzoFrameView",destory:"destory__b1e40FrameView",beforeTransitionIn:"beforeTransitionIn__ZsjSmFrameView",afterTransitionIn:"afterTransitionIn__ptQUAFrameView",header:"header__QKwf0FrameView",close:"close__z_uCFFrameView",url:"url__QLkvUFrameView",padRight:"padRight__wXiuKFrameView",iframe:"iframe__dcv2OFrameView"};var o,i=n(1951),a=n(7954),s=n(721),c=n(7584),l=n(2181),u=n(7992),p=(o=function(t,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},o(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),f=function(t,e,n,r){return new(n||(n=Promise))((function(o,i){function a(t){try{c(r.next(t))}catch(t){i(t)}}function s(t){try{c(r.throw(t))}catch(t){i(t)}}function c(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(a,s)}c((r=r.apply(t,e||[])).next())}))},h=function(t,e){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(s){return function(c){return function(s){if(n)throw new TypeError("Generator is already executing.");for(;i&&(i=0,s[0]&&(a=0)),a;)try{if(n=1,r&&(o=2&s[0]?r.return:s[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,s[1])).done)return o;switch(r=0,o&&(s=[2&s[0],o.value]),s[0]){case 0:case 1:o=s;break;case 4:return a.label++,{value:s[1],done:!1};case 5:a.label++,r=s[1],s=[0];continue;case 7:s=a.ops.pop(),a.trys.pop();continue;default:if(!(o=a.trys,(o=o.length>0&&o[o.length-1])||6!==s[0]&&2!==s[0])){a=0;continue}if(3===s[0]&&(!o||s[1]>o[0]&&s[1]<o[3])){a.label=s[1];break}if(6===s[0]&&a.label<o[1]){a.label=o[1],o=s;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(s);break}o[2]&&a.ops.pop(),a.trys.pop();continue}s=e.call(t,a)}catch(t){s=[6,t],r=0}finally{n=o=0}if(5&s[0])throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}([s,c])}}};const d=function(t){function e(e,n){var o=t.call(this,e,n)||this;return o.cssName=r.FrameView,o.showMenuButton=!1,o.isFullPage=!0,o.iframe=null,o.path=n.stateData,o.elm=document.createElement("div"),o.header=o.createHeader(),o.closeButton=o.createCloseButton(),o.urlElm=o.createUrlElm(),o.createPadRight(),o}return p(e,t),e.prototype.setPath=function(t){this.path=t,this.urlElm.innerText=t,this.iframe&&this.setPath(t)},e.prototype.animateTransitionIn=function(){(0,u.Z)(r,this.elm,e.transitionInTime)},e.prototype.setup=function(){return f(this,void 0,void 0,(function(){return h(this,(function(e){switch(e.label){case 0:if(!this.path)throw new Error("Path not set");return[4,t.prototype.setup.call(this)];case 1:return e.sent(),c.Z.isIOS?(location.replace(this.path),[2]):(this.iframe=new a.default(this.path),this.header.classList.add(r.header),this.urlElm.innerText=this.path,this.elm.appendChild(this.header),this.iframe.setup(),this.iframe.appendTo(this.elm),this.iframe.focus(),this.addEventHandlers(),[2])}}))}))},e.prototype.destory=function(){return f(this,void 0,void 0,(function(){return h(this,(function(n){switch(n.label){case 0:return[4,t.prototype.destory.call(this)];case 1:return n.sent(),this.elm.classList.add(r.destory),[4,(0,l.Z)(e.destoryTime)];case 2:return n.sent(),[2]}}))}))},e.prototype.getState=function(){return this.path},e.prototype.addEventHandlers=function(){this.closeButton.addEventListener("click",this.closeButtonClickHandler.bind(this)),this.iframe.onClose(this.closeSelf.bind(this))},e.prototype.createHeader=function(){var t=document.createElement("div");return t.classList.add(r.header),t},e.prototype.createCloseButton=function(){var t=document.createElement("div");t.classList.add(r.close);var e=s.Z.loadImage(c.Z.path.img.close).data;return t.appendChild(e),this.header.appendChild(t),t},e.prototype.createUrlElm=function(){var t=document.createElement("div");return t.classList.add(r.url),this.header.appendChild(t),t},e.prototype.createPadRight=function(){var t=document.createElement("div");return t.classList.add(r.padRight),this.header.appendChild(t),t},e.prototype.closeButtonClickHandler=function(){this.iframe.tryClose()},e.prototype.closeSelf=function(){close()},e.destoryTime=400,e.transitionInTime=400,e}(i.Z)},7954:(t,e,n)=>{n.r(e),n.d(e,{default:()=>c});const r="iframe__KWDNriframe";var o,i=n(8416),a=n(7433),s=(o=function(t,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},o(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});const c=function(t){function e(e){var n=t.call(this)||this;return n.cssName=r,n.elm=document.createElement("iframe"),n.eventHandlers=new a.Z,n.setSrc(e),n.addEventHandlers(),n}return s(e,t),e.prototype.setSrc=function(t){this.elm.src=t},e.prototype.focus=function(){this.elm.focus()},e.prototype.close=function(){this.elm.parentElement&&this.elm.parentElement.removeChild(this.elm)},e.prototype.tryClose=function(){this.elm.src="about:blank"},e.prototype.isClosed=function(){try{return Boolean(this.elm.contentWindow&&"about:blank"===this.elm.contentWindow.location.href)}catch(t){if(t instanceof DOMException&&t.code===t.SECURITY_ERR)return!1;throw t}},e.prototype.onClose=function(t){this.eventHandlers.add(t)},e.prototype.offClose=function(t){this.eventHandlers.remove(t)},e.prototype.addEventHandlers=function(){var t=this;this.elm.addEventListener("load",(function(){t.isClosed()&&t.eventHandlers.dispatch()}))},e}(i.Z)}}]);