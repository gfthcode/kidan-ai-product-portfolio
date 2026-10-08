/* Condensation-covered glass opening: real erasing strokes reveal the live page underneath. */
(() => {
  const overlay = document.querySelector('#fog-intro');
  const canvas = document.querySelector('#fog-canvas');
  const context = canvas.getContext('2d');
  const skip = document.querySelector('#fog-skip');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let running = false, finishing = false, touched = false, last = null;
  let width = 0, height = 0, radius = 80, columns = 0, rows = 0, cleared = 0;
  let cells = new Set(), raf = 0, idleTimer = 0, demoTimer = 0, hideTimer = 0, resizeTimer = 0;
  const stopMotion = () => { cancelAnimationFrame(raf); clearTimeout(idleTimer); clearTimeout(demoTimer); };
  const surfaces = enabled => document.querySelectorAll('[data-surface]').forEach(el => { el.inert = enabled; });
  function finish(reason = 'complete') {
    if (!running || finishing) return;
    finishing = true; stopMotion();

    document.querySelector('#fog-status').textContent = '雾气已擦开，欢迎进入陈高波的个人作品集。';
    overlay.classList.add('is-clearing');
    hideTimer = setTimeout(() => {
      running = false; overlay.hidden = true; surfaces(false);
      document.dispatchEvent(new CustomEvent('kidan:fog-finished',{detail:{skipped:reason==='skip'}}));
      if (overlay.contains(document.activeElement)) document.querySelector('#archive-toggle')?.focus({preventScroll:true});
    }, reduced.matches ? 0 : 650);
  }
  function drawFog() {
    width = innerWidth; height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.globalCompositeOperation = 'source-over';
    // A soft view through humid glass, rather than an opaque white cover.
    const scene = document.createElement('canvas');
    scene.width = width; scene.height = height;
    const sceneContext = scene.getContext('2d');
    sceneContext.fillStyle = '#e6e5e2'; sceneContext.fillRect(0, 0, width, height);
    const portrait = document.querySelector('.scene-model img');
    if (portrait.complete && portrait.naturalWidth) {
      const rect = portrait.getBoundingClientRect();
      sceneContext.drawImage(portrait, rect.left, rect.top, rect.width, rect.height);
    }
    context.save(); context.filter = 'blur(16px)';
    context.drawImage(scene, -12, -12, width + 24, height + 24); context.restore();
    const haze = context.createLinearGradient(0, 0, width, height);
    haze.addColorStop(0, 'rgba(229,236,231,.48)');
    haze.addColorStop(.5, 'rgba(231,237,232,.38)');
    haze.addColorStop(1, 'rgba(235,239,235,.55)');
    context.fillStyle = haze; context.fillRect(0, 0, width, height);
    // Uneven condensation gathers in soft patches on the glass.
    for (let i = 0; i < 24; i++) {
      const x = Math.random() * width, y = Math.random() * height;
      const r = Math.max(width, height) * (.07 + Math.random() * .12);
      const patch = context.createRadialGradient(x,y,0,x,y,r);
      patch.addColorStop(0,'rgba(245,247,243,.10)');patch.addColorStop(1,'rgba(245,247,243,0)');
      context.fillStyle=patch;context.fillRect(x-r,y-r,r*2,r*2);
    }
    // Each larger bead refracts the actual portrait, with a dark meniscus and a lit rim.
    function droplet(x, y, r, stretch = 1.2) {
      context.save();context.translate(x,y);context.scale(1,stretch);
      context.beginPath();context.ellipse(0,0,r,r,0,0,Math.PI*2);context.clip();
      context.globalAlpha=.5;
      context.drawImage(scene,Math.max(0,x-r*2.4),Math.max(0,y-r*2.4),r*4.8,r*4.8,-r,-r,r*2,r*2);
      context.globalAlpha=1;
      const lens=context.createRadialGradient(-r*.28,-r*.3,r*.1,0,0,r);
      lens.addColorStop(0,'rgba(248,255,249,.48)');lens.addColorStop(.32,'rgba(220,233,223,.06)');
      lens.addColorStop(.78,'rgba(24,39,29,.10)');lens.addColorStop(.93,'rgba(13,27,19,.30)');lens.addColorStop(1,'rgba(249,255,250,.56)');
      context.fillStyle=lens;context.fillRect(-r,-r,r*2,r*2);context.restore();
      context.save();context.translate(x,y);context.scale(1,stretch);
      context.beginPath();context.ellipse(0,0,r*.84,r*.84,0,.17*Math.PI,.72*Math.PI);
      context.strokeStyle='rgba(253,255,253,.68)';context.lineWidth=Math.max(.55,r*.12);context.stroke();
      context.beginPath();context.ellipse(-r*.27,-r*.38,r*.15,r*.09,-.5,0,Math.PI*2);
      context.fillStyle='rgba(255,255,255,.8)';context.fill();context.restore();
    }
    // Tiny beads supply the dense, wet surface texture; the larger ones remain legible on phones.
    for (let i=0;i<Math.min(5200,width*height/200);i++) {
      const x=Math.random()*width,y=Math.random()*height,r=.3+Math.random()*.9;
      context.beginPath();context.ellipse(x,y,r,r*1.2,0,0,Math.PI*2);
      context.fillStyle='rgba(30,50,38,.10)';context.fill();
      context.beginPath();context.arc(x-.2,y+.35,r*.56,0,Math.PI*2);
      context.fillStyle='rgba(255,255,255,.42)';context.fill();
    }
    const beadCount=Math.min(380,Math.max(90,width*height/4500));
    for(let i=0;i<beadCount;i++){
      const x=8+Math.random()*(width-16),y=8+Math.random()*(height-16);
      const r=1.8+Math.pow(Math.random(),2)*6.5;
      const stretch=1.05+Math.random()*.5;
      // Some beads have pulled short, translucent water trails down the glass.
      if(r>5 && Math.random()>.35){
        const length=12+Math.random()*48;
        context.beginPath();context.moveTo(x-1,y-length);
        context.bezierCurveTo(x+3,y-length*.65,x-3,y-length*.25,x,y);
        context.lineWidth=r*.55;context.strokeStyle='rgba(242,252,244,.15)';context.lineCap='round';context.stroke();
        context.lineWidth=.6;context.strokeStyle='rgba(21,41,27,.16)';context.stroke();
      }
      droplet(x,y,r,stretch);
    }
    radius = Math.max(48, Math.min(width * .085, 115));
    columns = Math.ceil(width / 26); rows = Math.ceil(height / 26);
    cells = new Set(); cleared = 0; last = null;
  }
  function dab(x, y, size = radius, count = true) {
    const brush = context.createRadialGradient(x, y, size * .62, x, y, size);
    brush.addColorStop(0, 'rgba(0,0,0,1)'); brush.addColorStop(.7, 'rgba(0,0,0,.96)'); brush.addColorStop(1, 'rgba(0,0,0,0)');
    context.save(); context.globalCompositeOperation = 'destination-out'; context.fillStyle = brush;
    context.fillRect(x - size, y - size, size * 2, size * 2); context.restore();
    if (!count) return;
    for (let row = Math.max(0, Math.floor((y - size * .7) / 26)); row < Math.min(rows, Math.ceil((y + size * .7) / 26)); row++) {
      for (let col = Math.max(0, Math.floor((x - size * .7) / 26)); col < Math.min(columns, Math.ceil((x + size * .7) / 26)); col++) {
        if (Math.hypot(col * 26 + 13 - x, row * 26 + 13 - y) < size * .7) cells.add(row * columns + col);
      }
    }
    cleared = cells.size / (columns * rows);

    if (cleared >= .32) finish();
  }
  // Residual water gathers at the edges of the wiped path; fine streaks remain inside it.
  function wetEdges(a, b, size) {
    const dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy);if(length<2)return;
    const nx=-dy/length,ny=dx/length;
    context.save();context.globalCompositeOperation='source-over';context.lineCap='round';
    for(const offset of [-.91,.91,-.34,.18,.49]){
      context.beginPath();context.moveTo(a.x+nx*size*offset,a.y+ny*size*offset);
      context.lineTo(b.x+nx*size*offset,b.y+ny*size*offset);
      context.lineWidth=Math.abs(offset)>.8?1.1:.65;
      context.strokeStyle=Math.abs(offset)>.8?'rgba(240,251,243,.26)':'rgba(235,247,238,.085)';context.stroke();
    }
    context.restore();
  }
  function stroke(x, y) {
    if (last) {
      const distance = Math.hypot(x - last.x, y - last.y);
      const steps = Math.max(1, Math.ceil(distance / (radius * .25)));
      for (let i = 1; i <= steps; i++) dab(last.x + (x - last.x) * i / steps, last.y + (y - last.y) * i / steps);
      wetEdges(last,{x,y},radius);
    } else dab(x, y);
    last = {x, y};
  }
  function automaticWipe() {
    if (!running || finishing) return;
    const started = performance.now();
    const bands = 6, brushSize = Math.max(width / 9, height / 8);
    let previous = {x:-brushSize, y:height * .08};
    const frame = now => {
      if (!running || finishing) return;
      const t = Math.min((now - started) / 2200, 1), position = t * bands;
      const band = Math.min(bands - 1, Math.floor(position));
      const local = t === 1 ? 1 : position - band;
      const x = (band % 2 ? 1 - local : local) * (width + brushSize * 2) - brushSize;
      const y = height * (.08 + .84 * position / bands);
      const steps = Math.max(1, Math.ceil(Math.hypot(x - previous.x, y - previous.y) / (brushSize * .25)));
      for (let i = 1; i <= steps; i++) dab(previous.x + (x - previous.x) * i / steps, previous.y + (y - previous.y) * i / steps, brushSize, false);
      wetEdges(previous,{x,y},brushSize);
      previous = {x, y};

      if (t < 1) raf = requestAnimationFrame(frame); else finish();
    };
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (!context || reduced.matches) return;
    stopMotion(); clearTimeout(hideTimer); clearTimeout(resizeTimer);
    running = true; finishing = false; touched = false;
    overlay.hidden = false; overlay.classList.remove('is-clearing');
    document.querySelector('#fog-status').textContent = '';
    surfaces(true); drawFog(); skip.focus({preventScroll:true});
    if (!reduced.matches) {
      demoTimer = setTimeout(() => {
        const startTime = performance.now();
        const demo = now => {
          if (!running || finishing || touched) return;
          const t = Math.min((now - startTime) / 1000, 1);
          dab(width * (.36 + t * .24), height * (.56 - Math.sin(t * Math.PI) * .13), radius * .8, false);
          if (t < 1) raf = requestAnimationFrame(demo);
        };
        raf = requestAnimationFrame(demo);
      }, 650);
      idleTimer = setTimeout(automaticWipe, 4200);
    }
  }
  function interact(event) {
    if (!running || finishing) return;
    if (event.pointerType === 'touch' && event.type === 'pointermove' && !event.buttons) return;
    stopMotion(); touched = true;
    stroke(event.clientX, event.clientY);
    if (!finishing && !reduced.matches) idleTimer = setTimeout(automaticWipe, 3000);
  }
  canvas.addEventListener('pointerdown', event => {last = null;canvas.setPointerCapture(event.pointerId);interact(event);});
  canvas.addEventListener('pointermove', interact);
  canvas.addEventListener('pointerup', () => {last = null;});
  canvas.addEventListener('pointercancel', () => {last = null;});
  canvas.addEventListener('pointerleave', () => {last = null;});
  skip.addEventListener('click', () => finish('skip'));
  document.addEventListener('keydown', event => {
    if (overlay.hidden) return;
    if (event.key === 'Escape') {event.preventDefault();finish('skip');}
    if (event.key === 'Tab') {event.preventDefault();skip.focus();}
  });
  window.addEventListener('resize', () => {
    if (!running || finishing) return;
    stopMotion(); clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {if (!running || finishing) return;drawFog();if(!reduced.matches)idleTimer=setTimeout(automaticWipe,2000);}, 120);
  });
  document.querySelector('.scene-model img').addEventListener('load', () => {if (running && !finishing && !touched) drawFog();});
  reduced.addEventListener('change', () => {if (reduced.matches && running) finish();});
  window.KidanFog = {start, get active() {return !overlay.hidden;}};
})();
