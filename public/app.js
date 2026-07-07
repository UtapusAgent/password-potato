
const $=s=>document.querySelector(s);let items=[];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function api(path,opt){const r=await fetch(path,{headers:{'content-type':'application/json'},...opt});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||r.statusText);return d}
async function load(){items=await api('/api/items');render()}
async function addItem(data){await api('/api/items',{method:'POST',body:JSON.stringify(data)});await load()}
async function updateItem(item){await api('/api/items/'+item.id,{method:'PUT',body:JSON.stringify(item)});await load()}
async function deleteItem(id){if(confirm('Delete this item?')){await api('/api/items/'+id,{method:'DELETE'});await load()}}
function shell(body){document.body.innerHTML='<main><header class="top"><div><h1>'+esc(APP.name)+'</h1><p class="muted">'+esc(APP.desc)+'</p></div></header><div id="app">'+body+'</div></main>'}

async function gen(){let len=$('#length').value||20,sym=$('#symbols').checked;let r=await api('/api/password?length='+len+'&symbols='+sym);$('#password').value=r.password}
function render(){shell('<section class="tool-layout"><aside class="panel"><h2>Generate</h2><input id="label" placeholder="Account label"><label>Length</label><input id="length" type="number" min="8" max="128" value="24"><label><input id="symbols" type="checkbox" checked> Include symbols</label><textarea id="password" placeholder="Generated password"></textarea><button id="generate">Generate</button> <button id="save">Save record</button></aside><section><div class="list">'+(items.map(pw).join('')||'<p class="muted">No saved records.</p>')+'</div></section></section>');$('#generate').onclick=gen;$('#save').onclick=()=>addItem({title:$('#label').value||'Password',body:$('#password').value,status:'saved',meta:{length:$('#length').value,symbols:$('#symbols').checked}})}
function pw(x){return '<article class="item-card"><h3>'+esc(x.title)+'</h3><code class="secret">'+esc(x.body)+'</code><button onclick="copyPw('+x.id+')">Copy</button> <button class="danger" onclick="deleteItem('+x.id+')">Delete</button></article>'}function copyPw(id){let x=items.find(i=>i.id===id);navigator.clipboard.writeText(x.body)}window.copyPw=copyPw;window.deleteItem=deleteItem;load();
