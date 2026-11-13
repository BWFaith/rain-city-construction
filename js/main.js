/* Rain City Design & Build — site behaviour */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [
    ...r.querySelectorAll(s),
  ];
  const reduce = matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const money = (n) =>
    "$" + Math.round(n).toLocaleString("en-US");
  const esc = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );

  /* ---------- header ---------- */
  const header = $("header.site"),
    bar = $(".progress"),
    burger = $(".burger"),
    menu = $(".menu");
  function onScroll() {
    header.classList.toggle("scrolled", scrollY > 20);
    const h = document.documentElement;
    bar.style.width =
      (scrollY /
        Math.max(1, h.scrollHeight - innerHeight)) *
        100 +
      "%";
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  burger &&
    burger.addEventListener("click", () => {
      const o = burger.classList.toggle("open");
      menu.classList.toggle("open", o);
      burger.setAttribute("aria-expanded", o);
    });
  $$(".menu a").forEach((a) =>
    a.addEventListener("click", () => {
      burger.classList.remove("open");
      menu.classList.remove("open");
    }),
  );
  const here =
    location.pathname.split("/").pop() || "index.html";
  $$(".menu a.l").forEach((a) => {
    if (a.getAttribute("href") === here)
      a.classList.add("on");
  });
  const yr = $("#yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- reveal + counters ---------- */
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
        if (e.target.dataset.count) countUp(e.target);
      }),
    { threshold: 0.15 },
  );
  $$(".rv, [data-count]").forEach((el) => io.observe(el));
  function countUp(el) {
    const end = +el.dataset.count,
      suf = el.dataset.suffix || "",
      t0 = performance.now(),
      d = 1800;
    if (reduce) {
      el.textContent = end + suf;
      return;
    }
    (function f(t) {
      const p = Math.min(1, (t - t0) / d),
        e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(end * e) + suf;
      if (p < 1) requestAnimationFrame(f);
    })(t0);
  }

  /* ---------- hero: slideshow ---------- */
  const slides = $$(".slide"),
    dots = $$(".dots button"),
    cap = $(".hero-meta .cap");
  if (slides.length) {
    let i = 0,
      timer;
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) =>
        s.classList.toggle("on", k === i),
      );
      dots.forEach((d, k) => {
        d.classList.remove("on");
        void d.offsetWidth;
        d.classList.toggle("on", k === i);
      });
      if (cap)
        cap.textContent = slides[i].dataset.cap || "";
      clearTimeout(timer);
      if (!reduce)
        timer = setTimeout(() => go(i + 1), 7000);
    };
    dots.forEach((d, k) =>
      d.addEventListener("click", () => go(k)),
    );
    go(0);
  }

  /* ---------- hero: rain canvas with cursor ripples ---------- */
  const cv = $("#rain");
  if (cv && !reduce) {
    const ctx = cv.getContext("2d");
    let W,
      H,
      drops = [],
      ripples = [],
      run = true;
    const size = () => {
      const r = cv.getBoundingClientRect(),
        dpr = Math.min(2, devicePixelRatio || 1);
      W = cv.width = r.width * dpr;
      H = cv.height = r.height * dpr;
      cv.dpr = dpr;
      const n = Math.min(220, Math.floor(r.width / 7));
      drops = Array.from({ length: n }, () => mk(true));
    };
    const mk = (init) => ({
      x: Math.random() * (W || 1200) * 1.2,
      y: init ? Math.random() * (H || 800) : -40,
      l: 14 + Math.random() * 26,
      v: 9 + Math.random() * 12,
      a: 0.12 + Math.random() * 0.28,
    });
    size();
    addEventListener("resize", size);
    new IntersectionObserver((e) => {
      run = e[0].isIntersecting;
      if (run) loop();
    }).observe(cv);
    cv.parentElement.addEventListener(
      "pointermove",
      (e) => {
        const r = cv.getBoundingClientRect();
        if (Math.random() < 0.35)
          ripples.push({
            x: (e.clientX - r.left) * cv.dpr,
            y: (e.clientY - r.top) * cv.dpr,
            r: 2,
            a: 0.55,
          });
      },
    );
    function loop() {
      if (!run) return;
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = "round";
      const d = cv.dpr;
      for (const p of drops) {
        ctx.strokeStyle = `rgba(214,228,238,${p.a})`;
        ctx.lineWidth = 1.1 * d;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.l * 0.22 * d, p.y + p.l * d);
        ctx.stroke();
        p.x -= p.v * 0.22 * d;
        p.y += p.v * d;
        if (p.y > H) {
          if (Math.random() < 0.03)
            ripples.push({
              x: p.x,
              y: H - 4 * d,
              r: 2,
              a: 0.35,
            });
          Object.assign(p, mk(false));
          p.x = Math.random() * W * 1.2;
        }
      }
      ripples = ripples.filter((r) => r.a > 0.02);
      for (const r of ripples) {
        ctx.strokeStyle = `rgba(243,160,107,${r.a})`;
        ctx.lineWidth = 1.3 * d;
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.r, r.r * 0.45, 0, 0, 7);
        ctx.stroke();
        r.r += 1.6 * d;
        r.a *= 0.95;
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ---------- before / after sliders ---------- */
  $$(".ba").forEach((b) => {
    const inp = $("input", b),
      set = (v) => b.style.setProperty("--p", v + "%");
    inp.addEventListener("input", () => set(inp.value));
    set(inp.value);
    if (!reduce) {
      // gentle intro sweep once visible
      new IntersectionObserver(
        (e, o) => {
          if (!e[0].isIntersecting) return;
          o.disconnect();
          let t = 0;
          const f = () => {
            t += 0.035;
            const v =
              50 +
              Math.sin(t) * 22 * Math.max(0, 1 - t / 4);
            set(v);
            inp.value = v;
            if (t < 4) requestAnimationFrame(f);
            else {
              set(50);
              inp.value = 50;
            }
          };
          f();
        },
        { threshold: 0.6 },
      ).observe(b);
    }
  });

  /* ---------- gallery filters + lightbox ---------- */
  $$(".filters").forEach((f) =>
    f.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      $$("button", f).forEach((x) =>
        x.classList.toggle("on", x === b),
      );
      const cat = b.dataset.f;
      $$("[data-cat]").forEach((it) =>
        it.classList.toggle(
          "hide",
          cat !== "all" &&
            !it.dataset.cat.split(" ").includes(cat),
        ),
      );
    }),
  );
  const lb = $(".lb");
  if (lb) {
    const li = $("img", lb),
      lp = $("p", lb);
    const close = () => lb.classList.remove("open");
    $$(".mason figure").forEach((fig) => {
      fig.tabIndex = 0;
      const open = () => {
        const im = $("img", fig);
        li.src = im.src;
        li.alt = im.alt;
        lp.textContent =
          $("figcaption", fig)?.textContent || "";
        lb.classList.add("open");
      };
      fig.addEventListener("click", open);
      fig.addEventListener("keydown", (e) => {
        if (e.key === "Enter") open();
      });
    });
    lb.addEventListener("click", (e) => {
      if (e.target !== li) close();
    });
    addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- email (EmailJS, with safe demo fallback) ---------- */
  const cfg = window.RC;
  const emailReady = () =>
    window.emailjs &&
    cfg.emailjs.publicKey &&
    !/^YOUR_/.test(cfg.emailjs.publicKey) &&
    !/^YOUR_/.test(cfg.emailjs.serviceId) &&
    !/^YOUR_/.test(cfg.emailjs.templateId) &&
    !/yourdomain/.test(cfg.business.ownerEmail);
  async function sendBoth({
    clientEmail,
    clientName,
    subject,
    html,
    ownerSubject,
    ownerHtml,
  }) {
    if (!emailReady()) {
      console.info(
        "[Rain City] Demo mode — emails not sent. Configure js/config.js",
      );
      return { demo: true };
    }
    emailjs.init({ publicKey: cfg.emailjs.publicKey });
    const base = {
      from_name: cfg.business.name,
      reply_to: cfg.business.ownerEmail,
    };
    await emailjs.send(
      cfg.emailjs.serviceId,
      cfg.emailjs.templateId,
      {
        ...base,
        to_email: clientEmail,
        to_name: clientName,
        subject,
        message_html: html,
      },
    );
    await emailjs.send(
      cfg.emailjs.serviceId,
      cfg.emailjs.templateId,
      {
        ...base,
        to_email: cfg.business.ownerEmail,
        to_name: cfg.business.contact,
        subject: ownerSubject || subject,
        message_html: ownerHtml || html,
        reply_to: clientEmail,
      },
    );
    return { demo: false };
  }
  const emailShell = (title, inner) =>
    `<div style="font-family:Arial,Helvetica,sans-serif;max-width:620px;margin:auto;color:#1B2024"><div style="background:#171C20;padding:22px 26px"><span style="font-size:26px;font-weight:bold;color:#E8702A;letter-spacing:1px">RAIN&middot;CITY</span><span style="color:#fff;font-size:13px;margin-left:10px">DESIGN &amp; BUILD, LLC</span></div><div style="padding:26px;border:1px solid #e3e0da;border-top:0"><h2 style="margin:0 0 14px;font-size:22px">${title}</h2>${inner}<p style="margin-top:26px;font-size:13px;color:#59646B">${esc(cfg.business.name)} &middot; ${esc(cfg.business.phone)} &middot; Licensed, Bonded &amp; Insured</p></div></div>`;
  const validEmail = (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  /* ---------- contact form ---------- */
  const cf = $("#contactForm");
  if (cf)
    cf.addEventListener("submit", async (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(cf));
      let ok = true;
      $$(".field", cf).forEach((f) => {
        const i = $("input,select,textarea", f);
        if (!i) return;
        const bad =
          (i.required && !i.value.trim()) ||
          (i.type === "email" && !validEmail(i.value));
        f.classList.toggle("bad", bad);
        if (bad) ok = false;
      });
      if (!ok) return;
      const btn = $("button[type=submit]", cf);
      btn.disabled = true;
      btn.textContent = "Sending…";
      const rows = `<p><b>Name:</b> ${esc(d.name)}<br><b>Email:</b> ${esc(d.email)}<br><b>Phone:</b> ${esc(d.phone || "-")}<br><b>Topic:</b> ${esc(d.topic)}</p><p>${esc(d.message).replace(/\n/g, "<br>")}</p>`;
      try {
        const r = await sendBoth({
          clientEmail: d.email,
          clientName: d.name,
          subject:
            "We received your message — Rain City Design & Build",
          html: emailShell(
            "Thanks, " +
              esc(d.name.split(" ")[0]) +
              " — we got your message",
            "<p>A member of our team will reply shortly. Here is a copy of what you sent:</p>" +
              rows,
          ),
          ownerSubject:
            "New website message from " + d.name,
          ownerHtml: emailShell(
            "New message from the website",
            rows,
          ),
        });
        cf.innerHTML = `<div class="success on"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><path d="m7 12.5 3.2 3.2L17 9"/></svg><h3>Message sent</h3><p>Thank you — we will get back to you shortly.${r.demo ? '<br><span class="note">(Demo mode: emails are not live until EmailJS is configured in js/config.js.)</span>' : " A copy is on its way to your inbox."}</p></div>`;
      } catch (err) {
        console.error(err);
        btn.disabled = false;
        btn.textContent = "Send message";
        alert(
          "Sorry, the message could not be sent. Please call " +
            cfg.business.phone +
            ".",
        );
      }
    });

  /* ---------- booking wizard + quote calculator ---------- */
  const wiz = $("#wizard");
  if (!wiz) return;
  const S = {
    sel: new Set(),
    qty: {},
    tier: {},
    rush: false,
    date: "",
    slot: cfg.timeSlots[0],
    prop: "Single-family home",
    addr: "",
    notes: "",
    name: "",
    email: "",
    phone: "",
  };
  let step = 1;
  const svc = (id) => cfg.services.find((s) => s.id === id);

  // Step 1 cards
  $("#svcPick").innerHTML = cfg.services
    .map(
      (s) =>
        `<label><input type="checkbox" value="${s.id}"><img src="assets/images/${s.img}" alt="" loading="lazy"><span><b>${s.name}</b><small>${s.blurb}</small></span></label>`,
    )
    .join("");
  const pre = new URLSearchParams(location.search).get(
    "service",
  );
  if (pre && svc(pre)) {
    S.sel.add(pre);
    $(`#svcPick input[value=${pre}]`).checked = true;
  }
  $("#svcPick").addEventListener("change", (e) => {
    e.target.checked
      ? S.sel.add(e.target.value)
      : S.sel.delete(e.target.value);
    buildScope();
    calc();
  });

  // Step 2 scope fields
  function buildScope() {
    const box = $("#scopeBox");
    box.innerHTML =
      [...S.sel]
        .map((id) => {
          const s = svc(id);
          S.qty[id] ??= s.def;
          S.tier[id] ??= "standard";
          const tiers = s.tiers
            ? `<div class="field"><label>Finish level</label><div class="tiers">${Object.entries(
                cfg.tiers,
              )
                .map(
                  ([k, t]) =>
                    `<label><input type="radio" name="t-${id}" value="${k}" ${S.tier[id] === k ? "checked" : ""}>${t.label}<small>${t.note}</small></label>`,
                )
                .join("")}</div></div>`
            : "";
          return `<div class="scope" data-id="${id}"><h4>${s.name}</h4><div class="field"><label for="q-${id}">Approximate size — ${s.unit}</label><input id="q-${id}" type="number" min="1" inputmode="numeric" value="${S.qty[id]}"></div>${tiers}</div>`;
        })
        .join("") ||
      '<p class="qempty">Select at least one service in step 1.</p>';
  }
  $("#scopeBox").addEventListener("input", (e) => {
    const sc = e.target.closest(".scope");
    if (!sc) return;
    const id = sc.dataset.id;
    if (e.target.type === "number")
      S.qty[id] = Math.max(1, +e.target.value || 1);
    else S.tier[id] = e.target.value;
    calc();
  });

  // Step 3 fields
  const dt = $("#date");
  const min = new Date();
  min.setDate(min.getDate() + 2);
  dt.min = min.toISOString().slice(0, 10);
  $("#slots").innerHTML = cfg.timeSlots
    .map(
      (t, k) =>
        `<label><input type="radio" name="slot" value="${t}" ${k === 0 ? "checked" : ""}>${t}</label>`,
    )
    .join("");
  $("#rush").addEventListener("change", (e) => {
    S.rush = e.target.checked;
    calc();
  });

  // Pricing
  function calc() {
    let sub = 0;
    const lines = [];
    S.sel.forEach((id) => {
      const s = svc(id),
        m = s.tiers
          ? cfg.tiers[S.tier[id] || "standard"].mult
          : 1;
      const amt = Math.max(
        s.min,
        (S.qty[id] || s.def) * s.rate * m,
      );
      sub += amt;
      lines.push({
        name: s.name,
        qty: S.qty[id] || s.def,
        unit: s.unit,
        tier: s.tiers
          ? cfg.tiers[S.tier[id] || "standard"].label
          : "",
        amt,
      });
    });
    if (S.rush) sub *= cfg.rushMultiplier;
    const out = {
      lines,
      sub,
      lo: sub * cfg.rangeLow,
      hi: sub * cfg.rangeHigh,
    };
    $("#qLines").innerHTML = lines.length
      ? lines
          .map(
            (l) =>
              `<div class="qline"><span>${l.name}${l.tier ? " · " + l.tier : ""}</span><span>${money(l.amt)}</span></div>`,
          )
          .join("") +
        (S.rush
          ? `<div class="qline"><span>Priority scheduling</span><span>+${Math.round((cfg.rushMultiplier - 1) * 100)}%</span></div>`
          : "")
      : '<p class="qempty">Choose your services and your estimate builds here, live.</p>';
    $("#qTotal").innerHTML = lines.length
      ? `<small>Estimated project range</small><b>${money(out.lo)} – ${money(out.hi)}</b><small>Final price is confirmed after a walkthrough.</small>`
      : "";
    return out;
  }

  // Navigation
  const heads = $$("#wizhead div"),
    panels = $$(".panel", wiz);
  function show(n) {
    step = n;
    panels.forEach((p, k) =>
      p.classList.toggle("on", k + 1 === n),
    );
    heads.forEach((h, k) => {
      h.classList.toggle("on", k + 1 === n);
      h.classList.toggle("done", k + 1 < n);
    });
    if (n === 5) review();
    scrollTo({
      top: wiz.offsetTop - 120,
      behavior: reduce ? "auto" : "smooth",
    });
  }
  function mark(el, bad) {
    el.closest(".field").classList.toggle("bad", bad);
    return !bad;
  }
  function validate(n) {
    if (n === 1) {
      if (!S.sel.size) {
        $("#e1").style.display = "block";
        return false;
      }
      $("#e1").style.display = "none";
      return true;
    }
    if (n === 2) return true;
    if (n === 3) {
      S.date = dt.value;
      S.slot = $("input[name=slot]:checked").value;
      S.prop = $("#prop").value;
      S.addr = $("#addr").value.trim();
      S.notes = $("#notes").value.trim();
      return [
        mark(dt, !S.date),
        mark($("#addr"), S.addr.length < 5),
      ].every(Boolean);
    }
    if (n === 4) {
      S.name = $("#cname").value.trim();
      S.email = $("#cemail").value.trim();
      S.phone = $("#cphone").value.trim();
      return [
        mark($("#cname"), S.name.length < 2),
        mark($("#cemail"), !validEmail(S.email)),
        mark(
          $("#cphone"),
          S.phone.replace(/\D/g, "").length < 7,
        ),
      ].every(Boolean);
    }
    return true;
  }
  $$("[data-next]", wiz).forEach((b) =>
    b.addEventListener("click", () => {
      if (validate(step)) show(step + 1);
    }),
  );
  $$("[data-prev]", wiz).forEach((b) =>
    b.addEventListener("click", () => show(step - 1)),
  );

  const fmtDate = (d) =>
    new Date(d + "T12:00:00").toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  function review() {
    const q = calc();
    $("#review").innerHTML =
      `<div class="review"><dl><dt>Services</dt><dd>${q.lines.map((l) => `${esc(l.name)} — ${l.qty} ${esc(l.unit)}${l.tier ? " (" + l.tier + ")" : ""}`).join("<br>")}</dd><dt>Preferred date</dt><dd>${fmtDate(S.date)}<br>${esc(S.slot)}${S.rush ? "<br><b>Priority scheduling requested</b>" : ""}</dd><dt>Property</dt><dd>${esc(S.prop)}<br>${esc(S.addr)}</dd><dt>Contact</dt><dd>${esc(S.name)}<br>${esc(S.email)} · ${esc(S.phone)}</dd>${S.notes ? `<dt>Notes</dt><dd>${esc(S.notes)}</dd>` : ""}<dt>Estimate</dt><dd><b style="font-size:1.3rem">${money(q.lo)} – ${money(q.hi)}</b></dd></dl></div>`;
  }

  // Submit
  $("#submitBook").addEventListener("click", async () => {
    const btn = $("#submitBook");
    btn.disabled = true;
    btn.textContent = "Sending your quote…";
    const q = calc(),
      ref =
        "RC-" +
        new Date()
          .toISOString()
          .slice(2, 10)
          .replace(/-/g, "") +
        "-" +
        Math.floor(1000 + Math.random() * 9000);
    const table = `<table style="width:100%;border-collapse:collapse;font-size:14px">${q.lines.map((l) => `<tr><td style="padding:9px 0;border-bottom:1px solid #e3e0da">${esc(l.name)}${l.tier ? " (" + l.tier + ")" : ""}<br><span style="color:#59646B;font-size:12px">${l.qty} ${esc(l.unit)}</span></td><td style="padding:9px 0;border-bottom:1px solid #e3e0da;text-align:right"><b>${money(l.amt)}</b></td></tr>`).join("")}${S.rush ? `<tr><td style="padding:9px 0">Priority scheduling</td><td style="text-align:right">+${Math.round((cfg.rushMultiplier - 1) * 100)}%</td></tr>` : ""}</table><p style="font-size:18px;margin:18px 0 4px"><b>Estimated range: ${money(q.lo)} – ${money(q.hi)}</b></p><p style="font-size:12px;color:#59646B;margin:0">This is an estimate. The final price is confirmed after a site walkthrough.</p>`;
    const details = `<p style="font-size:14px;line-height:1.6"><b>Reference:</b> ${ref}<br><b>Preferred date:</b> ${fmtDate(S.date)}, ${esc(S.slot)}<br><b>Property:</b> ${esc(S.prop)}, ${esc(S.addr)}<br><b>Client:</b> ${esc(S.name)} · ${esc(S.email)} · ${esc(S.phone)}${S.notes ? "<br><b>Notes:</b> " + esc(S.notes) : ""}</p>`;
    try {
      const r = await sendBoth({
        clientEmail: S.email,
        clientName: S.name,
        subject: `Your quote ${ref} — Rain City Design & Build`,
        html: emailShell(
          "Thank you, " +
            esc(S.name.split(" ")[0]) +
            " — your booking request is in",
          `<p>Here is your quote summary. We will confirm your appointment by phone or email within one business day.</p>${details}${table}`,
        ),
        ownerSubject: `NEW BOOKING ${ref} — ${S.name} (${money(q.lo)}–${money(q.hi)})`,
        ownerHtml: emailShell(
          "New booking request",
          details + table,
        ),
      });
      $$(".panel", wiz).forEach((p) =>
        p.classList.remove("on"),
      );
      $("#wizhead").style.display = "none";
      $("#doneRef").textContent = ref;
      $("#doneMail").textContent = S.email;
      $("#demoNote").style.display = r.demo
        ? "block"
        : "none";
      $("#success").classList.add("on");
      scrollTo({
        top: wiz.offsetTop - 120,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(err);
      btn.disabled = false;
      btn.textContent = "Send my quote";
      alert(
        "Sorry, we could not send your request. Please call " +
          cfg.business.phone +
          ".",
      );
    }
  });

  buildScope();
  calc();
  show(1);
})();
