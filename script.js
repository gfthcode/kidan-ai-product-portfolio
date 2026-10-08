document.addEventListener('DOMContentLoaded', () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const backdrop = document.querySelector('#backdrop');
  const modal = document.querySelector('.detail-modal');
  const title = document.querySelector('#modal-title');
  const kicker = document.querySelector('#modal-kicker');
  const content = document.querySelector('#modal-content');
  const closeButton = document.querySelector('.modal-close');
  let returnFocus = null, closeTimer = 0;
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const makeSection = section => {
    let html = `<article class="detail-section"><div class="detail-eyebrow">${esc(section.eyebrow || '')}</div><h3>${esc(section.title || '')}</h3>`;
    if (section.text) html += `<p>${esc(section.text)}</p>`;
    if (section.bullets) html += `<ul>${section.bullets.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`;
    if (section.subsections) html += `<div class="detail-subsections">${section.subsections.map(([heading, text])=>`<div><h4>${esc(heading)}</h4><p>${esc(text)}</p></div>`).join('')}</div>`;
    if (section.repos) html += `<div class="repo-list">${section.repos.map(([name,desc,url])=>`<a class="repo-row" href="${esc(url)}" target="_blank" rel="noreferrer"><span><b>${esc(name)}</b><small>${esc(desc)}</small></span><i>↗</i></a>`).join('')}</div>`;
    if (section.tags) html += `<div class="skill-tags">${section.tags.map(tag=>`<span>${esc(tag)}</span>`).join('')}</div>`;
    if (section.links) html += `<div class="detail-links">${section.links.map(([label,url])=>`<a href="${esc(url)}" ${(url.startsWith('http') || url.endsWith('.pdf'))?'target="_blank" rel="noreferrer"':''}>${esc(label)} <b>↗</b></a>`).join('')}</div>`;
    return html + '</article>';
  };
  window.PORTFOLIO_CONTENT.panels.contact = {number:'05',label:'联系我',title:'联系陈高波',sections:[{title:'一起聊聊产品与新的机会。',text:'新南威尔士大学 UNSW · 金融科技本科生',links:[['152 6881 7047','tel:+8615268817047'],['g1628908@gmail.com','mailto:g1628908@gmail.com'],['在线查看简历 PDF','assets/Chen_Gaobo_Resume.pdf?v=20261008-ai-site']]}]};
  const projectData = window.PORTFOLIO_CONTENT.panels.projects;
  ['nucleus','courtmatch'].forEach((key,index) => {
    window.PORTFOLIO_CONTENT.panels[key] = {number:String(index+1).padStart(2,'0'),label:'个人项目',title:projectData.showcase[index].name,sections:[projectData.sections[index]],cover:index===0?'assets/nucleus-preview.png':'assets/courtmatch-preview.png'};
  });
  const archiveToggle = document.querySelector('#archive-toggle');
  const archiveMenu = document.querySelector('#archive-menu');
  const closeArchive = () => {archiveMenu.hidden=true;archiveToggle.setAttribute('aria-expanded','false');};
  archiveToggle.addEventListener('click',()=>{stopOpening();const show=archiveMenu.hidden;archiveMenu.hidden=!show;archiveToggle.setAttribute('aria-expanded',String(show));});
  document.addEventListener('click',e=>{if(!e.target.closest('.masthead'))closeArchive();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!archiveMenu.hidden){closeArchive();archiveToggle.focus();}});
  const setupExperience = panel => {
    const section=panel.sections[0];
    const names=['AIUI 智能体','无障碍体验','海外适配'];
    content.innerHTML=`<p class="experience-context">${esc(section.eyebrow)} · 参与 AIUI 智能体交互、无障碍体验与海外适配。</p><div class="experience-tabs" role="tablist" aria-label="选择实习工作"><button type="button" role="tab" id="experience-tab-0" aria-controls="experience-article">${names[0]}</button><button type="button" role="tab" id="experience-tab-1" aria-controls="experience-article">${names[1]}</button><button type="button" role="tab" id="experience-tab-2" aria-controls="experience-article">${names[2]}</button></div><div id="experience-article" role="tabpanel" tabindex="0"></div>`;
    const tabs=[...content.querySelectorAll('[role="tab"]')];
    const paint=index=>{
      tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
      const [heading,text]=section.subsections[index];
      const article=content.querySelector('#experience-article');article.setAttribute('aria-labelledby',tabs[index].id);
      article.innerHTML=makeSection({title:heading.replace(/^\d+\s*\/\s*/,''),text});
    };
    tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>paint(index));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(index+1)%3;if(e.key==='ArrowLeft')next=(index+2)%3;if(e.key==='Home')next=0;if(e.key==='End')next=2;if(next!==undefined){e.preventDefault();paint(next);tabs[next].focus();}});});
    paint(0);
  };
  const openPanel = key => {
    const panel = window.PORTFOLIO_CONTENT?.panels?.[key]; if (!panel) return;
    stopOpening(); closeArchive(); clearTimeout(closeTimer); returnFocus = document.activeElement;
    kicker.textContent = `${panel.number} / ${panel.label}`; title.textContent = panel.title;
    if(key==='experience')setupExperience(panel);else content.innerHTML=`${panel.cover?`<img class="detail-cover" src="${esc(panel.cover)}" alt="${esc(panel.title)} 产品界面">`:''}${panel.sections.map(makeSection).join('')}`;
    content.scrollTop = 0; modal.classList.toggle('has-showcase',Boolean(panel.cover));
    backdrop.hidden = false; document.body.classList.add('modal-open');
    document.querySelectorAll('[data-surface]').forEach(el => el.inert = true);
    requestAnimationFrame(() => {backdrop.classList.add('is-open'); closeButton.focus({preventScroll:true});});
  };
  const closePanel = () => {
    if (backdrop.hidden) return;
    backdrop.classList.remove('is-open'); document.body.classList.remove('modal-open');
    document.querySelectorAll('[data-surface]').forEach(el => el.inert = false);
    clearTimeout(closeTimer); closeTimer = setTimeout(() => {backdrop.hidden = true; if(returnFocus?.isConnected && !returnFocus.closest('[hidden]'))returnFocus.focus({preventScroll:true});else archiveToggle.focus({preventScroll:true});},200);
  };
  document.querySelectorAll('[data-panel]').forEach(button => button.addEventListener('click', () => openPanel(button.dataset.panel)));
  closeButton.addEventListener('click', closePanel);
  backdrop.addEventListener('click', e => {if(e.target === backdrop) closePanel();});
  document.addEventListener('keydown', e => {
    if(backdrop.hidden) return;
    if(e.key === 'Escape'){e.preventDefault();closePanel();}
    if(e.key === 'Tab'){
      const items=[...modal.querySelectorAll('button, a[href], [tabindex="0"]')].filter(el=>!el.closest('[hidden]') && el.tabIndex>=0);
      const first=items[0],last=items[items.length-1];
      if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
    }
  });

  const scenes=window.PORTFOLIO_SCENES;
  const sceneButtons=[...document.querySelectorAll('[data-scene-to]')];
  const contexts=[...document.querySelectorAll('[data-context]')];
  const goggles=document.querySelector('.scene-goggles');
  const turn=document.querySelector('.goggles-turn');
  let scene=0,wheelDelta=0,lastWheel=0,touchStart=null,openingTimers=[];
  function stopOpening(){openingTimers.forEach(clearTimeout);openingTimers=[];document.body.classList.remove('opening-sequence');}
  function selectScene(index,manual=true){
    if(manual)stopOpening();closeArchive();scene=(index+scenes.length)%scenes.length;
    document.body.dataset.scene=String(scene);
    sceneButtons.forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.sceneTo)===scene)));
    contexts.forEach(context=>{context.hidden=Number(context.dataset.context)!==scene;});
    goggles.setAttribute('aria-hidden',String(scene!==2));goggles.tabIndex=scene===2?0:-1;
    if(scene!==2&&document.activeElement===goggles)document.querySelector(`.scene-controls [data-scene-to="${scene}"]`).focus({preventScroll:true});
    document.querySelector('#scene-label').textContent=scenes[scene].hint;
    document.querySelector('#chapter-mark').textContent=scenes[scene].mark;
    document.querySelector('#chapter-caption').textContent=scenes[scene].caption;
    document.querySelector('meta[name="theme-color"]').content=scenes[scene].theme;
  }
  function playOpening(event){
    if(reduced||event.detail?.skipped)return;
    document.body.classList.add('opening-sequence');
    openingTimers=[setTimeout(()=>selectScene(1,false),1800),setTimeout(()=>selectScene(2,false),3600),setTimeout(stopOpening,4900)];
  }
  document.addEventListener('kidan:fog-finished',playOpening,{once:true});
  sceneButtons.forEach(button=>button.addEventListener('click',()=>selectScene(Number(button.dataset.sceneTo))));
  document.querySelector('.next-scene').addEventListener('click',()=>selectScene(scene+1));
  document.querySelector('.mast-brand').addEventListener('click',e=>{e.preventDefault();selectScene(0);});
  window.addEventListener('wheel',event=>{
    if(!backdrop.hidden||window.KidanFog?.active||event.ctrlKey||reduced||!archiveMenu.hidden)return;
    stopOpening();const now=performance.now();if(now-lastWheel<850)return;
    wheelDelta+=event.deltaY;if(Math.abs(wheelDelta)>55){selectScene(Math.max(0,Math.min(2,scene+Math.sign(wheelDelta))));wheelDelta=0;lastWheel=now;}
  },{passive:true});
  const stage=document.querySelector('.visual-stage');
  const finePointer=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if(finePointer&&!reduced){
    const clearStageParallax=()=>{
      ['--figure-x','--figure-y','--pose-x','--pose-y','--goggles-x','--goggles-y','--goggles-tilt'].forEach(name=>stage.style.removeProperty(name));
    };
    stage.addEventListener('pointermove',event=>{
      if(event.pointerType!=='mouse'||dragging)return;
      const bounds=stage.getBoundingClientRect();
      const x=Math.max(-1,Math.min(1,(event.clientX-bounds.left)/bounds.width*2-1));
      const y=Math.max(-1,Math.min(1,(event.clientY-bounds.top)/bounds.height*2-1));
      stage.style.setProperty('--figure-x',`${x*8}px`);
      stage.style.setProperty('--figure-y',`${y*6}px`);
      stage.style.setProperty('--pose-x',`${x*6}px`);
      stage.style.setProperty('--pose-y',`${y*4}px`);
      stage.style.setProperty('--goggles-x',`${x*10}px`);
      stage.style.setProperty('--goggles-y',`${y*7}px`);
      stage.style.setProperty('--goggles-tilt',`${x*3}deg`);
    });
    stage.addEventListener('pointerleave',clearStageParallax);
    content.addEventListener('pointermove',event=>{
      const image=event.target.closest('.detail-cover');
      if(!image)return;
      const bounds=image.getBoundingClientRect();
      const x=(event.clientX-bounds.left)/bounds.width*2-1;
      const y=(event.clientY-bounds.top)/bounds.height*2-1;
      image.style.setProperty('--cover-x',`${-x*5}px`);
      image.style.setProperty('--cover-y',`${-y*5}px`);
    });
    content.addEventListener('pointerout',event=>{
      const image=event.target.closest('.detail-cover');
      if(image&&!image.contains(event.relatedTarget)){
        image.style.removeProperty('--cover-x');image.style.removeProperty('--cover-y');
      }
    });
  }
  stage.addEventListener('touchstart',e=>{touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
  stage.addEventListener('touchend',e=>{
    if(!touchStart||!backdrop.hidden||window.KidanFog?.active)return;
    const dx=touchStart.x-e.changedTouches[0].clientX,dy=touchStart.y-e.changedTouches[0].clientY;touchStart=null;
    if(Math.abs(dy)>60 && Math.abs(dy)>Math.abs(dx)*1.2)selectScene(Math.max(0,Math.min(2,scene+Math.sign(dy))));
  },{passive:true});
  document.addEventListener('keydown',e=>{
    if(!backdrop.hidden||window.KidanFog?.active||/BUTTON|A/.test(document.activeElement.tagName)||document.activeElement===goggles)return;
    if(['ArrowDown','ArrowRight','ArrowUp','ArrowLeft'].includes(e.key)){e.preventDefault();selectScene(scene+(['ArrowDown','ArrowRight'].includes(e.key)?1:-1));}
  });
  let dragging=false,startX=0,startY=0,startTurn=0,dragDistance=0;
  const rotate=x=>turn.style.setProperty('--turn',Math.max(0,Math.min(1,x)));
  goggles.addEventListener('pointerdown',e=>{if(scene!==2)return;stopOpening();dragging=true;startX=e.clientX;startY=e.clientY;dragDistance=0;startTurn=Number(turn.style.getPropertyValue('--turn'))||0;goggles.setPointerCapture(e.pointerId);goggles.classList.add('is-dragging');});
  goggles.addEventListener('pointermove',e=>{if(!dragging)return;dragDistance=Math.max(dragDistance,Math.hypot(e.clientX-startX,e.clientY-startY));rotate(startTurn+(e.clientX-startX)/Math.min(innerWidth*.33,330));});
  const endDrag=()=>{if(dragging&&dragDistance>=8)rotate((Number(turn.style.getPropertyValue('--turn'))||0)>=.5?1:0);dragging=false;goggles.classList.remove('is-dragging');};
  goggles.addEventListener('pointerup',()=>{const clicked=dragging&&dragDistance<8;endDrag();if(clicked)openPanel('experience');});
  goggles.addEventListener('pointercancel',endDrag);
  goggles.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openPanel('experience');}else if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();rotate(e.key==='ArrowRight'?1:0);}});
  selectScene(0,false);
  const hash=location.hash.slice(1);
  if(hash==='projects')selectScene(1);
  else if(hash==='experience')selectScene(2);
  else if(window.PORTFOLIO_CONTENT.panels[hash])openPanel(hash);
  else window.KidanFog?.start();
});
