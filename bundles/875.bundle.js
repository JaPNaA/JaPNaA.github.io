"use strict";(self.webpackChunkjapnaa_github_io=self.webpackChunkjapnaa_github_io||[]).push([[875,269,610],{4959:(t,e,n)=>{n.r(e),n.d(e,{default:()=>p});const r="BrowseProjects__r7eHMBrowse";var o,i=n(1951),s=n(7419),u=(o=function(t,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},o(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),c=function(t,e,n,r){return new(n||(n=Promise))((function(o,i){function s(t){try{c(r.next(t))}catch(t){i(t)}}function u(t){try{c(r.throw(t))}catch(t){i(t)}}function c(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(s,u)}c((r=r.apply(t,e||[])).next())}))},a=function(t,e){var n,r,o,i,s={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(u){return function(c){return function(u){if(n)throw new TypeError("Generator is already executing.");for(;i&&(i=0,u[0]&&(s=0)),s;)try{if(n=1,r&&(o=2&u[0]?r.return:u[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,u[1])).done)return o;switch(r=0,o&&(u=[2&u[0],o.value]),u[0]){case 0:case 1:o=u;break;case 4:return s.label++,{value:u[1],done:!1};case 5:s.label++,r=u[1],u=[0];continue;case 7:u=s.ops.pop(),s.trys.pop();continue;default:if(!(o=s.trys,(o=o.length>0&&o[o.length-1])||6!==u[0]&&2!==u[0])){s=0;continue}if(3===u[0]&&(!o||u[1]>o[0]&&u[1]<o[3])){s.label=u[1];break}if(6===u[0]&&s.label<o[1]){s.label=o[1],o=u;break}if(o&&s.label<o[2]){s.label=o[2],s.ops.push(u);break}o[2]&&s.ops.pop(),s.trys.pop();continue}u=e.call(t,s)}catch(t){u=[6,t],r=0}finally{n=o=0}if(5&u[0])throw u[1];return{value:u[0]?u[1]:void 0,done:!0}}([u,c])}}};const p=function(t){function e(n,r){var o=t.call(this,n,r)||this;return o.isFullPage=!0,o.cssName=e.cssName,o.elm=document.createElement("div"),o.projectsGrid=new s.default(o.app),o}return u(e,t),e.prototype.setup=function(){return c(this,void 0,void 0,(function(){return a(this,(function(e){return t.prototype.setup.call(this),this.updateWidgetSize(),this.projectsGrid.setup(),this.projectsGrid.appendTo(this.elm),this.addEventHandlers(),[2]}))}))},e.prototype.destory=function(){return c(this,void 0,void 0,(function(){return a(this,(function(e){switch(e.label){case 0:return[4,t.prototype.destory.call(this)];case 1:return e.sent(),this.projectsGrid.destory(),[2]}}))}))},e.prototype.focus=function(){this.projectsGrid.focus()},e.prototype.canScroll=function(){return this.projectsGrid.isOverflowing()},e.prototype.addEventHandlers=function(){this.events.onResize(this.updateWidgetSize.bind(this)),this.updateWidgetSize()},e.prototype.updateWidgetSize=function(){this.projectsGrid.resize(this.app.width,this.app.height)},e.cssName=r,e}(i.Z)}}]);