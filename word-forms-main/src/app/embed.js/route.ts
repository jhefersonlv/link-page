import { NextResponse } from 'next/server'

const EMBED_SCRIPT = `/* word-forms embed v2 */
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  var script = document.currentScript;
  if (!script) return;

  var subdomain = (script.getAttribute('data-form') || '').trim().toLowerCase();
  if (!/^[a-z0-9-]{3,40}$/.test(subdomain)) {
    console.error('[word-forms] missing or invalid data-form attribute');
    return;
  }

  var explicitHost = (script.getAttribute('data-host') || '').replace(/\\/$/, '');
  var srcUrl;
  try { srcUrl = new URL(script.src); } catch (_) { srcUrl = null; }
  var base = explicitHost || (srcUrl ? srcUrl.origin : '');
  if (!base) {
    console.error('[word-forms] could not infer host; pass data-host attribute');
    return;
  }

  var mode = (script.getAttribute('data-mode') || 'inline').toLowerCase();
  var minHeight = parseInt(script.getAttribute('data-min-height') || '480', 10);
  var maxHeight = parseInt(script.getAttribute('data-max-height') || '900', 10);

  function buildIframe(extraCss, fill) {
    var iframe = document.createElement('iframe');
    var qs = fill ? '?fill=1' : '';
    iframe.src = base + '/embed/' + encodeURIComponent(subdomain) + qs;
    iframe.title = 'Formulário de contato';
    iframe.loading = 'lazy';
    iframe.allow = 'clipboard-write';
    iframe.setAttribute('data-word-forms-iframe', '1');
    iframe.style.cssText =
      'border:0;width:100%;display:block;background:transparent;color-scheme:normal;' +
      (extraCss || '');
    return iframe;
  }

  if (mode === 'bubble') {
    setupBubble();
  } else {
    setupInline();
  }

  // -------------------------------------------------------------------------
  // INLINE — iframe injetado em sequência ao script, com auto-resize
  // -------------------------------------------------------------------------
  function setupInline() {
    var iframe = buildIframe('min-height:' + minHeight + 'px;height:' + minHeight + 'px;');
    if (script.parentNode) {
      script.parentNode.insertBefore(iframe, script.nextSibling);
    } else {
      document.body.appendChild(iframe);
    }
    window.addEventListener('message', function (event) {
      if (!event || event.source !== iframe.contentWindow) return;
      var data = event.data;
      if (!data || data.type !== 'lead-form:resize' || typeof data.height !== 'number') return;
      var h = Math.max(minHeight, Math.min(maxHeight, Math.ceil(data.height)));
      iframe.style.height = h + 'px';
    });
  }

  // -------------------------------------------------------------------------
  // BUBBLE — botão flutuante (FAB) que abre painel com o form
  // -------------------------------------------------------------------------
  function setupBubble() {
    var color = script.getAttribute('data-color') || '#0f172a';
    var label = script.getAttribute('data-label') || '';
    var position = (script.getAttribute('data-position') || 'bottom-right').toLowerCase();
    var isLeft = position.indexOf('left') >= 0;
    var horizCss = isLeft ? 'left:24px' : 'right:24px';

    var chatIcon =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>' +
      '</svg>';
    var closeIcon =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Abrir formulário de contato');
    btn.style.cssText =
      'position:fixed;bottom:24px;' + horizCss +
      ';z-index:2147483646;display:flex;align-items:center;gap:8px;' +
      'padding:0 ' + (label ? '20px' : '0') + ';height:56px;min-width:56px;' +
      'border:0;border-radius:28px;background:' + color + ';color:#fff;cursor:pointer;' +
      'box-shadow:0 8px 20px rgba(15,23,42,0.18);font:600 14px -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;' +
      'transition:transform .15s ease;outline:0;';
    btn.innerHTML =
      '<span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;">' +
      chatIcon + '</span>' +
      (label ? '<span>' + escapeHtml(label) + '</span>' : '');
    btn.addEventListener('mouseenter', function () { btn.style.transform = 'translateY(-1px)'; });
    btn.addEventListener('mouseleave', function () { btn.style.transform = 'none'; });

    var panel = document.createElement('div');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Formulário de contato');
    panel.style.cssText =
      'position:fixed;bottom:96px;' + horizCss +
      ';width:380px;max-width:calc(100vw - 32px);' +
      'height:640px;max-height:calc(100dvh - 120px);' +
      'z-index:2147483647;border-radius:16px;overflow:hidden;background:#fff;' +
      'box-shadow:0 16px 48px -8px rgba(15,23,42,0.28);display:none;flex-direction:column;';

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Fechar formulário');
    closeBtn.style.cssText =
      'position:absolute;top:10px;' + (isLeft ? 'left:10px' : 'right:10px') +
      ';z-index:1;display:flex;align-items:center;justify-content:center;' +
      'width:32px;height:32px;border:0;border-radius:16px;background:rgba(15,23,42,0.06);color:#0f172a;cursor:pointer;';
    closeBtn.innerHTML = closeIcon;
    panel.appendChild(closeBtn);

    var iframe = null;
    var isOpen = false;

    function open() {
      if (!iframe) {
        iframe = buildIframe('flex:1;height:100%;width:100%;', true);
        panel.appendChild(iframe);
      }
      panel.style.display = 'flex';
      btn.style.display = 'none';
      isOpen = true;
    }
    function close() {
      panel.style.display = 'none';
      btn.style.display = 'flex';
      isOpen = false;
    }

    btn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (event) {
      if (isOpen && event.key === 'Escape') close();
    });

    document.body.appendChild(panel);
    document.body.appendChild(btn);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
})();
`

export function GET() {
  return new NextResponse(EMBED_SCRIPT, {
    status: 200,
    headers: {
      'content-type': 'application/javascript; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=300',
      'access-control-allow-origin': '*'
    }
  })
}
