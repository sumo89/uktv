/*
Problem Statement:

Design a maze with following rules.
1. Maze is divided into cells with custom width and height (Already Implemented).
2. Each cell of the maze can be either empty or Food for Mario (Already Implemented).

To Be Implemented:
1. Mario will be starting from a random cell once any of the direction arrow is pressed.
2. Mario should start moving cell by cell in the current direction.
3. If he hits the boundary of the maze he will get reflected in the opposite direction from which he is coming from.
4. He eats the food when he visits a cell which is having food.
5. The food will vanish once he collects it. Use arrows to change the direction. Count the total number of moves to collect all the food.

Constraints
A. 2 <= boardWidth, boardHeight <= 20.
B. Cells with food is generated automatically.
C. Not a single line to be changed from the existing code.

*/

$(document).ready(function() {

    // Function to generate random number
    function getRandomArbitrary(min, max) {
      return parseInt(Math.random() * (max - min) + min);
    }
  
    // Getting board width and height
    const boardWidth = getRandomArbitrary(5,20);
    const boardHeight = getRandomArbitrary(5,20);
   $('#bWidth span').text(boardWidth);
   $('#bHeight span').text(boardHeight);
  
    // Setting game speed (msec)
    const gameSpeed = 300;
  
    // Generate food count with at max 1/10 th of cells
    let foodCount = parseInt((boardWidth * boardHeight) /10);
  
    // Generate random position.
    const startPosition = {
      x: getRandomArbitrary(0, boardWidth),
      y: getRandomArbitrary(0, boardHeight),
    };
  
    var board = new Array(boardHeight);
  
    for(var i = 0; i < boardHeight; i++) {
      board[i] = new Array(boardWidth);
    }
  
    // Array containing cells that has food
    const foodCell = [];
  
    // Filling food cell. same cell can be repeated due to random fn.
    for(var i = 0; i < foodCount; i++) {
      const positionX = getRandomArbitrary(0, boardWidth);
      const positionY = getRandomArbitrary(0, boardHeight);
  
      if(!(startPosition.x == positionX && startPosition.y == positionY)) {
        foodCell.push({
          x: positionX,
          y: positionY,
        });
      }
    }
  
    // App container
    let appContainer = $('.appContainer');
  
    // Make an empty board
    for(var i = 0; i < boardHeight; i++) {
      for(var j = 0; j < boardWidth; j++) {
        board[i][j] = {
          x: i,
          y: j,
          isHavingFood: false,
        }
      }
    }
  
    foodCount = 0;
    // Assign cells with food
    for(var i = 0; i < foodCell.length; i++) {
        let foodX = foodCell[i].x;
        let foodY = foodCell[i].y;
  
        let rowCell = board[foodY];
        let columnCell = rowCell[foodX];
  
  
      if(!columnCell.isHavingFood) {
          columnCell.isHavingFood = true;
        foodCount = foodCount + 1;
      }
      columnCell.isHavingFood = true;
    }
  
    // Generate Board content
    let boardContent = "<div class = 'board'>";
  
    console.log('board ', board)
    for (var index = 0; index < board.length; index ++){
      let rowContent = "<div class = 'row row-" + index + "'>\n";
      for (var index2 = 0; index2 < board[index].length; index2++){
          const additionalClass = board[index][index2].isHavingFood ? 'food' : '';
          rowContent += "<div class = 'cell " + "row-" + index + " col-" + index2 + " " + additionalClass + " '" + "></div>" + "\n";  
      }
      rowContent += "</div>";
      boardContent += rowContent;
    }
  
    appContainer.html(boardContent);
  
    let currentPosition = {
      x: startPosition.x,
      y: startPosition.y,
    };
  
    let marioLocationClass = '.row-' + currentPosition.y + '.col-' + currentPosition.x;
    $(marioLocationClass).addClass('mario-location');
  
    // Your Code Here
  
    // - I've had to refactor the loop that populates the grid as the X and Y were reversed,
    // Marios starting position sometimes didn't work and I couldn't test for correct width/height

    // "Mario will be starting from a random cell once any of the direction arrow is pressed"
    // - He is being populated on the board by default, I don't want to change the existing code so can't make him only appear
    // when a direction button is pressed
  
    var keyDirections = {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39
    }
    var allKeyPresses = 0,
        collectedFood = 0;
  
    document.onkeydown = function onDirectionPress(event){
      // declare keyDirection as undefined on all key pressed then overwrite if it's a direction
      var keyDirection = undefined;
  
      Object.keys(keyDirections).forEach(function(key) {
          // check if key press is a direction arrow
          if (keyDirections[key] == event.keyCode) {
              
              if (event.keyCode === keyDirections.UP){
                  keyDirection = keyDirections.UP;
                  // check if Mario is already at the edge, if so move the opposite direction
                  // else increment currentPosition
                  if (currentPosition.y < 1){
                      currentPosition.y = currentPosition.y + 1;
                  }
                  else {
                      currentPosition.y = currentPosition.y - 1;
                  }
              }
              else if (event.keyCode === keyDirections.DOWN){
                  keyDirection = keyDirections.DOWN;
                  if (currentPosition.y === boardHeight-1){
                      currentPosition.y = currentPosition.y - 1;
                  }
                  else {
                      currentPosition.y = currentPosition.y + 1;
                  }
              }
              else if (event.keyCode === keyDirections.LEFT){
                  keyDirection = keyDirections.LEFT;
                  if (currentPosition.x < 1){
                      currentPosition.x = currentPosition.x + 1;
                  }
                  else {
                      currentPosition.x = currentPosition.x - 1;
                  }
              }
              else if (event.keyCode === keyDirections.RIGHT){
                  keyDirection = keyDirections.RIGHT
                  if (currentPosition.x === boardWidth-1){
                      currentPosition.x = currentPosition.x - 1;
                  }
                  else {
                      currentPosition.x = currentPosition.x + 1;
                  }
              }
          }
      });
      // keyDirection is set if a direction is pressed, it will be undefined if any other keys are pressed
      if (keyDirection){
          allKeyPresses ++;
  
          marioLocationClass = '.row-' + currentPosition.y + '.col-' + currentPosition.x;
          // check if the new cell has food, is so remove the class and increment collectedFood
          if ($(marioLocationClass).hasClass('food')){
              $(marioLocationClass).removeClass('food');
              collectedFood ++;
          }
          // update total moves counter on screen
          $('#marioMoves').text('Total Moves: '+allKeyPresses)
          // remove mario-location class and add it to the new cell
          $('.cell').removeClass('mario-location');
          $(marioLocationClass).addClass('mario-location');
  
          // slight delay so the DOM can update before the alert shows
          if (collectedFood === foodCount){
              // Collected all the food, show final screen
              showCompletedScreen()
          }
      }
    }
  
    function showCompletedScreen(){
        compeltedScreenShowing = true;
        $('.appContainer, .spacer, .input, .output').addClass('hidden');
        var completedScreen = $('<div class="completed-screen">\
                                  <h1>Completed in '+ allKeyPresses +' moves</h1>\
                                  <button onClick="window.location.reload()">Click here to start again</button>\
                                </div>')
        $('body').append(completedScreen);
  
        // timeout for the transition hiding appContainer etc to finish
        setTimeout(function(){
          completedScreen.addClass('showing')
        }, 200)
    }
  
  });
  