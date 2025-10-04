// ===== Meteoros Interativos =====
const meteorContainer = document.getElementById('meteor-container');
const meteors = [];
const meteorCount = 50; // mais meteoros
let mouse = { x: -100, y: -100 };

for (let i = 0; i < meteorCount; i++) {
  const div = document.createElement('div');
  div.classList.add('meteor');
  meteorContainer.appendChild(div); // dentro do container
  meteors.push({
    el: div,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    speed: 1 + Math.random() * 2,
    dx: Math.random() * 1 - 0.5
  });
}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function animateMeteors() {
  meteors.forEach(m => {
    // Desvio do cursor
    const dx = m.x - mouse.x;
    const dy = m.y - mouse.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if(dist < 100){
      const angle = Math.atan2(dy, dx);
      m.x += Math.cos(angle) * 3;
      m.y += Math.sin(angle) * 3;
    }

    // Movimento natural
    m.y += m.speed;
    m.x += m.dx;

    if(m.y > window.innerHeight) {
      m.y = -10;
      m.x = Math.random() * window.innerWidth;
    }
    if(m.x > window.innerWidth) m.x = 0;
    if(m.x < 0) m.x = window.innerWidth;

    m.el.style.transform = `translate(${m.x}px, ${m.y}px)`;
  });
  requestAnimationFrame(animateMeteors);
}

animateMeteors();

// ===== Wikipedia Search =====
const LANG_NAMES = { pt:"Português", en:"Inglês", es:"Espanhol", fr:"Francês"};
const articleEl = document.getElementById("article");
document.getElementById("search-btn").addEventListener("click", searchArticle);

async function fetchFullContent(topic, lang){
  const cleanInput = encodeURIComponent(topic.trim().replace(/\s+/g, '_'));
  try {
    const summaryRes = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${cleanInput}`);
    if(!summaryRes.ok) throw new Error("Artigo não encontrado");
    const summary = await summaryRes.json();
    let allTexts = [];
    if(summary.extract) allTexts.push(summary.extract);
    return { title: summary.title, content: allTexts.join("\n\n"), lang };
  } catch(e){
    return { title: topic, content: `❌ Não foi possível encontrar "${topic}" na Wikipedia em ${LANG_NAMES[lang]}.`, lang };
  }
}

async function searchArticle(){
  const topic = document.getElementById("topic-input").value;
  const lang = document.getElementById("lang-select").value;
  if(!topic.trim()) return;

  articleEl.innerHTML = "<p>🔎 Buscando...</p>";
  articleEl.classList.remove('hidden');

  const result = await fetchFullContent(topic, lang);
  articleEl.innerHTML = `<h2>${result.title}</h2><p>${result.content}</p>`;
}

// ===== Alternância de Tema =====
const themeBtn = document.getElementById("theme-toggle");
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
