
var rows = window.prompt("Enter the number of rows:")
var cols = window.prompt("Enter the number of columns: ");
var playing = false;

var grid1 = new Array(rows);
var grid2 = new Array(rows);

var timer;
var reproductionTime = 100;

function createGrids() {
    for (var i = 0; i < rows; i++) {
        grid1[i] = new Array(cols);
        grid2[i] = new Array(cols);
    }
}

function resetGrids() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid1[i][j] = 0;
            grid2[i][j] = 0;
        }
    }
}

function copyGrid() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid1[i][j] = grid2[i][j];
            grid2[i][j] = 0;
        }
    }
}

function createTable() {
    var tableContainer = document.getElementById('tableContainer');
    if (!tableContainer) {
        console.error("Error");
    }
    
    var table = document.createElement("table");
    for (var i = 0; i < rows; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < cols; j++) {
            var td = document.createElement("td");
            td.setAttribute("id", i + " " + j);
            td.setAttribute("class", "off");
            td.onclick = cellClickHandler;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    tableContainer.appendChild(table);
    }

    function cellClickHandler() {
        var rowcol = this.id.split(" ");
        var row = rowcol[0];
        var col = rowcol[1];

        var classes = this.getAttribute("class");
        if(classes.indexOf("on") > -1) {
            this.setAttribute("class", "off");
            grid1[row][col] = 0;
        } else {
            this.setAttribute("class", "on");
            grid1[row][col] = 1;
        }

    }

    function updateView() {
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                var cell = document.getElementById(i + " " + j);
                if (grid1[i][j] == 0) {
                    cell.setAttribute("class", "off");
                } else {
                    cell.setAttribute("class", "on");
                }
            }
        }
    }

function controlButtons() {
   
    var startButton = document.getElementById('startButton');
    startButton.onclick = startButtonHandler;

    var clearButton = document.getElementById('clearButton');
    clearButton.onclick = clearButtonHandler;

    var randomButton = document.getElementById('randomButton');
    randomButton.onclick = randomButtonHandler;
}

function startButtonHandler() {
    if (playing) {
        console.log("Pause the game");
        playing = false;
        this.innerHTML = "Continue game";
        clearTimeout(timer);
    } else {
        console.log("Continue the game");
        playing = true;
        this.innerHTML = "Pause game";
        play();
    }
}


function clearButtonHandler() {
    playing = false;
    var startButton = document.getElementById('startButton');
    startButton.innerHTML = "Start Game";
    clearTimeout(timer);

    var cellsList = document.getElementsByClassName("on");
    var cells = [];
    for (var i = 0; i < cellsList.length; i++) {
        cells.push(cellsList[i]);
    }

    for (var i = 0; i < cells.length; i++) {
        cells[i].setAttribute("class", "off");
    }
    resetGrids();
}


function randomButtonHandler() {
    if (playing) return;
    clearButtonHandler();
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var isLive = Math.round(Math.random());
            if (isLive == 1) {
                var cell = document.getElementById(i + " " + j);
                cell.setAttribute("class", "on");
                grid1[i][j] = 1;
            }
        }
    }
}


function play() {
    computeNextGen();

    if (playing) {
        timer = setTimeout(play, reproductionTime);
    }
}

function computeNextGen() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            rules(i, j);
        }
    }
    copyGrid();
    updateView();
}


function rules(row, col) {
    var numNeighbors = neighbors(row, col);
    if (grid1[row][col] == 1) {
        if (numNeighbors < 2) {
            grid2[row][col] = 0;
        } else if (numNeighbors == 2 || numNeighbors == 3) {
            grid2[row][col] = 1;
        } else if (numNeighbors > 3) {
            grid2[row][col] = 0;
        }
    } else if (grid1[row][col] == 0) {
            if (numNeighbors == 3) {
                grid2[row][col] = 1;
            }
        }
    }

function neighbors(row, col) {
    var count = 0;
    if (row-1 >= 0) {
        if (grid1[row-1][col] == 1) count++;
    }
    if (row-1 >= 0 && col-1 >= 0) {
        if (grid1[row-1][col-1] == 1) count++;
    }
    if (row-1 >= 0 && col+1 < cols) {
        if (grid1[row-1][col+1] == 1) count++;
    }
    if (col-1 >= 0) {
        if (grid1[row][col-1] == 1) count++;
    }
    if (col+1 < cols) {
        if (grid1[row][col+1] == 1) count++;
    }
    if (row+1 < rows) {
        if (grid1[row+1][col] == 1) count++;
    }
    if (row+1 < rows && col-1 >= 0) {
        if (grid1[row+1][col-1] == 1) count++;
    }
    if (row+1 < rows && col+1 < cols) {
        if (grid1[row+1][col+1] == 1) count++;
    }
    return count;
}

function startgame() {
    createTable();
    createGrids();
    resetGrids();
    controlButtons();
}

window.onload = startgame;
