"use strict";(self.webpackChunkjapnaa_github_io=self.webpackChunkjapnaa_github_io||[]).push([[557],{5557:(t,e,n)=>{n.r(e),n.d(e,{default:()=>l});const i="View404__LyPjdView404";var o,s=n(1951),r=(o=function(t,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},o(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),a=function(t,e,n,i){return new(n||(n=Promise))((function(o,s){function r(t){try{h(i.next(t))}catch(t){s(t)}}function a(t){try{h(i.throw(t))}catch(t){s(t)}}function h(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(r,a)}h((i=i.apply(t,e||[])).next())}))},h=function(t,e){var n,i,o,s,r={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return s={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s;function a(a){return function(h){return function(a){if(n)throw new TypeError("Generator is already executing.");for(;s&&(s=0,a[0]&&(r=0)),r;)try{if(n=1,i&&(o=2&a[0]?i.return:a[0]?i.throw||((o=i.return)&&o.call(i),0):i.next)&&!(o=o.call(i,a[1])).done)return o;switch(i=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return r.label++,{value:a[1],done:!1};case 5:r.label++,i=a[1],a=[0];continue;case 7:a=r.ops.pop(),r.trys.pop();continue;default:if(!(o=r.trys,(o=o.length>0&&o[o.length-1])||6!==a[0]&&2!==a[0])){r=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){r.label=a[1];break}if(6===a[0]&&r.label<o[1]){r.label=o[1],o=a;break}if(o&&r.label<o[2]){r.label=o[2],r.ops.push(a);break}o[2]&&r.ops.pop(),r.trys.pop();continue}a=e.call(t,r)}catch(t){a=[6,t],i=0}finally{n=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,h])}}};const l=function(t){function e(e,n){var o=t.call(this,e,n)||this;return o.cssName=i,o.isFullPage=!1,o.elm=document.createElement("div"),o.elm.setAttribute("aria-label","404"),o.canvas=o.createCanvas(),o.X=o.canvas.getContext("2d"),o.width=o.canvas.width,o.height=o.canvas.height,o.mouseX=o.width/2,o.mouseY=o.height/2,o.elm.appendChild(o.canvas),o}return r(e,t),e.prototype.setup=function(){t.prototype.setup.call(this),this.X&&(this.mouseMoveHandler=this.mouseMoveHandler.bind(this),this.canvas.addEventListener("mousemove",this.mouseMoveHandler),this.draw()),this.resizeHandler=this.resizeHandler.bind(this),this.events.onResize(this.resizeHandler),this.resizeHandler()},e.prototype.destory=function(){return a(this,void 0,void 0,(function(){return h(this,(function(e){switch(e.label){case 0:return[4,t.prototype.destory.call(this)];case 1:return e.sent(),this.X&&this.canvas.removeEventListener("mousemove",this.mouseMoveHandler),removeEventListener("resize",this.resizeHandler),[2]}}))}))},e.prototype.createCanvas=function(){var t=document.createElement("canvas");return t.width=innerWidth,t.height=innerHeight,t},e.prototype.mouseMoveHandler=function(t){this.mouseX=t.offsetX,this.mouseY=t.offsetY,this.draw()},e.prototype.resizeHandler=function(){this.width=this.canvas.width=this.app.width,this.height=this.canvas.height=this.app.height,this.draw()},e.prototype.draw=function(){this.X.globalCompositeOperation="source-over",this.X.fillStyle="#242424",this.X.fillRect(0,0,this.canvas.width,this.canvas.height);var t=this.X.createRadialGradient(this.mouseX,this.mouseY,84,this.width/2,0,0);t.addColorStop(0,"#4F4F4F"),t.addColorStop(1,"#FFFFFF"),this.X.fillStyle=t,this.X.fillRect(0,0,this.canvas.width,this.canvas.height),this.X.textBaseline="middle",this.X.textAlign="center",this.X.fillStyle="#000000",this.X.font="128px Consolas, monospace",this.X.globalCompositeOperation="destination-atop",this.X.fillText("404",this.width/2,this.height/2)},e}(s.Z)}}]);