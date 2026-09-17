/* ============================================================
   PORTFOLIO — Script
   Soft circular cursor/touch mask that reveals the digital
   portrait layer underneath the base editorial portrait.
   No canvas, no WebGL, no libraries — pure DOM + CSS mask.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    const hero   = document.getElementById('hero');
    const reveal = document.getElementById('reveal');
    const ring   = document.getElementById('cursorRing');

    if (!hero || !reveal || !ring) return;

    /* ── State ──────────────────────────────────────────────── */
    const RADIUS       = 190;       // reveal circle radius (px)
    const EASE_POS     = 0.13;      // cursor position smoothing
    const EASE_RADIUS  = 0.07;      // radius grow/shrink smoothing

    let mouseX = -500, mouseY = -500;
    let curX   = -500, curY   = -500;
    let targetR = 0,   curR   = 0;
    let active  = false;

    /* ── Pointer Events ─────────────────────────────────────── */
    hero.addEventListener('pointerenter', () => {
        active  = true;
        targetR = RADIUS;
        ring.classList.add('visible');
    });

    hero.addEventListener('pointerleave', () => {
        active  = false;
        targetR = 0;
        ring.classList.remove('visible');
    });

    hero.addEventListener('pointermove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    /* ── Touch support ──────────────────────────────────────── */
    hero.addEventListener('touchstart', (e) => {
        active  = true;
        targetR = RADIUS;
        const t = e.touches[0];
        mouseX = t.clientX;
        mouseY = t.clientY;
        curX   = mouseX;              // instant snap on first touch
        curY   = mouseY;
        ring.classList.add('visible');
    }, { passive: true });

    hero.addEventListener('touchmove', (e) => {
        const t = e.touches[0];
        mouseX = t.clientX;
        mouseY = t.clientY;
    }, { passive: true });

    hero.addEventListener('touchend', () => {
        active  = false;
        targetR = 0;
        ring.classList.remove('visible');
    });

    /* ── Interactive element hover (cursor ring enlarges) ──── */
    const interactiveEls = hero.querySelectorAll('a, button');
    interactiveEls.forEach(el => {
        el.addEventListener('pointerenter', () => ring.classList.add('on-link'));
        el.addEventListener('pointerleave', () => ring.classList.remove('on-link'));
    });

    /* ── Animation Loop ─────────────────────────────────────── */
    function tick() {
        // Smooth position
        curX += (mouseX - curX) * EASE_POS;
        curY += (mouseY - curY) * EASE_POS;

        // Smooth radius
        curR += (targetR - curR) * EASE_RADIUS;

        // Apply CSS radial-gradient mask to the reveal layer
        // The soft feather (60% → 100%) creates the liquid-glass edge
        const mask = `radial-gradient(circle ${curR}px at ${curX}px ${curY}px, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)`;
        reveal.style.webkitMaskImage = mask;
        reveal.style.maskImage       = mask;

        // Move cursor ring — offset by half size for centering
        const ringSize = ring.classList.contains('on-link') ? 52 : 28;
        ring.style.transform = `translate(${curX - ringSize / 2}px, ${curY - ringSize / 2}px)`;

        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);

    /* ── Modal System (About / Work / Contact) ─────────────── */
    const modals = [
        { btn: 'aboutBtn',   overlay: 'aboutModal',   close: 'modalClose' },
        { btn: 'workBtn',    overlay: 'workModal',     close: 'workModalClose' },
        { btn: 'contactBtn', overlay: 'contactModal',  close: 'contactModalClose' },
    ];

    function openModal(overlay) {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    modals.forEach(({ btn, overlay, close }) => {
        const btnEl     = document.getElementById(btn);
        const overlayEl = document.getElementById(overlay);
        const closeEl   = document.getElementById(close);
        if (!btnEl || !overlayEl || !closeEl) return;

        btnEl.addEventListener('click', (e) => { e.preventDefault(); openModal(overlayEl); });
        closeEl.addEventListener('click', () => closeModal(overlayEl));
        overlayEl.addEventListener('click', (e) => { if (e.target === overlayEl) closeModal(overlayEl); });
    });

    // Global Escape to close any open modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m));
        }
    });

    /* ── Work Screenshots ──────────────────────────────────── */
    // Add your work screenshot filenames here.
    // Place the image files in the same folder as index.html.
    const workScreenshots = [
        { src: 'Screenshot 2026-09-16 132549.png', label: 'Dhakad Property & Builder', link: 'https://dhakadpropertyandbuilder1.netlify.app/' },
        { src: 'Screenshot 2026-09-16 132644.png', label: 'Shivalay Infratech', link: 'https://shivalayinfratech.vercel.app/' },
        { src: 'Screenshot 2026-09-16 132705.png', label: 'BrajMiles — Braj Yatra Specialists', link: 'https://www.brajmiles.com/' },
        { src: 'Screenshot 2026-09-16 133114.png', label: 'Tyzil — Stop Watching, Start Building', link: 'https://tyzil.in/' },
        { src: 'Screenshot 2026-09-16 133212.png', label: 'Hyper University — Members Club', link: 'https://hyper27.vercel.app/' },
    ];

    const workGrid = document.getElementById('workGrid');
    if (workGrid) {
        if (workScreenshots.length === 0) {
            workGrid.innerHTML = '<div class="work-empty">Screenshots coming soon — drop images into the project folder and add them to the list in script.js</div>';
        } else {
            workGrid.innerHTML = workScreenshots.map(item => `
                <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="work-item" style="text-decoration: none; display: block;">
                    <img src="${item.src}" alt="${item.label}" loading="lazy">
                    <div class="work-item-label">${item.label}</div>
                </a>
            `).join('');
        }
    }
});
