// CS30 Major Project (Sudoku)
// Muhammad Raahim
// June 14, 2024
//
// Extra for Experts:
// - 

let state = "start screen";
let easyButton, mediumButton, hardButton;
let grid, solvedGrid;
let cols = 9; 
let rows = 9;
let w = 65;
let r = 0;
let g = 0;
let b = 0;
let value = 0;
let mistakes = 0;

let selectedCell = null;
let choice;
let numberSelected;

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

    if (this.value === numberSelected) {
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

  // eslint-disable-next-line no-undef
  easyButton = new Clickable();
  easyButton.locate(width/2 - 100, height/2);
  easyButton.onPress = easyWasPressed;
  easyButton.resize(200,50);
  easyButton.text = "Easy Level";
  easyButton.textSize = 24;

  // eslint-disable-next-line no-undef
  mediumButton = new Clickable();
  mediumButton.locate(width/2 - 100,height/2 + 100);
  mediumButton.onPress = mediumWasPressed;
  mediumButton.resize(200,50);
  mediumButton.text = "Medium Level";
  mediumButton.textSize = 24;

  // eslint-disable-next-line no-undef
  hardButton = new Clickable();
  hardButton.locate(width/2 - 100,height/2 + 200);
  hardButton.onPress = hardWasPressed;
  hardButton.resize(200,50);
  hardButton.text = "Hard Level";
  hardButton.textSize = 24;


  grid = generateGrid(cols, rows);
  solvedGrid = generateGrid(cols, rows);

  choice = mediumLevel;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid[y][x] = new Cell(y, x, w, choice[y][x],r,g,b);
      solvedGrid[y][x] = new Cell(y, x, w, choice[y][x],r,g,b);
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
    easyButton.draw();
    mediumButton.draw();
    hardButton.draw();
  } 
  else if (state === "game screen") {
    gameScreen();
  }
}

function easyWasPressed() {
  state = "game screen";
  choice = easyLevel;
}

function mediumWasPressed() {
  state = "game screen";
  choice = mediumLevel;
}

function hardWasPressed() {
  state = "game screen";
  choice = hardLevel;
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
  text("Sudoku", width / 2, height / 2 - 80);
  textSize(24);
  text("Click the square to start", width / 2, height / 2 - 40);
}

function mousePressed() {
  if (state === "game screen") {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y][x].cellClicked(mouseX,mouseY)) {
          if (selectedCell) {
            selectedCell.clicked = false;
          }
          grid[y][x].update();
          selectedCell = grid[y][x];
          numberSelected = null;

          if (selectedCell.value !== 0) {
            numberSelected = selectedCell.value;
          }
        }
      }
    }
  }
}

function solveGrid(grid, y = 0, x = 0) {
  // Solved the grid as a whole so returns true (Base Case)
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
        numberSelected = null;

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
