(()=>{"use strict";var e={886:function(e,t,r){var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const n=o(r(657)),l=r(428);new n.default((e=>{const t=new l.Vector2(800,800),r=t.x/t.y;let o=new l.Vector2;let n=[...Array(t.x)].map((e=>Array(t.y).fill(0))),a=0,u=[],c=[];e.setup=()=>{document.querySelector("body").style.backgroundColor="#27212E",o.copy(t),e.createCanvas(...o.toArray()).parent("parent"),e.windowResized(),n[200][400]=1},e.draw=()=>{!function(){let r=performance.now();e.clear(),e.background("#111B24"),e.scale(o.x/t.x),e.strokeWeight(1),e.noStroke(),e.fill("#ED4EB3");for(let t=a;t<n.length;t++){if(performance.now()-r>14)return void(a=t);for(let r=0;r<n[t].length;r++){n[t][r]&&e.rect(t,r,1,1);let o=0==r?0:r-1,l=r==n[t].length-1?r:r+1,a=0==t?0:t-1;n[t][o]|n[a][o]|n[t][l]&&u.push([t,r]),n[t][r]&n[t][o]&n[a][o]&n[t][l]&&c.push([t,r])}}for(a=0;u.length>0;){let[e,t]=u.pop();n[e][t]=1}for(;c.length>0;){let[e,t]=c.pop();n[e][t]=0}}()},e.windowResized=()=>{let n=function(e,t=".markdown-body"){let r=e.windowWidth,o=document.querySelector(t);return null!=o&&(r=Math.min(r,o.clientWidth)),r}(e);n<t.x?o.set(n,Math.round(n/r)):o.copy(t),e.resizeCanvas(...o.toArray())}}))},428:e=>{e.exports=THREE},657:e=>{e.exports=p5}},t={};!function r(o){var n=t[o];if(void 0!==n)return n.exports;var l=t[o]={exports:{}};return e[o].call(l.exports,l,l.exports,r),l.exports}(886)})();