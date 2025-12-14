let allPlayers = [];
let currentPlayers = [];
let round = 1;

/* -------- READ EXCEL -------- */
document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("excelFile");

  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        allPlayers = json.map(row => row.Player);
        alert("Players Loaded: " + allPlayers.length);
      };

      reader.readAsArrayBuffer(file);
    });
  }
});

/* -------- START MATCHMAKING -------- */
function startMatchmaking() {
  const count = parseInt(document.getElementById("playerCount").value);

  if (count % 2 !== 0) {
    alert("Please select an even number of players");
    return;
  }

  currentPlayers = shuffle(allPlayers).slice(0, count);
  round = 1;
  createMatches();
}

/* -------- CREATE MATCHES -------- */
function createMatches() {
  const matchesDiv = document.getElementById("matches");
  const title = document.getElementById("roundTitle");

  matchesDiv.innerHTML = "";
  title.innerText = `Round ${round}`;

  for (let i = 0; i < currentPlayers.length; i += 2) {
    const matchDiv = document.createElement("div");
    matchDiv.className = "match";

    matchDiv.innerHTML = `
      <strong>${currentPlayers[i]}</strong> vs 
      <strong>${currentPlayers[i + 1]}</strong><br>
      <select>
        <option value="">Select Winner</option>
        <option value="${currentPlayers[i]}">${currentPlayers[i]}</option>
        <option value="${currentPlayers[i + 1]}">${currentPlayers[i + 1]}</option>
      </select>
    `;

    matchesDiv.appendChild(matchDiv);
  }
}

/* -------- NEXT ROUND -------- */
function nextRound() {
  const selects = document.querySelectorAll(".match select");
  let winners = [];

  for (let select of selects) {
    if (select.value === "") {
      alert("Please select all winners");
      return;
    }
    winners.push(select.value);
  }

  if (winners.length === 1) {
    document.getElementById("matches").innerHTML =
      `<h2>🏆 Tournament Winner: ${winners[0]}</h2>`;
    document.getElementById("roundTitle").innerText = "";
    return;
  }

  currentPlayers = winners;
  round++;
  createMatches();
}

/* -------- SHUFFLE -------- */
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
