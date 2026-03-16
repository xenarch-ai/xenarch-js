"use strict";var __xenarch=(()=>{var m=["GPTBot","OAI-SearchBot","ChatGPT-User","ClaudeBot","anthropic-ai","PerplexityBot","Perplexity-User","Google-Extended","Bytespider","Amazonbot","Applebot-Extended","Meta-ExternalAgent","CCBot","cohere-ai","YouBot","DuckAssistBot","Timpibot","Diffbot","Webz.io","ImagesiftBot","Omgili"];function g(e){let t=e??navigator.userAgent;if(!t)return!1;let n=t.toLowerCase();return m.some(r=>n.includes(r.toLowerCase()))}function f(){let e=document.querySelectorAll("script[src]"),t=null;for(let i of e){let p=i;if(p.src&&p.src.includes("l.js")){t=p;break}}if(!t)return null;let n=t.getAttribute("data-site-id");if(!n)return null;let r=t.getAttribute("data-api-url")||"https://xenarch.bot/v1",o;try{let i=new URL(r);if(i.protocol!=="https:"&&i.protocol!=="http:")return null;o=r}catch{return null}let l=t.getAttribute("data-price"),a;if(l){let i=parseInt(l,10);a=!isNaN(i)&&i>=0&&i<=1e4?i:void 0}return{siteId:n,apiUrl:o,price:a}}function x(e){try{let t=new URL(e);if(t.protocol!=="https:"&&t.protocol!=="http:")throw new Error("Invalid protocol");return e}catch{throw new Error(`Invalid API URL: ${e}`)}}function c(e,t){let n=e[t];if(typeof n!="string"||n.length===0)throw new Error(`Invalid response: missing or empty "${t}"`);return n}function C(e){if(!e||typeof e!="object")throw new Error("Invalid response");let t=e;return{gate_id:c(t,"gate_id"),price_usd:c(t,"price_usd"),splitter:c(t,"splitter"),collector:c(t,"collector"),network:c(t,"network"),asset:typeof t.asset=="string"?t.asset:"",verify_url:c(t,"verify_url"),expires:c(t,"expires")}}function S(e){if(!e||typeof e!="object")throw new Error("Invalid response");let t=e;return{gate_id:c(t,"gate_id"),status:c(t,"status"),price_usd:c(t,"price_usd"),paid_at:typeof t.paid_at=="string"?t.paid_at:null}}async function h(e,t,n){let r=x(e),o=await fetch(`${r}/gates`,{method:"POST",headers:{"X-Site-Token":t,"Content-Type":"application/json"},body:JSON.stringify({url:n,detection_method:"ua_match"})});if(o.status!==402&&!o.ok)throw new Error(`Gate creation failed: ${o.status}`);return C(await o.json())}async function y(e,t){let n=x(e),r=encodeURIComponent(t),o=await fetch(`${n}/gates/${r}`);if(!o.ok)throw new Error(`Gate status check failed: ${o.status}`);return S(await o.json())}var s="xenarch-gate-overlay",k=`
  #${s} {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #fff;
  }
  #${s} .xn-card {
    background: #1a1a2e;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 32px;
    max-width: 420px;
    width: 90%;
    text-align: center;
  }
  #${s} .xn-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 8px;
  }
  #${s} .xn-subtitle {
    font-size: 14px;
    color: #aaa;
    margin: 0 0 24px;
  }
  #${s} .xn-price {
    font-size: 32px;
    font-weight: 700;
    color: #4ade80;
    margin: 0 0 24px;
  }
  #${s} .xn-details {
    text-align: left;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 16px;
    margin: 0 0 24px;
    font-size: 12px;
    line-height: 1.8;
    word-break: break-all;
  }
  #${s} .xn-label {
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  #${s} .xn-status {
    font-size: 14px;
    color: #facc15;
  }
  #${s} .xn-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(250, 204, 21, 0.3);
    border-top-color: #facc15;
    border-radius: 50%;
    animation: xn-spin 0.8s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }
  @keyframes xn-spin {
    to { transform: rotate(360deg); }
  }
`;function d(e,t){let n=document.createElement("div"),r=document.createElement("span");return r.className="xn-label",r.textContent=e,n.appendChild(r),n.appendChild(document.createTextNode(" "+t)),n}function w(e){if(!document.getElementById("xenarch-gate-styles")){let u=document.createElement("style");u.id="xenarch-gate-styles",u.textContent=k,document.head.appendChild(u)}let t=document.createElement("div");t.id=s;let n=document.createElement("div");n.className="xn-card";let r=document.createElement("p");r.className="xn-title",r.textContent="This content requires payment";let o=document.createElement("p");o.className="xn-subtitle",o.textContent="AI agent access via Xenarch";let l=document.createElement("p");l.className="xn-price",l.textContent=`$${e.price_usd}`;let a=document.createElement("div");a.className="xn-details",a.appendChild(d("Network:",e.network)),a.appendChild(d("Asset:",e.asset||"USDC")),a.appendChild(d("Splitter:",e.splitter)),a.appendChild(d("Collector:",e.collector)),a.appendChild(d("Gate ID:",e.gate_id));let i=document.createElement("p");i.className="xn-status";let p=document.createElement("span");p.className="xn-spinner",i.appendChild(p),i.appendChild(document.createTextNode("Waiting for payment\u2026")),n.append(r,o,l,a,i),t.appendChild(n),document.body.appendChild(t)}function b(){let e=document.getElementById(s);e&&e.remove();let t=document.getElementById("xenarch-gate-styles");t&&t.remove()}var v=3e3,I=6e5;function _(e,t){let n=Date.now(),r=async()=>{if(!(Date.now()-n>I)){try{if((await y(e,t)).status==="paid"){b(),sessionStorage.setItem(`xenarch_gate_${t}`,"paid");return}}catch{}setTimeout(r,v)}};setTimeout(r,v)}async function E(){if(!g())return;let e=f();if(e)try{let t=await h(e.apiUrl,e.siteId,window.location.href);w(t),_(e.apiUrl,t.gate_id)}catch{}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",E):E();})();
