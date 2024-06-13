// CS30 Major Project (Sudoku)
// Muhammad Raahim
// June 14, 2024
// 
// Citations: 
// https://masteringsudoku.com/sudoku-rules-beginners/
// Extra for Experts:
// - 

let state = "start screen";
let counter = 0;
let easyButton, mediumButton, hardButton, homeButton, revealAnswerButton, clearButton;
let grid, solvedGrid;
let cols = 9; 
let rows = 9;
let w = 65;
let r = 0;
let g = 0;
let b = 0;
let value = 0;
let mistakes = 0;
let levelDifficulty = "";
let levelCompleted = false;
let gameLost = false;

let selectedCell = null;
let numberSelected;
let clearedGrid;
let numberRow;

let canvasPosition;

// Easy Level Sudoku Grid
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
  [3, 0, 6, 5, 0, 8, 4, 0, 0],
  [5, 2, 0, 0, 0, 0, 0, 0, 0],
  [0, 8, 7, 0, 0, 0, 0, 3, 1],
  [0, 0, 3, 0, 1, 0, 0, 8, 0],
  [9, 0, 0, 8, 6, 3, 0, 0, 5],
  [0, 5, 0, 0, 9, 0, 6, 0, 0],
  [1, 3, 0, 0, 0, 0, 2, 5, 0],
  [0, 0, 0, 0, 0, 0, 0, 7, 4],
  [0, 0, 5, 2, 0, 6, 3, 0, 0],
];

// Hard level Sudoku grid
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

    // Highlight cell if clicked or if it contains the selected number
    if (this.clicked && this.value === 0 || this.clicked && this.r !== 0) {
      fill(200, 200, 255, 150);
      square(this.x, this.y, this.w);
    }

    if (this.value === numberSelected) {
      fill(200, 200, 255, 150);
      square(this.x, this.y, this.w);
    }
  }

  // Check if the cell is clicked
  cellClicked(x, y) {
    return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w;
  }
  
  // Toggle the clicked state of the cell
  update() {
    this.clicked = !this.clicked;
  }
  
}

function setup() {
  createCanvas(1000, windowHeight);
  buttons();
}

function buttons() { 
  // Creating buttons for levels, reveal answer, home and clear answer.
  // eslint-disable-next-line no-undef
  easyButton = new Clickable();
  easyButton.locate(width / 2 - 100, height/2);
  easyButton.onPress = function(){
    levelDifficulty = "easy";
    state = "game screen";
    initializeGrids(easyLevel);
  };
  easyButton.resize(200,50);
  easyButton.text = "Easy Level";
  easyButton.textSize = 24;

  // eslint-disable-next-line no-undef
  mediumButton = new Clickable();
  mediumButton.locate(width / 2 - 100,height/2 + 100);
  mediumButton.onPress = function(){
    state = "game screen";
    levelDifficulty = "medium";
    initializeGrids(mediumLevel);
  };
  mediumButton.resize(200,50);
  mediumButton.text = "Medium Level";
  mediumButton.textSize = 24;

  // eslint-disable-next-line no-undef
  hardButton = new Clickable();
  hardButton.locate(width / 2 - 100,height/2 + 200);
  hardButton.onPress = function(){
    state = "game screen";
    levelDifficulty = "hard";
    initializeGrids(hardLevel);
  };
  hardButton.resize(200,50);
  hardButton.text = "Hard Level";
  hardButton.textSize = 24;

  // eslint-disable-next-line no-undef
  homeButton = new Clickable();
  homeButton.locate(2,600);
  homeButton.onPress = function(){
    state = "start screen";
    numberSelected = null;
    gameLost = false;
    levelCompleted = false; 
  };
  homeButton.resize(180,50);
  homeButton.text = "Home";
  homeButton.textSize = 24;
  
  // eslint-disable-next-line no-undef
  revealAnswerButton = new Clickable();
  revealAnswerButton.locate(202,600);
  revealAnswerButton.onPress = revealAnswer;
  revealAnswerButton.resize(180,50);
  revealAnswerButton.text = "Reveal Answer";
  revealAnswerButton.textSize = 24;

  // eslint-disable-next-line no-undef
  clearButton = new Clickable();
  clearButton.locate(402,600);
  clearButton.onPress = clearAnswer;
  clearButton.resize(180,50);
  clearButton.text = "Clear ";
  clearButton.textSize = 24;
}

// Initialize grids based on the selected difficulty level
function initializeGrids(level) {
  grid = generateGrid(cols, rows);
  solvedGrid = generateGrid(cols, rows);
  clearedGrid = generateGrid(cols, rows);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid[y][x] = new Cell(y, x, w, level[y][x],r,g,b);
      solvedGrid[y][x] = new Cell(y, x, w, level[y][x],r,g,b);
      clearedGrid[y][x] = new Cell(y, x, w, level[y][x],r,g,b);
    }
  }
  
  // Solve the grid for checking answers
  solveGrid(solvedGrid);
}

// Generate game grid with a specified number of rows and columns
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
  homeButton.draw();
  revealAnswerButton.draw();
  clearButton.draw();

  // Display the Sudoku grid
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
  
  instructions();
  text("Mistakes: " + mistakes, cols * w + 20, rows * w - 10);

  // If all cells match, print the message
  if (levelCompleted) {
    fill(0);
    textSize(28);
    textAlign(LEFT);
    text("LEVEL COMPLETED!", cols * w + 20, height/2 - 85);
  }
  
  // Check if the game is lost and display message accordingly
  if (mistakes > 5) {
    gameLost = true;
    fill(0);
    textSize(28);
    textAlign(LEFT);
    text("GAME LOST!", cols * w + 20, height/2 - 85);
    text("Click Home to try again.", cols * w + 20, height/2 - 45);
  }
}

// Function to check if it's safe to place a number in a cell
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

// Function to display instructions on the game screen
function instructions() {
  fill(0);
  textSize(28);
  textAlign(LEFT);
  text("Instructions:", cols * w + 20, 20);
  text("1. Place in numbers using the", cols * w + 20, 60);
  text("keyboard in the empty cells", cols * w + 50, 100);
  text("2. Each row, column and 3x3 box", cols * w + 20, 140);
  text("must contain numbers 1-9 once.", cols * w + 50, 180);
  text("3. You can use backspace to", cols * w + 20, 220);
  text("remove the number.", cols * w + 50, 260);
}

// Function to display the start screen
function startScreen() {
  background(0);
  easyButton.draw();
  mediumButton.draw();
  hardButton.draw();
  mistakes = 0;

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(72);
  text("Sudoku",width / 2, height / 2 - 80);
}

// Function for Mouse Activity
function mousePressed() {
  // Prevent user interaction with the grid if game is lost
  if (gameLost) {
    return;
  }

  // Check if mouse click occurred on the game screen
  if (state === "game screen") {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y][x].cellClicked(mouseX,mouseY)) {
          // Update selected cell
          if (selectedCell) {
            selectedCell.clicked = false;
          }
          grid[y][x].update();
          selectedCell = grid[y][x];
          numberSelected = null;

          // Assigning the numberSelected variable with the cell clicked to make sure all the other occurences of the same number are highlighted
          if (selectedCell.value !== 0) {
            numberSelected = selectedCell.value;
          }
        }
      }
    }
  }
}

// Function for recursively solving the grid
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

// Function for Keyboard Activity
function keyPressed() {
  // Check if selected cell is empty or highlighted. Allows user to change their wrong answers as well.
  if (selectedCell && selectedCell.value === 0 || selectedCell && selectedCell.r !== 0) {
    let num = int(key);

    // Check if input is a valid number
    if (num >= 1 && num <= 9) {
      let y = selectedCell.y / w;
      let x = selectedCell.x / w;

      // Validate input against solved grid
      if (num === solvedGrid[y][x].value) {
        // Update cell properties for correct input
        selectedCell.r = 0;
        selectedCell.g = 0;
        selectedCell.b = 0;
        selectedCell.value = num;
        selectedCell.clicked = false;
        selectedCell = null;
        numberSelected = null;

      }
      
      else {
        // Update cell properties for incorrect input
        selectedCell.r = 255;
        selectedCell.g = 0;
        selectedCell.b = 0;
        selectedCell.value = num;
        selectedCell.clicked = false;
        selectedCell = null;
        
        mistakes++;
      }

      // Check for game win after each number is added to the grid by the user. 
      gameWin();
    }
  }
  
  // Allows user to use backspace to remove their inaccurate number from a cell.
  if (selectedCell && selectedCell.value !== 0 && keyCode === BACKSPACE && selectedCell.r !== 0) {
    selectedCell.value = 0;
    selectedCell.clicked = false;
    selectedCell = null;
    numberSelected = null;
  }
}

// Function for Reveal Answer Button
function revealAnswer() {
  // Only reveal answer if game is not lost
  if (gameLost === false) { 
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        grid[y][x].value = solvedGrid[y][x].value;
        grid[y][x].r = solvedGrid[y][x].r;
        grid[y][x].g = solvedGrid[y][x].g;
        grid[y][x].b = solvedGrid[y][x].b;
      }
    }
  }

  // Update game state and check for win condition
  gameWin();
}

// Function for Clear Button
function clearAnswer() {
  // Reset level completion status
  levelCompleted = false;

  if (gameLost === false) { 
    // Only clear answer if game is not lost
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        grid[y][x].value = clearedGrid[y][x].value;
        grid[y][x].r = clearedGrid[y][x].r;
        grid[y][x].g = clearedGrid[y][x].g;
        grid[y][x].b = clearedGrid[y][x].b;
        
      }
    }
  }
}

// Function to display Game Win Message
function gameWin() {
  // Initialize a variable to track if the game is completed
  let isCompleted = true;

  // Check if every cell in the grid matches the corresponding cell in the solved grid
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x].value !== solvedGrid[y][x].value) {
        isCompleted = false;

        // Exit the inner loop since there's no need to continue checking
        break;
      }
    }

    // If the completion variable is false, exit the outer loop as well
    if (!isCompleted) {
      break;
    }
  }

  // If all cells match, update the variable to display the message
  if (isCompleted) {
    levelCompleted = true;
  }
}
