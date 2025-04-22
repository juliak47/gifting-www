document.addEventListener("DOMContentLoaded", () => {
    console.log("%cようこそ…霊がここにいます。","color:#f0f; font-size:16px;");


    const bg      = document.getElementById('spooky-bg');
    const playBtn = document.getElementById('play-audio');

    playBtn.addEventListener('click', () => {
    if (bg.paused) {
        bg.play().catch(console.error);
        playBtn.textContent = '🔇 Pause Audio';
    } else {
        bg.pause();
        playBtn.textContent = '🔊 Play Audio';
    }
    });

    const form    = document.getElementById("haiku-form");
    const result  = document.getElementById("result");
    const entries = document.getElementById("entries");
    const ids     = ["l1","l2","l3"];
  
    const loadHaikus = () => JSON.parse(localStorage.getItem("haikus")||"[]");
    const saveHaikus = arr => localStorage.setItem("haikus", JSON.stringify(arr));
  
    function copyText(txt) {
      if (navigator.clipboard?.writeText) {
        return navigator.clipboard.writeText(txt);
      }
      const ta = document.createElement("textarea");
      ta.value = txt; ta.readOnly = true;
      ta.style.position = "absolute"; ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select(); document.execCommand("copy");
      document.body.removeChild(ta);
      return Promise.resolve();
    }
  
    function renderArchive(){
      const all = loadHaikus();
      entries.innerHTML = all.map((lines,i)=>`
        <div class="card" data-index="${i}">
          ${lines.map(l=>`<p>${l}</p>`).join("")}
          <div class="card-actions">
            <button class="copy-btn archive-copy">Copy</button>
          </div>
        </div>
      `).join("");
      document.querySelectorAll(".archive-copy").forEach((btn, idx)=>{
        btn.onclick = () => copyText(all[idx].join(" ")).then(()=> alert("Copied!"));
      });
    }
  
    form.onsubmit = e => {
      e.preventDefault();
      const lines = ids.map(id=>document.getElementById(id).value.trim());
      const all = loadHaikus(); all.unshift(lines); saveHaikus(all);
      renderArchive();
  
      result.innerHTML = `
        <div class="card">
          ${lines.map(l=>`<p>${l}</p>`).join("")}
          <div class="card-actions">
            <button id="copy" class="copy-btn">Copy</button>
            <button id="again">Write Another</button>
          </div>
        </div>`;
      result.classList.remove("hidden");
      form.classList.add("hidden");
  
      document.getElementById("copy").onclick = () =>
        copyText(lines.join(" ")).then(()=>alert("Copied!"));
      document.getElementById("again").onclick = () => {
        form.reset();
        result.classList.add("hidden");
        form.classList.remove("hidden");
      };
    };
  
    renderArchive();
  });
  