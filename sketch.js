// CS30 Major Project (Sudoku)
// Muhammad Raahim
// June 14, 2024
// 
// Citations: 
// https://masteringsudoku.com/sudoku-rules-beginners/
// Extra for Experts:
// - Recursion to solve sudoku levels.


let easyButton, mediumButton, hardButton, homeButton, revealAnswerButton, clearButton;
let grid, solvedGrid, clearedGrid, numberRow;

let state = "start screen";
let cols = 9; 
let rows = 9;
let w = 75;
let r = 0;
let g = 0;
let b = 0;

let mistakes = 0;
let levelDifficulty = "";
let levelCompleted = false;
let gameLost = false;

let selectedCell = null;
let numberSelected;
let selectedCellFromNumberRow = null;
let numberSelectedFromNumberRow;

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

// Number Row Grid
let numberRowSelect = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
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
    
    // Highlight cell if clicked or if it contains the selected number
    if (this.clicked && this.value === 0 || this.clicked && this.r !== 0) {
      fill(0, 153, 153, 150);
      square(this.x, this.y, this.w);
    }

    if (this.value === numberSelected) {
      fill(0, 153, 153, 150);
      square(this.x, this.y, this.w);
    }

    // Display number if cell has a value
    if (this.value !== 0) {
      textAlign(CENTER, CENTER);
      textSize(30);
      fill(this.r, this.g, this.b);
      text(this.value, this.x + this.w / 2, this.y + this.w / 2);
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

// Defining a class for each cell in the Number Row grid
class CellForNumberGrid {
  constructor(y, x, w, value) {
    // Initializing cell properties
    this.x = x;
    this.y = y;
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
      textSize(30);
      fill(0);
      text(this.value, this.x + this.w / 2, this.y + this.w / 2);
    }

    if (this.clicked) {
      fill(0, 153, 153, 150);
      square(this.x, this.y, this.w);
      fill(0);
      text(this.value, this.x + this.w / 2, this.y + this.w / 2);
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
  createCanvas(1250, windowHeight);
  buttons();
  numberGrid();
}

function numberGrid() {
  let startX = 10 * w + 110;  // Start position for the number row grid
  let startY = 4.7 * w;  // Start position for the y-axis

  numberRow = generateNumberGrid();

  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      numberRow[y][x] = new CellForNumberGrid(startY + y * w, startX + x * w,  w, numberRowSelect[y][x]);
    }
  }
}

function buttons() { 
  // Creating buttons for levels, reveal answer, home and clear answer.
  // eslint-disable-next-line no-undef
  easyButton = new Clickable();
  easyButton.locate(width / 2 - 130, height/2);
  easyButton.onPress = function(){
    levelDifficulty = "easy";
    state = "game screen";
    initializeGrids(easyLevel);
  };
  easyButton.resize(250,75);
  easyButton.text = "Easy Level";
  easyButton.textSize = 30;

  // eslint-disable-next-line no-undef
  mediumButton = new Clickable();
  mediumButton.locate(width / 2 - 130,height/2 + 100);
  mediumButton.onPress = function(){
    state = "game screen";
    levelDifficulty = "medium";
    initializeGrids(mediumLevel);
  };
  mediumButton.resize(250,75);
  mediumButton.text = "Medium Level";
  mediumButton.textSize = 30;

  // eslint-disable-next-line no-undef
  hardButton = new Clickable();
  hardButton.locate(width / 2 - 130,height/2 + 200);
  hardButton.onPress = function(){
    state = "game screen";
    levelDifficulty = "hard";
    initializeGrids(hardLevel);
  };
  hardButton.resize(250,75);
  hardButton.text = "Hard Level";
  hardButton.textSize = 30;

  // eslint-disable-next-line no-undef
  homeButton = new Clickable();
  homeButton.locate(2,10.5 * w);
  homeButton.onPress = function(){
    state = "start screen";
    numberSelected = null;
    gameLost = false;
    levelCompleted = false; 
  };
  homeButton.resize(220,75);
  homeButton.text = "Home";
  homeButton.textSize = 28;
  
  // eslint-disable-next-line no-undef
  revealAnswerButton = new Clickable();
  revealAnswerButton.locate(230,10.5 * w);
  revealAnswerButton.onPress = revealAnswer;
  revealAnswerButton.resize(220,75);
  revealAnswerButton.text = "Reveal Answer";
  revealAnswerButton.textSize = 28;

  // eslint-disable-next-line no-undef
  clearButton = new Clickable();
  clearButton.locate(458,10.5 * w);
  clearButton.onPress = clearAnswer;
  clearButton.resize(220,75);
  clearButton.text = "Clear";
  clearButton.textSize = 28;
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

function generateNumberGrid() {
  let emptyArray = new Array(3);
  for (let i = 0; i < emptyArray.length; i++) {
    emptyArray[i] = new Array(3);
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
  background(204, 229, 255);
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

  // Display the number selection grid
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      numberRow[y][x].show();
    }
  }

  instructions();
  text("Mistakes: " + mistakes + "/6", 0, rows * w + 30);

  // If all cells match, print the message
  gameWinMessage();
  
  // Check if the game is lost and display message accordingly
  gameLostMessage();
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
  textSize(25);
  textAlign(LEFT);
  text("Instructions:", cols * w + 20, 20);
  text("1. Each row, column and 3x3 box must", cols * w + 20, 60);
  text("contain the numbers 1-9 once each.", cols * w + 55, 100);
  text("2. Enter numbers, using the keyboard or", cols * w + 20, 140);
  text("number grid below, in the empty cells.", cols * w + 55, 180);
  text("3. You can use backspace to remove the", cols * w + 20, 220);
  text("number.", cols * w + 55, 260);
  
  textSize(30);
  text("Number Grid", cols * w + 200, 330);
}

// Function to display the start screen
function startScreen() {
  background(204, 229, 255);
  easyButton.draw();
  mediumButton.draw();
  hardButton.draw();
  mistakes = 0;

  fill(0);
  textAlign(CENTER, CENTER);
  textSize(92);
  textFont("Verdana");
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

    // Clicking a cell from the Number Grid
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (numberRow[y][x].cellClicked(mouseX,mouseY)) {
          // Update selected cell
          if (selectedCellFromNumberRow) {
            selectedCellFromNumberRow.clicked = false;
          }
          numberRow[y][x].update();
          selectedCellFromNumberRow = numberRow[y][x];
          numberSelectedFromNumberRow = numberRow[y][x].value;
          selectedCell.clicked = false;
          selectedCell = null;
          numberSelected = null;
        }
      }
    }
    
    // Clicking a Cell from Sudoku Grid
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

          if ((selectedCell.value === 0 || selectedCell.r !== 0) && numberSelectedFromNumberRow !== null) {
            // Validate input against solved grid
            if (numberSelectedFromNumberRow === solvedGrid[y][x].value) {
              // Update cell properties for correct input
              selectedCell.r = 0;
              selectedCell.g = 0;
              selectedCell.b = 0;
              selectedCell.value = numberSelectedFromNumberRow;
              numberSelectedFromNumberRow = null;
              selectedCellFromNumberRow.clicked = false;
              selectedCell.clicked = false;
              selectedCell = null;
              numberSelected = null;

            }
      
            else {
              // Update cell properties for incorrect input
              selectedCell.r = 255;
              selectedCell.g = 0;
              selectedCell.b = 0;
              selectedCell.value = numberSelectedFromNumberRow;
              numberSelectedFromNumberRow = null;
              selectedCellFromNumberRow.clicked = false;
              selectedCell.clicked = false;
              selectedCell = null;
              numberSelected = null;
              mistakes++;
            }
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

function gameWinMessage() {
  if (levelCompleted) {
    fill(0);
    textSize(35);
    textAlign(LEFT);
    text("LEVEL COMPLETED!", 2.1 * w, rows * w + 80);
  }
}

function gameLostMessage() {
  // Check if the game is lost and display message accordingly
  if (mistakes > 5) {
    gameLost = true;
    
    fill(0);
    textSize(28);
    textAlign(LEFT);
    text("GAME LOST! Click Home to try again.", 1.2 * w, rows * w + 75);
    // text("Click Home to try again.", cols * w + 20, height/2 - 45);
  }
}