(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{14:function(t,e,n){},15:function(t,e,n){},16:function(t,e,n){"use strict";n.r(e);var a=n(0),o=n.n(a),r=n(4),i=n.n(r),u=(n(14),n(5)),c=n(6),l=n(1),s=n(7),f=n(8),h=n(2);n(15);function p(t){var e=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}();return function(){var n,a=Object(h.a)(t);if(e){var o=Object(h.a)(this).constructor;n=Reflect.construct(a,arguments,o)}else n=a.apply(this,arguments);return Object(f.a)(this,n)}}var v=function(t){Object(s.a)(n,t);var e=p(n);function n(){var t;return Object(u.a)(this,n),(t=e.call(this)).state={inputValue:""},t.inputChange=t.inputChange.bind(Object(l.a)(t)),t}return Object(c.a)(n,[{key:"inputChange",value:function(t){this.setState({value:t.target.value}),console.log(this.state.value)}},{key:"inputSubmit",value:function(t){alert("la valeur a \xe9t\xe9 envoy\xe9e : "+this.state.value),t.preventDefault()}},{key:"render",value:function(){return o.a.createElement("div",{className:"App"},o.a.createElement("form",{method:"POST",action:"/form/signup",onSubmit:this.inputSubmit},o.a.createElement("input",{name:"username",value:this.state.value,onChange:this.inputChange}),o.a.createElement("button",{type:"submit"},"Send")))}}]),n}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(o.a.createElement(v,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})},9:function(t,e,n){t.exports=n(16)}},[[9,1,2]]]);
//# sourceMappingURL=main.4fb07eb0.chunk.js.map