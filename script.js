(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const form = $("greetingForm");
  const canvas = $("fireworks");
  const ctx = canvas.getContext("2d");
  const modal = $("greetingModal");
  const params = new URLSearchParams(window.location.search);
  let particles = [];
  let audioContext = null;
  let soundEnabled = false;
  let currentGreeting = null;
  let currentShareUrl = window.location.href;

  const FESTIVALS = {
    diwali: {
      title: "Happy Diwali!", hiTitle: "शुभ दीपावली", kicker: "A FESTIVAL OF LIGHTS",
      warm: ["May your home glow with happiness, your hearts be filled with peace, and your days shine with endless possibilities.", "आपके घर में सुख-समृद्धि और जीवन में खुशियों की रोशनी बनी रहे।"],
      traditional: ["May Goddess Lakshmi bless your family with health, prosperity and abundance. Wishing you a bright and blessed Diwali.", "माँ लक्ष्मी की कृपा से आपके परिवार में सुख, शांति और समृद्धि बनी रहे। शुभ दीपावली!"],
      short: ["Wishing you a sparkling Diwali filled with love, laughter and light!", "दीपों का उजाला, खुशियों की बहार — आपको और आपके परिवार को दीपावली की शुभकामनाएँ!"]
    },
    holi: {
      title: "Happy Holi!", hiTitle: "होली की शुभकामनाएँ", kicker: "A CELEBRATION OF COLOURS",
      warm: ["May your life be painted with the brightest colours of love, laughter and beautiful memories.", "आपका जीवन प्यार, हँसी और खुशियों के रंगों से सदा भरा रहे।"],
      traditional: ["May this Holi bring new beginnings, good health and prosperity to your family. Have a blessed celebration!", "होली के पावन पर्व पर आपके जीवन में सुख, शांति और समृद्धि के रंग भर जाएँ।"],
      short: ["A little colour, a lot of joy. Happy Holi to you and your family!", "रंगों और उमंगों भरी होली की हार्दिक शुभकामनाएँ!"]
    },
    rakhi: {
      title: "Happy Raksha Bandhan!", hiTitle: "रक्षाबंधन की शुभकामनाएँ", kicker: "A BOND OF LOVE",
      warm: ["May the beautiful bond of love, care and memories between siblings grow stronger with every passing year.", "भाई-बहन का प्यार और विश्वास यूँ ही जीवन भर बना रहे।"],
      traditional: ["Wishing you a Raksha Bandhan filled with blessings, affection and cherished family moments.", "रक्षाबंधन का यह पावन पर्व आपके परिवार में प्रेम और खुशियाँ लेकर आए।"],
      short: ["Celebrating a bond that is forever. Happy Raksha Bandhan!", "प्यार और विश्वास के अटूट रिश्ते को रक्षाबंधन की शुभकामनाएँ!"]
    },
    eid: {
      title: "Eid Mubarak!", hiTitle: "ईद मुबारक", kicker: "A TIME FOR GRATITUDE & JOY",
      warm: ["May this special day bring peace to your home, happiness to your heart and countless blessings to your family.", "आपके घर में अमन, दिल में सुकून और परिवार में ढेरों खुशियाँ रहें। ईद मुबारक!"],
      traditional: ["May Allah bless you and your loved ones with good health, prosperity and peace. Eid Mubarak!", "अल्लाह आपके परिवार को सेहत, बरकत और खुशियों से नवाज़े। ईद मुबारक!"],
      short: ["Wishing you a joyful Eid filled with love, peace and togetherness!", "खुशियों, मोहब्बत और बरकतों वाली ईद मुबारक!"]
    },
    christmas: {
      title: "Merry Christmas!", hiTitle: "क्रिसमस की शुभकामनाएँ", kicker: "A SEASON OF GIVING",
      warm: ["May your home be filled with warmth, your heart with gratitude and your days with the magic of togetherness.", "आपके घर में प्रेम, शांति और खुशियों का उजाला हमेशा बना रहे।"],
      traditional: ["May the spirit of Christmas bring hope, kindness and abundant blessings to you and your family.", "क्रिसमस का पर्व आपके जीवन में नई आशा, प्रेम और खुशियाँ लेकर आए।"],
      short: ["Wishing you a magical Christmas and a season full of smiles!", "प्रेम और खुशियों से भरे क्रिसमस की हार्दिक शुभकामनाएँ!"]
    },
    newyear: {
      title: "Happy New Year!", hiTitle: "नववर्ष की शुभकामनाएँ", kicker: "A FRESH START",
      warm: ["May the new year open doors to beautiful opportunities, good health and moments worth remembering.", "नया साल आपके जीवन में नई उमंग, सफलता और ढेरों खुशियाँ लेकर आए।"],
      traditional: ["Wishing you and your family a year blessed with peace, progress, prosperity and good fortune.", "आपके परिवार को सुख, शांति, उन्नति और समृद्धि से भरे नववर्ष की शुभकामनाएँ।"],
      short: ["New year, new hopes, endless possibilities. Happy New Year!", "नया साल नई खुशियाँ और नई उम्मीदें लेकर आए। नववर्ष मंगलमय हो!"]
    },
    generic: {
      title: "Warm Wishes!", hiTitle: "हार्दिक शुभकामनाएँ", kicker: "A MOMENT TO CELEBRATE",
      warm: ["Wishing you and your loved ones happiness, peace and beautiful memories on this special occasion.", "इस खास मौके पर आपके और आपके परिवार के जीवन में खुशियाँ और प्रेम बना रहे।"],
      traditional: ["May this special occasion bring blessings, good health and prosperity to your entire family.", "यह शुभ अवसर आपके परिवार के लिए सुख, शांति और समृद्धि लेकर आए।"],
      short: ["Sending smiles, love and warm wishes your way!", "आपको और आपके परिवार को ढेरों शुभकामनाएँ!"]
    }
  };

  function selectedTemplate() {
    return document.querySelector('input[name="template"]:checked')?.value || "warm";
  }

  function readForm() {
    const festival = $("festival").value;
    const template = selectedTemplate();
    const data = FESTIVALS[festival] || FESTIVALS.generic;
    return {
      festival,
      template,
      recipient: $("recipient").value.trim(),
      sender: $("sender").value.trim(),
      language: $("language").value,
      note: $("personalNote").value.trim(),
      title: $("language").value === "hi" ? data.hiTitle : data.title,
      kicker: data.kicker,
      english: data[template][0],
      hindi: data[template][1]
    };
  }

  function visibleMessages(greeting) {
    return {
      english: greeting.language === "hi" ? "" : greeting.english,
      hindi: greeting.language === "en" ? "" : greeting.hindi
    };
  }

  function updatePreview() {
    const g = readForm();
    const msgs = visibleMessages(g);
    $("previewFestival").textContent = g.kicker;
    $("previewTitle").textContent = g.title;
    $("previewRecipient").textContent = g.recipient ? `Dear ${g.recipient}` : "Dear Family & Friends";
    $("previewMessage").textContent = msgs.english;
    $("previewHindi").textContent = msgs.hindi;
    $("previewNote").textContent = g.note ? `“${g.note}”` : "";
    $("previewSender").textContent = g.sender || "Your well-wisher";
    $("previewMessage").hidden = !msgs.english;
    $("previewHindi").hidden = !msgs.hindi;
    document.querySelectorAll(".template-choice").forEach((el) => {
      el.classList.toggle("selected", el.querySelector("input").checked);
    });
  }

  form.addEventListener("input", updatePreview);
  form.addEventListener("change", updatePreview);

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function burst(x, y, big = false) {
    const colors = ["#ffd36f", "#f18f9b", "#a9d9f3", "#ffffff", "#d6a4ed"];
    const count = big ? 62 : 32;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = (big ? 3.8 : 2.7) * (.45 + Math.random() * .8);
      particles.push({
        x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life: 1, decay: .012 + Math.random() * .012,
        color: colors[Math.floor(Math.random() * colors.length)], radius: 1.7 + Math.random() * 1.3
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.vy += .025; p.life -= p.decay;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  animate();

  function playChime() {
    if (!soundEnabled) return;
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(990, audioContext.currentTime + .18);
      gain.gain.setValueAtTime(.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.08, audioContext.currentTime + .02);
      gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + .5);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(); oscillator.stop(audioContext.currentTime + .52);
    } catch (_) { /* Audio is optional; the greeting still works without it. */ }
  }

  $("soundToggle").addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    $("soundToggle").textContent = soundEnabled ? "🔔" : "🔇";
    if (soundEnabled) playChime();
  });

  function encodeGreeting(g) {
    const payload = {
      v: 1, f: g.festival, t: g.template, r: g.recipient,
      s: g.sender, l: g.language, n: g.note
    };
    return btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function decodeGreeting(token) {
    try {
      const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(escape(atob(base64)));
      const payload = JSON.parse(json);
      if (!payload || payload.v !== 1 || !FESTIVALS[payload.f]) return null;
      return payload;
    } catch (_) { return null; }
  }

  function makeShareUrl(g) {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("wish", encodeGreeting(g));
    return url.toString();
  }

  function populateForm(payload) {
    $("festival").value = payload.f;
    $("recipient").value = payload.r || "";
    $("sender").value = payload.s || "";
    $("language").value = payload.l || "both";
    $("personalNote").value = payload.n || "";
    const radio = document.querySelector(`input[name="template"][value="${payload.t}"]`);
    if (radio) radio.checked = true;
    updatePreview();
  }

  function openGreeting(g, shareUrl) {
    currentGreeting = g;
    currentShareUrl = shareUrl || makeShareUrl(g);
    const msgs = visibleMessages(g);
    $("finalFestival").textContent = g.kicker;
    $("finalTitle").textContent = g.title;
    $("finalRecipient").textContent = g.recipient ? `Dear ${g.recipient}` : "Dear Family & Friends";
    $("finalMessage").textContent = msgs.english;
    $("finalHindi").textContent = msgs.hindi;
    $("finalMessage").hidden = !msgs.english;
    $("finalHindi").hidden = !msgs.hindi;
    $("finalNote").textContent = g.note ? `“${g.note}”` : "";
    $("finalSender").textContent = g.sender || "Your well-wisher";
    $("greetingModal").classList.add("show");
    $("greetingModal").setAttribute("aria-hidden", "false");
    $("shareStatus").textContent = "";
    burst(window.innerWidth / 2, window.innerHeight * .23, true);
    playChime();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const g = readForm();
    const url = makeShareUrl(g);
    openGreeting(g, url);
  });

  $("closeModal").addEventListener("click", () => {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  });
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
    }
  });

  function shareText(g) {
    const msgs = visibleMessages(g);
    return [
      `${g.title} — ${g.recipient || "Dear Family & Friends"}!`,
      msgs.english,
      msgs.hindi,
      g.note ? `“${g.note}”` : "",
      `With love, ${g.sender || "Your well-wisher"}`,
      "Made with Apno Ki Diwali"
    ].filter(Boolean).join("\n\n");
  }

  $("whatsappShare").addEventListener("click", () => {
    if (!currentGreeting) return;
    const text = `${shareText(currentGreeting)}\n\nOpen your personalised greeting:\n${currentShareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });

  $("copyLink").addEventListener("click", async () => {
    if (!currentShareUrl) return;
    try {
      await navigator.clipboard.writeText(currentShareUrl);
      $("shareStatus").textContent = "Greeting link copied. Share it with your loved ones!";
    } catch (_) {
      const field = document.createElement("textarea");
      field.value = currentShareUrl;
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand("copy");
      field.remove();
      $("shareStatus").textContent = copied ? "Greeting link copied. Share it with your loved ones!" : "Please copy this link from your browser address bar.";
    }
  });

  // A shared link opens directly with the selected names, festival and message style.
  const shared = params.get("wish");
  if (shared) {
    const payload = decodeGreeting(shared);
    if (payload) {
      populateForm(payload);
      const g = readForm();
      currentShareUrl = window.location.href;
      window.addEventListener("load", () => openGreeting(g, currentShareUrl), { once: true });
    }
  } else {
    updatePreview();
  }

  // Small decorative bursts; no continuous heavy animation or external service required.
  setTimeout(() => burst(window.innerWidth * .82, window.innerHeight * .18, false), 900);
  setTimeout(() => burst(window.innerWidth * .15, window.innerHeight * .28, false), 1500);
})();
