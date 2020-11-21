// @ts-nocheck
let grid = [];
let scl = 600 / 28;
function setup() {
  let canv = createCanvas(600, 600);
  canv.parent('canvasContainer');
  background(0);
  for (let i = 0; i < 28; i++) {
    let row = [];
    for (let j = 0; j < 28; j++) {
      row.push(new Cell(floor(i * scl), floor(j * scl)));
    }
    grid.push(row);
  }
}
function draw() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      const cell = grid[i][j];
      if (
        mouseX > cell.x &&
        mouseX < cell.x + scl &&
        mouseY > cell.y &&
        mouseY < cell.y + scl &&
        mouseIsPressed
      ) {
        colourCell(i, j);
      }
    }
  }
  showGrid(grid);
}

function clearGrid() {
  for (let i = 0; i < 28; i++) {
    for (let j = 0; j < 28; j++) {
      grid[i][j].colour = 255;
    }
  }
}
function colourCell(i, j) {
  try {
    grid[i][j].colour = 0;
    grid[i - 1][j - 1].colour -= 120;
    grid[i][j - 1].colour -= 120;
    grid[i + 1][j - 1].colour -= 120;
    grid[i - 1][j].colour -= 120;
    grid[i + 1][j].colour -= 120;
    grid[i - 1][j + 1].colour -= 120;
    grid[i][j + 1].colour -= 120;
    grid[i + 1][j + 1].colour -= 120;
  } catch (error) {}
}
function showGrid(grid) {
  strokeWeight(0.1);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      const cell = grid[i][j];
      fill(cell.colour);
      square(cell.x, cell.y, scl);
    }
  }
}
const Cell = function (x, y) {
  this.x = x;
  this.y = y;
  this.colour = 255;
};

let ctx = document.getElementById('myChart').getContext('2d');
let myChart = new Chart(ctx, {
  type: 'horizontalBar',
  data: {
    labels: [
      'Zero',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
    ],
    datasets: [
      {
        label: '% Confidence',
        data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(4,212,240,0.2)',
          'rgba(253,73,160,0.2)',
          'rgba(29,116,27,0.2)',
          'rgba(65,32,169,0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(4,212,240,1)',
          'rgba(253,73,160,1)',
          'rgba(29,116,27,1 )',
          'rgba(65,32,169,1 )',
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      yAxes: [
        {
          labelString: '% Confidence',
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  },
});

function updateChart(newData) {
  myChart.data.datasets[0].data = newData;
  myChart.update();
}
let norm_grid = [];
async function predict() {
  norm_grid = grid.slice().map((row, i) => {
    return row.map((elem, j) => {
      return Math.abs(255 - elem.colour);
    });
  });

  let data = {
    imageData: norm_grid,
  };

  let res = await fetch('/api/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  perc_data = await res.json();
  perc_data = await perc_data.pred_val;
  updateChart(await perc_data);
}

setInterval(() => {
  predict();
}, 500);
