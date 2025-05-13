// Functie om verbindingen te maken tussen blokken
function connectBlocks() {
  const blocks = document.querySelectorAll(".block");
  const grid = {};

  // Groepeer blokken per kolom
  blocks.forEach((block) => {
    const col = block.style.gridColumn;
    if (!grid[col]) grid[col] = [];
    grid[col].push(block);
  });

  // Teken verticale lijnen binnen dezelfde kolom
  Object.values(grid).forEach((colBlocks) => {
    colBlocks.sort(
      (a, b) => parseInt(a.style.gridRow) - parseInt(b.style.gridRow)
    ); // Sorteer op rij
    for (let i = 0; i < colBlocks.length - 1; i++) {
      const from = getCenterEdge(colBlocks[i], "bottom");
      const to = getCenterEdge(colBlocks[i + 1], "top");
      drawLine(from, to); // Rechte verticale lijn
    }
  });

  // Teken L-vormige pijlen tussen opeenvolgende stappen
  const rows = {};
  blocks.forEach((block) => {
    const row = block.style.gridRow;
    if (!rows[row]) rows[row] = [];
    rows[row].push(block);
  });

  const sortedRows = Object.keys(rows).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );
  for (let i = 0; i < sortedRows.length - 1; i++) {
    const currentRow = rows[sortedRows[i]];
    const nextRow = rows[sortedRows[i + 1]];

    currentRow.forEach((currentBlock) => {
      let closestBlock = null;
      let minDistance = Infinity;

      nextRow.forEach((nextBlock) => {
        const distance = Math.abs(
          getCenter(currentBlock).x - getCenter(nextBlock).x
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestBlock = nextBlock;
        }
      });

      if (closestBlock) {
        const from = getCenterEdge(currentBlock, "right");
        const to = getCenterEdge(closestBlock, "left");
        drawLShapeArrow(from, to); // L-vormige pijl
      }
    });
  }
}

// Functie om het midden van een rand van een element te berekenen
function getCenterEdge(el, edge) {
  const rect = el.getBoundingClientRect();
  switch (edge) {
    case "top":
      return { x: rect.left + rect.width / 2, y: rect.top };
    case "bottom":
      return { x: rect.left + rect.width / 2, y: rect.bottom };
    case "left":
      return { x: rect.left, y: rect.top + rect.height / 2 };
    case "right":
      return { x: rect.right, y: rect.top + rect.height / 2 };
    default:
      return getCenter(el);
  }
}

// Functie om het midden van een element te berekenen
function getCenter(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

// Functie om een rechte lijn te tekenen
function drawLine(from, to) {
  const ns = "http://www.w3.org/2000/svg";
  const line = document.createElementNS(ns, "line");
  line.setAttribute("x1", from.x);
  line.setAttribute("y1", from.y);
  line.setAttribute("x2", to.x);
  line.setAttribute("y2", to.y);
  line.setAttribute("stroke", "black");
  line.setAttribute("stroke-width", "2");
  document.getElementById("connections").appendChild(line);
}

// Functie om een L-vormige pijl te tekenen
function drawLShapeArrow(from, to) {
  const ns = "http://www.w3.org/2000/svg";
  const path = document.createElementNS(ns, "path");

  const midX = (from.x + to.x) / 2; // Horizontale middenlijn
  const d = `M${from.x},${from.y} H${midX} V${to.y} H${to.x}`;
  path.setAttribute("d", d);
  path.setAttribute("stroke", "black");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("marker-end", "url(#arrowhead)");

  document.getElementById("connections").appendChild(path);
}

// Functie om een marker toe te voegen voor pijlen
function addArrowMarker() {
  const ns = "http://www.w3.org/2000/svg";
  const marker = document.createElementNS(ns, "marker");
  marker.setAttribute("id", "arrowhead");
  marker.setAttribute("markerWidth", "10");
  marker.setAttribute("markerHeight", "7");
  marker.setAttribute("refX", "10");
  marker.setAttribute("refY", "3.5");
  marker.setAttribute("orient", "auto");

  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", "M0,0 L10,3.5 L0,7 Z");
  path.setAttribute("fill", "black");

  marker.appendChild(path);
  document.getElementById("connections").appendChild(marker);
}

// Initialiseer de verbindingen
document.addEventListener("DOMContentLoaded", () => {
  addArrowMarker();
  connectBlocks();
});
