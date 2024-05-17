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

// Defining a class for each cell in the grid
class Cell {
  constructor(y, x, w) {
    // initializing cell properties
    this.x = x * w;
    this.y = y * w;
    this.w = w;
  }
  
  // Function to display the cell
  show() {
    // Cell Borders
    strokeWeight(1);
    noFill();
    square(this.x, this.y, this.w);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  grid = generateGrid(cols, rows);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid[y][x] = new Cell(y, x, w);

    }
  }
}

// Function to generate game grid with a specified number of rows and columns
function generateGrid(cols, rows) {

  // Create an array with the specified number of rows
  let emptyArray = new Array(rows);

  // Loop through each row in the array
  for (let i = 0; i < emptyArray.length; i++) {

    // Initialize each row as an array with the specified number of columns
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

  // Initially, displays the each cell in the grid
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid[y][x].show();
      // Outlining the grid so it looks like a sudoku grid
      if (y === 0 && (x === 3 || x === 6 )) {
        strokeWeight(5);
        line(x * w,y * w,x * w, cols * w);
      }
      else if (x === 0 && (y === 3 || y === 6)) {
        strokeWeight(5);
        line(x * w,y * w, rows * w,y * w);
      }
    }
  }

  instructions();
}


function safeToPlaceNumber() {
  
}

function instructions() {
  fill(0);
  textSize(20);
  text("A 9x9 square must be filled in with numbers from 1-9 with no repeated numbers in each line, horizontally or vertically. To challenge you more, there are 3x3 squares marked out in the grid, and each of these squares can’t have any repeat numbers either. ", 500, 20);
}
function startScreen() {
  background(0);
  square(width/2, height/2, 100);

}

function mousePressed() {
  // Checking to see if the user has clicked on the square on the start screen
  if (mouseX > width/2 && mouseX < width/2 + 100 && mouseY > height/2 && mouseY < height/2 + 100){
    state = "game screen";
  }
  
}
