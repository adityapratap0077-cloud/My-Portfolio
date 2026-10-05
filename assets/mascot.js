/* Page mascot — vanilla JS port of the page-mascot skill component.
   A chibi character that watches the cursor and reacts when poked.
   Sheets: assets/mascots/aditya-directions.webp + aditya-reactions.webp */
(function () {
  'use strict';

  var DIRECTIONS_URL = 'assets/mascots/aditya-directions.webp';
  var REACTIONS_URL = 'assets/mascots/aditya-reactions.webp';
  // Unique fingerprint of the header portrait's embedded base64 (see build notes).
  var HEADER_IMG_FINGERPRINT = 'KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigApyffFNp8ePMGaANpbXy7TzMdRVG2OXaLHU9a1FuRJZCNiOnFZsW2PO4fNu4+lA';

  var DIRECTIONS = ['up-left', 'up', 'up-right', 'left', 'center', 'right', 'down-left', 'down', 'down-right'];
  var REACTIONS = ['blink', 'heart', 'sparkle', 'surprised', 'wink', 'bashful', 'sleepy', 'dizzy', 'delighted'];
  // Clockwise from the right, matching atan2 with y pointing down.
  var CLOCKWISE = ['right', 'down-right', 'down', 'down-left', 'left', 'up-left', 'up', 'up-right'];
  var SECTOR = (Math.PI * 2) / CLOCKWISE.length;
  var HYSTERESIS = 0.12;
  var DEAD_ZONE = 70;

  var PAYOFFS = ['heart', 'sparkle', 'delighted'];
  var BOOP_PAYOFF = 120;
  var BOOP_END = 560;
  var SQUASH_MS = 420;
  var DIZZY_AFTER = 4;
  var DIZZY_WINDOW = 1600;
  var DIZZY_END = 1100;

  var SQUASH = [
    { transform: 'scale(1, 1)', easing: 'ease-in' },
    { transform: 'scale(1.10, 0.86)', offset: 0.18, easing: 'ease-out' },
    { transform: 'scale(0.95, 1.08)', offset: 0.45, easing: 'ease-in-out' },
    { transform: 'scale(1.03, 0.97)', offset: 0.72, easing: 'ease-in-out' },
    { transform: 'scale(1, 1)' }
  ];

  function cellPos(index) {
    return ((index % 3) * 50) + '% ' + (Math.floor(index / 3) * 50) + '%';
  }

  function wrap(angle) {
    return Math.atan2(Math.sin(angle), Math.cos(angle));
  }

  function makeLayer(bgUrl) {
    var s = document.createElement('span');
    s.style.position = 'absolute';
    s.style.inset = '0';
    s.style.backgroundSize = '300% 300%';
    s.style.backgroundRepeat = 'no-repeat';
    s.style.backgroundImage = 'url(' + bgUrl + ')';
    s.style.pointerEvents = 'none';
    return s;
  }

  function createMascot(size) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Boop the mascot');
    btn.style.position = 'relative';
    btn.style.display = 'block';
    btn.style.flexShrink = '0';
    btn.style.width = size + 'px';
    btn.style.height = size + 'px';
    btn.style.padding = '0';
    btn.style.border = '0';
    btn.style.background = 'transparent';
    btn.style.appearance = 'none';
    btn.style.webkitAppearance = 'none';
    btn.style.cursor = 'pointer';
    btn.style.userSelect = 'none';
    btn.style.webkitUserSelect = 'none';

    var squash = document.createElement('span');
    squash.style.position = 'relative';
    squash.style.display = 'block';
    squash.style.width = '100%';
    squash.style.height = '100%';
    squash.style.transformOrigin = '50% 78%';
    btn.appendChild(squash);

    var dirLayer = makeLayer(DIRECTIONS_URL);
    var reactLayer = makeLayer(REACTIONS_URL);
    // Preload both sheets so the first click never flashes.
    reactLayer.style.opacity = '0';
    squash.appendChild(dirLayer);
    squash.appendChild(reactLayer);

    var direction = 'center';
    var reaction = null;
    var timers = [];
    var boops = { count: 0, at: 0 };

    function render() {
      dirLayer.style.backgroundPosition = cellPos(DIRECTIONS.indexOf(direction));
      dirLayer.style.opacity = reaction ? '0' : '1';
      reactLayer.style.backgroundPosition = cellPos(REACTIONS.indexOf(reaction || 'blink'));
      reactLayer.style.opacity = reaction ? '1' : '0';
    }
    render();

    // ---- cursor tracking ----
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      var sector = -1;
      var pointer = null;

      var aim = function () {
        if (!pointer) return;
        var box = btn.getBoundingClientRect();
        var dx = pointer.x - (box.left + box.width / 2);
        var dy = pointer.y - (box.top + box.height / 2);

        if (Math.hypot(dx, dy) < DEAD_ZONE) {
          if (direction !== 'center') { direction = 'center'; sector = -1; render(); }
          return;
        }

        var angle = Math.atan2(dy, dx);
        if (sector !== -1 && Math.abs(wrap(angle - sector * SECTOR)) < SECTOR / 2 + HYSTERESIS) return;

        sector = (Math.round(angle / SECTOR) + CLOCKWISE.length) % CLOCKWISE.length;
        direction = CLOCKWISE[sector];
        render();
      };

      window.addEventListener('pointermove', function (e) {
        pointer = { x: e.clientX, y: e.clientY };
        aim();
      }, { passive: true });
      window.addEventListener('scroll', aim, { passive: true });
    }

    // ---- boop ----
    function later(ms, next) {
      timers.push(window.setTimeout(function () { reaction = next; render(); }, ms));
    }

    btn.addEventListener('click', function () {
      timers.forEach(window.clearTimeout);
      timers = [];

      var now = Date.now();
      boops.count = now - boops.at < DIZZY_WINDOW ? boops.count + 1 : 1;
      boops.at = now;

      if (boops.count >= DIZZY_AFTER) {
        boops.count = 0;
        reaction = 'dizzy';
        render();
        later(DIZZY_END, null);
      } else {
        reaction = 'blink';
        render();
        later(BOOP_PAYOFF, PAYOFFS[(boops.count - 1) % PAYOFFS.length]);
        later(BOOP_END, null);
      }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      try { squash.animate(SQUASH, { duration: SQUASH_MS, easing: 'linear' }); } catch (e) {}
    });

    return btn;
  }

  // ---- swap the header portrait for the mascot ----
  function findHeaderImg() {
    var imgs = document.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
      if (imgs[i].src && imgs[i].src.indexOf(HEADER_IMG_FINGERPRINT) !== -1) return imgs[i];
    }
    return null;
  }

  function init(attempts) {
    var img = findHeaderImg();
    if (!img) {
      if (attempts < 40) setTimeout(function () { init(attempts + 1); }, 500);
      return;
    }
    var rect = img.getBoundingClientRect();
    var size = Math.max(120, Math.min(rect.width || 200, rect.height || 200));
    var mascot = createMascot(Math.round(size));

    // Keep the layout slot stable: wrap in the img's own dimensions.
    var holder = document.createElement('span');
    holder.style.display = 'inline-block';
    holder.style.width = size + 'px';
    holder.style.height = size + 'px';
    holder.appendChild(mascot);
    img.replaceWith(holder);
  }

  if (document.readyState === 'complete') init(0);
  else window.addEventListener('load', function () { init(0); });
})();
