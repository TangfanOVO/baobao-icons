/* Single-icon exports. Artwork: CC BY-NC 4.0, by @唐幡. */
(() => {
  const panel = document.querySelector('#download');
  const iconChoice = panel.querySelector('#download-icon');
  const motionChoice = panel.querySelector('#download-motion');
  const status = panel.querySelector('#download-status');
  const cancel = panel.querySelector('#download-cancel');
  const result = panel.querySelector('#download-result');
  const saveLink = panel.querySelector('#download-save');
  const fields = panel.querySelectorAll('select, input, [data-format]');
  let outputURL = null;
  let job = null;
  let serial = 0;
  iconChoice.innerHTML = DATA.icons.map(ic => `<option value="${ic.key}">${ic.label} · seal-${ic.key}</option>`).join('');
  motionChoice.innerHTML = MOTIONS.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
  iconChoice.value = 'home';

  function options() {
    return {
      icon: byKey[iconChoice.value], motion: motionChoice.value,
      size: Number(panel.querySelector('#download-size').value),
      color: panel.querySelector('#download-color').value,
      background: panel.querySelector('#download-background').value,
      speed: Number(state.speed), variant: `${state.weight}-${state.eyes}`
    };
  }

  function innerSVG(o) {
    const extra = o.motion === 'idle' ? 'idle' : `${o.motion === 'sleep' ? 'is-asleep ' : ''}do-${o.motion}`;
    const holder = document.createElement('div');
    holder.innerHTML = svg(o.icon, 24, extra);
    const el = holder.firstElementChild;
    el.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    el.removeAttribute('aria-hidden');
    el.style.setProperty('--bb-slow', '1');
    el.style.color = o.color;
    // Each settings icon has a mask; isolate its IDs from the gallery and other exports.
    const ids = new Map();
    el.querySelectorAll('[id]').forEach(node => {
      const id = node.id, unique = `bb-export-${++serial}-${id}`;
      ids.set(id, unique); node.id = unique;
    });
    el.querySelectorAll('*').forEach(node => Array.from(node.attributes).forEach(attr => {
      let value = attr.value;
      ids.forEach((unique, id) => { value = value.replaceAll(`url(#${id})`, `url(#${unique})`); });
      if (value !== attr.value) node.setAttribute(attr.name, value);
    }));
    return el;
  }

  function refresh() {
    const ic = byKey[iconChoice.value];
    motionChoice.querySelector('[value="trick"]').disabled = !ic.trick;
    if (!ic.trick && motionChoice.value === 'trick') motionChoice.value = 'wake';
    const o = options(), preview = panel.querySelector('#download-preview');
    const el = innerSVG(o);
    el.setAttribute('width', '72'); el.setAttribute('height', '72');
    el.style.setProperty('--bb-slow', String(o.speed));
    el.setAttribute('aria-hidden', 'true');
    preview.replaceChildren(el);
    preview.style.background = o.background === 'transparent' ? '' : o.background;
    panel.querySelector('#download-style').textContent = `${state.weight === 'thin' ? '细线' : '粗线'} · ${state.eyes === 'plain' ? '豆豆眼' : '高光眼'} · ${o.speed === 1 ? '正常速度' : '慢放 3 倍'}；粗细、眼睛和速度跟随页面上方的选择。`;
  }

  function select(key, motion) {
    if (job) { status.textContent = '正在生成，请等这一份完成，或先取消。'; return; }
    iconChoice.value = key; motionChoice.value = motion;
    refresh();
    panel.scrollIntoView({ block: 'start' });
    iconChoice.focus({ preventScroll: true });
  }

  const serializer = new XMLSerializer();
  const sourceCSS = document.querySelector('style').textContent;
  const motionCSS = sourceCSS.slice(sourceCSS.indexOf('/* 豹宝 motion'));
  function wrap(o, inner, css = '') {
    // A nested 24-unit viewport preserves every existing transform origin; the outer
    // four-unit margin keeps jumping roofs, balloons and flames inside the image.
    const background = o.background === 'transparent' ? '' : `<rect x="-4" y="-4" width="32" height="32" fill="${o.background}"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${o.size}" height="${o.size}" viewBox="-4 -4 32 32"><title>豹宝图标 · ${o.icon.label}</title><desc>豹宝图标 by @唐幡 · CC BY-NC 4.0 · https://creativecommons.org/licenses/by-nc/4.0/ · 商用请联系作者。</desc>${css ? `<style>${css}</style>` : ''}${background}${inner}</svg>`;
  }

  function publish(blob, name) {
    if (outputURL) URL.revokeObjectURL(outputURL);
    outputURL = URL.createObjectURL(blob);
    saveLink.href = outputURL; saveLink.download = name;
    saveLink.textContent = `保存 ${name}`;
    panel.querySelector('#download-image').src = outputURL;
    result.hidden = false;
    saveLink.click();
    status.textContent = '文件已生成。若未自动下载，点下面的保存链接；手机也可打开预览后保存。';
  }

  const frameProperties = ['transform', 'transform-origin', 'transform-box', 'opacity', 'color', 'fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset', 'visibility'];
  function snapshot(el) {
    const clone = el.cloneNode(true);
    const originals = [el, ...el.querySelectorAll('*')];
    const copies = [clone, ...clone.querySelectorAll('*')];
    originals.forEach((node, i) => {
      const style = getComputedStyle(node);
      frameProperties.forEach(key => copies[i].style.setProperty(key, style.getPropertyValue(key)));
      copies[i].style.animation = 'none';
    });
    return serializer.serializeToString(clone);
  }

  async function drawFrame(context, source) {
    const url = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml;charset=utf-8' }));
    try {
      const image = new Image();
      await new Promise((resolve, reject) => {
        image.onload = resolve; image.onerror = () => reject(new Error('图标画面无法读取'));
        image.src = url;
      });
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      context.drawImage(image, 0, 0);
    } finally { URL.revokeObjectURL(url); }
  }

  async function gif(o, signal) {
    const { GIFEncoder, quantize, applyPalette } = await import('./vendor/gifenc.esm.js');
    const stage = document.createElement('div');
    stage.className = 'export-stage'; stage.setAttribute('aria-hidden', 'true');
    const el = innerSVG(o); stage.append(el); document.body.append(stage);
    try {
      const animations = el.getAnimations({ subtree: true });
      if (!animations.length) throw new Error('当前浏览器无法读取动画，请换 Safari 或 Chrome 重试');
      animations.forEach(animation => { animation.pause(); animation.currentTime = 0; });
      const end = o.motion === 'idle' ? 9600 : Math.max(...animations.map(a => a.effect.getComputedTiming().endTime)) + 600;
      const frames = Math.ceil(end / 50);
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = o.size;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) throw new Error('当前浏览器不能导出 GIF，请改用动态 SVG');
      const encoder = GIFEncoder();
      for (let i = 0; i < frames; i++) {
        signal.throwIfAborted();
        animations.forEach(animation => { animation.currentTime = i * 50; });
        await drawFrame(context, wrap(o, snapshot(el)));
        const { data } = context.getImageData(0, 0, o.size, o.size);
        const transparent = o.background === 'transparent';
        // GIF has one-bit alpha. Preserve the pale muzzle by compositing partial
        // opacity onto a white matte, while leaving the empty canvas transparent.
        if (transparent) for (let p = 0; p < data.length; p += 4) {
          const alpha = data[p + 3] / 255;
          if (alpha < .08) { data[p] = data[p + 1] = data[p + 2] = data[p + 3] = 0; }
          else { for (let c = 0; c < 3; c++) data[p + c] = Math.round(data[p + c] * alpha + 255 * (1 - alpha)); data[p + 3] = 255; }
        }
        const format = transparent ? 'rgba4444' : 'rgb565';
        const palette = quantize(data, 256, { format, oneBitAlpha: true });
        const indexed = applyPalette(data, palette, format);
        const transparentIndex = transparent ? palette.findIndex(color => color[3] === 0) : -1;
        encoder.writeFrame(indexed, o.size, o.size, {
          palette, delay: 50 * o.speed, repeat: 0, dispose: 2,
          transparent: transparentIndex >= 0, transparentIndex: Math.max(0, transparentIndex)
        });
        status.textContent = `正在生成 GIF：${Math.round((i + 1) / frames * 100)}%`;
        if (i % 4 === 0) await new Promise(resolve => setTimeout(resolve, 0));
      }
      signal.throwIfAborted(); encoder.finish();
      return new Blob([encoder.bytes()], { type: 'image/gif' });
    } finally { stage.remove(); }
  }

  panel.addEventListener('change', refresh);
  panel.addEventListener('click', async event => {
    const button = event.target.closest('[data-format]');
    if (!button || job) return;
    const o = options(), format = button.dataset.format;
    const name = `seal-${o.icon.key}-${o.variant}-${o.motion}-${o.size}px-${o.speed}x.${format}`;
    job = new AbortController();
    fields.forEach(field => { field.disabled = true; });
    panel.setAttribute('aria-busy', 'true');
    status.textContent = format === 'gif' ? '正在准备 GIF…' : '正在生成动态 SVG…';
    cancel.hidden = format !== 'gif'; result.hidden = true;
    try {
      let blob;
      if (format === 'gif') blob = await gif(o, job.signal);
      else {
        const el = innerSVG(o); el.style.setProperty('--bb-slow', String(o.speed));
        blob = new Blob([wrap(o, serializer.serializeToString(el), motionCSS)], { type: 'image/svg+xml;charset=utf-8' });
      }
      if (!job.signal.aborted) publish(blob, name);
    } catch (error) {
      status.textContent = error.name === 'AbortError' ? '已取消，可以重新选择或下载。' : `生成失败：${error.message}。请重试，或改用动态 SVG。`;
    } finally {
      fields.forEach(field => { field.disabled = false; });
      panel.removeAttribute('aria-busy'); cancel.hidden = true; job = null; refresh();
    }
  });
  cancel.addEventListener('click', () => job?.abort());
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-download-key]');
    if (button) select(button.dataset.downloadKey, button.dataset.downloadMotion || state.allm);
  });
  document.addEventListener('baobao:settings', () => { if (!job) refresh(); });
  refresh();
})();
