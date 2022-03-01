(()=>{"use strict";var e={664:(e,t)=>{function r(e,t,r,o){return r-n(o-e,0,r,o)+t}function n(e,t,r,n){return(e/=n)<1/2.75?r*(7.5625*e*e)+t:e<2/2.75?r*(7.5625*(e-=1.5/2.75)*e+.75)+t:e<2.5/2.75?r*(7.5625*(e-=2.25/2.75)*e+.9375)+t:r*(7.5625*(e-=2.625/2.75)*e+.984375)+t}Object.defineProperty(t,"__esModule",{value:!0}),t.easeInQuad=function(e,t,r,n){return r*(e/=n)*e+t},t.easeOutQuad=function(e,t,r,n){return-r*(e/=n)*(e-2)+t},t.easeInOutQuad=function(e,t,r,n){return(e/=n/2)<1?r/2*e*e+t:-r/2*(--e*(e-2)-1)+t},t.easeInCubic=function(e,t,r,n){return r*(e/=n)*e*e+t},t.easeOutCubic=function(e,t,r,n){return r*((e=e/n-1)*e*e+1)+t},t.easeInOutCubic=function(e,t,r,n){return(e/=n/2)<1?r/2*e*e*e+t:r/2*((e-=2)*e*e+2)+t},t.easeInQuart=function(e,t,r,n){return r*(e/=n)*e*e*e+t},t.easeOutQuart=function(e,t,r,n){return-r*((e=e/n-1)*e*e*e-1)+t},t.easeInOutQuart=function(e,t,r,n){return(e/=n/2)<1?r/2*e*e*e*e+t:-r/2*((e-=2)*e*e*e-2)+t},t.easeInQuint=function(e,t,r,n){return r*(e/=n)*e*e*e*e+t},t.easeOutQuint=function(e,t,r,n){return r*((e=e/n-1)*e*e*e*e+1)+t},t.easeInOutQuint=function(e,t,r,n){return(e/=n/2)<1?r/2*e*e*e*e*e+t:r/2*((e-=2)*e*e*e*e+2)+t},t.easeInSine=function(e,t,r,n){return-r*Math.cos(e/n*(Math.PI/2))+r+t},t.easeOutSine=function(e,t,r,n){return r*Math.sin(e/n*(Math.PI/2))+t},t.easeInOutSine=function(e,t,r,n){return-r/2*(Math.cos(Math.PI*e/n)-1)+t},t.easeInExpo=function(e,t,r,n){return 0===e?t:r*Math.pow(2,10*(e/n-1))+t},t.easeOutExpo=function(e,t,r,n){return e===n?t+r:r*(1-Math.pow(2,-10*e/n))+t},t.easeInOutExpo=function(e,t,r,n){return 0===e?t:e===n?t+r:(e/=n/2)<1?r/2*Math.pow(2,10*(e-1))+t:r/2*(2-Math.pow(2,-10*--e))+t},t.easeInCirc=function(e,t,r,n){return-r*(Math.sqrt(1-(e/=n)*e)-1)+t},t.easeOutCirc=function(e,t,r,n){return r*Math.sqrt(1-(e=e/n-1)*e)+t},t.easeInOutCirc=function(e,t,r,n){return(e/=n/2)<1?-r/2*(Math.sqrt(1-e*e)-1)+t:r/2*(Math.sqrt(1-(e-=2)*e)+1)+t},t.easeInElastic=function(e,t,r,n){var o=1.70158,l=0,c=r;return 0===e?t:1==(e/=n)?t+r:(l||(l=.3*n),c<Math.abs(r)?(c=r,o=l/4):o=l/(2*Math.PI)*Math.asin(r/c),-c*Math.pow(2,10*(e-=1))*Math.sin((e*n-o)*(2*Math.PI)/l)+t)},t.easeOutElastic=function(e,t,r,n){var o=1.70158,l=0,c=r;return 0===e?t:1==(e/=n)?t+r:(l||(l=.3*n),c<Math.abs(r)?(c=r,o=l/4):o=l/(2*Math.PI)*Math.asin(r/c),c*Math.pow(2,-10*e)*Math.sin((e*n-o)*(2*Math.PI)/l)+r+t)},t.easeInOutElastic=function(e,t,r,n){var o=1.70158,l=0,c=r;return 0===e?t:2==(e/=n/2)?t+r:(l||(l=n*(.3*1.5)),c<Math.abs(r)?(c=r,o=l/4):o=l/(2*Math.PI)*Math.asin(r/c),e<1?c*Math.pow(2,10*(e-=1))*Math.sin((e*n-o)*(2*Math.PI)/l)*-.5+t:c*Math.pow(2,-10*(e-=1))*Math.sin((e*n-o)*(2*Math.PI)/l)*.5+r+t)},t.easeInBack=function(e,t,r,n,o){return void 0===o&&(o=1.70158),r*(e/=n)*e*((o+1)*e-o)+t},t.easeOutBack=function(e,t,r,n,o){return void 0===o&&(o=1.70158),r*((e=e/n-1)*e*((o+1)*e+o)+1)+t},t.easeInOutBack=function(e,t,r,n,o){return void 0===o&&(o=1.70158),(e/=n/2)<1?r/2*(e*e*((1+(o*=1.525))*e-o))+t:r/2*((e-=2)*e*((1+(o*=1.525))*e+o)+2)+t},t.easeInBounce=r,t.easeOutBounce=n,t.easeInOutBounce=function(e,t,o,l){return e<l/2?.5*r(2*e,0,o,l)+t:.5*n(2*e-l,0,o,l)+.5*o+t}},72:function(e,t,r){var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.Point2D=void 0;const o=n(r(657)),l=r(664),c=r(428);class a{constructor(e=0,t=0){this.x=e,this.y=t}get xy(){return[this.x,this.y]}addPoints(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}clone(){return new a(this.x,this.y)}static lerp(e,t,r){return e+r*(t-e)}lerpPoints(e,t,r){return this.x=a.lerp(e.x,t.x,r),this.y=a.lerp(e.y,t.y,r),this}multiplyScalar(e){return this.x*=e,this.y*=e,this}subPoints(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}}function i(e,t=".markdown-body"){let r=e.windowWidth,n=document.querySelector(t);return null!=n&&(r=Math.min(r,n.clientWidth)),r}t.Point2D=a,new o.default((e=>{const t=new c.Vector2(700,200),r=t.x/t.y;let n=new c.Vector2;const o="#111B24";let s=[new a(200,100),new a(500,100)],u=(new a).addPoints(s[0],s[1]).multiplyScalar(.5),f=0;e.setup=()=>{n.copy(t),e.createCanvas(...n.toArray()).parent("parent"),e.windowResized()},e.draw=()=>{!function(){f=(f+16.6)%3e3;let e=f/3e3;if(e<.5){let t=l.easeInOutCubic(2*e,0,1,1);u.lerpPoints(s[0],s[1],t)}else{let t=l.easeInOutCubic(2*(e-.5),0,1,1);u.lerpPoints(s[1],s[0],t)}}(),function(){e.clear(),e.background(o),e.scale(n.x/t.x),e.stroke(255),e.strokeWeight(3);for(let t=1;t<s.length;t++)r=s[t-1],l=s[t],e.line(r.x,r.y,l.x,l.y);var r,l;e.noStroke();for(let t of s)e.fill(255),e.circle(t.x,t.y,28),e.fill(o),e.circle(t.x,t.y,22);e.strokeWeight(3),e.stroke("#FF4136"),e.noFill(),e.circle(...u.xy,25)}()},e.windowResized=()=>{let o=i(e);o<t.x?n.set(o,Math.round(o/r)):n.copy(t),e.resizeCanvas(...n.toArray())}})),new o.default((e=>{const t=new c.Vector2(700,500),r=t.x/t.y;let n=new c.Vector2;const o="#111B24";let s=[new a(100,400),new a(200,100),new a(500,100),new a(600,400)],u=[];for(let e=0;e<s.length-1;e++)u.push(s[e].clone());let f=0;e.setup=()=>{n.copy(t),e.createCanvas(...n.toArray()).parent("parent2"),e.windowResized()},e.draw=()=>{!function(){f=(f+16.6)%3e3;let e=f/3e3,t=0;t=e<.5?l.easeInOutCubic(2*e,0,1,1):l.easeInOutCubic(2*(e-.5),0,1,1);for(let r=0;r<u.length;r++){let n=u[r];e<.5?n.lerpPoints(s[r],s[r+1],t):n.lerpPoints(s[r+1],s[r],t)}}(),function(){e.clear(),e.background(o),e.scale(n.x/t.x),e.stroke(255),e.strokeWeight(3);for(let t=0;t<s.length-1;t++)r=s[t],l=s[t+1],e.line(r.x,r.y,l.x,l.y);var r,l;e.noStroke();for(let t of s)e.fill(255),e.circle(t.x,t.y,28),e.fill(o),e.circle(t.x,t.y,22);for(let t of u)e.strokeWeight(3),e.stroke("#FF4136"),e.noFill(),e.circle(...t.xy,25)}()},e.windowResized=()=>{let o=i(e);o<t.x?n.set(o,Math.round(o/r)):n.copy(t),e.resizeCanvas(...n.toArray())}})),new o.default((e=>{const t=new c.Vector2(700,500),r=t.x/t.y;let n=new c.Vector2;const o="#111B24";let a=[new c.Vector2(100,400),new c.Vector2(200,100),new c.Vector2(500,100),new c.Vector2(600,400)],s=[];for(let e=0;e<a.length-1;e++)s.push(a[e].clone());let u=0;function f(t,r){e.line(t.x,t.y,r.x,r.y)}let h=new c.Vector2,y=new c.Vector2,p=new c.Vector2;e.setup=()=>{n.copy(t),e.createCanvas(...n.toArray()).parent("parent3"),e.windowResized()},e.draw=()=>{!function(){u=(u+16.6)%3e3;let e=u/3e3,t=0;t=e<.5?l.easeInOutCubic(2*e,0,1,1):l.easeInOutCubic(2*(e-.5),0,1,1);for(let r=0;r<s.length;r++){let n=s[r];e<.5?n.lerpVectors(a[r],a[r+1],t):n.lerpVectors(a[r+1],a[r],t)}}(),function(){e.clear(),e.background(o),e.scale(n.x/t.x),e.stroke(255),e.strokeWeight(3);for(let e=0;e<a.length-1;e++)f(a[e],a[e+1]);e.noStroke();for(let t of a)e.fill(255),e.circle(t.x,t.y,28),e.fill(o),e.circle(t.x,t.y,22);for(let t of s)e.strokeWeight(3),e.stroke("#FF4136"),e.noFill(),e.circle(...t.toArray(),25);for(let e=0;e<s.length-1;e++){h.subVectors(s[e+1],s[e]);let t=14/h.length();y.copy(h).multiplyScalar(t).add(s[e]),p.copy(h).multiplyScalar(1-t).add(s[e]),f(y,p)}}()},e.windowResized=()=>{let o=i(e);o<t.x?n.set(o,Math.round(o/r)):n.copy(t),e.resizeCanvas(...n.toArray())}})),new o.default((e=>{const t=new c.Vector2(700,500),r=t.x/t.y;let n=new c.Vector2;const o="#111B24";let a=[new c.Vector2(100,400),new c.Vector2(200,100),new c.Vector2(500,100),new c.Vector2(600,400)],s=[];for(let e=0;e<a.length-1;e++)s.push(a[e].clone());let u=[];for(let e=0;e<s.length-1;e++)u.push(s[e].clone());let f=0;function h(t,r){e.line(t.x,t.y,r.x,r.y)}let y=new c.Vector2,p=new c.Vector2,w=new c.Vector2;e.setup=()=>{n.copy(t),e.createCanvas(...n.toArray()).parent("parent4"),e.windowResized()},e.draw=()=>{!function(){f=(f+16.6)%3e3;let e=f/3e3,t=0;t=e<.5?l.easeInOutCubic(2*e,0,1,1):l.easeInOutCubic(2*(e-.5),0,1,1);for(let r=0;r<s.length;r++){let n=s[r];e<.5?n.lerpVectors(a[r],a[r+1],t):n.lerpVectors(a[r+1],a[r],t)}for(let r=0;r<u.length;r++){let n=u[r];e<.5?n.lerpVectors(s[r],s[r+1],t):n.lerpVectors(s[r+1],s[r],t)}}(),function(){e.clear(),e.background(o),e.scale(n.x/t.x),e.stroke(255),e.strokeWeight(3);for(let e=0;e<a.length-1;e++)h(a[e],a[e+1]);e.noStroke();for(let t of a)e.fill(255),e.circle(t.x,t.y,28),e.fill(o),e.circle(t.x,t.y,22);e.strokeWeight(3),e.stroke("#FF4136"),e.noFill();for(let t of s)e.circle(...t.toArray(),25);for(let e=0;e<s.length-1;e++){y.subVectors(s[e+1],s[e]);let t=14/y.length();p.copy(y).multiplyScalar(t).add(s[e]),w.copy(y).multiplyScalar(1-t).add(s[e]),h(p,w)}e.strokeWeight(3),e.stroke("#FFB700"),e.noFill();for(let t of u)e.circle(...t.toArray(),25)}()},e.windowResized=()=>{let o=i(e);o<t.x?n.set(o,Math.round(o/r)):n.copy(t),e.resizeCanvas(...n.toArray())}})),new o.default((e=>{const t=new c.Vector2(700,500),r=t.x/t.y;let n=new c.Vector2;const o="#111B24";let a=[new c.Vector2(100,400),new c.Vector2(200,100),new c.Vector2(500,100),new c.Vector2(600,400)],s=[];for(let e=0;e<a.length-1;e++)s.push(a[e].clone());let u=[];for(let e=0;e<s.length-1;e++)u.push(s[e].clone());let f=0;function h(t,r){e.line(t.x,t.y,r.x,r.y)}let y=new c.Vector2,p=new c.Vector2,w=new c.Vector2;e.setup=()=>{n.copy(t),e.createCanvas(...n.toArray()).parent("parent5"),e.windowResized()},e.draw=()=>{!function(){f=(f+16.6)%3e3;let e=f/3e3,t=0;t=e<.5?l.easeInOutCubic(2*e,0,1,1):l.easeInOutCubic(2*(e-.5),0,1,1);for(let r=0;r<s.length;r++){let n=s[r];e<.5?n.lerpVectors(a[r],a[r+1],t):n.lerpVectors(a[r+1],a[r],t)}for(let r=0;r<u.length;r++){let n=u[r];e<.5?n.lerpVectors(s[r],s[r+1],t):n.lerpVectors(s[r+1],s[r],t)}}(),function(){e.clear(),e.background(o),e.scale(n.x/t.x),e.stroke(255),e.strokeWeight(3);for(let e=0;e<a.length-1;e++)h(a[e],a[e+1]);e.noStroke();for(let t of a)e.fill(255),e.circle(t.x,t.y,28),e.fill(o),e.circle(t.x,t.y,22);e.strokeWeight(3),e.stroke("#FF4136"),e.noFill();for(let t of s)e.circle(...t.toArray(),25);for(let e=0;e<s.length-1;e++){y.subVectors(s[e+1],s[e]);let t=14/y.length();p.copy(y).multiplyScalar(t).add(s[e]),w.copy(y).multiplyScalar(1-t).add(s[e]),h(p,w)}e.strokeWeight(3),e.stroke("#FFB700"),e.noFill();for(let t of u)e.circle(...t.toArray(),25);for(let e=0;e<u.length-1;e++){y.subVectors(u[e+1],u[e]);let t=14/y.length();p.copy(y).multiplyScalar(t).add(u[e]),w.copy(y).multiplyScalar(1-t).add(u[e]),h(p,w)}}()},e.windowResized=()=>{let o=i(e);o<t.x?n.set(o,Math.round(o/r)):n.copy(t),e.resizeCanvas(...n.toArray())}})),new o.default((e=>{const t=new c.Vector2(700,500),r=t.x/t.y;let n=new c.Vector2;const o="#111B24";let a=[new c.Vector2(100,400),new c.Vector2(200,100),new c.Vector2(500,100),new c.Vector2(600,400)],s=[];for(let e=0;e<a.length-1;e++)s.push(a[e].clone());let u=[];for(let e=0;e<s.length-1;e++)u.push(s[e].clone());let f=new c.Vector2,h=0;function y(t,r){e.line(t.x,t.y,r.x,r.y)}let p=new c.Vector2,w=new c.Vector2,d=new c.Vector2;e.setup=()=>{n.copy(t),e.createCanvas(...n.toArray()).parent("parent6"),e.windowResized()},e.draw=()=>{!function(){h=(h+16.6)%3e3;let e=h/3e3,t=0;t=e<.5?l.easeInOutCubic(2*e,0,1,1):l.easeInOutCubic(2*(e-.5),0,1,1);for(let r=0;r<s.length;r++){let n=s[r];e<.5?n.lerpVectors(a[r],a[r+1],t):n.lerpVectors(a[r+1],a[r],t)}for(let r=0;r<u.length;r++){let n=u[r];e<.5?n.lerpVectors(s[r],s[r+1],t):n.lerpVectors(s[r+1],s[r],t)}e<.5?f.lerpVectors(u[0],u[1],t):f.lerpVectors(u[1],u[0],t)}(),function(){e.clear(),e.background(o),e.scale(n.x/t.x),e.stroke(255),e.strokeWeight(3);for(let e=0;e<a.length-1;e++)y(a[e],a[e+1]);e.noStroke();for(let t of a)e.fill(255),e.circle(t.x,t.y,28),e.fill(o),e.circle(t.x,t.y,22);e.strokeWeight(3),e.stroke("#FF4136"),e.noFill();for(let t of s)e.circle(...t.toArray(),25);for(let e=0;e<s.length-1;e++){p.subVectors(s[e+1],s[e]);let t=14/p.length();w.copy(p).multiplyScalar(t).add(s[e]),d.copy(p).multiplyScalar(1-t).add(s[e]),y(w,d)}e.strokeWeight(3),e.stroke("#FFB700"),e.noFill();for(let t of u)e.circle(...t.toArray(),25);for(let e=0;e<u.length-1;e++){p.subVectors(u[e+1],u[e]);let t=14/p.length();w.copy(p).multiplyScalar(t).add(u[e]),d.copy(p).multiplyScalar(1-t).add(u[e]),y(w,d)}e.strokeWeight(3),e.stroke("#19A974"),e.noFill(),e.circle(...f.toArray(),25)}()},e.windowResized=()=>{let o=i(e);o<t.x?n.set(o,Math.round(o/r)):n.copy(t),e.resizeCanvas(...n.toArray())}})),new o.default((e=>{const t=new c.Vector2(700,500),r=t.x/t.y;let n=new c.Vector2;const o="#111B24";let a=[new c.Vector2(100,400),new c.Vector2(200,100),new c.Vector2(500,100),new c.Vector2(600,400)],s=[];for(let e=0;e<a.length-1;e++)s.push(a[e].clone());let u=[];for(let e=0;e<s.length-1;e++)u.push(s[e].clone());let f=new c.Vector2,h=[],y=[],p=!1,w=0,d=0;function x(t,r){e.line(t.x,t.y,r.x,r.y)}let V=new c.Vector2,g=new c.Vector2,k=new c.Vector2;e.setup=()=>{n.copy(t),e.createCanvas(...n.toArray()).parent("parent7"),e.windowResized()},e.draw=()=>{!function(){w=(w+16.6)%3e3;let e=w/3e3;d=0,d=e<.5?l.easeInOutCubic(2*e,0,1,1):l.easeInOutCubic(2*(e-.5),1,-1,1);for(let e=0;e<s.length;e++)s[e].lerpVectors(a[e],a[e+1],d);for(let e=0;e<u.length;e++)u[e].lerpVectors(s[e],s[e+1],d);f.lerpVectors(u[0],u[1],d),p||(e<=.5?(h.push(f.clone()),y.push(d)):p=!0)}(),function(){e.clear(),e.background(o),e.scale(n.x/t.x),e.stroke(255),e.strokeWeight(3);for(let e=0;e<a.length-1;e++)x(a[e],a[e+1]);e.noStroke();for(let t of a)e.fill(255),e.circle(t.x,t.y,28),e.fill(o),e.circle(t.x,t.y,22);e.strokeWeight(3),e.stroke("#FF4136"),e.noFill();for(let t of s)e.circle(...t.toArray(),25);for(let e=0;e<s.length-1;e++){V.subVectors(s[e+1],s[e]);let t=14/V.length();g.copy(V).multiplyScalar(t).add(s[e]),k.copy(V).multiplyScalar(1-t).add(s[e]),x(g,k)}e.strokeWeight(3),e.stroke("#FFB700"),e.noFill();for(let t of u)e.circle(...t.toArray(),25);for(let e=0;e<u.length-1;e++){V.subVectors(u[e+1],u[e]);let t=14/V.length();g.copy(V).multiplyScalar(t).add(u[e]),k.copy(V).multiplyScalar(1-t).add(u[e]),x(g,k)}e.strokeWeight(3),e.stroke("#19A974"),e.noFill(),e.circle(...f.toArray(),25);for(let t=0;t<y.length;t++)y[t]<d&&e.point(...h[t].toArray())}()},e.windowResized=()=>{let o=i(e);o<t.x?n.set(o,Math.round(o/r)):n.copy(t),e.resizeCanvas(...n.toArray())}})),new o.default((e=>{const t=new c.Vector2(700,500),r=t.x/t.y;let n=new c.Vector2,o=0,a=0,s=[new c.Vector2(100,400),new c.Vector2(200,100),new c.Vector2(500,100),new c.Vector2(600,400)];e.setup=()=>{n.copy(t),e.createCanvas(...n.toArray()).parent("parent8"),e.windowResized()},e.draw=()=>{!function(){o=(o+16.6)%3e3;let e=o/3e3;a=0,a=e<.5?l.easeInOutCubic(2*e,0,1,1):l.easeInOutCubic(2*(e-.5),1,-1,1)}(),function(){e.clear(),e.background("#111B24"),e.scale(n.x/t.x),e.strokeWeight(3),e.stroke("#19A974"),e.noFill(),e.bezier(...s[0].toArray(),...s[1].toArray(),...s[2].toArray(),...s[3].toArray()),e.strokeWeight(3),e.stroke(255,100*a),e.noFill();for(let t of s)e.circle(...t.toArray(),7)}()},e.windowResized=()=>{let o=i(e);o<t.x?n.set(o,Math.round(o/r)):n.copy(t),e.resizeCanvas(...n.toArray())}}))},428:e=>{e.exports=THREE},657:e=>{e.exports=p5}},t={};!function r(n){var o=t[n];if(void 0!==o)return o.exports;var l=t[n]={exports:{}};return e[n].call(l.exports,l,l.exports,r),l.exports}(72)})();