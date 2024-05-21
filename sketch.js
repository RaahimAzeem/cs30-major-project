// CS30 Major Project (Sudoku)
// Muhammad Raahim
// June 14, 2024
//
// Extra for Experts:
// - 

let state = "start screen";
let grid;
let cols = 9; 
let rows = 9;
let w = 50;
let value = 0;
let mistakes = 0;
let selectedCell = null;

// Easy level Sudoku grid
let easyLevel = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

// Defining a class for each cell in the grid
class Cell {
  constructor(y, x, w, value) {
    // initializing cell properties
    this.x = x * w;
    this.y = y * w;
    this.w = w;
    this.value = value;
    this.clicked = false; 
  }
  
  // Function to display the cell
  show() {
    // Cell Borders
    strokeWeight(2);
    noFill();
    square(this.x, this.y, this.w);
    

    // Display number if cell has a value
    if (this.value !== 0) {
      textAlign(CENTER, CENTER);
      textSize(20);
      fill(0);
      text(this.value, this.x + this.w / 2, this.y + this.w / 2);
    }

    if (this.clicked && this.value === 0) {
      fill(200, 200, 255, 150);
      square(this.x, this.y, this.w);
    }
  }

  cellClicked(x, y) {
    return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w;
  }
  
  update() {
    this.clicked = !this.clicked;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  grid = generateGrid(cols, rows);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid[y][x] = new Cell(y, x, w, easyLevel[y][x]);
    }
  }
}

// Function to generate game grid with a specified number of rows and columns
function generateGrid(cols, rows) {
  let emptyArray = new Array(rows);
  for (let i = 0; i < emptyArray.length; i++) {
    emptyArray[i] = new Array(cols);
  }

  return emptyArray;
}

function draw() {
  determineState();
}

function determineState() {
  if (state === "start screen") {
    startScreen();
  } 
  else if (state === "game screen") {
    gameScreen();
  }
}

function gameScreen() {
  background(255);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid[y][x].show();
      // Outlining the grid so it looks like a sudoku grid
      if (y === 0 && (x === 3 || x === 6 )) {
        strokeWeight(5);
        line(x * w, y * w, x * w, cols * w);
      }
      if (x === 0 && (y === 3 || y === 6)) {
        strokeWeight(5);
        line(x * w, y * w, rows * w, y * w);
      }
    }
  }

  // instructions();
}

function safeToPlaceNumber(grid, y, x, num) {
  // Check the row for the number
  for (let x = 0; x < cols; x++) {
    if (grid[y][x].value === num) {
      return false;
    }
  }

  // Check the column for the number
  for (let y = 0; y < rows; y++) {
    if (grid[y][x].value === num) {
      return false;
    }
  }

  // Identify the top-left corner of the 3x3 subgrid
  let startRow = Math.floor(y / 3) * 3;
  let startCol = Math.floor(x / 3) * 3;

  // Check the 3x3 subgrid for the number
  for (let y = startRow; y < startRow + 3; y++) {
    for (let x = startCol; x < startCol + 3; x++) {
      if (grid[y][x].value === num) {
        return false;
      }
    }
  }

  // If the number is not found in the row, column, or subgrid, it's safe to place
  return true;
}



function instructions() {
  fill(0);
  textSize(20);
  text("A 9x9 square must be filled in with numbers from 1-9 with no repeated numbers in each line, horizontally or vertically. To challenge you more, there are 3x3 squares marked out in the grid, and each of these squares can’t have any repeat numbers either.", 500, 20);
}

function startScreen() {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("Sudoku", width / 2, height / 2 - 60);
  textSize(24);
  text("Click the square to start", width / 2, height / 2 - 20);
  square(width / 2 - 50, height / 2, 100);
}

function mousePressed() {
  if (state === "start screen" && mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 && mouseY < height / 2 + 100) {
    state = "game screen";
  }

  if (state === "game screen") {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y][x].cellClicked(mouseX,mouseY)) {
          if (selectedCell) {
            selectedCell.clicked = false;
          }
          grid[y][x].update();
          selectedCell = grid[y][x];
          
        }
      }
    }
  }
}

function keyPressed() {
  if (selectedCell && selectedCell.value === 0 && state === "game screen") {
    let num = int(key);
    if (num >= 1 && num <= 9) {
      let y = selectedCell.y / w;
      let x = selectedCell.x / w;
      if (safeToPlaceNumber(grid, y, x, num)) {
        selectedCell.value = num;
        selectedCell.clicked = false;
        selectedCell = null;
      }
    }
    else if (!safeToPlaceNumber) {
      mistakes++;
      console.log("Mistakes:" + mistakes);
    }
  }
}