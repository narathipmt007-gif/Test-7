fetch('data.json').then(r=>r.json()).then(data=>{
const names=['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัส','ศุกร์','เสาร์'];
const $=id=>document.getElementById(id);
function parseRange(s){let m=s.match(/(\d{1,2})\.(\d{2})-(\d{1,2})\.(\d{2})/);if(!m)return null;return [+m[1]*60+ +m[2],+m[3]*60+ +m[4]]}
function norm(v){return String(v||'').replace(/\n/g,' ').trim()}
function run(){let day=names.indexOf($('weekday').value),t=$('time').value.split(':').map(Number),mins=t[0]*60+t[1];let sheet=(mins>=360&&mins<1080)?data.day:data.night;let row=sheet[day+1],found=null;
for(let c=1;c<row.length;c++){let hdr=sheet[0][c],rng=parseRange(hdr);if(!rng)continue;let x=mins;if(mins<360)x+=1440;if(rng[0]<=x&&x<=rng[1]){found={c,hdr,cell:row[c]};break}}
if(!found){$('result').textContent='ไม่พบช่วงเวลาในตาราง';return}
let parts=String(found.cell).split('\n'),label=parts[0],vals=(parts[1]||'').split(',').map(x=>x.trim());let subIndex=0;let headers=String(sheet[0][found.c]).split('\n')[1]||'';let times=headers.split(',').map(x=>x.trim());let timeText=$('time').value;let selected=times.findIndex(x=>{let p=x.split('.').map(Number);return p.length===2&&mins===p[0]*60+p[1]});if(selected<0)selected=1;
let status=vals[selected]||'ไม่ระบุ';let good=status==='ดี';
$('result').innerHTML=`<h3>${names[day]} • ${label}</h3><p>เวลา ${norm(found.hdr)}</p><p>ผลช่วงย่อย: <b class="${good?'good':'bad'}">${status}</b></p><p>${good?'เกณฑ์ดีตามตาราง':'เกณฑ์ไม่ดีตามตาราง'}</p>`;
let table='<table><tr><th>ช่วง</th><th>ชื่อยาม</th><th>ต้น</th><th>กลาง</th><th>ปลาย</th></tr>';for(let d=0;d<7;d++){table+=`<tr><td>${names[d]}</td>`;let cell=sheet[d+1][found.c]||'',p=String(cell).split('\n'),v=(p[1]||'').split(',');table+=`<td>${p[0]||''}</td>${v.map(x=>`<td>${x.trim()}</td>`).join('')}</tr>`}table+='</table>' $('table').innerHTML=table;
let m=data.meanings[day+1]||[];$('meaning').innerHTML=`<table><tr><th>ยาม</th><th>ต้น</th><th>กลาง</th><th>ปลาย</th></tr>${data.meanings.slice(1).map(r=>`<tr>${r.map(x=>`<td>${x||''}</td>`).join('')}</tr>`).join('')}</table>`;
$('extra').innerHTML=data.extra.map(r=>r.filter(Boolean).join(' — ')).filter(Boolean).map(x=>`<p>${x}</p>`).join('');
}
$('check').addEventListener('click',run);run();
}).catch(e=>document.getElementById('result').textContent='โหลดข้อมูลไม่สำเร็จ: '+e);