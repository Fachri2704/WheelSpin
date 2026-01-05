      const canvas = document.getElementById("wheel");
      const ctx = canvas.getContext("2d");
      const wheelContainer = document.getElementById("wheelContainer");
      const entriesInput = document.getElementById("entriesInput");
      const totalEntries = document.getElementById("totalEntries");
      const shuffleBtn = document.getElementById("shuffleBtn");
      const clearBtn = document.getElementById("clearBtn");
      const resultPopup = document.getElementById("resultPopup");
      const winnerName = document.getElementById("winnerName");
      const removeWinnerBtn = document.getElementById("removeWinnerBtn");
      const closePopupBtn = document.getElementById("closePopupBtn");
      const btnTabEntries = document.getElementById("btnTabEntries");
      const btnTabResults = document.getElementById("btnTabResults");
      const contentEntries = document.getElementById("contentEntries");
      const contentResults = document.getElementById("contentResults");
      const resultsList = document.getElementById("resultsList");
      const countResults = document.getElementById("countResults");
      const clearResultsBtn = document.getElementById("clearResultsBtn");
const editPopup = document.getElementById('editPopup');
const openEditBtn = document.getElementById('openEditBtn'); // Tombol pensil baru
const cancelEditBtn = document.getElementById('cancelEditBtn');
const saveEditBtn = document.getElementById('saveEditBtn');
const displayTitle = document.getElementById('displayTitle');
const displayDesc = document.getElementById('displayDesc');
const inputTitle = document.getElementById('inputTitle');
const inputDesc = document.getElementById('inputDesc');
const panelToggle = document.getElementById('panelToggle');
const entriesPanel = document.querySelector('.entries-panel');
const labelText = document.querySelector('.label-text');
const sortBtn = document.getElementById("sortBtn");
const defaultNames = ["Gabriel", "Rizky", "Amelia", "Budi", "Siti", "Andi", "Dewi", "Fajar"];
const settingsPopup = document.getElementById('settingsPopup');
const fixedWinnerToggle = document.getElementById('fixedWinnerToggle');
const fixedWinnerArea = document.getElementById('fixedWinnerArea');
const fixedWinnerList = document.getElementById('fixedWinnerList');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const logoH1 = document.querySelector('.logo-area h1');
const spinSettingsPopup = document.getElementById('spinSettingsPopup');
const spinTimeRange = document.getElementById('spinTimeRange');
const spinTimeValue = document.getElementById('spinTimeValue');
const openSpinSettings = document.getElementById('openSpinSettings');
const closeSpinSettings = document.getElementById('closeSpinSettings');
entriesInput.value = defaultNames.join("\n");
// Set default (Panel terlihat di awal)
panelToggle.checked = true;
// 2. Aktifkan Idle Spin saat pertama kali load
wheelContainer.classList.add('slow-spin');
let spinDuration = 10;
let isFixedMode = false;
let currentWinnerStep = 0; // Untuk melacak urutan pemenang ke-berapa

// 1. Klik dua kali logo untuk buka popup
logoH1.addEventListener('dblclick', () => {
  settingsPopup.classList.add('active');
});

// 2. Tutup popup
closeSettingsBtn.addEventListener('click', () => {
  settingsPopup.classList.remove('active');
});

// 3. Toggle ON/OFF
fixedWinnerToggle.addEventListener('change', () => {
  isFixedMode = fixedWinnerToggle.checked;
  if (isFixedMode) {
    fixedWinnerArea.classList.remove('hidden');
    currentWinnerStep = 0; // Reset urutan saat diaktifkan
  } else {
    fixedWinnerArea.classList.add('hidden');
  }
});

// Buka/Tutup Popup
openSpinSettings.addEventListener('click', () => {
  spinSettingsPopup.classList.add('active');
});

closeSpinSettings.addEventListener('click', () => {
  spinSettingsPopup.classList.remove('active');
});

// Update nilai saat slider digeser
spinTimeRange.addEventListener('input', (e) => {
  spinDuration = parseInt(e.target.value);
  spinTimeValue.innerText = spinDuration;
});

panelToggle.addEventListener('change', () => {
  if (panelToggle.checked) {
    entriesPanel.classList.remove('collapsed');
    labelText.textContent = "Hide Panel";
  } else {
    entriesPanel.classList.add('collapsed');
    labelText.textContent = "Show Panel";
  }
  
  // Gunakan requestAnimationFrame atau timeout agar browser sempat 
  // mengatur ulang layout sebelum roda digambar ulang
  requestAnimationFrame(() => {
    setTimeout(drawWheel, 300);
  });
});

      let winnerHistory = [];
      function switchTab(target) {
        if (target === "entries") {
          btnTabEntries.classList.add("active");
          btnTabResults.classList.remove("active");
          contentEntries.classList.remove("hidden");
          contentResults.classList.add("hidden");
        } else {
          btnTabEntries.classList.remove("active");
          btnTabResults.classList.add("active");
          contentEntries.classList.add("hidden");
          contentResults.classList.remove("hidden");
        }
      }

      function sortEntries() {
  const currentEntries = getEntries();
  if (currentEntries.length === 0) return;

  // Mengurutkan secara alfabetis (A-Z)
  // localeCompare memastikan pengurutan yang benar untuk berbagai karakter
  currentEntries.sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));

  // Masukkan kembali ke textarea
  entriesInput.value = currentEntries.join("\n");
  
  // Update tampilan roda
  updateEntryCount();
}

      const colors = [
        "#e74c3c",
        "#3498db",
        "#2ecc71",
        "#f39c12",
        "#9b59b6",
        "#1abc9c",
        "#34495e",
        "#e67e22",
        "#16a085",
        "#c0392b",
        "#8e44ad",
        "#27ae60",
      ];

      openEditBtn.addEventListener('click', () => {
  inputTitle.value = displayTitle.textContent;
  inputDesc.value = displayDesc.textContent;
  editPopup.classList.add('active');
});

cancelEditBtn.addEventListener('click', () => {
  editPopup.classList.remove('active');
});

saveEditBtn.addEventListener('click', () => {
  if (inputTitle.value.trim() !== "") {
    displayTitle.textContent = inputTitle.value;
    displayDesc.textContent = inputDesc.value;
    document.title = inputTitle.value + " - NameSpin";
    editPopup.classList.remove('active');
  } else {
    alert("Judul wajib diisi!");
  }
});

      let entries = [];
      let isSpinning = false;
      let currentRotation = 0;

      function setCanvasSize() {
  const section = document.querySelector('.wheel-section');
  const availableWidth = section.offsetWidth;
  const availableHeight = section.offsetHeight;

  // Di mobile, kita lebih mengutamakan lebar (Width) karena kita bisa scroll ke bawah
  // Di desktop, kita tetap menggunakan Math.min (lebar vs tinggi) agar tidak overflow
  let size;
  if (window.innerWidth <= 768) {
    size = availableWidth - 40; // Margin 40px
  } else {
    size = Math.min(availableWidth, availableHeight) - 60;
  }

  canvas.width = size;
  canvas.height = size;
  
  const wrapper = document.querySelector('.wheel-wrapper');
  wrapper.style.width = size + 'px';
  wrapper.style.height = size + 'px';
}
      function getEntries() {
        const text = entriesInput.value.trim();
        if (!text) return [];
        return text.split("\n").filter((name) => name.trim() !== "");
      }

      function updateEntryCount() {
        entries = getEntries();
        totalEntries.textContent = entries.length;
        drawWheel();
      }

      function drawWheel() {
        setCanvasSize();
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = canvas.width / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (entries.length === 0) {
          ctx.fillStyle = "#ecf0f1";
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.fill();
          return;
        }

        const segmentAngle = (2 * Math.PI) / entries.length;

        entries.forEach((name, index) => {
          const startAngle = index * segmentAngle - Math.PI / 2;
          const endAngle = startAngle + segmentAngle;

          // Draw segment
          ctx.fillStyle = colors[index % colors.length];
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, radius, startAngle, endAngle);
          ctx.closePath();
          ctx.fill();

          // Draw border
          ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(
            centerX + radius * Math.cos(startAngle),
            centerY + radius * Math.sin(startAngle)
          );
          ctx.stroke();

          // Draw text
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(startAngle + segmentAngle / 2);
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "white";
          ctx.font = "bold 16px sans-serif";
          ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
          ctx.shadowBlur = 3;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;

          // Position text at 60% of radius from center
          ctx.fillText(name, radius * 0.6, 0);
          ctx.restore();
        });
      }

  function spinWheel() {
  if (isSpinning || entries.length === 0) return;

  // 1. MATIKAN IDLE SPIN SEBELUM MULAI
  wheelContainer.classList.remove('slow-spin');
  
  // 2. Reset posisi ke 0 agar tidak bentrok
  wheelContainer.style.transition = 'none';
  wheelContainer.style.transform = 'rotate(0deg)';
  currentRotation = 0;

  // Beri jeda sedikit agar browser sadar animasi idle sudah mati
  setTimeout(() => {
    isSpinning = true;
    
    // 3. GUNAKAN DURASI DARI SLIDER (Konversi detik ke milidetik)
    // Variabel spinDuration diambil dari input range settings
    const currentSpinTimeMs = spinDuration * 1000; 
    
    // MinSpins otomatis menyesuaikan: semakin lama waktu, semakin banyak putaran
    const minSpins = Math.max(5, Math.floor(spinDuration * 1.5)); 
    
    let randomWinnerIndex;
    const segmentAngle = 360 / entries.length;

    // 4. LOGIKA PENENTU PEMENANG (Fixed vs Random)
    if (typeof isFixedMode !== 'undefined' && isFixedMode) {
      const listPemenang = fixedWinnerList.value.split('\n').filter(name => name.trim() !== "");
      
      if (listPemenang.length > 0) {
        // Ambil nama berdasarkan urutan (looping)
        const targetName = listPemenang[currentWinnerStep % listPemenang.length].trim();
        
        // Cari indexnya di roda
        const foundIndex = entries.findIndex(name => name.toLowerCase() === targetName.toLowerCase());
        
        if (foundIndex !== -1) {
          randomWinnerIndex = foundIndex;
          currentWinnerStep++; 
        } else {
          randomWinnerIndex = Math.floor(Math.random() * entries.length);
        }
      } else {
        randomWinnerIndex = Math.floor(Math.random() * entries.length);
      }
    } else {
      randomWinnerIndex = Math.floor(Math.random() * entries.length);
    }
    
    // 5. KALKULASI POSISI BERHENTI
    // Tambahkan sedikit offset random agar tidak selalu berhenti tepat di garis tengah segmen
    const padding = segmentAngle * 0.1; 
    const randomOffsetInsideSegment = padding + (Math.random() * (segmentAngle - 2 * padding));
    
    const winnerRandomAngle = (randomWinnerIndex * segmentAngle) + randomOffsetInsideSegment;
    const targetStopAngle = 360 - winnerRandomAngle;

    // Hitung rotasi kumulatif
    const currentFullRotations = Math.ceil(currentRotation / 360);
    currentRotation = (currentFullRotations + minSpins) * 360 + targetStopAngle;

    // 6. JALANKAN ANIMASI (Durasinya Dinamis!)
    wheelContainer.style.transition = `transform ${currentSpinTimeMs}ms cubic-bezier(0.1, 0, 0, 1)`;
    wheelContainer.style.transform = `rotate(${currentRotation}deg)`;

    // 7. TAMPILKAN PEMENANG SETELAH DURASI SELESAI
    setTimeout(() => {
      isSpinning = false;
      const winner = entries[randomWinnerIndex];
      const winnerColor = colors[randomWinnerIndex % colors.length];
      
      if (typeof showWinner === 'function') {
        showWinner(winner, winnerColor);
      } else {
        alert("Pemenangnya adalah: " + winner);
      }
    }, currentSpinTimeMs);
  }, 10); 
}


      function showWinner(winner, winnerColor) {
        winnerName.textContent = winner;
        const popupHeader = document.querySelector(".popup-header");
        popupHeader.style.background = winnerColor;
        resultPopup.classList.add("active");

        addWinnerToHistory(winner, winnerColor);
      }

      function closePopup() {
        resultPopup.classList.remove("active");
      }

      function removeWinner() {
        const winner = winnerName.textContent;
        const currentEntries = getEntries();
        const filteredEntries = currentEntries.filter(
          (name) => name !== winner
        );
        entriesInput.value = filteredEntries.join("\n");
        updateEntryCount();
        closePopup();
      }

      function shuffleEntries() {
        const currentEntries = getEntries();
        for (let i = currentEntries.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [currentEntries[i], currentEntries[j]] = [
            currentEntries[j],
            currentEntries[i],
          ];
        }
        entriesInput.value = currentEntries.join("\n");
        updateEntryCount();
      }

      function clearEntries() {
        entriesInput.value = "";
        updateEntryCount();
      }

      clearResultsBtn.addEventListener("click", () => {
        winnerHistory = [];
        renderResults();
      });

      function addWinnerToHistory(name, color) {
        winnerHistory.unshift({ name, color });
        updateResultsUI();
      }

      function updateResultsUI() {
        countResults.textContent = winnerHistory.length;
        if (winnerHistory.length === 0) {
          resultsList.innerHTML = '<p class="empty-msg">Belum ada pemenang</p>';
          return;
        }

        resultsList.innerHTML = winnerHistory
          .map(
            (item) => `
    <div class="result-item">
      <div class="result-color" style="background: ${item.color}"></div>
      <span>${item.name}</span>
    </div>
  `
          )
          .join("");
      }

      wheelContainer.addEventListener("click", spinWheel);
      entriesInput.addEventListener("input", updateEntryCount);
      shuffleBtn.addEventListener("click", shuffleEntries);
      clearBtn.addEventListener("click", clearEntries);
      closePopupBtn.addEventListener("click", closePopup);
      removeWinnerBtn.addEventListener("click", removeWinner);
      btnTabEntries.addEventListener("click", () => switchTab("entries"));
      btnTabResults.addEventListener("click", () => switchTab("results"));
      sortBtn.addEventListener("click", sortEntries);
      clearResultsBtn.addEventListener("click", () => {
        winnerHistory = [];
        updateResultsUI();
      });

      window.addEventListener("resize", () => {
  drawWheel();
});
   window.addEventListener("load", () => {
  drawWheel();
});   

      updateEntryCount();