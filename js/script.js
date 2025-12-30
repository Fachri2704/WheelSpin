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
entriesInput.value = defaultNames.join("\n");
// Set default (Panel terlihat di awal)
panelToggle.checked = true;
// 2. Aktifkan Idle Spin saat pertama kali load
wheelContainer.classList.add('slow-spin');

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
        const size = wheelContainer.offsetWidth;
        canvas.width = size;
        canvas.height = size;
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

  // MATIKAN IDLE SPIN SEBELUM MULAI
  wheelContainer.classList.remove('slow-spin');
  
  // Reset posisi ke 0 sebentar agar transisi JS tidak bentrok dengan sisa posisi CSS Animation
  // Ini mencegah roda "melompat" saat diklik
  wheelContainer.style.transition = 'none';
  wheelContainer.style.transform = 'rotate(0deg)';
  currentRotation = 0;

  // Beri jeda sedikit (10ms) agar browser sadar animasi idle sudah mati
  setTimeout(() => {
    isSpinning = true;
    
    const spinDuration = 4000; 
    const minSpins = 12; 
    
    const randomWinnerIndex = Math.floor(Math.random() * entries.length);
    const segmentAngle = 360 / entries.length;
    
    // Posisi random agar deg-degan
    const padding = segmentAngle * 0.05; 
    const randomOffsetInsideSegment = padding + (Math.random() * (segmentAngle - 2 * padding));
    
    const winnerRandomAngle = (randomWinnerIndex * segmentAngle) + randomOffsetInsideSegment;
    const targetStopAngle = 360 - winnerRandomAngle;

    const currentFullRotations = Math.ceil(currentRotation / 360);
    currentRotation = (currentFullRotations + minSpins) * 360 + targetStopAngle;

    // Jalankan Animasi Kencang
    wheelContainer.style.transition = `transform ${spinDuration}ms cubic-bezier(0.1, 0, 0, 1)`;
    wheelContainer.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
      isSpinning = false;
      const winner = entries[randomWinnerIndex];
      const winnerColor = colors[randomWinnerIndex % colors.length];
      showWinner(winner, winnerColor);
    }, spinDuration);
  }, 10); // Jeda kecil
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
      

      updateEntryCount();