import { useState, useEffect, useRef } from "react";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --orange: #f15a22;
    --orange-dark: #c94a1a;
    --orange-glow: rgba(241,90,34,0.15);
    --bg: #0d0d0d;
    --bg3: #1a1a1a;
    --surface: #181818;
    --surface2: #1f1f1f;
    --text: #f5f5f5;
    --muted: #888;
    --border: rgba(255,255,255,0.07);
    --border-o: rgba(241,90,34,0.3);
    --radius: 10px;
    --radius2: 14px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; }

  /* ── PRELOADER ── */
  .pre { position:fixed;inset:0;background:#0d0d0d;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2.5rem;transition:opacity .6s ease,transform .7s cubic-bezier(.76,0,.24,1); }
  .pre.out { opacity:0;transform:translateY(-100%);pointer-events:none; }
  .pre-logo-row { display:flex;align-items:center;gap:1.8rem; }
  .pre-logo-box { width:110px;height:110px;background:var(--orange);border-radius:20px;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-size:4rem;font-weight:900;color:#fff;flex-shrink:0;animation:pre-pop .7s cubic-bezier(.34,1.56,.64,1) both;box-shadow:0 20px 50px rgba(241,90,34,.4); }
  @keyframes pre-pop { from{opacity:0;transform:scale(.5)} to{opacity:1;transform:scale(1)} }
  .pre-text-col { display:flex;flex-direction:column;gap:.35rem;animation:pre-slide .7s .15s ease both; }
  @keyframes pre-slide { from{opacity:0;transform:translateX(-25px)} to{opacity:1;transform:translateX(0)} }
  .pre-name { font-family:'Barlow Condensed',sans-serif;font-size:clamp(2.8rem,8vw,5.5rem);font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:#fff;line-height:1; }
  .pre-divider { width:100%;height:1px;background:linear-gradient(90deg,var(--orange),transparent);margin:.15rem 0; }
  .pre-sub { font-size:clamp(.6rem,.9vw,.8rem);letter-spacing:.38em;text-transform:uppercase;color:var(--orange); }
  .pre-bar-wrap { display:flex;flex-direction:column;align-items:center;gap:.6rem;animation:pre-fade .5s .5s ease both; }
  @keyframes pre-fade { from{opacity:0} to{opacity:1} }
  .pre-bar { width:260px;height:2px;background:#252525;border-radius:2px;overflow:hidden; }
  .pre-prog { height:100%;background:linear-gradient(90deg,var(--orange),#ff9d00);transition:width 1.6s cubic-bezier(.4,0,.2,1); }
  .pre-pct { font-family:'Barlow Condensed',sans-serif;font-size:.8rem;font-weight:700;letter-spacing:.15em;color:var(--muted); }

  /* ── SCROLL PROGRESS ── */
  .scroll-prog { position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,var(--orange),#ff9d00);z-index:1001;transform-origin:left;width:100%; }

  /* ── NAVBAR ── */
  .navbar { position:fixed;top:0;left:0;right:0;z-index:100;padding:1.2rem 3rem;transition:all .4s ease;display:flex;justify-content:space-between;align-items:center; }
  .navbar.scrolled { background:rgba(13,13,13,.96);backdrop-filter:blur(24px);padding:.8rem 3rem;border-bottom:1px solid var(--border);box-shadow:0 4px 30px rgba(0,0,0,.4); }
  .nav-logo { display:flex;align-items:center;gap:.85rem;text-decoration:none; }
  .nav-logo-img { width:52px;height:52px;object-fit:contain;flex-shrink:0;transition:transform .35s ease; }
  .nav-logo:hover .nav-logo-img { transform:scale(1.08) rotate(-3deg); }
  .nav-logo-name { font-family:'Barlow Condensed',sans-serif;font-size:1.35rem;font-weight:900;letter-spacing:.08em;color:#fff; }
  .nav-logo-name span { color:var(--orange); }
  .nav-logo-tag { font-size:.6rem;color:var(--muted);letter-spacing:.2em;text-transform:uppercase; }
  .nav-links { display:flex;align-items:center;gap:2rem; }
  .nav-link { color:#ccc;text-decoration:none;font-size:.88rem;font-weight:500;padding:.4rem 0;position:relative;transition:color .3s; }
  .nav-link::after { content:'';position:absolute;bottom:0;left:0;width:0;height:2px;background:var(--orange);border-radius:2px;transition:width .3s ease; }
  .nav-link:hover { color:var(--orange); }
  .nav-link:hover::after { width:100%; }

  /* ── BUTTONS ── */
  .btn { display:inline-flex;align-items:center;justify-content:center;gap:.6rem;padding:.85rem 2rem;font-family:'DM Sans',sans-serif;font-weight:600;font-size:.9rem;text-decoration:none;border-radius:6px;transition:all .3s ease;cursor:pointer;border:none;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap; }
  .btn-primary { background:var(--orange);color:#fff;box-shadow:0 0 20px rgba(241,90,34,.2); }
  .btn-primary:hover { background:var(--orange-dark);transform:translateY(-3px);box-shadow:0 10px 30px rgba(241,90,34,.4); }
  .btn-outline { background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,.2); }
  .btn-outline:hover { border-color:var(--orange);color:var(--orange);transform:translateY(-3px);background:rgba(241,90,34,.05); }

  /* ── HAMBURGER ── */
  .hamburger { width:32px;height:24px;position:relative;cursor:pointer;background:none;border:none;padding:0;display:none; }
  .hamburger span { position:absolute;left:0;height:2px;background:#fff;border-radius:2px;transition:all .35s cubic-bezier(.23,1,.32,1); }
  .hamburger span:nth-child(1) { top:0;width:100%; }
  .hamburger span:nth-child(2) { top:50%;transform:translateY(-50%);width:70%; }
  .hamburger span:nth-child(3) { bottom:0;width:85%; }
  .hamburger:hover span { background:var(--orange); }
  .hamburger.active span:nth-child(1) { top:50%;transform:translateY(-50%) rotate(45deg);width:100%; }
  .hamburger.active span:nth-child(2) { opacity:0;width:0; }
  .hamburger.active span:nth-child(3) { bottom:50%;transform:translateY(50%) rotate(-45deg);width:100%; }
  .mobile-menu { position:fixed;top:0;right:-100%;width:100%;height:100dvh;background:rgba(10,10,10,.98);backdrop-filter:blur(30px);z-index:99;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.8rem;transition:right .45s cubic-bezier(.65,0,.35,1); }
  .mobile-menu.open { right:0; }
  .mobile-menu a { font-family:'Barlow Condensed',sans-serif;font-size:clamp(2.2rem,9vw,3.5rem);font-weight:900;letter-spacing:.05em;color:#fff;text-decoration:none;text-transform:uppercase;transition:color .3s,transform .3s; }
  .mobile-menu a:hover { color:var(--orange);transform:translateX(10px); }
  .mob-call { font-size:1.1rem !important;color:var(--orange) !important;margin-top:.5rem;display:flex;align-items:center;gap:.5rem; }

  /* ── HERO ── */
  .hero { position:relative;min-height:100dvh;display:flex;align-items:center;overflow:hidden; }
  .hero-bg { position:absolute;inset:0;z-index:0; }
  .hero-bg img { width:100%;height:100%;object-fit:cover;filter:brightness(.22) saturate(.7); }
  .hero-overlay { position:absolute;inset:0;background:linear-gradient(110deg,rgba(13,13,13,.97) 0%,rgba(13,13,13,.55) 55%,rgba(13,13,13,.8) 100%); }
  .hero-band { position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,transparent 0%,var(--orange) 30%,#ff9d00 70%,transparent 100%); }
  .hero-content { position:relative;z-index:1;padding:8rem 5% 5rem;max-width:1000px;width:100%; }
  .hero-badge { display:inline-flex;align-items:center;gap:.6rem;padding:.45rem 1.1rem;background:rgba(241,90,34,.1);border:1px solid rgba(241,90,34,.3);border-radius:100px;font-size:.7rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--orange);margin-bottom:1.8rem; }
  .badge-dot { width:7px;height:7px;background:var(--orange);border-radius:50%;animation:pulse-dot 2s ease infinite;flex-shrink:0; }
  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.6)} }
  .ac-badge { display:inline-flex;align-items:center;padding:.28rem .75rem;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:100px;font-size:.68rem;font-weight:600;letter-spacing:.1em;color:#bbb;text-transform:uppercase;margin-left:.6rem; }
  .hero-title { font-family:'Barlow Condensed',sans-serif;font-size:clamp(3.8rem,12vw,9.5rem);font-weight:900;line-height:.9;letter-spacing:.01em;text-transform:uppercase; }
  .hero-title .orange { color:var(--orange); }
  .hero-sub { font-size:clamp(.95rem,1.6vw,1.15rem);color:#999;margin-top:2rem;max-width:500px;line-height:1.75; }
  .hero-sub strong { color:var(--orange);font-weight:600; }
  .hero-actions { display:flex;flex-wrap:wrap;gap:1rem;margin-top:2.5rem;align-items:center; }
  .hero-scroll { position:absolute;bottom:2rem;right:4%;display:flex;flex-direction:column;align-items:center;gap:.5rem;opacity:.4;pointer-events:none;z-index:1; }
  .hero-scroll span { font-size:.6rem;letter-spacing:.3em;text-transform:uppercase;writing-mode:vertical-rl; }
  .scroll-line { width:1px;height:50px;background:linear-gradient(to bottom,#fff,transparent);animation:scr-pulse 2s ease infinite; }
  @keyframes scr-pulse { 0%,100%{opacity:1;transform:scaleY(1)} 50%{opacity:.2;transform:scaleY(.5)} }

  /* ── SECTIONS ── */
  .section { padding:7rem 5%;position:relative; }
  .section-bg { background:var(--surface); }
  .section-alt { background:var(--bg3); }
  .max-w { max-width:1280px;margin:0 auto; }
  .label { font-size:.7rem;font-weight:700;letter-spacing:.32em;text-transform:uppercase;color:var(--orange);margin-bottom:.75rem;display:flex;align-items:center;gap:.65rem; }
  .label::before { content:'';width:28px;height:2px;background:var(--orange);border-radius:2px;flex-shrink:0; }
  .sec-title { font-family:'Barlow Condensed',sans-serif;font-size:clamp(2.5rem,5.5vw,5rem);font-weight:900;line-height:.95;text-transform:uppercase;letter-spacing:.02em; }
  .sec-title .orange { color:var(--orange); }
  .sec-title .dim { color:rgba(255,255,255,.18); }
  .divider { width:60px;height:3px;background:linear-gradient(90deg,var(--orange),#ff9d00);border-radius:2px;margin-top:1rem; }

  /* ══════════════════════════════════════
     ── UPGRADED SERVICES SECTION ──
     ══════════════════════════════════════ */
  .services-section { padding:7rem 5%;background:var(--surface);position:relative;overflow:hidden; }
  .services-section::before {
    content:'';position:absolute;top:-200px;right:-200px;
    width:600px;height:600px;
    background:radial-gradient(circle,rgba(241,90,34,.06) 0%,transparent 70%);
    pointer-events:none;
  }

  /* Hero image strip above the grid */
  .svc-hero-strip {
    display:grid;
    grid-template-columns:2fr 1fr 1fr;
    gap:1rem;
    margin:2.5rem 0 3.5rem;
    height:280px;
    border-radius:18px;
    overflow:hidden;
  }
  .svc-strip-img {
    position:relative;overflow:hidden;cursor:default;
  }
  .svc-strip-img img {
    width:100%;height:100%;object-fit:cover;
    filter:brightness(.65) saturate(.8);
    transition:transform .6s ease,filter .6s ease;
  }
  .svc-strip-img:hover img { transform:scale(1.07);filter:brightness(.5) saturate(1.1); }
  .svc-strip-label {
    position:absolute;bottom:1.2rem;left:1.4rem;
    font-family:'Barlow Condensed',sans-serif;font-size:1.2rem;font-weight:900;
    text-transform:uppercase;letter-spacing:.08em;color:#fff;
    text-shadow:0 2px 12px rgba(0,0,0,.7);
  }
  .svc-strip-tag {
    position:absolute;top:1rem;right:1rem;
    background:var(--orange);color:#fff;
    font-size:.58rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
    padding:.25rem .65rem;border-radius:100px;
  }
  .svc-strip-img::after {
    content:'';position:absolute;inset:0;
    background:linear-gradient(to top,rgba(0,0,0,.6) 0%,transparent 55%);
  }

  /* New photo-card grid */
  .services-grid-v2 {
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:1.5rem;
  }
  .svc-card-v2 {
    position:relative;border-radius:16px;overflow:hidden;
    height:320px;cursor:default;
    border:1px solid var(--border);
    transition:transform .4s cubic-bezier(.23,1,.32,1),box-shadow .4s ease;
  }
  .svc-card-v2:hover { transform:translateY(-8px) scale(1.01);box-shadow:0 28px 60px rgba(0,0,0,.55); }
  .svc-card-v2 img {
    position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
    filter:brightness(.45) saturate(.7);
    transition:transform .6s ease,filter .5s ease;
  }
  .svc-card-v2:hover img { transform:scale(1.08);filter:brightness(.3) saturate(.9); }
  .svc-card-v2-overlay {
    position:absolute;inset:0;
    background:linear-gradient(170deg,transparent 30%,rgba(13,13,13,.9) 100%);
    transition:background .4s ease;
  }
  .svc-card-v2:hover .svc-card-v2-overlay {
    background:linear-gradient(170deg,rgba(241,90,34,.08) 0%,rgba(13,13,13,.95) 100%);
  }
  .svc-card-v2-accent {
    position:absolute;bottom:0;left:0;right:0;height:3px;
    background:linear-gradient(90deg,var(--orange),#ff9d00);
    transform:scaleX(0);transform-origin:left;
    transition:transform .4s ease;
  }
  .svc-card-v2:hover .svc-card-v2-accent { transform:scaleX(1); }
  .svc-card-v2-body {
    position:absolute;bottom:0;left:0;right:0;
    padding:1.6rem 1.5rem;
    z-index:2;
    transform:translateY(8px);transition:transform .4s ease;
  }
  .svc-card-v2:hover .svc-card-v2-body { transform:translateY(0); }
  .svc-card-v2-icon {
    width:42px;height:42px;background:rgba(241,90,34,.18);
    border:1px solid rgba(241,90,34,.35);border-radius:10px;
    display:flex;align-items:center;justify-content:center;
    font-size:1.25rem;margin-bottom:.9rem;
    transition:background .3s,transform .3s;
  }
  .svc-card-v2:hover .svc-card-v2-icon { background:rgba(241,90,34,.35);transform:scale(1.1) rotate(-5deg); }
  .svc-card-v2-name {
    font-family:'Barlow Condensed',sans-serif;font-size:1.5rem;font-weight:900;
    text-transform:uppercase;letter-spacing:.04em;line-height:1;
    transition:color .3s;
  }
  .svc-card-v2:hover .svc-card-v2-name { color:var(--orange); }
  .svc-card-v2-desc {
    font-size:.8rem;color:rgba(255,255,255,.6);margin-top:.45rem;line-height:1.6;
    max-height:0;overflow:hidden;
    transition:max-height .4s ease,opacity .4s ease;opacity:0;
  }
  .svc-card-v2:hover .svc-card-v2-desc { max-height:80px;opacity:1; }

  /* Stat row below grid */
  .svc-stat-row {
    display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;
    margin-top:2.5rem;padding:2rem;
    background:linear-gradient(135deg,rgba(241,90,34,.07),rgba(241,90,34,.02));
    border:1px solid rgba(241,90,34,.18);border-radius:16px;
  }
  .svc-stat { text-align:center; }
  .svc-stat-num {
    font-family:'Barlow Condensed',sans-serif;font-size:clamp(2.2rem,3.5vw,3rem);
    font-weight:900;color:var(--orange);line-height:1;
  }
  .svc-stat-lbl { font-size:.72rem;color:var(--muted);letter-spacing:.16em;text-transform:uppercase;margin-top:.4rem; }

  /* ══════════════════════════════════════
     ── UPGRADED WHY SECTION ──
     ══════════════════════════════════════ */
  .why-section { padding:7rem 5%;background:var(--bg3);position:relative;overflow:hidden; }

  /* Full-bleed photo collage header */
  .why-collage {
    display:grid;
    grid-template-columns:1.5fr 1fr 1fr;
    grid-template-rows:200px 200px;
    gap:.75rem;
    margin-bottom:4rem;
    border-radius:20px;overflow:hidden;
    height:410px;
  }
  .why-col-img {
    position:relative;overflow:hidden;
    transition:transform .5s ease;
  }
  .why-col-img:first-child { grid-row:1/3; }
  .why-col-img img {
    width:100%;height:100%;object-fit:cover;
    filter:brightness(.5) saturate(.75);
    transition:transform .6s ease,filter .5s ease;
  }
  .why-col-img:hover img { transform:scale(1.06);filter:brightness(.4) saturate(1); }
  .why-col-img::after {
    content:'';position:absolute;inset:0;
    background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.7) 100%);
  }
  .why-col-tag {
    position:absolute;bottom:1rem;left:1.1rem;z-index:2;
    font-family:'Barlow Condensed',sans-serif;font-size:1rem;font-weight:900;
    text-transform:uppercase;letter-spacing:.07em;color:#fff;
    text-shadow:0 2px 8px rgba(0,0,0,.6);
  }
  .why-col-badge {
    position:absolute;top:.8rem;right:.8rem;z-index:2;
    background:var(--orange);color:#fff;
    font-size:.55rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
    padding:.22rem .6rem;border-radius:100px;
  }

  /* Two-column layout */
  .why-body { display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:start; }

  /* Left: big feature card */
  .why-feature-card {
    position:relative;border-radius:20px;overflow:hidden;
    height:480px;
    border:1px solid var(--border);
    box-shadow:0 30px 70px rgba(0,0,0,.45);
  }
  .why-feature-card img {
    width:100%;height:100%;object-fit:cover;
    filter:brightness(.4) saturate(.6);
    transition:transform .6s ease,filter .5s ease;
  }
  .why-feature-card:hover img { transform:scale(1.04);filter:brightness(.3) saturate(.8); }
  .why-feature-card::after {
    content:'';position:absolute;inset:0;
    background:linear-gradient(170deg,transparent 35%,rgba(13,13,13,.92) 100%);
  }
  .why-feature-content {
    position:absolute;bottom:0;left:0;right:0;z-index:2;padding:2.5rem;
  }
  .why-feature-eyebrow {
    font-size:.65rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;
    color:var(--orange);margin-bottom:.6rem;
  }
  .why-feature-title {
    font-family:'Barlow Condensed',sans-serif;font-size:2.4rem;font-weight:900;
    text-transform:uppercase;line-height:1;margin-bottom:.7rem;
  }
  .why-feature-desc { font-size:.88rem;color:#bbb;line-height:1.75; }
  .why-mini-stats {
    display:flex;gap:1.5rem;margin-top:1.5rem;padding-top:1.5rem;
    border-top:1px solid rgba(255,255,255,.1);
  }
  .why-mini-stat-num {
    font-family:'Barlow Condensed',sans-serif;font-size:1.8rem;font-weight:900;
    color:var(--orange);line-height:1;
  }
  .why-mini-stat-lbl { font-size:.7rem;color:#888;text-transform:uppercase;letter-spacing:.12em; }

  /* Right: reasons list */
  .why-reasons { display:flex;flex-direction:column;gap:1rem; }
  .why-reason {
    display:grid;grid-template-columns:56px 1fr;gap:1.2rem;align-items:start;
    padding:1.4rem;
    background:rgba(255,255,255,.02);
    border:1px solid var(--border);border-radius:14px;
    transition:all .3s ease;cursor:default;position:relative;overflow:hidden;
  }
  .why-reason::before {
    content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
    background:var(--orange);transform:scaleY(0);transform-origin:bottom;
    transition:transform .4s ease;
  }
  .why-reason:hover {
    border-color:rgba(241,90,34,.3);
    background:rgba(241,90,34,.03);
    transform:translateX(5px);
    box-shadow:0 8px 30px rgba(0,0,0,.3);
  }
  .why-reason:hover::before { transform:scaleY(1); }
  .why-reason-img {
    width:56px;height:56px;border-radius:10px;overflow:hidden;flex-shrink:0;
    border:1px solid var(--border);
    transition:transform .3s;
  }
  .why-reason-img img { width:100%;height:100%;object-fit:cover;filter:brightness(.7) saturate(.8); }
  .why-reason:hover .why-reason-img { transform:scale(1.08) rotate(-3deg); }
  .why-reason-title {
    font-family:'Barlow Condensed',sans-serif;font-size:1.15rem;font-weight:800;
    text-transform:uppercase;letter-spacing:.04em;
    transition:color .3s;
  }
  .why-reason:hover .why-reason-title { color:var(--orange); }
  .why-reason-desc { font-size:.82rem;color:var(--muted);margin-top:.25rem;line-height:1.65; }

  /* AC Callout banner */
  .why-ac-banner {
    margin-top:3rem;
    padding:2rem 2.5rem;
    background:linear-gradient(135deg,rgba(241,90,34,.12),rgba(241,90,34,.03));
    border:1px solid rgba(241,90,34,.3);border-radius:16px;
    display:flex;align-items:center;gap:2rem;flex-wrap:wrap;
    position:relative;overflow:hidden;
  }
  .why-ac-banner::before {
    content:'❄';position:absolute;right:2rem;top:50%;transform:translateY(-50%);
    font-size:6rem;opacity:.06;pointer-events:none;
  }
  .why-ac-icon {
    font-size:3rem;flex-shrink:0;
    animation:float-ac 3s ease-in-out infinite;
  }
  @keyframes float-ac { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  .why-ac-title {
    font-family:'Barlow Condensed',sans-serif;font-size:2rem;font-weight:900;
    text-transform:uppercase;color:var(--orange);
  }
  .why-ac-desc { font-size:.88rem;color:var(--muted);margin-top:.25rem;line-height:1.65; }

  /* ── ABOUT STATS ── */
  .about-stats { background:#111;padding:6rem 5%; }
  .about-stats-inner { max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center; }
  .about-img { position:relative;border-radius:16px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.5); }
  .about-img img { width:100%;height:520px;object-fit:cover;filter:grayscale(100%) brightness(.8);display:block;transition:filter .5s ease,transform .5s ease; }
  .about-img:hover img { filter:grayscale(60%) brightness(.9);transform:scale(1.03); }
  .about-img-overlay { position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(0,0,0,.7) 100%); }
  .about-img-tag { position:absolute;bottom:1.5rem;left:1.5rem;padding:.6rem 1.2rem;background:var(--orange);color:#fff;font-family:'Barlow Condensed',sans-serif;font-size:1rem;font-weight:900;text-transform:uppercase;letter-spacing:.1em;border-radius:6px; }
  .about-text { display:flex;flex-direction:column;gap:1.5rem; }
  .about-para { font-size:1.05rem;color:#ccc;line-height:1.85; }
  .about-para + .about-para { font-size:.97rem;color:#999; }
  .about-stat-cards { display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:.5rem; }
  .asc { background:var(--surface2);border:1px solid var(--border);border-radius:14px;padding:2rem 1rem 1.5rem;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.5rem;transition:all .35s ease;position:relative;overflow:hidden;cursor:default; }
  .asc::before { content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 0%,rgba(241,90,34,.12),transparent 70%);opacity:0;transition:opacity .35s; }
  .asc::after { content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--orange),#ff9d00);transform:scaleX(0);transform-origin:center;transition:transform .4s ease; }
  .asc:hover { border-color:rgba(241,90,34,.4);transform:translateY(-6px);box-shadow:0 16px 40px rgba(0,0,0,.3); }
  .asc:hover::before { opacity:1; }
  .asc:hover::after { transform:scaleX(1); }
  .asc-num { font-family:'Barlow Condensed',sans-serif;font-size:clamp(2.8rem,4vw,4rem);font-weight:900;color:var(--orange);line-height:1;position:relative;z-index:1; }
  .asc-lbl { font-size:.75rem;color:#888;letter-spacing:.18em;text-transform:uppercase;text-align:center;position:relative;z-index:1; }

  /* ── PRICING ── */
  .pricing-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:1.25rem;margin-top:3.5rem; }
  .price-card { background:var(--surface2);border:1px solid var(--border);border-radius:16px;overflow:hidden;transition:all .4s ease;position:relative;display:flex;flex-direction:column; }
  .price-card.best { border-color:rgba(241,90,34,.45);background:linear-gradient(170deg,rgba(241,90,34,.08) 0%,var(--surface2) 55%); }
  .price-card:hover { transform:translateY(-10px);box-shadow:0 28px 60px rgba(0,0,0,.45); }
  .price-card.best:hover { box-shadow:0 28px 60px rgba(241,90,34,.25); }
  .price-header { padding:2rem 1.8rem 1.4rem;border-bottom:1px solid var(--border);position:relative;flex-shrink:0; }
  .price-badge { position:absolute;top:1rem;right:1rem;background:var(--orange);color:#fff;font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:.25rem .65rem;border-radius:100px; }
  .price-dur { font-size:.68rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--muted); }
  .price-amt { display:flex;align-items:flex-start;gap:.08em;margin-top:.5rem;line-height:1; }
  .price-rupee { font-family:'DM Sans',sans-serif;font-size:clamp(1.2rem,2vw,1.7rem);font-weight:700;color:var(--orange);padding-top:.3em;flex-shrink:0;line-height:1; }
  .price-number { font-family:'Barlow Condensed',sans-serif;font-size:clamp(2.8rem,4vw,4.2rem);font-weight:900;color:#fff;line-height:1; }
  .price-save { font-size:.74rem;color:var(--orange);font-weight:600;margin-top:.55rem; }
  .price-body { padding:1.5rem 1.8rem 2rem;flex:1;display:flex;flex-direction:column; }
  .price-features { list-style:none;display:flex;flex-direction:column;gap:.7rem;flex:1; }
  .price-features li { display:flex;align-items:flex-start;gap:.7rem;font-size:.87rem;color:#d1d5db;line-height:1.5; }
  .price-features li svg { width:15px;height:15px;color:var(--orange);flex-shrink:0;margin-top:.18rem; }
  .price-btn-wrap { margin-top:1.5rem; }
  .price-btn-wrap .btn { width:100%; }
  .couples-banner { margin-top:2rem;padding:1.8rem 2rem;background:linear-gradient(135deg,rgba(241,90,34,.1),rgba(241,90,34,.03));border:1px solid rgba(241,90,34,.25);border-radius:14px;display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;transition:all .3s ease; }
  .couples-banner:hover { border-color:rgba(241,90,34,.45); }
  .couples-title { font-family:'Barlow Condensed',sans-serif;font-size:1.6rem;font-weight:900;text-transform:uppercase;color:var(--orange); }
  .couples-desc { font-size:.87rem;color:var(--muted);margin-top:.2rem;line-height:1.6; }

  /* ── TIMINGS ── */
  .timings-flex { display:flex;flex-wrap:wrap;gap:1.5rem;margin-top:3rem;justify-content:center; }
  .timing-card { display:flex;align-items:center;gap:2rem;padding:2.5rem 3rem;background:var(--surface2);border:1px solid var(--border);border-radius:16px;flex:1;min-width:280px;transition:all .35s ease;position:relative;overflow:hidden; }
  .timing-card::before { content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--orange);transform:scaleY(0);transform-origin:bottom;transition:transform .4s ease; }
  .timing-card:hover { border-color:rgba(241,90,34,.3);transform:translateY(-5px);box-shadow:0 20px 50px rgba(0,0,0,.35); }
  .timing-card:hover::before { transform:scaleY(1); }
  .timing-icon { width:70px;height:70px;background:var(--orange-glow);border:1px solid rgba(241,90,34,.25);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;transition:transform .35s ease; }
  .timing-card:hover .timing-icon { transform:scale(1.1); }
  .timing-icon::before { content:'';position:absolute;inset:-6px;border:1.5px dashed rgba(241,90,34,.25);border-radius:50%;animation:spin 20s linear infinite; }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .timing-icon svg { width:30px;height:30px;color:var(--orange); }
  .timing-day { font-family:'Barlow Condensed',sans-serif;font-size:1.7rem;font-weight:900;text-transform:uppercase;letter-spacing:.04em; }
  .timing-hours { color:var(--orange);font-size:1.1rem;font-weight:700;margin-top:.25rem; }
  .timing-note { font-size:.75rem;color:var(--muted);margin-top:.25rem; }

  /* ── BMI ── */
  .bmi-wrapper { max-width:900px;margin:3.5rem auto 0;background:var(--surface2);border:1px solid var(--border);border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.3); }
  .bmi-head { padding:2.5rem 3rem;background:linear-gradient(135deg,rgba(241,90,34,.1),rgba(241,90,34,.02));border-bottom:1px solid var(--border);display:flex;align-items:center;gap:1.5rem; }
  .bmi-head-icon { width:60px;height:60px;background:var(--orange);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.8rem;flex-shrink:0;box-shadow:0 8px 20px rgba(241,90,34,.35); }
  .bmi-head h3 { font-family:'Barlow Condensed',sans-serif;font-size:2.2rem;font-weight:900;text-transform:uppercase; }
  .bmi-head p { font-size:.88rem;color:var(--muted);margin-top:.2rem; }
  .bmi-body { padding:2.5rem 3rem; }
  .bmi-inputs { display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1.5rem;margin-bottom:2rem; }
  .bmi-field label { display:block;font-size:.72rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-bottom:.65rem; }
  .input-wrap { position:relative; }
  .input-wrap input { width:100%;padding:.95rem 3.5rem .95rem 1.2rem;background:rgba(255,255,255,.04);border:1.5px solid var(--border);border-radius:10px;color:#fff;font-size:1.1rem;font-weight:500;font-family:'DM Sans',sans-serif;transition:all .3s ease; }
  .input-wrap input:focus { outline:none;border-color:var(--orange);box-shadow:0 0 0 3px rgba(241,90,34,.1);background:rgba(255,255,255,.06); }
  .input-unit { position:absolute;right:1rem;top:50%;transform:translateY(-50%);font-size:.75rem;font-weight:700;color:var(--orange);pointer-events:none; }
  .gender-wrap { display:flex;gap:.75rem; }
  .gender-btn { flex:1;padding:.9rem;text-align:center;background:rgba(255,255,255,.04);border:1.5px solid var(--border);border-radius:10px;cursor:pointer;font-size:.9rem;font-weight:600;color:var(--muted);transition:all .3s ease;user-select:none; }
  .gender-btn:hover { border-color:rgba(241,90,34,.4);color:#ccc; }
  .gender-btn.active { background:rgba(241,90,34,.12);border-color:var(--orange);color:var(--orange); }
  .bmi-calc-btn { width:100%;padding:1.15rem;background:linear-gradient(135deg,var(--orange),var(--orange-dark));color:#fff;border:none;border-radius:12px;font-family:'Barlow Condensed',sans-serif;font-size:1.5rem;font-weight:900;text-transform:uppercase;letter-spacing:.12em;cursor:pointer;transition:all .35s ease;box-shadow:0 4px 20px rgba(241,90,34,.25); }
  .bmi-calc-btn:hover { transform:translateY(-3px);box-shadow:0 12px 35px rgba(241,90,34,.45); }
  .bmi-result { margin-top:2rem;padding:2rem;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:14px;animation:fadeUp .5s ease; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .bmi-score-row { display:flex;align-items:center;gap:2rem;flex-wrap:wrap; }
  .bmi-score-big { font-family:'Barlow Condensed',sans-serif;font-size:5rem;font-weight:900;line-height:1; }
  .bmi-score-label { font-family:'Barlow Condensed',sans-serif;font-size:1.8rem;font-weight:900;text-transform:uppercase;margin-top:.2rem; }
  .bmi-gauge { flex:1;min-width:200px; }
  .bmi-gauge-bar { height:10px;border-radius:100px;background:linear-gradient(90deg,#3b82f6 0%,#22c55e 25%,#f59e0b 55%,#ef4444 80%,#7c3aed 100%);position:relative;margin-bottom:.7rem; }
  .bmi-pointer { position:absolute;top:-5px;width:20px;height:20px;background:#fff;border-radius:50%;border:2.5px solid #0d0d0d;transform:translateX(-50%);transition:left .8s cubic-bezier(.34,1.56,.64,1);box-shadow:0 0 0 3px rgba(255,255,255,.25); }
  .bmi-gauge-labels { display:flex;justify-content:space-between;font-size:.62rem;color:var(--muted); }
  .bmi-tip { margin-top:1.5rem;padding:1.3rem 1.6rem;background:rgba(241,90,34,.08);border:1px solid rgba(241,90,34,.2);border-radius:12px;font-size:.9rem;line-height:1.7;color:#d1d5db; }
  .bmi-tip strong { color:var(--orange); }

  /* ── BRANCHES ── */
  .branches-grid { display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem;margin-top:3.5rem; }
  .branch-card { padding:2.5rem;background:var(--surface2);border:1px solid var(--border);border-radius:16px;position:relative;overflow:hidden;transition:all .35s ease; }
  .branch-card::before { content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--orange),#ff9d00);transform:scaleX(0);transform-origin:left;transition:transform .4s ease; }
  .branch-card::after { content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(241,90,34,.05),transparent);opacity:0;transition:opacity .35s; }
  .branch-card:hover { transform:translateY(-6px);border-color:rgba(241,90,34,.3);box-shadow:0 20px 50px rgba(0,0,0,.4); }
  .branch-card:hover::before { transform:scaleX(1); }
  .branch-card:hover::after { opacity:1; }
  .branch-city { font-family:'Barlow Condensed',sans-serif;font-size:2.2rem;font-weight:900;text-transform:uppercase;color:var(--orange);letter-spacing:.04em;position:relative;z-index:1; }
  .branch-name { font-size:1rem;font-weight:600;margin-top:.3rem;color:#eee;position:relative;z-index:1; }
  .branch-addr { font-size:.85rem;color:var(--muted);margin-top:1rem;line-height:1.75;position:relative;z-index:1; }
  .branch-link { display:inline-flex;align-items:center;gap:.5rem;margin-top:1.5rem;color:var(--orange);font-size:.83rem;font-weight:700;text-decoration:none;text-transform:uppercase;letter-spacing:.1em;transition:all .3s ease;position:relative;z-index:1; }
  .branch-link:hover { gap:1rem; }

  /* ── CONTACT ── */
  .contact-grid { display:grid;grid-template-columns:1fr 1fr;gap:4rem;margin-top:3.5rem; }
  .form-field { margin-bottom:1.25rem; }
  .form-field input, .form-field textarea { width:100%;padding:1.1rem 1.4rem;background:rgba(255,255,255,.03);border:1.5px solid var(--border);border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:.95rem;transition:all .3s ease; }
  .form-field input:focus, .form-field textarea:focus { outline:none;border-color:var(--orange);box-shadow:0 0 0 3px rgba(241,90,34,.1);background:rgba(255,255,255,.05); }
  .form-field input::placeholder, .form-field textarea::placeholder { color:#3d4450; }
  .form-field textarea { min-height:130px;resize:vertical; }
  .contact-detail { display:flex;align-items:flex-start;gap:1.25rem;margin-bottom:1.5rem;padding:1rem;border-radius:12px;transition:background .3s; }
  .contact-detail:hover { background:rgba(255,255,255,.03); }
  .detail-icon { width:48px;height:48px;flex-shrink:0;background:var(--orange-glow);border:1px solid rgba(241,90,34,.2);border-radius:12px;display:flex;align-items:center;justify-content:center;transition:all .3s ease; }
  .contact-detail:hover .detail-icon { background:rgba(241,90,34,.2);transform:scale(1.05); }
  .detail-icon svg { width:20px;height:20px;color:var(--orange); }
  .detail-lbl { font-size:.68rem;color:var(--muted);letter-spacing:.14em;text-transform:uppercase; }
  .detail-val { font-size:1rem;font-weight:600;margin-top:.25rem;color:#eee;line-height:1.55; }
  .detail-val a { color:#eee;text-decoration:none;transition:color .3s; }
  .detail-val a:hover { color:var(--orange); }

  /* ── FOOTER ── */
  .footer { padding:4rem 5% 2.5rem;border-top:1px solid var(--border);background:#080808; }
  .footer-top { display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:2.5rem;padding-bottom:2.5rem;border-bottom:1px solid var(--border); }
  .footer-name { font-family:'Barlow Condensed',sans-serif;font-size:2rem;font-weight:900;letter-spacing:.06em;color:#fff; }
  .footer-name span { color:var(--orange); }
  .footer-tag { font-size:.68rem;color:var(--muted);letter-spacing:.18em;text-transform:uppercase;margin-top:.25rem; }
  .social-links { display:flex;gap:.75rem; }
  .social-btn { width:44px;height:44px;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:12px;display:flex;align-items:center;justify-content:center;color:#888;text-decoration:none;transition:all .3s ease; }
  .social-btn:hover { background:var(--orange);border-color:var(--orange);color:#fff;transform:translateY(-4px) scale(1.05);box-shadow:0 8px 20px rgba(241,90,34,.35); }
  .footer-ql { font-size:.88rem;color:var(--muted); }
  .footer-ql-title { color:#eee;font-weight:600;margin-bottom:.75rem;font-size:.9rem; }
  .footer-ql a { color:var(--muted);text-decoration:none;transition:all .3s;display:block;padding:.2rem 0; }
  .footer-ql a:hover { color:var(--orange);transform:translateX(4px); }
  .footer-bottom { padding-top:2rem;text-align:center;font-size:.8rem;color:#383838; }
  .footer-bottom strong { color:var(--orange); }

  /* ── RESPONSIVE ── */
  @media (max-width:1200px) { .pricing-grid{grid-template-columns:repeat(2,1fr)} }
  @media (max-width:1024px) {
    .services-grid-v2{grid-template-columns:repeat(2,1fr)}
    .svc-hero-strip{grid-template-columns:1fr 1fr;height:auto}
    .svc-hero-strip>*:last-child{display:none}
    .why-collage{grid-template-columns:1fr 1fr;grid-template-rows:200px;height:auto}
    .why-col-img:first-child{grid-row:auto}
    .why-body{grid-template-columns:1fr;gap:3rem}
    .why-feature-card{height:320px}
    .branches-grid{grid-template-columns:1fr}
    .contact-grid{grid-template-columns:1fr;gap:3rem}
    .about-stats-inner{gap:3rem}
  }
  @media (max-width:900px) {
    .about-stats-inner{grid-template-columns:1fr}
    .about-img img{height:300px}
    .pricing-grid{grid-template-columns:1fr 1fr}
    .svc-stat-row{grid-template-columns:repeat(2,1fr)}
    .why-collage{display:none}
  }
  @media (max-width:768px) {
    .navbar{padding:1rem 1.25rem}.navbar.scrolled{padding:.8rem 1.25rem}
    .nav-links,.nav-cta{display:none!important}.hamburger{display:block}
    .section{padding:4.5rem 4%}
    .services-grid-v2{grid-template-columns:1fr}
    .svc-hero-strip{display:none}
    .timings-flex{flex-direction:column}.timing-card{min-width:100%;padding:2rem}
    .about-stat-cards{grid-template-columns:repeat(3,1fr)}
  }
  @media (max-width:600px) {
    .pricing-grid{grid-template-columns:1fr}
    .hero-title{font-size:clamp(3rem,15vw,5rem)}
    .footer-top{flex-direction:column;gap:2rem}
    .hero-actions{flex-direction:column;align-items:stretch}
    .hero-actions .btn{justify-content:center}
    .svc-stat-row{grid-template-columns:repeat(2,1fr)}
    .why-mini-stats{flex-direction:column;gap:.8rem}
  }
  @media (max-width:480px) {
    .bmi-body{padding:1.5rem}.bmi-head{padding:1.5rem;flex-direction:column;align-items:flex-start}
    .bmi-inputs{grid-template-columns:1fr 1fr}.couples-banner{flex-direction:column}
    .about-stats{padding:4rem 4%}.timing-card{flex-direction:column;text-align:center}
  }

  @media (prefers-reduced-motion:reduce) { *,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important} }
  :focus-visible { outline:2px solid var(--orange);outline-offset:3px; }
  ::selection { background:rgba(241,90,34,.35);color:#fff; }
`;

/* ── Icons ── */
const PhoneIcon       = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 11.9a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 2.92 1.2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 18.92z"/></svg>;
const ArrowIcon       = () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const PulseIcon       = () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
const CheckIcon       = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const ClockIcon       = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const MapPinIcon      = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const PhoneDetailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 11.9a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 2.92 1.2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 18.92z"/></svg>;
const SendIcon        = () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>;
const IGIcon  = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
const FBIcon  = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const YTIcon  = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>;
const WAIcon  = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>;

/* ── Service Data with real Unsplash photos ── */
const SERVICES = [
  { icon:"💪", name:"Bodybuilding",      desc:"Progressive strength training with certified coaches and premium equipment.",
    img:"https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80&fit=crop" },
  { icon:"⚖️", name:"Body Maintenance",  desc:"Structured routines to keep your physique in peak condition year-round.",
    img:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80&fit=crop" },
  { icon:"🔥", name:"Body Slimming",     desc:"Targeted fat loss programs combining cardio and resistance training.",
    img:"https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80&fit=crop" },
  { icon:"📈", name:"Weight Gain",       desc:"Evidence-based muscle gain programs with nutrition guidance included.",
    img:"https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=600&q=80&fit=crop" },
  { icon:"📉", name:"Weight Loss",       desc:"Proven calorie-deficit protocols with trainer-led accountability.",
    img:"https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80&fit=crop" },
  { icon:"🎶", name:"Aerobics",          desc:"High-energy group aerobics classes for cardiovascular fitness and fun.",
    img:"https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80&fit=crop" },
  { icon:"🚴", name:"Cardio",            desc:"High-tech cardio equipment — treadmills, bikes, ellipticals & more.",
    img:"https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=80&fit=crop" },
  { icon:"🩺", name:"Physiotherapy",     desc:"Professional physiotherapy to prevent and recover from injuries.",
    img:"https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80&fit=crop" },
  { icon:"🎯", name:"Personal Training", desc:"One-on-one sessions tailored 100% to your goals and fitness level.",
    img:"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80&fit=crop" },
];

/* ── Why reasons with real photos ── */
const WHY_REASONS = [
  { icon:"🏋️", title:"Premium Equipment",
    img:"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80&fit=crop",
    desc:"High-tech cardio machines, free weights, and resistance equipment updated regularly." },
  { icon:"🎓", title:"Certified Trainers",
    img:"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80&fit=crop",
    desc:"All trainers hold professional certifications dedicated to your safe progress." },
  { icon:"🧭", title:"Personalized Plans",
    img:"https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=200&q=80&fit=crop",
    desc:"No one-size-fits-all. Every member gets a custom workout and nutrition plan." },
  { icon:"🌟", title:"Unisex & Welcoming",
    img:"https://images.unsplash.com/photo-1518310952931-b1de897bc7c9?w=200&q=80&fit=crop",
    desc:"A safe, inclusive environment for beginners, women, seniors, and athletes." },
  { icon:"📍", title:"Multiple Branches",
    img:"https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&q=80&fit=crop",
    desc:"4 branches across Madurai & Chennai — your membership works everywhere." },
];

const PLANS = [
  { duration:"Monthly Plan", price:"1,699", save:"Per month • Flexible", best:false,
    features:["Full gym access","All 9 programs","Locker & changing room","Basic fitness assessment"] },
  { duration:"3 Month Plan", price:"4,199", save:"Save ₹898 vs Monthly",  best:false,
    features:["Everything in Monthly","2 personal training sessions","Nutrition guidance","Progress tracking"] },
  { duration:"6 Month Plan", price:"5,999", save:"Save ₹3,195 vs Monthly", best:true,
    features:["Everything in 3 Month","4 personal training sessions","Physiotherapy consultation","Priority booking","Guest pass (1/month)"] },
  { duration:"Yearly Plan",  price:"9,999", save:"Save ₹10,189 vs Monthly",best:false,
    features:["Everything in 6 Month","Unlimited personal sessions","Full nutrition plan","Guest passes (2/month)","Free merchandise"] },
];

const BRANCHES = [
  { city:"Madurai", name:"Thathaneri Branch — Main Centre",
    addr:"No: 54, 2nd Floor, Rajalakshmi Complex,\nK. Salai, Keelavaithiyanathapuram,\nThathaneri, Madurai – 625 018",
    map:"https://maps.google.com/?q=No+54+Rajalakshmi+Complex+Madurai" },
  { city:"Madurai", name:"Anna Nagar Branch",
    addr:"42, Kalavasal Street, Anna Nagar,\nMadurai, Tamil Nadu – 625 020\nNear Bus Stand",
    map:"https://maps.google.com/?q=Anna+Nagar+Madurai" },
  { city:"Chennai", name:"T. Nagar Branch",
    addr:"88, Pondy Bazaar Road, T. Nagar,\nChennai, Tamil Nadu – 600 017\nNear Metro Station",
    map:"https://maps.google.com/?q=T+Nagar+Chennai" },
  { city:"Chennai", name:"OMR Branch",
    addr:"Tech Park Complex, OMR,\nChennai, Tamil Nadu – 600 097\nInside IT Corridor",
    map:"https://maps.google.com/?q=OMR+Chennai" },
];

/* ── Preloader ── */
function Preloader({ done }) {
  const [width, setWidth] = useState("0%");
  const [pct, setPct]     = useState(0);
  useEffect(() => {
    setTimeout(() => setWidth("100%"), 120);
    let cur = 0;
    const iv = setInterval(() => {
      cur += Math.floor(Math.random() * 8) + 3;
      if (cur >= 100) { cur = 100; clearInterval(iv); }
      setPct(cur);
    }, 60);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className={`pre${done ? " out" : ""}`}>
      <div className="pre-logo-row">
        <img src="logo.png" alt="Aayshmaa Logo" style={{ width:110,height:110,objectFit:"contain",flexShrink:0,animation:"pre-pop .7s cubic-bezier(.34,1.56,.64,1) both" }} />
        <div className="pre-text-col">
          <div className="pre-name">AAYSHMAA</div>
          <div className="pre-divider" />
          <div className="pre-sub">Unisex Fitness Centre</div>
        </div>
      </div>
      <div className="pre-bar-wrap">
        <div className="pre-bar"><div className="pre-prog" style={{ width }} /></div>
        <div className="pre-pct">{pct}%</div>
      </div>
    </div>
  );
}

/* ── Navbar ── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const close  = () => { setMenuOpen(false); document.body.style.overflow = ""; };
  const toggle = () => { const n = !menuOpen; setMenuOpen(n); document.body.style.overflow = n ? "hidden" : ""; };
  const links  = [["#about","About"],["#pricing","Pricing"],["#bmi","BMI Check"],["#branches","Branches"],["#contact","Contact"]];
  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <a href="#" className="nav-logo">
          <img src="logo.png" alt="Logo" className="nav-logo-img" />
          <div>
            <div className="nav-logo-name">AAYSHMAA<span>.</span></div>
            <div className="nav-logo-tag">Unisex Fitness Centre</div>
          </div>
        </a>
        <div className="nav-links">
          {links.map(([h,l]) => <a key={h} href={h} className="nav-link">{l}</a>)}
        </div>
        <a href="tel:7401543400" className="btn btn-primary nav-cta"><PhoneIcon /> Call Now</a>
        <button className={`hamburger${menuOpen ? " active" : ""}`} onClick={toggle} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {links.map(([h,l]) => <a key={h} href={h} onClick={close}>{l}</a>)}
        <a href="tel:7401543400" className="mob-call" onClick={close}><PhoneIcon /> 74015 43400</a>
      </div>
    </>
  );
}

/* ── Scroll Progress ── */
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const p = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setPct(isNaN(p) ? 0 : p);
    };
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return <div className="scroll-prog" style={{ transform:`scaleX(${pct})` }} />;
}

/* ── Hero ── */
function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80" alt="Gym" loading="eager" />
        <div className="hero-overlay" />
      </div>
      <div className="hero-band" />
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-dot" />
          Now Open in Madurai &amp; Chennai
          <span className="ac-badge">❄ A/C</span>
        </div>
        <h1 className="hero-title">
          <span style={{ display:"block" }}>Get In</span>
          <span className="orange" style={{ display:"block" }}>Shape</span>
          <span style={{ display:"block" }}>Today<span className="orange">.</span></span>
        </h1>
        <p className="hero-sub">
          <strong>Aayshmaa Unisex Fitness Centre</strong> — Your destination for Bodybuilding, Slimming, Cardio &amp; more. Certified trainers. High-tech equipment. AC facility.
        </p>
        <div className="hero-actions">
          <a href="#pricing" className="btn btn-primary">Join Now <ArrowIcon /></a>
          <a href="#bmi"     className="btn btn-outline">Check Your BMI <PulseIcon /></a>
        </div>
      </div>
      <div className="hero-scroll"><span>Scroll</span><div className="scroll-line" /></div>
    </section>
  );
}

/* ══════════════════════════════════════
   ── UPGRADED SERVICES SECTION ──
   ══════════════════════════════════════ */
function Services() {
  return (
    <section id="about" className="services-section">
      <div className="max-w">
        <div className="label">What We Offer</div>
        <h2 className="sec-title">Our <span className="orange">Programs</span><br /><span className="dim">&amp; Services</span></h2>
        <div className="divider" />

        {/* ── Photo strip banner ── */}
        <div className="svc-hero-strip">
          <div className="svc-strip-img">
            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80&fit=crop" alt="Main gym floor" loading="lazy" />
            <div className="svc-strip-label">State-of-the-Art Facility</div>
            <div className="svc-strip-tag">❄ Full A/C</div>
          </div>
          <div className="svc-strip-img">
            <img src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80&fit=crop" alt="Weight training" loading="lazy" />
            <div className="svc-strip-label">Strength Zone</div>
          </div>
          <div className="svc-strip-img">
            <img src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=80&fit=crop" alt="Cardio area" loading="lazy" />
            <div className="svc-strip-label">Cardio Suite</div>
          </div>
        </div>

        {/* ── Photo card grid ── */}
        <div className="services-grid-v2">
          {SERVICES.map(s => (
            <div key={s.name} className="svc-card-v2">
              <img src={s.img} alt={s.name} loading="lazy" />
              <div className="svc-card-v2-overlay" />
              <div className="svc-card-v2-accent" />
              <div className="svc-card-v2-body">
                <div className="svc-card-v2-icon">{s.icon}</div>
                <div className="svc-card-v2-name">{s.name}</div>
                <div className="svc-card-v2-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Stats row ── */}
        <div className="svc-stat-row">
          {[["9+","Programs"],["50+","Expert Trainers"],["5000+","Happy Members"],["4","AC Branches"]].map(([n,l]) => (
            <div key={l} className="svc-stat">
              <div className="svc-stat-num">{n}</div>
              <div className="svc-stat-lbl">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── About Stats (unchanged) ── */
function AboutStats() {
  return (
    <section className="about-stats">
      <div className="about-stats-inner">
        <div className="about-img">
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80" alt="Aayshmaa Gym" />
          <div className="about-img-overlay" />
          <div className="about-img-tag">Est. Since 2018</div>
        </div>
        <div className="about-text">
          <p className="about-para">At Aayshmaa Fitness Centre, we believe in transforming lives through fitness. Established with a vision to create a premium fitness experience, our centres are equipped with cutting-edge technology and world-class amenities.</p>
          <p className="about-para">Our certified trainers bring years of expertise to guide you through your fitness journey, whether you're a beginner or a seasoned athlete. We focus on holistic wellness, combining strength training, cardio, and nutrition guidance.</p>
          <div className="about-stat-cards">
            {[["4","Branches"],["50+","Trainers"],["5000+","Members"]].map(([n,l]) => (
              <div key={l} className="asc">
                <div className="asc-num">{n}</div>
                <div className="asc-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   ── UPGRADED WHY AAYSHMAA SECTION ──
   ══════════════════════════════════════ */
function Why() {
  return (
    <section className="why-section">
      <div className="max-w">
        <div className="label">Why Aayshmaa</div>
        <h2 className="sec-title">Built for <span className="orange">Real Results</span></h2>
        <div className="divider" />

        {/* ── Photo collage strip ── */}
        <div className="why-collage">
          <div className="why-col-img">
            <img src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80&fit=crop" alt="Training" loading="lazy" />
            <div className="why-col-tag">Transform Your Body</div>
            <div className="why-col-badge">Since 2018</div>
          </div>
          <div className="why-col-img">
            <img src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80&fit=crop" alt="Weights" loading="lazy" />
            <div className="why-col-tag">Strength Zone</div>
          </div>
          <div className="why-col-img">
            <img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80&fit=crop" alt="Cardio" loading="lazy" />
            <div className="why-col-tag">Cardio &amp; Aerobics</div>
          </div>
          <div className="why-col-img">
            <img src="https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600&q=80&fit=crop" alt="Community" loading="lazy" />
            <div className="why-col-tag">Expert Coaches</div>
          </div>
          <div className="why-col-img">
            <img src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80&fit=crop" alt="Gym" loading="lazy" />
            <div className="why-col-tag">Premium Facility</div>
          </div>
        </div>

        {/* ── Two column layout ── */}
        <div className="why-body">
          {/* Left: big feature card with photo */}
          <div className="why-feature-card">
            <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80&fit=crop" alt="Personal Training" loading="lazy" />
            <div className="why-feature-content">
              <div className="why-feature-eyebrow">Our Promise to You</div>
              <div className="why-feature-title">Expert Guidance,<br />Real Results</div>
              <div className="why-feature-desc">Every member gets a personalized plan crafted by certified trainers. We track your progress, adjust your program, and push you safely toward your goals.</div>
              <div className="why-mini-stats">
                <div>
                  <div className="why-mini-stat-num">100%</div>
                  <div className="why-mini-stat-lbl">Certified Staff</div>
                </div>
                <div>
                  <div className="why-mini-stat-num">5000+</div>
                  <div className="why-mini-stat-lbl">Lives Changed</div>
                </div>
                <div>
                  <div className="why-mini-stat-num">7yr+</div>
                  <div className="why-mini-stat-lbl">Experience</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: reasons with photo thumbnails */}
          <div>
            <div className="why-reasons">
              {WHY_REASONS.map(w => (
                <div key={w.title} className="why-reason">
                  <div className="why-reason-img">
                    <img src={w.img} alt={w.title} loading="lazy" />
                  </div>
                  <div>
                    <div className="why-reason-title">{w.title}</div>
                    <div className="why-reason-desc">{w.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* AC Banner */}
            <div className="why-ac-banner">
              <div className="why-ac-icon">❄️</div>
              <div style={{ flex:1 }}>
                <div className="why-ac-title">Full A/C Facility</div>
                <div className="why-ac-desc">Train in cool comfort even in Tamil Nadu's intense heat. All our branches are fully air-conditioned — no sweaty, stuffy gym experience here.</div>
              </div>
              <a href="tel:7401543400" className="btn btn-primary" style={{ fontSize:".85rem",padding:".65rem 1.4rem",flexShrink:0 }}>Join Today <ArrowIcon /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ── */
function Pricing() {
  return (
    <section id="pricing" className="section">
      <div className="max-w">
        <div className="label">Membership Plans</div>
        <h2 className="sec-title">Invest in <span className="orange">Your Health</span></h2>
        <div className="divider" />
        <p style={{ marginTop:"1.5rem", maxWidth:550, color:"#999", fontSize:".95rem", lineHeight:1.8 }}>
          Transparent pricing with no hidden fees. Pick the plan that fits your schedule and goals.
        </p>
        <div className="pricing-grid">
          {PLANS.map(p => (
            <div key={p.duration} className={`price-card${p.best ? " best" : ""}`}>
              <div className="price-header">
                {p.best && <div className="price-badge">Best Value</div>}
                <div className="price-dur">{p.duration}</div>
                <div className="price-amt">
                  <span className="price-rupee">₹</span>
                  <span className="price-number">{p.price}</span>
                </div>
                <div className="price-save">{p.save}</div>
              </div>
              <div className="price-body">
                <ul className="price-features">
                  {p.features.map(f => <li key={f}><CheckIcon />{f}</li>)}
                </ul>
                <div className="price-btn-wrap">
                  <a href="tel:7401543400" className={`btn ${p.best ? "btn-primary" : "btn-outline"}`}>
                    {p.best ? "Choose Plan" : "Get Started"}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="couples-banner">
          <div style={{ fontSize:"2.5rem" }}>👫</div>
          <div style={{ flex:1 }}>
            <div className="couples-title">Couples Pack Available!</div>
            <div className="couples-desc">Got a workout partner? Enquire about our exclusive Couples membership for extra savings. Call us for details.</div>
          </div>
          <a href="tel:7401543400" className="btn btn-primary">Enquire Now <ArrowIcon /></a>
        </div>
      </div>
    </section>
  );
}

/* ── Timings ── */
function Timings() {
  return (
    <section id="timings" className="section section-bg">
      <div className="max-w" style={{ textAlign:"center" }}>
        <div className="label" style={{ justifyContent:"center" }}>Operating Hours</div>
        <h2 className="sec-title">We're <span className="orange">Open</span></h2>
        <div className="divider" style={{ margin:"1rem auto" }} />
        <div className="timings-flex">
          {[
            { day:"Mon – Sat", hours:"5:00 AM – 10:00 PM", note:"17 hours of access daily" },
            { day:"Sunday",    hours:"6:00 AM – 12:00 PM", note:"Morning sessions only" },
          ].map(t => (
            <div key={t.day} className="timing-card">
              <div className="timing-icon"><ClockIcon /></div>
              <div>
                <div className="timing-day">{t.day}</div>
                <div className="timing-hours">{t.hours}</div>
                <div className="timing-note">{t.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── BMI ── */
function BMI() {
  const [gender, setGender] = useState("male");
  const [form,   setForm]   = useState({ age:"", height:"", weight:"" });
  const [result, setResult] = useState(null);

  const calculate = () => {
    const { age, height, weight } = form;
    if (!age || !height || !weight || +height < 50 || +weight < 10) {
      alert("Please fill in all fields with valid values."); return;
    }
    const h = +height / 100, bmi = +weight / (h * h), val = bmi.toFixed(1);
    let category, color, tip, pct;
    if (bmi < 18.5) {
      category="Underweight"; color="#3b82f6"; pct=Math.max(2,(bmi/18.5)*20);
      tip=<><strong>You are Underweight.</strong> Our trainers recommend a <strong>Weight Gain &amp; Muscle Building</strong> program with a high-calorie nutrition plan.</>;
    } else if (bmi < 25) {
      category="Normal Weight"; color="#22c55e"; pct=20+((bmi-18.5)/6.5)*35;
      tip=<><strong>Great — You're at a Healthy Weight!</strong> Maintain with our <strong>Body Maintenance</strong> or <strong>Bodybuilding</strong> programs.</>;
    } else if (bmi < 30) {
      category="Overweight"; color="#f59e0b"; pct=55+((bmi-25)/5)*25;
      tip=<><strong>You are Overweight.</strong> Our <strong>Body Slimming</strong> and <strong>Weight Loss</strong> programs will help you shed fat efficiently.</>;
    } else {
      category="Obese"; color="#ef4444"; pct=Math.min(97,80+((bmi-30)/10)*17);
      tip=<><strong>BMI indicates Obesity.</strong> Our certified trainers will create a safe, progressive plan. Combine <strong>Cardio + Weight Loss</strong> for sustainable results.</>;
    }
    setResult({ val, category, color, tip, pct });
  };

  return (
    <section id="bmi" className="section">
      <div className="max-w">
        <div className="label">Free Tool</div>
        <h2 className="sec-title">Check Your <span className="orange">BMI</span></h2>
        <div className="divider" />
        <div className="bmi-wrapper">
          <div className="bmi-head">
            <div className="bmi-head-icon">⚡</div>
            <div><h3>BMI Calculator</h3><p>Enter your details below to calculate instantly</p></div>
          </div>
          <div className="bmi-body">
            <div className="bmi-inputs">
              {[["age","Age","25","yrs"],["height","Height","170","cm"],["weight","Weight","70","kg"]].map(([id,lbl,ph,unit]) => (
                <div key={id} className="bmi-field">
                  <label>{lbl}</label>
                  <div className="input-wrap">
                    <input type="number" placeholder={ph} value={form[id]}
                      onChange={e => setForm(f => ({ ...f, [id]:e.target.value }))} />
                    <span className="input-unit">{unit}</span>
                  </div>
                </div>
              ))}
              <div className="bmi-field">
                <label>Gender</label>
                <div className="gender-wrap">
                  <div className={`gender-btn${gender==="male"   ? " active":""}`} onClick={() => setGender("male")}>♂ Male</div>
                  <div className={`gender-btn${gender==="female" ? " active":""}`} onClick={() => setGender("female")}>♀ Female</div>
                </div>
              </div>
            </div>
            <button className="bmi-calc-btn" onClick={calculate}>Calculate BMI →</button>
            {result && (
              <div className="bmi-result">
                <div className="bmi-score-row">
                  <div>
                    <div className="bmi-score-big" style={{ color:result.color }}>{result.val}</div>
                    <div className="bmi-score-label" style={{ color:result.color }}>{result.category}</div>
                  </div>
                  <div className="bmi-gauge">
                    <div className="bmi-gauge-bar">
                      <div className="bmi-pointer" style={{ left:`${result.pct}%` }} />
                    </div>
                    <div className="bmi-gauge-labels">
                      <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
                    </div>
                  </div>
                </div>
                <div className="bmi-tip">{result.tip}</div>
                <div style={{ marginTop:"1.5rem",paddingTop:"1.25rem",borderTop:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem" }}>
                  <p style={{ fontSize:".88rem",color:"var(--muted)" }}>Want a personalized plan based on your BMI?</p>
                  <a href="tel:7401543400" className="btn btn-primary" style={{ fontSize:".85rem",padding:".7rem 1.5rem" }}>Talk to a Trainer →</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Branches ── */
function Branches() {
  return (
    <section id="branches" className="section section-bg">
      <div className="max-w">
        <div className="label">Our Locations</div>
        <h2 className="sec-title">Find Us <span className="orange">Near You</span></h2>
        <div className="divider" />
        <div className="branches-grid">
          {BRANCHES.map(b => (
            <div key={b.name} className="branch-card">
              <div className="branch-city">{b.city}</div>
              <div className="branch-name">{b.name}</div>
              <div className="branch-addr">{b.addr.split("\n").map((l,i) => <span key={i}>{l}<br /></span>)}</div>
              <a href={b.map} target="_blank" rel="noopener noreferrer" className="branch-link">Get Directions <ArrowIcon /></a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Contact ── */
function Contact() {
  const [status, setStatus] = useState("idle");
  const formRef = useRef(null);
  const handleSubmit = e => {
    e.preventDefault(); setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setTimeout(() => { setStatus("idle"); formRef.current?.reset(); }, 2500);
    }, 1200);
  };
  return (
    <section id="contact" className="section">
      <div className="max-w">
        <div className="label">Get in Touch</div>
        <h2 className="sec-title">Start Your <span className="orange">Journey</span></h2>
        <div className="divider" />
        <div className="contact-grid">
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="form-field"><input type="text" placeholder="Your Name" required /></div>
            <div className="form-field"><input type="tel"  placeholder="Phone Number" required /></div>
            <div className="form-field"><input type="text" placeholder="Which Branch? (Optional)" /></div>
            <div className="form-field"><textarea placeholder="Your message or enquiry…" required /></div>
            <button type="submit" className="btn btn-primary"
              style={{ width:"100%",fontSize:"1rem",background:status==="sent"?"#22c55e":undefined }}
              disabled={status==="sending"}>
              {status==="sending" ? "Sending…" : status==="sent" ? "✓ Message Sent!" : <><span>Send Message</span><SendIcon /></>}
            </button>
          </form>
          <div>
            <div className="contact-detail">
              <div className="detail-icon"><MapPinIcon /></div>
              <div>
                <div className="detail-lbl">Main Address</div>
                <div className="detail-val">No: 54, 2nd Floor, Rajalakshmi Complex,<br />K. Salai, Thathaneri, Madurai – 625018</div>
              </div>
            </div>
            <div className="contact-detail">
              <div className="detail-icon"><PhoneDetailIcon /></div>
              <div>
                <div className="detail-lbl">Phone</div>
                <div className="detail-val"><a href="tel:7401543400">74015 43400</a> &nbsp;/&nbsp; <a href="tel:9095035967">90950 35967</a></div>
              </div>
            </div>
            <div className="contact-detail">
              <div className="detail-icon"><ClockIcon /></div>
              <div>
                <div className="detail-lbl">Working Hours</div>
                <div className="detail-val">Mon–Sat: 5:00 AM – 10:00 PM<br />Sunday: 6:00 AM – 12:00 PM</div>
              </div>
            </div>
            <div style={{ padding:"1.75rem",background:"var(--orange-glow)",border:"1px solid rgba(241,90,34,.2)",borderRadius:14,marginTop:".5rem" }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.6rem",fontWeight:900,textTransform:"uppercase",color:"var(--orange)",marginBottom:".5rem" }}>Never Give Up!</div>
              <p style={{ fontSize:".9rem",color:"#999",lineHeight:1.75 }}>Your transformation starts the moment you walk through our doors. Our trainers are ready to guide you every step of the way.</p>
              <div style={{ display:"flex",gap:".8rem",marginTop:"1.5rem",flexWrap:"wrap" }}>
                <a href="tel:7401543400" className="btn btn-primary" style={{ fontSize:".85rem",padding:".65rem 1.4rem" }}>📞 Call Now</a>
                <a href="https://wa.me/917401543400" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize:".85rem",padding:".65rem 1.4rem" }}>💬 WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="footer">
      <div className="max-w">
        <div className="footer-top">
          <div style={{ display:"flex",alignItems:"center",gap:".9rem" }}>
            <img src="logo.png" alt="Aayshmaa Logo" style={{ width:52,height:52,objectFit:"contain",flexShrink:0 }} />
            <div>
              <div className="footer-name">AAYSHMAA<span>.</span></div>
              <div className="footer-tag">Unisex Fitness Centre · A/C Facility</div>
            </div>
          </div>
          <div className="social-links">
            <a href="#" className="social-btn" aria-label="Instagram"><IGIcon /></a>
            <a href="#" className="social-btn" aria-label="Facebook"><FBIcon /></a>
            <a href="#" className="social-btn" aria-label="YouTube"><YTIcon /></a>
            <a href="https://wa.me/917401543400" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="WhatsApp"><WAIcon /></a>
          </div>
          <div className="footer-ql">
            <div className="footer-ql-title">Quick Links</div>
            <a href="#about">About &amp; Services</a>
            <a href="#pricing">Membership Pricing</a>
            <a href="#bmi">BMI Calculator</a>
            <a href="#branches">Our Branches</a>
            <a href="#contact">Contact Us</a>
          </div>
          <div className="footer-ql">
            <div className="footer-ql-title">Contact</div>
            <a href="tel:7401543400">📞 74015 43400</a>
            <a href="tel:9095035967">📞 90950 35967</a>
            <a href="https://wa.me/917401543400">💬 WhatsApp Us</a>
            <div style={{ marginTop:".5rem",color:"var(--muted)",fontSize:".82rem",lineHeight:1.7 }}>
              Mon–Sat: 5 AM – 10 PM<br />Sunday: 6 AM – 12 PM
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2024 <strong>Aayshmaa Unisex Fitness Centre</strong>. All rights reserved. &nbsp;|&nbsp; Madurai &amp; Chennai
        </div>
      </div>
    </footer>
  );
}

/* ── App ── */
export default function App() {
  const [done, setDone] = useState(false);
  useEffect(() => { setTimeout(() => setDone(true), 2400); }, []);
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Preloader done={done} />
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Services />
      <AboutStats />
      <Why />
      <Pricing />
      <Timings />
      <BMI />
      <Branches />
      <Contact />
      <Footer />
    </>
  );
}