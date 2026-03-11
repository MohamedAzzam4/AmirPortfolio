/* ═══════════════════════════════════════════════════════
   AMIR PORTFOLIO — COMPLEX ANIMATIONS
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // ─── PROFILE CARD 3D TILT ────────────────────────────
    const pcWrap = document.getElementById('profileCard');
    const pcShell = document.getElementById('profileCardShell');

    if (pcWrap && pcShell) {
        const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
        const round = (v, p = 3) => parseFloat(v.toFixed(p));
        const adjust = (v, fMin, fMax, tMin, tMax) => round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

        let currentX = 0, currentY = 0, targetX = 0, targetY = 0;
        let running = false, lastTs = 0;
        let initialUntil = 0;
        let enterTimer = null, leaveRaf = null;

        const DEFAULT_TAU = 0.14;
        const INITIAL_TAU = 0.6;

        function setVarsFromXY(x, y) {
            const w = pcShell.clientWidth || 1;
            const h = pcShell.clientHeight || 1;
            const pX = clamp((100 / w) * x);
            const pY = clamp((100 / h) * y);
            const cX = pX - 50;
            const cY = pY - 50;

            const props = {
                '--pointer-x': pX + '%',
                '--pointer-y': pY + '%',
                '--background-x': adjust(pX, 0, 100, 35, 65) + '%',
                '--background-y': adjust(pY, 0, 100, 35, 65) + '%',
                '--pointer-from-center': clamp(Math.hypot(pY - 50, pX - 50) / 50, 0, 1),
                '--pointer-from-top': pY / 100,
                '--pointer-from-left': pX / 100,
                '--rotate-x': round(-(cX / 5)) + 'deg',
                '--rotate-y': round(cY / 4) + 'deg'
            };
            for (const [k, v] of Object.entries(props)) pcWrap.style.setProperty(k, v);
        }

        function step(ts) {
            if (!running) return;
            if (lastTs === 0) lastTs = ts;
            const dt = (ts - lastTs) / 1000;
            lastTs = ts;

            const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
            const k = 1 - Math.exp(-dt / tau);
            currentX += (targetX - currentX) * k;
            currentY += (targetY - currentY) * k;
            setVarsFromXY(currentX, currentY);

            const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;
            if (stillFar || document.hasFocus()) {
                requestAnimationFrame(step);
            } else {
                running = false;
                lastTs = 0;
            }
        }

        function startEngine() {
            if (running) return;
            running = true;
            lastTs = 0;
            requestAnimationFrame(step);
        }

        function setTarget(x, y) { targetX = x; targetY = y; startEngine(); }
        function toCenter() { setTarget((pcShell.clientWidth || 0) / 2, (pcShell.clientHeight || 0) / 2); }

        function getOffsets(evt) {
            const r = pcShell.getBoundingClientRect();
            return { x: evt.clientX - r.left, y: evt.clientY - r.top };
        }

        pcShell.addEventListener('pointerenter', (e) => {
            pcShell.classList.add('active');
            pcShell.classList.add('entering');
            if (enterTimer) clearTimeout(enterTimer);
            enterTimer = setTimeout(() => pcShell.classList.remove('entering'), 180);
            const { x, y } = getOffsets(e);
            setTarget(x, y);
        });

        pcShell.addEventListener('pointermove', (e) => {
            const { x, y } = getOffsets(e);
            setTarget(x, y);
        });

        pcShell.addEventListener('pointerleave', () => {
            toCenter();
            const checkSettle = () => {
                const settled = Math.hypot(targetX - currentX, targetY - currentY) < 0.6;
                if (settled) {
                    pcShell.classList.remove('active');
                    leaveRaf = null;
                } else {
                    leaveRaf = requestAnimationFrame(checkSettle);
                }
            };
            if (leaveRaf) cancelAnimationFrame(leaveRaf);
            leaveRaf = requestAnimationFrame(checkSettle);
        });

        // Initial animation: start from top-right corner, animate to center
        const initX = (pcShell.clientWidth || 300) - 70;
        const initY = 60;
        currentX = initX; currentY = initY;
        setVarsFromXY(currentX, currentY);
        toCenter();
        initialUntil = performance.now() + 1200;
        startEngine();
    }
});
