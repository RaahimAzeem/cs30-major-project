// CS30 Major Project (Sudoku)
// Muhammad Raahim
// June 14, 2024
//
// Extra for Experts:
// - 

let state = "start screen";
let grid, solvedGrid;
let cols = 9; 
let rows = 9;
let w = 65;
let value = 0;
let mistakes = 0;
let selectedCell = null;
let choice;

// Medium level Sudoku grid
let mediumLevel = [
  [ 3, 0, 6, 5, 0, 8, 4, 0, 0 ],
  [ 5, 2, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 8, 7, 0, 0, 0, 0, 3, 1 ],
  [ 0, 0, 3, 0, 1, 0, 0, 8, 0 ],
  [ 9, 0, 0, 8, 6, 3, 0, 0, 5 ],
  [ 0, 5, 0, 0, 9, 0, 6, 0, 0 ],
  [ 1, 3, 0, 0, 0, 0, 2, 5, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 7, 4 ],
  [ 0, 0, 5, 2, 0, 6, 3, 0, 0 ],
];

let easyLevel = [
  [7, 8, 0, 4, 0, 0, 1, 2, 0],
  [6, 0, 0, 0, 7, 5, 0, 0, 9],
  [0, 0, 0, 6, 0, 1, 0, 7, 8],
  [0, 0, 7, 0, 4, 0, 2, 6, 0],
  [0, 0, 1, 0, 5, 0, 9, 3, 0],
  [9, 0, 4, 0, 6, 0, 0, 0, 5],
  [0, 7, 0, 3, 0, 0, 0, 1, 2],
  [1, 2, 0, 0, 0, 7, 4, 0, 0],
  [0, 4, 9, 2, 0, 6, 0, 0, 7],
];

let hardLevel = [
  [3, 0, 0, 0, 5, 0, 7, 0, 0],
  [0, 5, 0, 0, 1, 0, 3, 0, 6],
  [0, 8, 6, 0, 0, 0, 0, 0, 0],
  [9, 0, 4, 0, 0, 5, 2, 0, 0],
  [2, 0, 0, 3, 7, 0, 0, 0, 5],
  [0, 3, 0, 1, 0, 0, 4, 6, 0],
  [5, 0, 0, 2, 0, 0, 0, 7, 0],
  [0, 0, 0, 0, 0, 0, 9, 0, 3],
  [1, 0, 0, 7, 4, 0, 0, 0, 2],
];
// Defining a class for each cell in the grid
class Cell {
  constructor(y, x, w, value, r, g, b) {
    // initializing cell properties
    this.x = x * w;
    this.y = y * w;
    this.w = w;
    this.value = value;
    this.clicked = false; 
    this.r = r;
    this.g = g;
    this.b = b;
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
      textSize(30);
      fill(this.r, this.g, this.b);
      text(this.value, this.x + this.w / 2, this.y + this.w / 2);
    }

    if (this.clicked && this.value === 0|| this.clicked && this.r !== 0) {
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
  
  highlight() {
    if (this.clicked) {
      fill(200, 200, 255, 150);
      square(this.x, this.y, this.w);
    }
  }
} 

function setup() {
  createCanvas(windowWidth, windowHeight);

  grid = generateGrid(cols, rows);
  solvedGrid = generateGrid(cols, rows);

  choice = hardLevel;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid[y][x] = new Cell(y, x, w, choice[y][x],0,0,0);
      solvedGrid[y][x] = new Cell(y, x, w, choice[y][x],0,0,0);
    }
  }


  solveGrid(solvedGrid);

  
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
  let revealAnswerButton = createButton("Reveal Answer");
  revealAnswerButton.position(width/2, height/2);
  revealAnswerButton.mousePressed(revealAnswer);

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
  text("A r.", 500, 20);
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

function solveGrid(grid, y = 0, x = 0) {
  // Solved the grid as a whole so returns true
  if (y === 9) {
    return true;
    
  }

  // Once it gets to the end of the row, recursively calls back the function but this time moving on to the next row and setting the column back at 0
  if (x === 9) {
    return solveGrid(grid, y + 1, 0);
  }

  // If the block already has a value, skips that cell by recursively calling the function but just adding 1 to the column and move on to the next cell
  if (grid[y][x].value !== 0) {
    return solveGrid(grid, y, x + 1);
  }

  // Looping through the numbers and checking if it's safe to place the number in the cell. If yes, then recursively calling the function to move on to the next cell
  for (let num = 1; num <= 9; num++) {
    if (safeToPlaceNumber(grid, y, x, num)) {
      solvedGrid[y][x].value = num;
      if (solveGrid(grid, y, x + 1)) {
        return true;
      }
      else {
        solvedGrid[y][x].value = 0;
      }
    }
  }

  // If no solution works, return false
  return false;
}

function keyPressed() {
  if (selectedCell && selectedCell.value === 0 || selectedCell && selectedCell.r !== 0) {
    let num = int(key);
    if (num >= 1 && num <= 9) {
      let y = selectedCell.y / w;
      let x = selectedCell.x / w;

      if (num === solvedGrid[y][x].value) {
        selectedCell.r = 0;
        selectedCell.g = 0;
        selectedCell.b = 0;
        selectedCell.value = num;
        selectedCell.clicked = false;
        selectedCell = null;
      }
      
      else {
        selectedCell.r = 255;
        selectedCell.g = 0;
        selectedCell.b = 0;
        selectedCell.value = num;
        selectedCell.clicked = false;
        selectedCell = null;
        
        mistakes++;
        console.log("ERROR! You have made " + mistakes + " mistakes!");
      }
    }
  }
}

function revealAnswer() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid[y][x] = solvedGrid[y][x];
    }
  }
}

function highlightAllOtherCells(grid) {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x].value === selectedCell.value) {
        grid[y][x].highlight();
      }
    }
  }
}