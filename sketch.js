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
  constructor(i, j, w) {
    // initializing cell properties
    this.i = i;
    this.j = j;
    this.x = i * w;
    this.y = j * w;
    this.w = w;
  }
  
  // Function to display the cell
  show() {
    // Cell Borders
    stroke(0);
    noFill();
    square(this.x, this.y, this.w);
  }

  // Method to check if a given point is within the cell
  cellContains(x, y) {
    return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w;
  }

  // Function to reveal the cell
  reveal() {
    this.revealed = true;
  }
}




function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Calculate the number of columns and rows based on the canvas size and cell width. Generate the game grid as well
  // cols = Math.floor(width / w);
  // rows = Math.floor(height / w);
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
    }
  }
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
