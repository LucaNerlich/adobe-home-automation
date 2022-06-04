(()=>{var C=new Map;function M(n,a){var e;a&&(C.has(n)?(e=C.get(n))==null||e.push(a):C.set(n,[a]))}var b=[],w="provider",V="provider-form",B="consumer",T="consumer-form";function u(){let n=()=>Math.floor((1+Math.random())*65536).toString(16).substring(1);return n()+"-"+n()+"-"+n()+"-"+n()+"-"+n()}function y(){return document.getElementById(B)}function O(){return document.getElementById(w)}function I(n,a,e){return new CustomEvent(n,{detail:{id:a,value:e}})}var S=class{};var h=class{},v=(e=>(e.BOOLEAN_STRATEGY="BOOLEAN_STRATEGY",e.NUMBER_STRATEGY="NUMBER_STRATEGY",e))(v||{});var _="bool-strategy-off",D="bool-strategy-on",c=class extends h{constructor(){super(...arguments);this.strategyType="BOOLEAN_STRATEGY"}static parseValue(e){return e.value>0||e.value<0||e.value==="true"||e.value===!0}static setValue(e,t){e?(t.textContent="ON",t.classList.contains(_)&&t.classList.remove(_),t.classList.add(D)):(t.textContent="OFF",t.classList.contains(D)&&t.classList.remove(D),t.classList.add(_))}createProviderElement(e,t){let r=u(),s=document.createElement("form");s.classList.add("bool-strategy-form");let m=document.createElement("label");m.textContent=t||e,m.setAttribute("for",r);let i=document.createElement("input");return i.id=r,i.setAttribute("type","checkbox"),i.setAttribute("name",t||e),i.addEventListener("click",o=>{let l=o.target,E=I(e,r,l==null?void 0:l.checked),d=C.get(e);d==null||d.forEach(g=>{g.dispatchEvent(E)})}),s.appendChild(m),s.appendChild(i),s}createConsumerElement(e,t){let r=c.parseValue(t),s=document.createElement("span");return c.setValue(r,s),s.addEventListener(e,this.update),M(e,s),s}update(e){let t=e.detail,r=this;r&&c.setValue(c.parseValue(t),r)}};var f=class extends h{constructor(){super(...arguments);this.strategyType="NUMBER_STRATEGY"}createProviderElement(e,t){let r=u(),s=document.createElement("form");s.classList.add("number-strategy-form");let m=document.createElement("label");m.textContent=t||e,m.setAttribute("for",r);let i=document.createElement("input");return i.id=r,i.setAttribute("type","number"),i.setAttribute("name",t||e),i.setAttribute("min","0"),i.setAttribute("max","1"),i.setAttribute("step","0.1"),i.setAttribute("placeholder","% max. value"),i.addEventListener("change",o=>{let l=o.target,E=I(e,r,l==null?void 0:l.valueAsNumber),d=C.get(e);d==null||d.forEach(g=>{g.dispatchEvent(E)})}),s.appendChild(m),s.appendChild(i),s}createConsumerElement(e,t){let r=document.createElement("span"),s=parseFloat(t.value);return isNaN(s)?r.textContent="N/A":r.textContent=s.toString(),r.addEventListener(e,this.update),M(e,r),r}update(e){let t=e.detail,r=this;r&&(r.textContent=t.value)}};function j(n,a){let e=document.createElement("div");if(a!=null)switch(a){case"BOOLEAN_STRATEGY".valueOf():e=new c().createProviderElement(n);break;case"NUMBER_STRATEGY".valueOf():e=new f().createProviderElement(n);break;default:console.error("Cannot create provider for non existent strategy: ",a);break}return e}function z(n,a,e){let t=null;if(e!=null)switch(e){case"BOOLEAN_STRATEGY".valueOf():t=new p(n,a,new c);break;case"NUMBER_STRATEGY".valueOf():t=new p(n,a,new f);break;default:console.error("Cannot create provider for non existent strategy: ",e);break}return t}function H(n,a){var s,m,i;let e="",t="",r=null;if(n.forEach((o,l)=>{l===L?e=A(o.toString()):l===P?r=o:l===R&&(t=o)}),e&&e.length>0&&r)switch(a){case x.PROVIDER:(s=O())==null||s.appendChild(j(e,r));break;case x.CONSUMER:let o=(m=z(e,t,r))==null?void 0:m.getElement();o&&((i=y())==null||i.appendChild(o));break;default:console.error("No device implementation exists for given type: ",a);break}}var x=(e=>(e.PROVIDER="PROVIDER",e.CONSUMER="CONSUMER",e))(x||{});var L="topic",R="name",P="strategies";function k(n){let a=document.createElement("input");return a.setAttribute("type","submit"),a.setAttribute("value",n),a}function G(n){let a=document.createElement("option");return a.setAttribute("value",n),a.textContent=n,a}function U(n){let a=u(),e=document.createElement("label");e.setAttribute("for",a),e.textContent="Use Case";let t=document.createElement("select");t.id=a,t.setAttribute("name",P),Object.keys(v).filter(r=>isNaN(Number(r))).forEach(r=>{t.appendChild(G(r))}),n.appendChild(document.createElement("br")),n.appendChild(e),n.appendChild(t)}function J(n){let a=u(),e=document.createElement("label");e.setAttribute("for",a),e.textContent="Available Topics";let t=document.createElement("select");t.id=a,t.setAttribute("name",L),b.forEach(r=>{t.appendChild(G(r))}),n.appendChild(document.createElement("br")),n.appendChild(e),n.appendChild(t)}function Y(n){let a=u(),e=document.createElement("span");return e.setAttribute("role","error"),e.id=a,e.style.display="none",e.style.color="red",e.textContent=n,e}function A(n){return n==null?void 0:n.replaceAll(" ","-")}function K(n){if(n){let a=u(),e=document.createElement("label");e.setAttribute("for",a),e.textContent="Topic";let t=document.createElement("input");t.id=a,t.setAttribute("type","text"),t.setAttribute("name",L),t.setAttribute("placeholder","Kitchen-Light"),t.setAttribute("required","true"),n.appendChild(e),n.appendChild(t),U(n);let r=k("Add Provider"),s=Y("Invalid: Duplicate Topic");n.appendChild(r),n.appendChild(s),n.addEventListener("submit",m=>{m.preventDefault();let i=m.target,o=new FormData(i),l=!0;o.forEach((E,d)=>{if(d===L){let g=A(E.toString());b.includes(g)?(s.style.display="",l=!1):(b.push(g),l=!0)}}),l&&(N(document.getElementById(T)),s.style.display="none",i.reset(),H(o,"PROVIDER"))})}}function N(n){if(n){n.innerHTML="";let a=u(),e=document.createElement("label");e.setAttribute("for",a),e.textContent="Name";let t=document.createElement("input");t.id=a,t.setAttribute("type","text"),t.setAttribute("name",R),t.setAttribute("placeholder","Kitchen-Light 1"),t.setAttribute("required","true"),n.appendChild(e),n.appendChild(t),J(n),U(n);let r=k("Add Consumer"),s=Y("Invalid: Name cannot be empty.");n.appendChild(r),n.appendChild(s),n.addEventListener("submit",m=>{m.preventDefault();let i=m.target,o=new FormData(i),l=!0;o.forEach((E,d)=>{d===R&&(E.toString().trim().length===0?l=!1:l=!0)}),l&&(s.style.display="none",i.reset(),H(o,"CONSUMER"))})}}var p=class extends S{constructor(e,t,r){super();this.id=u(),this.topic=A(e),this.label=t,this.strategy=r}static getConsumerWrapper(e,t){let r=document.createElement("div");return r.id=e,r.classList.add("consumer-item"),t&&t.length>0&&r.setAttribute("data-label",t),r}getElement(){let e=p.getConsumerWrapper(this.id,this.getLabel());e.textContent=this.getLabel()+": ",e.appendChild(this.getDisplayElement());let t=document.createElement("p");return t.textContent=this.topic,e.appendChild(t),e}getDisplayElement(){return this.strategy.createConsumerElement(this.topic,{label:this.label,id:this.id,value:!1})}getLabel(){return this.label?this.label:"simple-consumer"}};function Re(n,a){return n+a}var W;(W=document.getElementById("load-demo-button"))==null||W.addEventListener("click",n=>{let a="light-1",e="light-2",t="heating-1";b.push(a),b.push(e),b.push(t),N(document.getElementById(T));let r=O(),s=new c().createProviderElement(a);r==null||r.appendChild(s);let m=new c().createProviderElement(e);r==null||r.appendChild(m);let i=new f().createProviderElement(t);r==null||r.appendChild(i);let o=y(),l=new p(a,"Kitchen - Light (Left)",new c);o==null||o.appendChild(l.getElement());let E=new p(a,"Kitchen - Light (Right)",new c);o==null||o.appendChild(E.getElement());let d=new p(e,"Living Room - Light (All)",new c);o==null||o.appendChild(d.getElement());let g=new p(t,"Living Room - (Heating)",new f);o==null||o.appendChild(g.getElement());let F=n.target;F.disabled=!0,F.style.display="none"});K(document.getElementById(V));N(document.getElementById(T));var q;(q=document.getElementById("load-demo-button"))==null||q.click();})();
