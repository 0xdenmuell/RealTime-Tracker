(()=>{"use strict";var t={d:(e,n)=>{for(var r in n)t.o(n,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:n[r]})}};let e;async function n(t){t.toBlob((r=>{const o=new FormData;o.append("file",r,"frame.jpg"),fetch("http://localhost:8000/api/v1/recognition/recognize",{method:"POST",headers:{"x-api-key":"8ae55877-1be4-4be4-8d86-3f72340023dc"},body:o}).then((r=>{if(200!==r.status)throw new Error(`Error: ${r.status} ${r.statusText}`);console.log("Recognition success"),E(),clearInterval(e),e=setInterval((function(){n(t)}),5e3)})).catch((r=>{I(),clearInterval(e),e=setInterval((function(){n(t)}),2e3),console.log("Recognition failed:",r)}))}),"image/jpeg",.95)}t.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),t.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),(()=>{var e;t.g.importScripts&&(e=t.g.location+"");var n=t.g.document;if(!e&&n&&(n.currentScript&&"SCRIPT"===n.currentScript.tagName.toUpperCase()&&(e=n.currentScript.src),!e)){var r=n.getElementsByTagName("script");if(r.length)for(var o=r.length-1;o>-1&&(!e||!/^http(s?):/.test(e));)e=r[o--].src}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),t.p=e})(),t.d({},{Ip:()=>E,Sp:()=>I});const r=document.getElementById("live"),o=document.getElementById("canvasDisplay");let a;async function i(){try{r.srcObject=await navigator.mediaDevices.getUserMedia({video:!0}),await new Promise((t=>{r.onloadedmetadata=()=>{o.width=r.videoWidth,o.height=r.videoHeight,r.play(),t()}}));const t=o.getContext("2d"),e=()=>{t.drawImage(r,0,0,o.width,o.height),a=requestAnimationFrame(e)};e(),await n(o)}catch(t){throw new Error("Camera error:"+t.message)}}let c=[],s=null;const l=t.p+"/logo.png",d=document.getElementById("detailsList"),m=document.getElementById("workedTime"),u=document.getElementById("statusMessage"),g=document.getElementById("toggleCamera"),h=document.getElementById("exportDetails");let p,f=!1,w=!1,v=0;const y=document.createElement("div"),b=new Image;function E(){w||(s=new Date,p=setInterval((()=>function(){v++;const t=String(Math.floor(v/3600)).padStart(2,"0"),e=String(Math.floor(v%3600/60)).padStart(2,"0"),n=String(v%60).padStart(2,"0");m.textContent=`Worked Time: ${t}:${e}:${n}`}()),1e3),w=!0)}function I(){w&&(function(){if(s){const t=new Date;c.push({start:s,end:t}),s=null}}(),clearInterval(p),w=!1)}function $(t,e="info"){console.log(t),u.textContent=t,u.className=`alert alert-${e}`,u.style.display="block",setTimeout((()=>{u.style.display="none"}),5e3)}b.src=l,y.appendChild(b),g.addEventListener("click",(()=>{f?async function(){try{const t=r.srcObject;t&&t.getTracks().forEach((t=>t.stop())),r.srcObject=null,o.getContext("2d").clearRect(0,0,o.width,o.height),a&&cancelAnimationFrame(a)}catch(t){throw new Error("Error disabling the camera:"+t.message)}}().then((()=>{f=!1,g.textContent="Turn On Camera",I(),d.innerHTML="",c.forEach(((t,e)=>{const n=Math.round((t.end-t.start)/1e3),r=Math.floor(n/3600),o=Math.floor(n%3600/60),a=`${r>0?`${r}h `:""}${o>0?`${o}m `:""}${n%60}s`,i=document.createElement("li");i.className="list-group-item",i.textContent=`Interval ${e+1}: ${t.start.toLocaleTimeString()} - ${t.end.toLocaleTimeString()}, Duration: ${a}`,d.appendChild(i)}))})).catch((t=>{$(t.message,"warning")})):i().then((()=>{f=!0,g.textContent="Turn Off Camera",E(),$("Recognition successful")})).catch((t=>{$(t.message,"warning")}))})),h.addEventListener("click",(()=>{!function(){if(0===c.length)return void alert("No time intervals to export!");const t="data:text/csv;charset=utf-8,Start Time,End Time,Duration (seconds)\n"+c.map((t=>{const e=Math.round((t.end-t.start)/1e3);return`${t.start.toISOString()},${t.end.toISOString()},${e}`})).join("\n"),e=encodeURI(t),n=document.createElement("a");n.setAttribute("href",e),n.setAttribute("download","time_intervals.csv"),document.body.appendChild(n),n.click(),document.body.removeChild(n)}()}))})();