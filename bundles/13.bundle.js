(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{113:function(t,n,o){"use strict";o.r(n);var e,r=o(72),a=o.n(r),i=o(15),c=o.n(i),u=o(59),l=o(30),s=o(8),p=o(44),f=(e=function(t,n){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var o in n)n.hasOwnProperty(o)&&(t[o]=n[o])})(t,n)},function(t,n){function o(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}),d=function(t){function n(n,o){var e=t.call(this,n,o)||this;return e.cssName=a.a.About,e.isFullPage=!0,e.maybeInlinedContent=new p.a("/assets/views/about.html"),e.scrollingElm=e.elm=document.createElement("div"),e.contentContainer=e.createContentContainer(),e.elm.appendChild(e.contentContainer),e.viewComponents.push(e.saveScroll=new l.a(e,e.privateData)),e}return f(n,t),n.prototype.setup=function(){var n=this;t.prototype.setup.call(this);var o=new u.default(this.app);this.maybeInlinedContent.onLoad((function(t){o.setSource(t),o.setup().then((function(){return n.saveScroll.apply()})),o.appendTo(n.contentContainer)}))},n.prototype.createContentContainer=function(){var t=document.createElement("div");return t.classList.add(c.a.longTextContainer),t},n}(s.a);n.default=d},15:function(t,n,o){t.exports={longTextContainer:"longTextContainer__2Glixcommon",flatButton:"flatButton__InH9Bcommon"}},18:function(t,n,o){"use strict";function e(t){return t<.5?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1}o.d(n,"a",(function(){return e})),o.d(n,"c",(function(){return a})),o.d(n,"b",(function(){return i}));var r=Math.pow(2,-10);function a(t){return 1-Math.pow(2,-10*t)+r}function i(t){return((t*=2)<=1?Math.pow(2,10*t-10)-r:2-Math.pow(2,10-10*t)+r)/2}},30:function(t,n,o){"use strict";var e,r=o(18),a=(e=function(t,n){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var o in n)n.hasOwnProperty(o)&&(t[o]=n[o])})(t,n)},function(t,n){function o(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}),i=function(t,n,o,e){return new(o||(o=Promise))((function(r,a){function i(t){try{u(e.next(t))}catch(t){a(t)}}function c(t){try{u(e.throw(t))}catch(t){a(t)}}function u(t){var n;t.done?r(t.value):(n=t.value,n instanceof o?n:new o((function(t){t(n)}))).then(i,c)}u((e=e.apply(t,n||[])).next())}))},c=function(t,n){var o,e,r,a,i={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return a={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function c(a){return function(c){return function(a){if(o)throw new TypeError("Generator is already executing.");for(;i;)try{if(o=1,e&&(r=2&a[0]?e.return:a[0]?e.throw||((r=e.return)&&r.call(e),0):e.next)&&!(r=r.call(e,a[1])).done)return r;switch(e=0,r&&(a=[2&a[0],r.value]),a[0]){case 0:case 1:r=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,e=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!(r=(r=i.trys).length>0&&r[r.length-1])&&(6===a[0]||2===a[0])){i=0;continue}if(3===a[0]&&(!r||a[1]>r[0]&&a[1]<r[3])){i.label=a[1];break}if(6===a[0]&&i.label<r[1]){i.label=r[1],r=a;break}if(r&&i.label<r[2]){i.label=r[2],i.ops.push(a);break}r[2]&&i.ops.pop(),i.trys.pop();continue}a=n.call(t,i)}catch(t){a=[6,t],e=0}finally{o=r=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,c])}}},u=function(t){function n(n,o){var e=t.call(this)||this;return e.privateData=o,e.initalScrollTop=o.scrollTop||0,e.elm=n.scrollingElm,e}return a(n,t),n.prototype.setup=function(){this.privateData.scrollTop=this.privateData.scrollTop||0},n.prototype.destory=function(){},n.prototype.updatePrivateData=function(){this.privateData.scrollTop=this.elm.scrollTop},n.prototype.apply=function(){this.elm.scrollBy(0,this.initalScrollTop)},n.prototype.applyScrollDownWithTransition=function(){return i(this,void 0,void 0,(function(){function t(c){var u=(c-i)/n.scrollTransitionSpeed;u<0?(u=0,requestAnimationFrame(t)):u>1?u=1:requestAnimationFrame(t);var l=o*Object(r.c)(u)-a;e.scrollBy(0,l),a+=Math.floor(l)}var o,e,a,i;return c(this,(function(n){return(o=this.initalScrollTop-this.elm.scrollTop)<=0?[2]:(e=this.elm,a=0,i=performance.now(),requestAnimationFrame(t),[2])}))}))},n.prototype.hasScrolled=function(){return 0!==this.initalScrollTop},n.scrollTransitionSpeed=800,n}((function(){}));n.a=u},44:function(t,n,o){"use strict";var e=o(5),r=o(6),a=function(){function t(t){this.absolutePath=t,this.loaded=!1,this.loadHandlers=new r.a,this.setup()}return t.prototype.onLoadPromise=function(){var t=this;return this.loaded?Promise.resolve(this.data):new Promise((function(n){return t.loadHandlers.add((function(t){return n(t)}))}))},t.prototype.onLoad=function(t){this.loaded&&t(this.data),this.loadHandlers.add(t)},t.prototype.offLoad=function(t){this.loadHandlers.remove(t)},t.prototype.setup=function(){this.loadPreloadInDocument(),this.loaded||this.loadFromNetwork()},t.prototype.loadPreloadInDocument=function(){var t="viewMaybeInlinedContent:"+btoa(this.absolutePath),n=document.getElementById(t);n&&this.dispatchLoaded(this.unescapeForXML(n.innerHTML))},t.prototype.loadFromNetwork=function(){var t=this;e.a.loadText(this.absolutePath).onLoad((function(n){t.dispatchLoaded(n.data)}))},t.prototype.dispatchLoaded=function(t){this.data=t,this.loaded=!0,this.loadHandlers.dispatch(t)},t.prototype.unescapeForXML=function(t){return t.replace(/&amp;/g,"&").replace(/&apos;/g,"'").replace(/&quot;/g,'"').replace(/&gt;/g,">").replace(/&lt;/g,"<")},t}();n.a=a},72:function(t,n,o){t.exports={About:"About__1Q-RVAbout"}}}]);