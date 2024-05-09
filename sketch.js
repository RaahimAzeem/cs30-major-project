// CS30 Major Project (Sudoku)
// Muhammad Raahim
// June 14, 2024
//
// Extra for Experts:
// - 

let state = "start screen";
let grid;

function setup() {
  createCanvas(windowWidth, windowHeight);
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
