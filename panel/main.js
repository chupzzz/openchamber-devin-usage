(()=>{var Z="openchamber.sdk",k=1;var v_=`
:root {
  /* Quiet at rest like the app's own thumbs; hover gives a clear grab target. */
  --oc-scrollbar-thumb: color-mix(in srgb, var(--oc-muted, currentColor) 18%, transparent);
  --oc-scrollbar-thumb-hover: color-mix(in srgb, var(--oc-muted, currentColor) 36%, transparent);
  scrollbar-gutter: stable;
}
* {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
:hover, [data-oc-scrolling] {
  scrollbar-color: var(--oc-scrollbar-thumb) transparent;
}
/* Chromium's standard scrollbar properties otherwise override its pseudo-elements. */
@supports selector(::-webkit-scrollbar) {
  *, :hover, [data-oc-scrolling] { scrollbar-width: auto; scrollbar-color: auto; }
  ::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 999px;
    min-width: 24px;
    min-height: 24px;
  }
  :hover::-webkit-scrollbar-thumb, [data-oc-scrolling]::-webkit-scrollbar-thumb { background: var(--oc-scrollbar-thumb); }
  ::-webkit-scrollbar-thumb:hover { background: var(--oc-scrollbar-thumb-hover); }
  ::-webkit-scrollbar-corner { background: transparent; }
  ::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
}
@media (forced-colors: active) {
  *, :hover, [data-oc-scrolling] { scrollbar-color: auto; }
  ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb:hover { background: CanvasText; }
}
`;function u_(_){let U=_.documentElement;if(U.hasAttribute("data-oc-scrollbar-activity"))return;U.setAttribute("data-oc-scrollbar-activity","");let G=new WeakMap;_.addEventListener("scroll",(E)=>{let X=E.target===_?U:E.target;if(!(X instanceof Element))return;if(!X.hasAttribute("data-oc-scrolling"))X.setAttribute("data-oc-scrolling","");let A=G.get(X);if(A!==void 0)clearTimeout(A);G.set(X,setTimeout(()=>{G.delete(X),X.removeAttribute("data-oc-scrolling")},1000))},{capture:!0,passive:!0})}var qS=`(${u_.toString()})(document);`;var l_=128,n_=65536;var z_=128;var C_=65536;var oT=/^[a-z][a-z0-9-]{0,39}$/;var uT=(_)=>Object(_)===_&&!Array.isArray(_),o_=(_,U)=>Object.keys(_).every((G)=>U.includes(G)),lT=(_)=>String(_)===_&&_.length>=1&&_.length<=60,nT=(_)=>String(_)===_&&_.length>=1&&_.length<=80,iT=(_)=>{if(!Array.isArray(_)||_.length>4)return!1;let U=new Set;for(let G of _){if(!uT(G)||!oT.test(G.id)||!lT(G.label))return!1;if(G.disabled!==void 0&&G.disabled!==!0&&G.disabled!==!1)return!1;if(U.has(G.id))return!1;if(U.add(G.id),G.kind==="button"){if(!o_(G,["kind","id","label","disabled"]))return!1;continue}if(G.kind!=="select"||!o_(G,["kind","id","label","value","options","disabled"]))return!1;if(!nT(G.value)||!Array.isArray(G.options)||G.options.length<1||G.options.length>16)return!1;let E=new Set;for(let X of G.options){if(!uT(X)||!o_(X,["value","label"])||!nT(X.value)||!lT(X.label)||E.has(X.value))return!1;E.add(X.value)}if(!E.has(G.value))return!1}return!0};var J_=20000000,F_=256;var i_=(_)=>("bytes"in _)?_.bytes.byteLength:_.content.length,aT=(_,U)=>{if(_.path!==U.path||_.readOnly!==U.readOnly)return!1;if(_.encoding==="text"||U.encoding==="text")return _.encoding==="text"&&U.encoding==="text"&&_.content===U.content;if(_.bytes.byteLength!==U.bytes.byteLength)return!1;for(let G=0;G<_.bytes.byteLength;G+=1)if(_.bytes[G]!==U.bytes[G])return!1;return!0};var rT=/^[A-Za-z0-9_-]{1,80}$/;var sT=["left","right","top","bottom"];var tT=(_,U=0,G={remaining:16000})=>{if(--G.remaining<0||U>=32)return!1;if(_===null)return!0;let E=Array.isArray(_)?_:Object(_)===_?Object.values(_):[];for(let X of E)if(!tT(X,U+1,G))return!1;return!0},a_=(_)=>{if(_===null||_===!0||_===!1)return!0;if(Array.isArray(_))return Object.keys(_).every((U)=>/^(0|[1-9]\d*)$/.test(U)&&Number(U)<_.length)&&_.every(a_);if(Object(_)===_){let U=Object.getPrototypeOf(_);return(U===null||U===Object.prototype)&&Object.values(_).every(a_)}return String(_)===_||Number.isFinite(_)},r_=(_)=>{try{if(String(_.id)!==_.id||!rT.test(_.id)||!Number.isFinite(_.anchor.x)||Math.abs(_.anchor.x)>1e5||!Number.isFinite(_.anchor.y)||Math.abs(_.anchor.y)>1e5||!Number.isFinite(_.anchor.width)||!Number.isFinite(_.anchor.height)||_.anchor.width<=0||_.anchor.height<=0||_.anchor.width>1e5||_.anchor.height>1e5||!Number.isInteger(_.width)||_.width<160||_.width>640||!Number.isInteger(_.height)||_.height<48||_.height>480||_.side!==void 0&&!sT.includes(_.side)||_.focus!==void 0&&_.focus!==!0&&_.focus!==!1||!tT(_.data)||!a_(_.data))return!1;return JSON.stringify(_.data).length<=16000}catch{return!1}};var _S=["file","directory","other","missing"],t_=(_)=>Boolean(_&&"sessionId"in _),e_=(_)=>Boolean(_&&"sent"in _&&!("sessionId"in _));var TS=/^[0-9a-f]{7,64}$/i,_T=(_)=>TS.test(_),B_=500,I_=32000,SS=16000,US=128,GS=200,ES=2000,AS=16000,MS=80,XS=200,$S=16000;var OS=2000;var TT=20000,j_=1024,K_=2000000;var P_=64000,L_=8000,ST=4000;var UT=960000;var fS=999,DS=1e4,Y_=500,WS=["HOST_UNAVAILABLE","HOST_TIMEOUT","HOST_REJECTED","DISCONNECTED","DISABLED","BAD_PATH","NO_INTEGRATION","NO_SERVICE","SERVICE_FAILED","REQUEST_FAILED","RESPONSE_TOO_LARGE","NO_SESSION","SESSION_BUSY","NOT_GRANTED","NO_DIRECTORY","NOT_FOUND","FILE_TOO_LARGE","DENIED","NO_MODEL","MODEL_FAILED","UNSUPPORTED"],YS=["stopped","starting","ready","failed"],yS=new Set(WS),QS=(_)=>yS.has(_),ZS=(_)=>_&&QS(_)?_:"HOST_REJECTED",A_=(_)=>{if(_===void 0)return!1;if(_===null||_===!0||_===!1)return!0;if(String(_)===_)return!0;if(Number(_)===_)return Number.isFinite(_);if(Array.isArray(_))return _.every(A_);if(Object(_)===_)return Object.values(_).every(A_);return!1},kS=(_)=>A_(_)&&JSON.stringify(_).length<=$S,eT=(_)=>_?.trim().slice(0,XS)??"",M_=(_)=>{let U=_.id.trim().slice(0,US),G=_.title.trim().slice(0,GS),E=_.url.trim().slice(0,ES),X=_.text?.trim().slice(0,AS),A=_.author?.trim().slice(0,MS),Q=_.kind==="pull"?"pull":"issue",D={providerId:_.providerId.trim(),id:U,title:G||U,url:E,kind:Q};if(X)D.text=X;if(A)D.author=A;if(Q==="pull"){let V=eT(_.branches?.head),P=eT(_.branches?.base);if(V&&P)D.branches={head:V,base:P}}if(kS(_.data))D.data=_.data;return D},GT=(_)=>{let U=M_(_);if(_.projectId)U.projectId=_.projectId;if(_.navigation)U.navigation=_.navigation;if(_.worktree)U.worktree=_.worktree;return U},ET=(_)=>{let U={text:_.text.trim().slice(0,SS)};if(_.send)U.send=!0;return U},AT=(_)=>{if(_===null||!Number.isFinite(_))return null;return Math.min(fS,Math.max(0,Math.round(_)))},MT=(_)=>{if(!Number.isFinite(_))return 0;return Math.min(DS,Math.max(0,Math.ceil(_)))};var X_=(_)=>_.length>0&&_.length<=j_&&!_.includes("\x00")&&!_.includes("\\");var b_=(_)=>{if(!_.startsWith("/")||_.includes("\x00")||_.includes("\\")||_.includes("://"))return!1;if(_.length>OS)return!1;return!_.split("/").some((G)=>G==="."||G==="..")},hS=new Set(YS),XT=(_)=>Boolean(_&&"status"in _&&hS.has(String(_.status))&&!("body"in _)),N_=(_)=>Boolean(_&&"status"in _&&"body"in _&&Number.isInteger(_.status)),$T=(_)=>Boolean(_&&"content"in _&&String(_.content)===_.content),OT=(_)=>Boolean(_&&"written"in _&&_.written===!0),fT=(_)=>Boolean(_&&"entries"in _&&Array.isArray(_.entries)),mS=new Set(_S),DT=(_)=>Boolean(_&&"kind"in _&&"size"in _&&mS.has(String(_.kind))&&Number.isFinite(_.size)),WT=(_)=>Boolean(_&&"text"in _&&String(_.text)===_.text&&!("status"in _)),gS=new Set(["workspace","shells","ready","directory","session","connection","settings","session-lifecycle","item","resolve","action","status-control-event","popover-closed","file-open","file-snapshot","file-saved","generate-late"]),cS=(_)=>Object(_)===_?_:null,s_=(_)=>String(_)===_&&_.length>0,dS=(_)=>{if(!s_(_.id))return null;if(_.ok===!0){let U={channel:Z,v:k,type:"result",id:_.id,ok:!0};if(Object(_.payload)===_.payload)U.payload=_.payload;return U}if(_.ok===!1&&s_(_.error))return{channel:Z,v:k,type:"result",id:_.id,ok:!1,error:_.error,code:ZS(s_(_.code)?_.code:void 0)};return null},YT=(_)=>{let U=cS(_);if(!U||U.channel!==Z||U.v!==k)return null;if(U.type==="result")return dS(U);if(!gS.has(String(U.type))||Object(U.payload)!==U.payload)return null;return U};var VS=(_)=>("key"in _)&&("metaKey"in _)&&("ctrlKey"in _),pS=(_)=>(_.metaKey||_.ctrlKey)&&!_.altKey&&!_.shiftKey&&_.key.toLowerCase()==="s";class O extends Error{code;constructor(_,U){super(U);this.name="HostRequestError",this.code=_}}var zS=()=>Promise.reject(new O("BAD_PATH",'Request path must start with "/" and stay on the declared origin.')),R_=()=>Promise.reject(new O("BAD_PATH",`File path must be 1 to ${j_} characters without NUL or backslash.`)),x_=(_)=>{if(_===void 0)return;if(Object(_)!==_||Array.isArray(_)||_.scope!==void 0&&_.scope!=="instance"&&_.scope!=="device")throw new O("HOST_REJECTED",'Storage scope must be "instance" or "device".');return _.scope==="device"?"device":void 0},Y=(_)=>{return _.value+=1,`oc-${_.value}`},QT=(_={})=>{let U=_.target??("window"in globalThis?window:null);if(!U)throw new O("HOST_UNAVAILABLE","No window. connectHost runs in a browser frame.");let G=_.acceptSource??((T)=>T===U.parent),E=_.requestTimeoutMs??TT,X=new Set,A=new Set,Q=new Set,D=new Set,V=new Set,P=new Set,R=new Set,H=new Set,p=new Set,n=new Set,U_=[],C=null,q=null,u=new Set,r=new Set,c=null,T_=null,f_=!1,s=new Map,G_=new Map,E_=new Map,l=!1,W={value:0},f=null,o=null,D_=!1,W_=!1,xT=null,wT=(T)=>{if(!T)return null;return{sessionId:T.id,phase:T.busy?"started":"completed"}},g=(T)=>{U.parent.postMessage(T,"*")},HT=()=>{if(l||U.parent===U||n.size===0||f?.features?.lateGenerateResults!==!0)return;g({channel:Z,v:k,type:"generate-late-listen"})},j=(T,S)=>{for(let M of T)try{M(S)}catch($){console.error($)}},qT=(T)=>{if(!(T instanceof MessageEvent))return;if(!G(T.source))return;let S=YT(T.data);if(!S)return;if(S.type==="workspace"){let $=G_.get(S.payload.subscriptionId);if($)j([$],S.payload.snapshot);return}if(S.type==="shells"){let $=E_.get(S.payload.subscriptionId);if($)j([$],S.payload.snapshot);return}if(S.type==="ready"){if(f=S.payload,o=wT(S.payload.session),j(X,S.payload),j(A,S.payload.directory),j(Q,S.payload.session),o)j(D,o);j(V,S.payload.connection),j(P,S.payload.settings),j(R,S.payload.item),HT();return}if(S.type==="generate-late"){if(n.size===0)U_.push(S.payload);else j(n,S.payload);return}if(S.type==="directory"){if(f)f={...f,directory:S.payload.directory};j(A,S.payload.directory);return}if(S.type==="session"){if(f)f={...f,session:S.payload.session};if(!S.payload.session)o=null;else if(o?.sessionId!==S.payload.session.id)o=wT(S.payload.session);j(Q,S.payload.session);return}if(S.type==="session-lifecycle"){o=S.payload,j(D,S.payload);return}if(S.type==="connection"){if(f)f={...f,connection:S.payload.connection};j(V,S.payload.connection);return}if(S.type==="settings"){if(f)f={...f,settings:S.payload.settings};j(P,S.payload.settings);return}if(S.type==="item"){if(f)f={...f,item:S.payload.item};j(R,S.payload.item);return}if(S.type==="status-control-event"){j(H,S.payload);return}if(S.type==="popover-closed"){j(p,S.payload);return}if(S.type==="action"){let $=(z)=>{if(!l)g({channel:Z,v:k,type:"action-result",id:S.id,payload:z})},J=q;if(!J){$({ok:!1,error:"This extension does not handle background actions."});return}Promise.resolve().then(()=>J(S.payload)).then(()=>$({ok:!0}),(z)=>{let N=(z instanceof Error?z.message:String(z)).trim();$({ok:!1,error:(N||"Action failed.").slice(0,Y_)})});return}if(S.type==="file-open"){let $=S.payload;if(T_&&aT(T_,$))return;T_=$,j(u,S.payload);return}if(S.type==="file-saved"){j(r,S.payload.version);return}if(S.type==="file-snapshot"){let $=(N)=>{if(!l)g({channel:Z,v:k,type:"file-snapshot-result",id:S.id,payload:N})},J=(N)=>$({error:(N.trim()||"Could not read the edited file.").slice(0,Y_)}),z=c;if(!z){J("This extension does not edit files.");return}Promise.resolve().then(()=>z(S.payload.purpose)).then((N)=>{if(i_(N)>J_){J(`The file is over ${J_} ${"bytes"in N?"bytes":"characters"}.`);return}if(N.version.length>F_){J(`The snapshot version is over ${F_} characters.`);return}$({snapshot:"bytes"in N?{bytes:N.bytes,version:N.version}:{content:N.content,version:N.version}})},(N)=>J(N instanceof Error?N.message:String(N)));return}if(S.type==="resolve"){let $=(z)=>{g({channel:Z,v:k,type:"resolve-result",id:S.id,payload:z})},J=C;if(!J){$({error:"This extension does not resolve commands."});return}Promise.resolve().then(()=>J(S.payload)).then((z)=>$({item:z?M_(z):null}),(z)=>{let N=(z instanceof Error?z.message:String(z)).trim();$({error:(N||"Command failed.").slice(0,Y_)})});return}let M=s.get(S.id);if(!M)return;if(clearTimeout(M.timer),s.delete(S.id),S.ok){M.resolve(S.payload);return}M.reject(new O(S.code,S.error))};U.addEventListener("message",qT),g({channel:Z,v:k,type:"hello"});let y=(T,S=E)=>{if(l||U.parent===U)return Promise.reject(new O("HOST_UNAVAILABLE","No host frame. This page is not in an iframe."));return new Promise((M,$)=>{let J=setTimeout(()=>{s.delete(T.id),$(new O("HOST_TIMEOUT","Host did not answer in time."))},S);s.set(T.id,{resolve:M,reject:$,timer:J}),g(T)})},L=(T)=>y(T).then(()=>{return}),b={channel:Z,v:k},c_=(T)=>{if(!l&&U.parent!==U)g(T)},yT=()=>c_({...b,type:"file-save"}),hT=(T)=>{if(!VS(T)||!pS(T))return;T.preventDefault(),yT()},mT=(T)=>{if(!VS(T)||T.key!=="Escape"||f?.surface!=="popover"||!f.popover)return;T.preventDefault(),pT(f.popover.id,"escape").catch(()=>{return})},Z_=()=>{let T=f?.surface==="popover"?f.popover:void 0;if(!T)return;let S=D_||W_;if(xT===S)return;xT=S,vT(T.id,S).catch(()=>{return})},k_=()=>{if(f?.surface!=="popover"||D_)return;D_=!0,Z_()},gT=(T)=>{if(f?.surface!=="popover"||T.relatedTarget!==null||!D_)return;D_=!1,Z_()},cT=()=>{if(f?.surface!=="popover"||W_)return;W_=!0,Z_()},dT=()=>{if(f?.surface!=="popover"||!W_)return;W_=!1,Z_()},v=(T,S=1024)=>{if(!T.trim()||T.length>S)throw new O("HOST_REJECTED",`Identity must contain 1 to ${S} characters.`)},d_=async(T)=>{if(T.kind!=="projects")v(T.projectId);let S=await y({...b,type:"workspace-read",id:Y(W),payload:T});if(!S||!("kind"in S)||!("state"in S)||S.kind!==T.kind)throw new O("HOST_REJECTED","Host did not return workspace data.");return S},p_=async(T,S)=>{if(T.kind!=="projects")v(T.projectId);let M=Y(W);G_.set(M,S);try{await L({...b,type:"workspace-subscribe",id:Y(W),payload:{subscriptionId:M,query:T}})}catch($){if(G_.delete(M),!l)g({...b,type:"workspace-unsubscribe",id:Y(W),payload:{subscriptionId:M}});throw $}return()=>{if(!G_.delete(M)||l)return;g({...b,type:"workspace-unsubscribe",id:Y(W),payload:{subscriptionId:M}})}},HS=async(T,S)=>{if(T.kind==="session")v(T.sessionId);if(T.kind==="project")v(T.projectId);let M=Y(W);E_.set(M,S);try{await L({...b,type:"shells-subscribe",id:Y(W),payload:{subscriptionId:M,scope:T}})}catch($){if(E_.delete(M),!l)g({...b,type:"shells-unsubscribe",id:Y(W),payload:{subscriptionId:M}});throw $}return()=>{if(!E_.delete(M)||l)return;g({...b,type:"shells-unsubscribe",id:Y(W),payload:{subscriptionId:M}})}},V_=async(T)=>{if("key"in T&&(T.key.length===0||T.key.length>l_))throw new O("HOST_REJECTED","Storage key must contain 1 to 128 characters.");if(T.op==="set"&&!A_(T.value))throw new O("HOST_REJECTED","Storage values must be JSON.");if(T.op==="set"&&new TextEncoder().encode(JSON.stringify(T.value)).length>n_)throw new O("HOST_REJECTED","Storage value exceeds 64 KiB.");if(T.scope==="device"&&f?.features?.deviceStorage!==!0)throw new O("UNSUPPORTED","This host does not support device storage.");let S=await y({...b,type:"storage",id:Y(W),payload:T});if(!S||!("storage"in S)||S.op!==T.op)throw new O("HOST_REJECTED","Host did not return storage data.");return S},pT=(T,S)=>f?.features?.popovers!==!0&&!(f?.surface==="popover"&&f.popover?.id===T)?Promise.reject(new O("UNSUPPORTED","This host does not support popovers.")):L({...b,type:"popover-close",id:Y(W),payload:S?{id:T,reason:S}:{id:T}}),vT=(T,S)=>f?.features?.popovers!==!0&&!(f?.surface==="popover"&&f.popover?.id===T)?Promise.reject(new O("UNSUPPORTED","This host does not support popovers.")):L({...b,type:"popover-anchor",id:Y(W),payload:{id:T,active:S}});return U.addEventListener("keydown",mT,!0),U.addEventListener("pointerover",k_),U.addEventListener("pointermove",k_),U.addEventListener("pointerout",gT),U.addEventListener("focus",cT),U.addEventListener("blur",dT),{onAction:(T)=>{return q=T,()=>{if(q===T)q=null}},listProjects:async()=>{let T=await d_({kind:"projects"});if(T.kind!=="projects")throw new O("HOST_REJECTED","Expected projects.");return T},listWorktrees:async(T)=>{let S=await d_({kind:"worktrees",projectId:T});if(S.kind!=="worktrees")throw new O("HOST_REJECTED","Expected worktrees.");return S},listSessions:async(T)=>{let S=await d_({kind:"sessions",projectId:T});if(S.kind!=="sessions")throw new O("HOST_REJECTED","Expected sessions.");return S},onProjects:(T)=>p_({kind:"projects"},(S)=>{if(S.kind==="projects")T(S)}),onWorktrees:(T,S)=>p_({kind:"worktrees",projectId:T},(M)=>{if(M.kind==="worktrees")S(M)}),onSessions:(T,S)=>p_({kind:"sessions",projectId:T},(M)=>{if(M.kind==="sessions")S(M)}),onRunningShells:(T,S)=>HS(T,S),readShellOutput:async(T,S)=>{v(T,z_);let M=S?.cursor;if(M!==void 0&&(!Number.isInteger(M)||M<0))throw new O("HOST_REJECTED","Shell output cursor must be a non-negative integer.");let $=S?.tailBytes;if($!==void 0&&(!Number.isInteger($)||$<1||$>C_))throw new O("HOST_REJECTED",`Shell output tailBytes must be an integer between 1 and ${C_}.`);let z=await y({...b,type:"shell-output",id:Y(W),payload:{shellId:T,cursor:M,tailBytes:$}});if(!z||typeof z.output!=="string"||!Number.isFinite(z.cursor))throw new O("HOST_REJECTED","Host did not return shell output.");return z},stopShell:async(T)=>{if(v(T,z_),(await y({...b,type:"shell-stop",id:Y(W),payload:{shellId:T}}))?.stopped!==!0)throw new O("HOST_REJECTED","Host did not stop the shell.");return{stopped:!0}},openSession:async(T)=>{v(T),await L({...b,type:"open-session",id:Y(W),payload:{sessionId:T}})},storage:{get:async(T,S)=>{let M=x_(S),$={op:"get",key:T};if(M)$.scope=M;let J=await V_($);return J.op==="get"&&J.found?J.value:void 0},set:async(T,S,M)=>{let $=x_(M),J={op:"set",key:T,value:S};if($)J.scope=$;await V_(J)},delete:async(T,S)=>{let M=x_(S),$={op:"delete",key:T};if(M)$.scope=M;await V_($)},keys:async(T)=>{let S=x_(T),M={op:"keys"};if(S)M.scope=S;let $=await V_(M);if($.op!=="keys")throw new O("HOST_REJECTED","Expected storage keys.");return $.keys}},onReady:(T)=>{if(X.add(T),f)T(f);return()=>{X.delete(T)}},onDirectory:(T)=>{if(A.add(T),f)T(f.directory);return()=>{A.delete(T)}},onSession:(T)=>{if(Q.add(T),f)T(f.session);return()=>{Q.delete(T)}},onSessionLifecycle:(T)=>{if(D.add(T),o)T(o);return()=>{D.delete(T)}},onConnection:(T)=>{if(V.add(T),f)T(f.connection);return()=>{V.delete(T)}},onSettings:(T)=>{if(P.add(T),f)T(f.settings);return()=>{P.delete(T)}},onItem:(T)=>{if(R.add(T),f)T(f.item);return()=>{R.delete(T)}},onStatusControl:(T)=>{return H.add(T),()=>{H.delete(T)}},onPopoverClosed:(T)=>{return p.add(T),()=>{p.delete(T)}},setStatusControls:(T)=>{if(f?.features?.statusControls!==!0)return Promise.reject(new O("UNSUPPORTED","This host does not support status controls."));if(!iT(T))return Promise.reject(new O("HOST_REJECTED","Status controls must have unique bounded ids and valid selected options."));return L({...b,type:"status-controls",id:Y(W),payload:{controls:T}})},openPopover:(T)=>{if(f?.features?.popovers!==!0)return Promise.reject(new O("UNSUPPORTED","This host does not support popovers."));if(!r_(T))return Promise.reject(new O("HOST_REJECTED","Popover requests need bounded geometry and JSON data."));return L({...b,type:"popover-open",id:Y(W),payload:T})},closePopover:pT,setPopoverAnchorActive:vT,onResolve:(T)=>{return C=T,()=>{if(C===T)C=null}},toast:(T)=>{let S=T.message.trim();if(!S||S.length>B_)return Promise.reject(new O("HOST_REJECTED",`Toast message must contain 1 to ${B_} characters.`));if(T.copy&&T.copy!==!0&&(!T.copy.text.length||T.copy.text.length>I_))return Promise.reject(new O("HOST_REJECTED",`Toast copy text must contain 1 to ${I_} characters.`));return L({channel:Z,v:k,type:"toast",id:Y(W),payload:{...T,message:S}})},openUrl:(T)=>L({channel:Z,v:k,type:"open-url",id:Y(W),payload:{url:T}}),openCommit:(T)=>_T(T)?L({channel:Z,v:k,type:"open-commit",id:Y(W),payload:{sha:T}}):Promise.reject(new O("HOST_REJECTED","Commit id must be 7 to 64 hex characters.")),openSurface:(T)=>L({channel:Z,v:k,type:"open-surface",id:Y(W),payload:{surfaceId:T}}),writeClipboard:(T)=>L({channel:Z,v:k,type:"clipboard-write",id:Y(W),payload:{text:T}}),compose:(T)=>L({channel:Z,v:k,type:"compose",id:Y(W),payload:T}),attach:(T)=>L({channel:Z,v:k,type:"attach",id:Y(W),payload:M_(T)}),startSession:async(T)=>{if(T.projectId!==void 0)v(T.projectId);let S=T.worktree;if(S&&S!==!0)if(S.kind==="existing")v(S.directory);else{if(S.name!==void 0)v(S.name,200);if(S.baseBranch!==void 0)v(S.baseBranch,200)}let M=await y({channel:Z,v:k,type:"start-session",id:Y(W),payload:GT(T)},_.requestTimeoutMs??180000);if(!t_(M))throw new O("HOST_REJECTED","Host did not return a session.");return M},prompt:(T)=>y({channel:Z,v:k,type:"prompt",id:Y(W),payload:ET(T)}).then((S)=>{if(!e_(S))throw new O("HOST_REJECTED","Host did not return a prompt result.");return S}),sessionLink:(T)=>L({channel:Z,v:k,type:"session-link",id:Y(W),payload:M_(T)}),close:()=>L({channel:Z,v:k,type:"close",id:Y(W)}),oauthStart:()=>L({channel:Z,v:k,type:"oauth-start",id:Y(W)}),oauthDisconnect:()=>L({channel:Z,v:k,type:"oauth-disconnect",id:Y(W)}),request:(T)=>(b_(T.path)?y({channel:Z,v:k,type:"request",id:Y(W),payload:T}):zS()).then((S)=>{if(!N_(S))throw new O("HOST_REJECTED","Host request result was empty.");return S}),serviceRequest:(T)=>(b_(T.path)?y({channel:Z,v:k,type:"service-request",id:Y(W),payload:T}):zS()).then((S)=>{if(!N_(S))throw new O("HOST_REJECTED","Host service request result was empty.");return S}),serviceStatus:()=>y({channel:Z,v:k,type:"service-status",id:Y(W)}).then((T)=>{if(!XT(T))throw new O("HOST_REJECTED","Host did not return service status.");return T}),readFile:(T)=>(X_(T)?y({channel:Z,v:k,type:"file-read",id:Y(W),payload:{path:T}}):R_()).then((S)=>{if(!$T(S))throw new O("HOST_REJECTED","Host did not return file content.");return S}),writeFile:(T,S)=>{if(!X_(T))return R_();if(S.length>K_)return Promise.reject(new O("FILE_TOO_LARGE",`Content is over ${K_} characters.`));return y({channel:Z,v:k,type:"file-write",id:Y(W),payload:{path:T,content:S}}).then((M)=>{if(!OT(M))throw new O("HOST_REJECTED","Host did not confirm the write.");return M})},listDir:(T)=>(X_(T)?y({channel:Z,v:k,type:"file-list",id:Y(W),payload:{path:T}}):R_()).then((S)=>{if(!fT(S))throw new O("HOST_REJECTED","Host did not return directory entries.");return S}),stat:(T)=>(X_(T)?y({channel:Z,v:k,type:"file-stat",id:Y(W),payload:{path:T}}):R_()).then((S)=>{if(!DT(S))throw new O("HOST_REJECTED","Host did not return file status.");return S}),generate:(T)=>{let S=T.prompt.trim(),M=T.system?.trim();if(S.length===0||S.length>P_)return Promise.reject(new O("HOST_REJECTED",`Prompt must be 1 to ${P_} characters.`));if(M!==void 0&&(M.length===0||M.length>L_))return Promise.reject(new O("HOST_REJECTED",`System prompt must be 1 to ${L_} characters.`));let $=T.maxOutputTokens===void 0?void 0:Math.min(ST,Math.max(1,Math.floor(T.maxOutputTokens)));if($!==void 0&&!Number.isFinite($))return Promise.reject(new O("HOST_REJECTED","maxOutputTokens must be a number."));let J={prompt:S};if(M!==void 0)J.system=M;if($!==void 0)J.maxOutputTokens=$;return y({channel:Z,v:k,type:"generate",id:Y(W),payload:J},_.requestTimeoutMs??UT).then((z)=>{if(!WT(z))throw new O("HOST_REJECTED","Host did not return generated text.");return z})},onLateGenerateResult:(T)=>{n.add(T);for(let S of U_.splice(0))j([T],S);return HT(),()=>{n.delete(T)}},setBadge:(T)=>L({channel:Z,v:k,type:"badge",id:Y(W),payload:{count:AT(T)}}),setHeight:(T)=>L({channel:Z,v:k,type:"resize",id:Y(W),payload:{height:MT(T)}}),onFileOpen:(T)=>{if(u.add(T),!f_)f_=!0,U.addEventListener("keydown",hT,!0);if(T_)T(T_);return()=>{u.delete(T)}},onFileSnapshot:(T)=>{return c=T,()=>{if(c===T)c=null}},onFileSaved:(T)=>{return r.add(T),()=>{r.delete(T)}},reportFileChange:(T)=>c_({...b,type:"file-change",payload:{dirty:T.dirty,edited:T.edited}}),requestFileSave:yT,reportFileUnsupported:()=>c_({...b,type:"file-unsupported"}),dispose:()=>{for(let T of G_.keys())g({...b,type:"workspace-unsubscribe",id:Y(W),payload:{subscriptionId:T}});G_.clear();for(let T of E_.keys())g({...b,type:"shells-unsubscribe",id:Y(W),payload:{subscriptionId:T}});if(E_.clear(),l=!0,C=null,q=null,c=null,u.clear(),r.clear(),f_)U.removeEventListener("keydown",hT,!0);U.removeEventListener("message",qT),U.removeEventListener("keydown",mT,!0),U.removeEventListener("pointerover",k_),U.removeEventListener("pointermove",k_),U.removeEventListener("pointerout",gT),U.removeEventListener("focus",cT),U.removeEventListener("blur",dT);for(let T of s.values())clearTimeout(T.timer),T.reject(new O("HOST_UNAVAILABLE","Host client was disposed."));s.clear(),X.clear(),A.clear(),Q.clear(),D.clear(),V.clear(),P.clear(),R.clear(),H.clear(),p.clear(),n.clear(),U_.length=0}}};var CS=["browser.open","browser.snapshot","browser.click","browser.type","browser.scroll","browser.back","browser.forward","browser.inspect","browser.capture","browser.resize","browser.close"];var bU=new Set(CS);var JS=["none","agent","user"];var RU=new Set(JS);var vS=[["--oc-bg","background"],["--oc-elevated","elevated"],["--oc-fg","foreground"],["--oc-muted","muted"],["--oc-subtle","subtle"],["--oc-border","border"],["--oc-hover","hover"],["--oc-selection","selection"],["--oc-focus","focus"],["--oc-primary","primary"],["--oc-muted-surface","mutedSurface"],["--oc-elevated-fg","elevatedForeground"],["--oc-active","active"],["--oc-selection-fg","selectionForeground"],["--oc-primary-fg","primaryForeground"],["--oc-primary-text","primaryText"],["--oc-success-text","successText"],["--oc-warning-text","warningText"],["--oc-error-text","errorText"],["--oc-info-text","infoText"],["--oc-success","success"],["--oc-warning","warning"],["--oc-error","error"],["--oc-info","info"],["--oc-font","font"],["--oc-mono","mono"],["--oc-radius","radius"],["--surface-background","background"],["--surface-elevated","elevated"],["--surface-foreground","foreground"],["--surface-muted-foreground","muted"],["--surface-subtle","subtle"],["--interactive-border","border"],["--interactive-hover","hover"],["--interactive-selection","selection"],["--interactive-focus-ring","focus"],["--primary","primary"],["--surface-muted","mutedSurface"],["--surface-elevated-foreground","elevatedForeground"],["--interactive-active","active"],["--interactive-selection-foreground","selectionForeground"],["--primary-foreground","primaryForeground"],["--primary-text","primaryText"],["--success-text","successText"],["--warning-text","warningText"],["--error-text","errorText"],["--info-text","infoText"],["--status-success","success"],["--status-warning","warning"],["--status-error","error"],["--status-info","info"],["--font-sans","font"],["--font-mono","mono"],["--radius","radius"]],uS=[["--oc-syntax-keyword","--syntax-keyword","syntaxKeyword"],["--oc-syntax-string","--syntax-string","syntaxString"],["--oc-syntax-number","--syntax-number","syntaxNumber"],["--oc-syntax-function","--syntax-function","syntaxFunction"],["--oc-syntax-type","--syntax-type","syntaxType"],["--oc-syntax-comment","--syntax-comment","syntaxComment"],["--oc-syntax-variable","--syntax-variable","syntaxVariable"],["--oc-syntax-operator","--syntax-operator","syntaxOperator"]],FS=(_,U)=>{U.style.colorScheme=_.mode;for(let[G,E]of vS)U.style.setProperty(G,_.tokens[E]);for(let[G,E,X]of uS){let A=_.tokens[X]??"";U.style.setProperty(G,A),U.style.setProperty(E,A)}U.style.setProperty("font-family",_.tokens.font),U.style.setProperty("font-size","0.875rem"),U.style.setProperty("line-height","1.45"),U.style.setProperty("color",_.tokens.foreground)},ZT=(_,U)=>{if(FS(_.theme,U),U.dataset)U.dataset.ocSurface=_.surface,U.dataset.ocTheme=_.theme.mode};var lS={"surface-background":"bg","surface-elevated":"elevated","surface-elevated-foreground":"elevated-fg","surface-foreground":"fg","surface-muted-foreground":"muted","surface-muted":"muted-surface","surface-subtle":"subtle","interactive-border":"border","interactive-hover":"hover","interactive-active":"active","interactive-selection":"selection","interactive-selection-foreground":"selection-fg","interactive-focus-ring":"focus",primary:"primary","primary-foreground":"primary-fg","primary-text":"primary-text","success-text":"success-text","warning-text":"warning-text","error-text":"error-text","info-text":"info-text","status-success":"success","status-warning":"warning","status-error":"error","status-info":"info","font-sans":"font","font-mono":"mono",radius:"radius"},I=(_,U)=>`var(--${_}, var(--oc-${lS[_]}, ${U}))`,a=I("surface-background","transparent"),H_=I("surface-elevated","transparent"),$_=I("surface-elevated-foreground","inherit"),d=I("surface-foreground","inherit"),B=I("surface-muted-foreground","gray"),nS=I("surface-muted","transparent"),t=I("interactive-border","currentColor"),h=I("interactive-hover","transparent"),S_=I("interactive-active","transparent"),kT=I("interactive-selection","transparent"),VT=I("interactive-selection-foreground","inherit"),i=I("primary","currentColor"),zT=I("primary-text","inherit"),CT=I("error-text","inherit"),oS=I("font-sans","inherit"),JT=I("font-mono","monospace"),PS=I("radius","9px"),FT=`calc(${PS} - 2px)`,BS=`calc(${PS} - 4px)`,K=(_,U,G="transparent")=>`color-mix(in srgb, ${_} ${U}%, ${G})`,IS=`background-image: linear-gradient(${h}, ${h});`,BT=(_)=>`box-shadow: inset 0 0 0 1px ${_}, var(--oc-sdk-field-lift);`,IT="box-shadow: inset 0 0 0 1px var(--oc-sdk-edge), var(--oc-sdk-raised-lift);",jS="box-shadow: var(--oc-sdk-lit);",KS=`inset 0 1px 0 0 ${K(d,1.5)}, 0 1px 1px 0 rgb(0 0 0 / 0.28), 0 2px 3px -2px rgb(0 0 0 / 0.2)`,iS=`
:root {
  --oc-sdk-edge: ${K(d,10)};
  --oc-sdk-field-bg: ${H_};
  --oc-sdk-raised-bg: ${a};
  --oc-sdk-field-lift: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --oc-sdk-raised-lift: 0 1px 2px 0 rgb(0 0 0 / 0.06);
  --oc-sdk-lit: inset 0 1px 0 0 rgb(255 255 255 / 0.45), 0 1px 2px 0 rgb(0 0 0 / 0.08);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.8), inset 0 0 0 1px rgb(0 0 0 / 0.04), 0 0 0 1px rgb(0 0 0 / 0.1), 0 1px 2px -0.5px rgb(0 0 0 / 0.08), 0 4px 8px -2px rgb(0 0 0 / 0.08), 0 12px 20px -4px rgb(0 0 0 / 0.08);
}
:root[data-oc-theme="dark"] {
  --oc-sdk-edge: ${K(d,6)};
  --oc-sdk-field-bg: ${K(a,50,H_)};
  --oc-sdk-raised-bg: ${H_};
  --oc-sdk-field-lift: ${KS};
  --oc-sdk-raised-lift: ${KS};
  --oc-sdk-lit: inset 0 1px 0 0 ${K(d,1.5)}, 0 1px 1px 0 rgb(0 0 0 / 0.28), 0 2px 3px -2px rgb(0 0 0 / 0.2);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.06), inset 0 0 0 1px rgb(255 255 255 / 0.08), 0 0 0 1px rgb(0 0 0 / 0.36), 0 1px 1px -0.5px rgb(0 0 0 / 0.22), 0 3px 3px -1.5px rgb(0 0 0 / 0.2), 0 6px 6px -3px rgb(0 0 0 / 0.16);
}`,w_=(_)=>{let U=I(`status-${_}`,"currentColor");return`
.oc-sdk[data-tone="${_}"], .oc-sdk [data-tone="${_}"] { --oc-sdk-tone: ${U}; --oc-sdk-tone-text: ${I(`${_}-text`,"inherit")}; }`},aS=`
.oc-sdk { box-sizing: border-box; font-size: 0.875rem; line-height: 1.45; }
.oc-sdk *, .oc-sdk *::before, .oc-sdk *::after { box-sizing: border-box; }
/* :where() keeps the reset at zero specificity so every primitive class below overrides it. */
:where(.oc-sdk) :where(button, input, textarea), :where(button.oc-sdk, input.oc-sdk, textarea.oc-sdk) { font: inherit; color: inherit; margin: 0; }
:where(.oc-sdk) :where(button), :where(button.oc-sdk) { cursor: pointer; background: none; border: 0; padding: 0; }
.oc-sdk button:disabled, button.oc-sdk:disabled, .oc-sdk[aria-disabled="true"], .oc-sdk [aria-disabled="true"] { opacity: .5; pointer-events: none; }

.oc-sdk-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 32px; padding: 0 12px; border: 1px solid transparent; font-size: 0.875rem; font-weight: 500; line-height: 1; white-space: nowrap; }
.oc-sdk-btn[data-size="sm"] { gap: 6px; height: 28px; padding: 0 10px; font-size: 0.8125rem; }
.oc-sdk-btn[data-size="xs"] { gap: 4px; height: 24px; padding: 0 8px; font-size: 0.75rem; }
.oc-sdk-btn[data-loading="true"] { opacity: .5; pointer-events: none; }
.oc-sdk-btn > .oc-sdk-spinner-ring { width: 14px; height: 14px; }

.oc-sdk-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.oc-sdk-field-label { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-field-note { font-size: 0.75rem; }
.oc-sdk-input { display: block; width: 100%; min-width: 0; height: 32px; padding: 0 10px; border: 0; font-size: 0.875rem; line-height: 1.45; appearance: none; }
textarea.oc-sdk-input { height: auto; padding: 8px 10px; resize: vertical; }

.oc-sdk-search { position: relative; min-width: 0; }
.oc-sdk-search .oc-sdk-input { padding-left: 34px; padding-right: 34px; }
.oc-sdk-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); pointer-events: none; }
.oc-sdk-search-clear { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); display: none; align-items: center; justify-content: center; width: 24px; height: 24px; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-clear { display: inline-flex; }

.oc-sdk-select { position: relative; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.oc-sdk-trigger { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; width: auto; max-width: 100%; min-width: 0; height: 28px; padding: 0 10px; border: 1px solid transparent; font-size: 0.8125rem; text-align: left; }
.oc-sdk-trigger-value { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-trigger-chevron { flex: 0 0 auto; }
.oc-sdk-popup { position: fixed; z-index: 50; display: flex; flex-direction: column; gap: 2px; min-width: 160px; max-width: calc(100vw - 16px); max-height: min(320px, calc(100vh - 16px)); overflow: auto; padding: 4px; border: 1px solid transparent; }
.oc-sdk-popup-search { flex: 0 0 auto; padding: 2px 2px 4px; }
.oc-sdk-popup-search .oc-sdk-input { height: 28px; font-size: 0.8125rem; }
.oc-sdk-option { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 8px; font-size: 0.8125rem; text-align: left; }
.oc-sdk-option-label { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-option-hint { flex: 0 0 auto; font-size: 0.75rem; }
.oc-sdk-option-check { flex: 0 0 auto; display: inline-flex; width: 14px; visibility: hidden; }
.oc-sdk-option[aria-selected="true"] > .oc-sdk-option-check { visibility: visible; }
.oc-sdk-popup-empty { padding: 8px; font-size: 0.8125rem; }

.oc-sdk-check { display: inline-flex; align-items: flex-start; gap: 8px; width: 100%; text-align: left; }
.oc-sdk-check-box { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; margin-top: 3px; border: 1px solid transparent; }
.oc-sdk-check-box > svg { display: none; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box > svg { display: block; }
.oc-sdk-check-thumb { flex: 0 0 auto; position: relative; width: 36px; height: 20px; }
.oc-sdk-check-thumb::after { content: ""; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; }
.oc-sdk-check-text { display: flex; flex-direction: column; min-width: 0; }
.oc-sdk-check-label { font-size: 0.875rem; }
.oc-sdk-check-desc { font-size: 0.75rem; }

.oc-sdk-tabs { display: inline-flex; gap: 2px; padding: 2px; max-width: 100%; overflow: auto; }
.oc-sdk-tab { display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border: 1px solid transparent; font-size: 0.8125rem; font-weight: 500; white-space: nowrap; }
.oc-sdk-tab-count { font-size: 0.75rem; font-variant-numeric: tabular-nums; }

.oc-sdk-badge { display: inline-flex; align-items: center; padding: 1px 6px; font-size: 11px; font-weight: 500; line-height: 16px; white-space: nowrap; }

.oc-sdk-list { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.oc-sdk-row { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 8px; text-align: left; }
.oc-sdk-row-lead { flex: 0 0 auto; width: 64px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }
.oc-sdk-row-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-row-sub { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-meta { flex: 0 0 auto; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-list-empty { padding: 16px 8px; text-align: center; font-size: 0.8125rem; }

.oc-sdk-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 40px 16px; text-align: center; }
.oc-sdk-empty-title { margin: 0; font-size: 0.8125rem; font-weight: 600; }
.oc-sdk-empty-body { margin: 0; max-width: 32rem; font-size: 0.8125rem; }
.oc-sdk-empty-action { margin-top: 12px; }

@keyframes oc-sdk-spin { to { transform: rotate(360deg); } }
.oc-sdk-spinner { display: inline-flex; align-items: center; gap: 8px; font-size: 0.8125rem; }
.oc-sdk-spinner-ring { width: 16px; height: 16px; border: 2px solid transparent; animation: oc-sdk-spin .8s linear infinite; }
.oc-sdk-spinner[data-size="sm"] .oc-sdk-spinner-ring { width: 12px; height: 12px; }

.oc-sdk-banner { display: flex; align-items: flex-start; gap: 12px; padding: 8px 12px; border: 1px solid transparent; }
.oc-sdk-banner-text { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.oc-sdk-banner-title { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-banner-body { font-size: 0.8125rem; }
.oc-sdk-banner-action { flex: 0 0 auto; }

.oc-sdk-separator { display: flex; align-items: center; gap: 8px; width: 100%; margin: 8px 0; font-size: 0.75rem; }
.oc-sdk-separator::before, .oc-sdk-separator::after { content: ""; flex: 1 1 auto; height: 1px; }
.oc-sdk-separator[data-labeled="false"]::after { display: none; }
.oc-sdk-popup > .oc-sdk-separator { margin: 4px 0; }

.oc-sdk-progress { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.oc-sdk-progress-label { display: flex; justify-content: space-between; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-progress-track { height: 6px; overflow: hidden; }
.oc-sdk-progress-fill { height: 100%; transform-origin: left; transition: transform 200ms ease-out; }

.oc-sdk-menu { position: relative; display: inline-flex; }

.oc-sdk-text { white-space: pre-wrap; overflow-wrap: anywhere; }
.oc-sdk-text img { display: block; max-width: 100%; margin: 8px 0; }
`,LS=`${iS}
.oc-sdk { color: ${d}; font-family: ${oS}; }
.oc-sdk :focus-visible, .oc-sdk:focus-visible { outline: none; }
.oc-sdk :where(button, a[href], [role="button"], [role="tab"], [role="option"]):focus-visible, button.oc-sdk:focus-visible { ${IS} }
.oc-sdk-mono { font-family: ${JT}; }
.oc-sdk-muted { color: ${B}; }
${w_("success")}${w_("warning")}${w_("error")}${w_("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${i}; --oc-sdk-tone-text: ${zT}; }

.oc-sdk-btn { border-radius: ${FT}; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="xs"] { border-radius: ${BS}; }
.oc-sdk-btn[data-variant="default"] { color: ${zT}; background: ${K(i,10,a)}; border-color: ${K(i,12)}; ${jS} }
.oc-sdk-btn[data-variant="default"]:hover { background: ${K(i,16,a)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${K(i,22,a)}; box-shadow: none; }
.oc-sdk-btn[data-variant="secondary"] { background: ${nS}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${h}, ${h}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${S_}, ${S_}); }
.oc-sdk-btn[data-variant="outline"] { background: var(--oc-sdk-raised-bg); color: ${$_}; border-color: transparent; ${IT} }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${h}, ${h}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${S_}, ${S_}); box-shadow: inset 0 0 0 1px var(--oc-sdk-edge); }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${h}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${S_}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${I("status-error","red")}; color: ${CT}; background: ${K("var(--oc-sdk-tone)",7,a)}; border-color: ${K("var(--oc-sdk-tone)",12)}; ${jS} }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${K("var(--oc-sdk-tone)",9,a)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${K("var(--oc-sdk-tone)",11,a)}; box-shadow: none; }

.oc-sdk-field-note { color: ${B}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${CT}; }
.oc-sdk-input { border-radius: ${FT}; background: var(--oc-sdk-field-bg); color: ${$_}; ${BT("var(--oc-sdk-edge)")} transition: background 150ms ease-out; }
.oc-sdk-input::placeholder { color: ${B}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${h}, ${h}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { ${BT(K(d,26))} }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input, .oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { ${BT(I("status-error","red"))} }
.oc-sdk-input[data-mono="true"] { font-family: ${JT}; }

.oc-sdk-search-icon { color: ${B}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${i}; }
.oc-sdk-search-clear { border-radius: ${BS}; color: ${B}; }
.oc-sdk-search-clear:hover { background: ${h}; color: ${d}; }

.oc-sdk-trigger { border-color: transparent; border-radius: ${FT}; background: var(--oc-sdk-raised-bg); color: ${$_}; ${IT} transition: background 150ms ease-out; }
.oc-sdk-trigger:hover { background-image: linear-gradient(${h}, ${h}); }
.oc-sdk-trigger[aria-expanded="true"] { background-image: linear-gradient(${S_}, ${S_}); }
.oc-sdk-trigger-value[data-empty="true"] { color: ${B}; }
.oc-sdk-trigger-chevron { color: ${B}; }
/* The app's dropdown light: lit top, hairline rings and a layered shadow, no border. */
.oc-sdk-popup { --surface-foreground: ${$_}; border-color: transparent; border-radius: 12px; background: ${H_}; color: ${$_}; box-shadow: var(--oc-sdk-float); }
.oc-sdk-option { border-radius: 8px; }
.oc-sdk-option[data-active="true"] { background: ${h}; }
/* A selected option shows a check mark in the text colour, like the app's own pickers. Options without the mark come
   from bundles built before it existed and keep the selection fill as their only sign of the choice. */
.oc-sdk-option[aria-selected="true"]:not([data-mark]) { background: ${kT}; color: ${VT}; }
.oc-sdk-option-check { color: ${d}; }
.oc-sdk-option[data-destructive="true"] { color: ${CT}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${K(I("status-error","red"),10)}; }
.oc-sdk-option-hint { color: ${B}; }
.oc-sdk-popup-empty { color: ${B}; }

/* Checked stays neutral: the mark carries the state, and the primary colour stays with primary actions. */
.oc-sdk-check-box { border-color: ${t}; border-radius: 4px; color: ${d}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${K(d,60,t)}; }
.oc-sdk-check-thumb { border-radius: 9999px; background: ${t}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { border-radius: 9999px; background: ${a}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${i}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(16px); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${IS} }
.oc-sdk-check-desc { color: ${B}; }

.oc-sdk-tabs { border-radius: 10px; }
.oc-sdk-tabs[data-track="true"] { background: ${K(d,4)}; box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.16); }
.oc-sdk-tab { border-radius: 8px; color: ${B}; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${d}; }
.oc-sdk-tab[aria-selected="true"] { color: ${VT}; background: ${kT}; border-color: ${t}; }
.oc-sdk-tabs[data-track="true"] .oc-sdk-tab[aria-selected="true"] { color: ${$_}; background: var(--oc-sdk-raised-bg); border-color: transparent; ${IT} }
.oc-sdk-tab-count { color: ${B}; }

.oc-sdk-badge { border-radius: 9999px; background: ${h}; color: ${B}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${K("var(--oc-sdk-tone)",15)}; }

.oc-sdk-row { border-radius: 6px; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${h}; }
.oc-sdk-row[aria-selected="true"] { background: ${kT}; color: ${VT}; }
.oc-sdk-row-lead { font-family: ${JT}; color: ${B}; }
.oc-sdk-row-sub { color: ${B}; }
.oc-sdk-row-meta { color: ${B}; }
.oc-sdk-row[aria-selected="true"] .oc-sdk-row-lead, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-sub, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-meta { color: inherit; opacity: .75; }
.oc-sdk-list-empty { color: ${B}; }

.oc-sdk-empty-body { color: ${B}; }

.oc-sdk-spinner { color: ${B}; }
.oc-sdk-spinner-ring { border-color: ${t}; border-top-color: ${i}; border-radius: 9999px; }

/* Set apart by its tint alone, like the app's banners. */
.oc-sdk-banner { border-color: transparent; border-radius: 8px; background: ${K("var(--oc-sdk-tone)",10)}; }
.oc-sdk-banner-title { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); }
.oc-sdk-banner-body { color: ${B}; }

.oc-sdk-separator { color: ${B}; }
.oc-sdk-separator::before, .oc-sdk-separator::after { background: ${K(t,40)}; }

.oc-sdk-progress-label { color: ${B}; }
.oc-sdk-progress-track { border-radius: 9999px; background: ${t}; }
.oc-sdk-progress-fill { border-radius: 9999px; background: var(--oc-sdk-tone, ${i}); }

.oc-sdk-text a { color: ${zT}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { border-radius: 8px; border: 1px solid ${K(t,60)}; }
`,x=`
${v_}
${aS}
${LS}`;var bS="oc-sdk-ui-style";var w=(_)=>{let U=document.getElementById(bS);if(U instanceof HTMLStyleElement){if(U.textContent!==_)U.textContent=_;return}u_(document);let G=document.createElement("style");G.id=bS,G.textContent=_,document.head.appendChild(G)},F=(_,U)=>{let G=document.createElement(_);if(U)G.className=U;return G},e=(_)=>{let U=F("button",_);return U.type="button",U},m=(_,U)=>{let G=U??"";if(_.textContent!==G)_.textContent=G};var rS=()=>{let _=document.createElement("span");return _.className="oc-sdk-spinner-ring",_.setAttribute("aria-hidden","true"),_},Q_=(_,U)=>{w(x);let G=U,E=e("oc-sdk oc-sdk-btn"),X=rS(),A=document.createElement("span");E.append(A),_.append(E);let Q=()=>{if(E.dataset.variant=G.variant??"default",E.dataset.size=G.size??"default",E.disabled=Boolean(G.disabled)||Boolean(G.loading),E.dataset.loading=G.loading?"true":"false",E.setAttribute("aria-busy",G.loading?"true":"false"),G.loading&&X.parentNode!==E)E.prepend(X);else if(!G.loading&&X.parentNode===E)X.remove();m(A,G.label)},D=()=>{if(G.disabled||G.loading)return;G.onClick()};return E.addEventListener("click",D),Q(),{update:(V)=>{G={...G,...V},Q()},dispose:()=>{E.removeEventListener("click",D),E.remove()}}};var KT=(_,U={})=>{w(x);let G=U,E=F("span","oc-sdk oc-sdk-spinner");E.setAttribute("role","status");let X=F("span","oc-sdk-spinner-ring");X.setAttribute("aria-hidden","true");let A=F("span");E.append(X,A),_.append(E);let Q=()=>{E.dataset.size=G.size??"default",m(A,G.label),A.hidden=!G.label,E.setAttribute("aria-label",G.label??"Loading")};return Q(),{update:(D)=>{G={...G,...D},Q()},dispose:()=>{E.remove()}}};var PT=(_,U)=>{w(x);let G=U,E=F("div","oc-sdk oc-sdk-banner"),X=F("div","oc-sdk-banner-text"),A=F("div","oc-sdk-banner-title"),Q=F("div","oc-sdk-banner-body"),D=F("div","oc-sdk-banner-action");X.append(A,Q),E.append(X,D),_.append(E);let V=null,P=()=>{if(E.dataset.tone=G.tone,E.setAttribute("role",G.tone==="error"||G.tone==="warning"?"alert":"status"),m(A,G.title),m(Q,G.body),Q.hidden=!G.body,D.hidden=!G.action,!G.action){V?.dispose(),V=null;return}let R={label:G.action.label,onClick:G.action.onClick};if(V)V.update(R);else V=Q_(D,{...R,variant:"outline",size:"xs"})};return P(),{update:(R)=>{G={...G,...R},P()},dispose:()=>{V?.dispose(),V=null,E.remove()}}};var RT=QT(),__=document.querySelector("#root"),g_=[],TU=()=>{for(let _ of g_)_.dispose();g_=[]},LT=0,SU=(_)=>_&&Number.isFinite(_)?new Date(_).toLocaleDateString("en-US",{month:"short",day:"numeric"}):"—",UU=(_)=>_&&Number.isFinite(_)?new Date(_).toLocaleString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):"—",GU=(_)=>_===null||_===void 0?"—":`${Math.round(_)}%`,RS="devin-usage.collapsed",EU=()=>{try{let _=localStorage.getItem(RS);return _?new Set(JSON.parse(_)):new Set(["tools"])}catch{return new Set(["tools"])}},AU=(_)=>{try{localStorage.setItem(RS,JSON.stringify(Array.from(_)))}catch{}},O_=EU(),MU=(_)=>{if(O_.has(_))O_.delete(_);else O_.add(_);AU(O_),__.querySelectorAll(`[data-collapse="${_}"]`).forEach((U)=>{let G=U.querySelector(".sec-chev"),E=U.nextElementSibling,X=O_.has(_);if(G)G.textContent=X?"▸":"▾";if(E)E.style.display=X?"none":""})},bT=(_,U)=>{if(!U)return"";let G=U.usedPercent??null,E=G!==null?`<div class="bar"><div class="bar-fill" style="width:${G}%"></div></div>`:"",X=G!==null?GU(G):U.valueLabel??"—",A=[`<div class="q-row"><span class="q-label">${_}</span><span class="q-val">${X}</span></div>`,E];if(U.resetAt)A.push(`<div class="q-row sub"><span>resets</span><span>${UU(U.resetAt)}</span></div>`);if(U.valueLabel&&G!==null)A.push(`<div class="q-row sub"><span></span><span>${U.valueLabel}</span></div>`);return`<div class="q-card">${A.join("")}</div>`},NT=7,XU=(_)=>{if(_.length===0)return'<div class="empty">no data</div>';let U=(C)=>C.runs*10+C.lines,G=Math.max(1,..._.map(U)),E=(C)=>{if(C<=0)return 0;let q=C/G;if(q<0.2)return 1;if(q<0.45)return 2;if(q<0.7)return 3;return 4},A=(new Date(_[0].date+"T00:00:00Z").getUTCDay()+6)%7,Q=Array(A).fill(null);for(let C of _)Q.push(C);let D=[];for(let C=0;C<Q.length;C+=NT)D.push(Q.slice(C,C+NT));let V=[],P="",R=D.map((C)=>{let q=C.find((r)=>r!==null);if(!q)return"";let u=new Date(q.date+"T00:00:00Z").toLocaleDateString("en-US",{month:"short"});if(u!==P)return P=u,u;return""}),H=["Mon","","Wed","","Fri","","Sun"],p='<div class="hm-row hm-head"><div class="hm-corner"></div>'+D.map((C,q)=>`<div class="hm-m">${R[q]}</div>`).join("")+"</div>",n=Array.from({length:NT},(C,q)=>{let u=D.map((r)=>{let c=r[q];if(!c)return'<div class="hm-c hm-empty"></div>';let T_=U(c),f_=E(T_),s=`${c.date}
${c.runs} run${c.runs===1?"":"s"}, ${c.lines} lines`;return`<div class="hm-c hm-l${f_}" title="${s.replace(/"/g,"&quot;")}"></div>`}).join("");return`<div class="hm-row"><div class="hm-lab">${H[q]}</div>${u}</div>`}).join("");return`<div class="hm">${p}${n}${'<div class="hm-legend"><span class="hm-legend-label">Less</span><div class="hm-c hm-l0"></div><div class="hm-c hm-l1"></div><div class="hm-c hm-l2"></div><div class="hm-c hm-l3"></div><div class="hm-c hm-l4"></div><span class="hm-legend-label">More</span></div>'}</div>`},NS=(_,U,G,E=6)=>{if(G.length===0)return"";let X=Math.max(1,...G.map((D)=>D.count)),A=O_.has(U),Q=G.slice(0,E).map((D)=>`
        <div class="list-row">
          <div class="list-name" title="${D.name}">${D.name}</div>
          <div class="list-bar-wrap"><div class="list-bar" style="width:${D.count/X*100}%"></div></div>
          <div class="list-val">${D.count}</div>
        </div>`).join("");return`<div class="section">
    <button type="button" class="sec-head" data-collapse="${U}">
      <span class="sec-chev">${A?"▸":"▾"}</span>
      <span class="section-title">${_}</span>
      <span class="sec-count">${G.length}</span>
    </button>
    <div class="sec-body" style="display:${A?"none":""}">${Q}</div>
  </div>`},xS=async()=>{let _=++LT;TU(),__.innerHTML="";let U=KT(__,{label:"Loading Devin activity"});g_.push(U);try{let[G,E]=await Promise.all([RT.serviceRequest({method:"GET",path:"/quota"}),RT.serviceRequest({method:"GET",path:"/analytics?days=120"})]);if(_!==LT)return;U.dispose();let X=G.status===200?JSON.parse(G.body):null,A=null;if(E.status===200)try{A=JSON.parse(E.body)}catch{A={ok:!1,error:"bad JSON from service",days:[],models:[],tools:[],summary:null,rangeDays:0}}else A={ok:!1,error:`service returned ${E.status}: ${String(E.body).slice(0,200)}`,days:[],models:[],tools:[],summary:null,rangeDays:0};let Q=[];if(Q.push(`<div class="hdr">
         <div class="title">Devin</div>
         <button class="btn" id="refresh">Refresh</button>
       </div>`),X?.ok){let D=X.usage?.windows??{},V=X.user?.name,P=X.planLabel,R=D.monthly?.resetAt,H=R?SU(R):null;if(V||P||!!H){let U_=[V?`<span class="u-name">${V}</span>`:"",P?`<span class="plan-badge">${P.toUpperCase()}</span>`:""].join(""),C=H?`<span class="meta-label">Plan ends:</span> <span class="meta-val">${H}</span>`:"";Q.push(`<div class="user-row"><div class="u-left">${U_}</div><div class="u-right">${C}</div></div>`)}}if(X?.ok){let D=X.usage?.windows??{},V=[bT("Daily",D["1d"]),bT("Weekly",D.weekly),bT("Credits",D.credits_balance)].filter(Boolean).join("");if(V)Q.push(`<div class="q-grid">${V}</div>`)}else if(X&&!X.ok)Q.push(`<div class="err"><b>Quota:</b> ${X.error??"unavailable"}</div>`);if(A?.ok&&A.days&&A.days.length>0){let D=A.days.filter((H)=>H.runs>0||H.lines>0),V=A.days.reduce((H,p)=>H+p.runs,0),P=A.days.reduce((H,p)=>H+p.lines,0),R=A.summary?.aiCodePct;if(Q.push(`<div class="section section-activity">
           <div class="section-title">Activity — last ${A.rangeDays} days</div>
           <div class="stats">
             <div class="stat"><div class="stat-num">${D.length}</div><div class="stat-lab">active days</div></div>
             <div class="stat"><div class="stat-num">${V}</div><div class="stat-lab">runs</div></div>
             <div class="stat"><div class="stat-num">${P.toLocaleString()}</div><div class="stat-lab">lines</div></div>
             ${R!==null&&R!==void 0?`<div class="stat"><div class="stat-num">${Math.round(R*100)}%</div><div class="stat-lab">AI code</div></div>`:""}
           </div>
           ${XU(A.days)}
         </div>`),A.models?.length)Q.push(NS("Models","models",A.models,10));if(A.tools?.length)Q.push(NS("Tools","tools",A.tools,10))}else if(A?.ok&&A.days&&A.days.length===0)Q.push('<div class="err"><b>Analytics:</b> service returned no days</div>');else if(A&&!A.ok)Q.push(`<div class="err"><b>Analytics:</b> ${A.error??"unavailable"}</div>`);else Q.push('<div class="err"><b>Analytics:</b> no response from service</div>');__.innerHTML=`<div class="wrap">${Q.join("")}</div>`,__.querySelector("#refresh")?.addEventListener("click",()=>void xS()),__.querySelectorAll("[data-collapse]").forEach((D)=>{D.addEventListener("click",()=>{let V=D.dataset.collapse;if(V)MU(V)})})}catch(G){if(_!==LT)return;U.dispose();let E=G instanceof O?`${G.code}: ${G.message}`:String(G);__.innerHTML="",g_.push(PT(__,{tone:"error",title:"Service request failed",body:E}))}},wS=document.createElement("style");wS.textContent=`
  .wrap { font: 12px/1.5 var(--font-sans, system-ui); color: var(--foreground, #ddd); display:flex; flex-direction:column; }
  .wrap > * + * { margin-top: 12px; }
  .wrap > .hdr + .user-row { margin-top: 0; }
  .wrap > .hdr + .q-grid { margin-top: 8px; }
  .wrap > .user-row + .q-grid { margin-top: 12px; }
  .wrap > .section-activity { margin-top: 1rem; }
  .hdr { display:flex; align-items:center; justify-content:space-between; padding-bottom:8px; border-bottom:1px solid var(--border, #333); }
  .title { font-weight:600; font-size:13px; }
  .btn { background: var(--primary, #4a7); color: var(--primary-foreground, #fff); border:0; border-radius:4px; padding:4px 10px; font:inherit; cursor:pointer; font-size:11px; }
  .btn:hover { opacity: .9; }
  .user-row { display:flex; align-items:center; justify-content:space-between; padding:8px 0 0; font-size:12px; }
  .u-left { display:flex; align-items:center; gap:8px; }
  .u-name { color: var(--foreground, #ddd); font-weight:500; }
  .plan-badge { background: #fffc; color: #000; font-size:8px; font-weight:400; padding:2px 6px; border-radius:3px; letter-spacing:.03em; }
  .u-right { font-size:11px; color: var(--muted-foreground, #888); }
  .meta-label { color: var(--muted-foreground, #888); }
  .meta-val { color: var(--foreground, #ddd); font-weight:500; }

  .q-grid { display:grid; grid-template-columns: 1fr 1fr; gap:8px; }
  .q-card { background: var(--card, #1a1a1a); border:1px solid var(--border, #333); border-radius:6px; padding:8px 10px; }
  .q-row { display:flex; justify-content:space-between; padding:1px 0; }
  .q-row.sub { font-size:10px; color: var(--muted-foreground, #888); }
  .q-label { font-weight:500; }
  .q-val { font-variant-numeric: tabular-nums; font-weight:600; }
  .bar { height: 4px; background: var(--muted, #2a2a2a); border-radius:2px; margin:4px 0 2px; overflow:hidden; }
  .bar-fill { height:100%; background: var(--primary, #4a7); border-radius:2px; transition:width .3s; }

  .section { display:flex; flex-direction:column; gap:6px; }
  .section-title { font-size:11px; text-transform:uppercase; letter-spacing:.04em; color: var(--muted-foreground, #888); font-weight:600; }
  .stats { display:grid; grid-template-columns: repeat(auto-fit, minmax(60px, 1fr)); gap:6px; margin-bottom:4px; }
  .stat { background: var(--card, #1a1a1a); border:1px solid var(--border, #333); border-radius:6px; padding:6px 8px; text-align:center; }
  .stat-num { font-size:16px; font-weight:700; font-variant-numeric: tabular-nums; }
  .stat-lab { font-size:9px; color: var(--muted-foreground, #888); text-transform:uppercase; letter-spacing:.04em; }

  .hm { display:flex; flex-direction:column; gap:3px; padding:8px; background: var(--card, #1a1a1a); border:1px solid var(--border, #333); border-radius:6px; }
  .hm-row { display:flex; gap:3px; align-items:center; flex:1; }
  .hm-row .hm-lab { flex-shrink:0; }
  .hm-row .hm-c { flex:1; }
  .hm-corner { width:24px; flex-shrink:0; }
  .hm-head { margin-bottom:2px; }
  .hm-m { flex:1; font-size:9px; color: var(--muted-foreground, #888); overflow:hidden; white-space:nowrap; min-width:0; }
  .hm-lab { width:24px; font-size:9px; color: var(--muted-foreground, #888); text-align:right; padding-right:3px; }
  .hm-c { height:14px; border-radius:2px; min-width:0; }
  .hm-empty { background: transparent; }
  .hm-l0 { background: var(--muted, #222); }
  .hm-l1 { background: #0e4429; }
  .hm-l2 { background: #006d32; }
  .hm-l3 { background: #26a641; }
  .hm-l4 { background: #39d353; }
  .hm-c:hover { outline: 1px solid var(--foreground, #fff); }
  .hm-legend { display:flex; align-items:center; gap:3px; margin-top:6px; justify-content:flex-end; }
  .hm-legend .hm-c { width:10px; height:10px; flex:none; }
  .hm-legend-label { font-size:9px; color: var(--muted-foreground, #888); margin: 0 4px; }

  .sec-head { display:flex; align-items:center; gap:6px; width:100%; background:transparent; border:0; padding:2px 0; cursor:pointer; color: inherit; font: inherit; text-align:left; }
  .sec-head:hover .section-title { color: var(--foreground, #ddd); }
  .sec-chev { color: var(--muted-foreground, #888); font-size:10px; width:10px; }
  .sec-count { margin-left:auto; font-size:10px; color: var(--muted-foreground, #888); background: var(--muted, #2a2a2a); border-radius:8px; padding:1px 6px; font-variant-numeric:tabular-nums; }
  .sec-body { display:flex; flex-direction:column; gap:2px; padding-top:4px; }

  .list-row { display:grid; grid-template-columns: minmax(0,1fr) 2fr 40px; align-items:center; gap:8px; padding:2px 0; font-size:11px; }
  .list-name { color: var(--foreground, #ddd); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .list-bar-wrap { height:6px; background: var(--muted, #222); border-radius:3px; overflow:hidden; }
  .list-bar { height:100%; background: var(--primary, #4a7); border-radius:3px; }
  .list-val { text-align:right; font-variant-numeric: tabular-nums; color: var(--muted-foreground, #aaa); }

  .err { background: var(--destructive, #633); color: var(--destructive-foreground, #fdd); border:1px solid var(--destructive, #844); border-radius:6px; padding:8px 10px; font-size:11px; }
  .empty { color: var(--muted-foreground, #888); font-size: 11px; padding: 8px 0; text-align:center; }
`;document.head.appendChild(wS);RT.onReady((_)=>{ZT(_,document.documentElement),xS()});})();
