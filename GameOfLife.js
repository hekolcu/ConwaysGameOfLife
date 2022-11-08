export default class GameOfLife {

    static Layouts = {
        CENTER: 0,
        TOP_LEFT: 1,
        TOP_RIGHT: 2,
        BOTTOM_LEFT: 3,
        BOTTOM_RIGHT: 4,
        TOP_CENTER: 5,
        BOTTOM_CENTER: 6,
        LEFT_CENTER: 7,
        RIGHT_CENTER: 8
    }

    constructor(cellSize) {
        this.canvas = document.getElementById("gol-main");
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        this.cellSize = cellSize;
        this.cols = parseInt(this.width / this.cellSize) - 2;
        this.rows = parseInt(this.height / this.cellSize) - 2;
        this.cells = [];
        this.cellsDomElements = [];
        this.running = false;
        this.interval = 100;
        this.timer = null;
    }

    init() {
        this.canvas.addEventListener("click", this.clickCanvas.bind(this));
        this.canvas.classList.add("stopped");
        this.initCells();
        this.draw();
        console.log(this);
    }

    initCells(old = []) {
        this.cells = [];
        for (var i = 0; i < this.rows; i++) {
            this.cells[i] = [];
            for (var j = 0; j < this.cols; j++) {
                this.cells[i][j] = 0;
            }
        }
        this.cells.forEach(function(row, i){
            row.forEach(function(col, j){
                if (old[i] && old[i][j]) {
                    this.cells[i][j] = 1;
                }
            }.bind(this));
        }.bind(this));
    }

    clickCanvas(e) {
        if (e.target.className.indexOf("cell") != -1) {
            var i = this.getRow(e.target);
            var j = this.getColumn(e.target);
            if (this.cells[i][j] == 1) {
                this.cells[i][j] = 0;
                e.target.classList.remove("alive");
            } else {
                this.cells[i][j] = 1;
                e.target.classList.add("alive");
            }
        }
    }

    draw() {
        this.canvas.innerHTML = "";
        for (var i = 0; i < this.rows; i++) {
            var row = document.createElement("div");
            row.className = "row";
            this.cellsDomElements[i] = [];
            for (var j = 0; j < this.cols; j++) {
                var cell;
                if (this.cells[i][j] == 1) {
                    cell = document.createElement("div");
                    cell.className = "cell alive r" + i + " c" + j;
                }
                else {
                    cell = document.createElement("div");
                    cell.className = "cell r" + i + " c" + j;
                }
                cell.style.width = this.cellSize + "px";
                cell.style.height = this.cellSize + "px";
                row.appendChild(cell);
                this.cellsDomElements[i][j] = cell;
            }
            this.canvas.appendChild(row);
        }
    }

    start() {
        this.running = true;
        this.timer = setInterval(this.next.bind(this), this.interval);
        this.canvas.classList.remove("stopped");
        this.canvas.classList.add("running");
    }

    stop() {
        this.running = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.canvas.classList.remove("running");
        this.canvas.classList.add("stopped");
    }

    toggle() {
        if (this.running) {
            this.stop();
        } else {
            this.start();
        }
    }

    next() {
        var nextCells = [];
        for (var i = 0; i < this.rows; i++) {
            nextCells[i] = [];
            for (var j = 0; j < this.cols; j++) {
                nextCells[i][j] = this.getNextState(i, j);
                if (nextCells[i][j] == 1) {
                    this.cellsDomElements[i][j].classList.add("alive");
                }
                else {
                    this.cellsDomElements[i][j].classList.remove("alive");
                }
            }
        }
        this.cells = nextCells;
    }

    step() {
        this.stop();
        this.next();
    }

    getNextState(i, j) {
        var count = 0;
        for (var ii = -1; ii <= 1; ii++) {
            for (var jj = -1; jj <= 1; jj++) {
                if (ii == 0 && jj == 0) {
                    continue;
                }
                var iii = i + ii;
                var jjj = j + jj;
                if (iii < 0 || iii >= this.rows || jjj < 0 || jjj >= this.cols) {
                    continue;
                }
                if (this.cells[iii][jjj] == 1) {
                    count++;
                }
            }
        }
        if (this.cells[i][j] == 1) {
            if (count == 2 || count == 3) {
                return 1;
            } else {
                return 0;
            }
        } else {
            if (count == 3) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    clear() {
        this.initCells();
        this.draw();
    }

    random() {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                this.cells[i][j] = Math.floor(Math.random() * 2);
                if (this.cells[i][j] == 1) {
                    this.cellsDomElements[i][j].classList.add("alive");
                } else {
                    this.cellsDomElements[i][j].classList.remove("alive");
                }
            }
        }
    }

    setSpeed(interval) {
        if (interval > 0) {
            this.interval = interval;
            if (this.running) {
                this.stop();
                this.start();
            }
        }
    }

    setCellSize(cellSize) {
        this.cellSize = cellSize;
        this.cols = parseInt(this.width / this.cellSize) - 2;
        this.rows = parseInt(this.height / this.cellSize) - 2;
        this.initCells();
        this.draw();
    }

    setWidth(width) {
        this.width = width;
        this.cols = this.width / this.cellSize;
        this.canvas.width = this.width;
        this.initCells();
        this.draw();
    }

    setHeight(height) {
        this.height = height;
        this.rows = this.height / this.cellSize;
        this.canvas.height = this.height;
        this.initCells();
        this.draw();
    }

    setRows(rows) {
        this.rows = rows;
        this.height = this.rows * this.cellSize;
        this.canvas.height = this.height;
        this.initCells();
        this.draw();
    }

    setCols(cols) {
        this.cols = cols;
        this.width = this.cols * this.cellSize;
        this.canvas.width = this.width;
        this.initCells();
        this.draw();
    }

    setCellSize(cellSize) {
        this.cellSize = cellSize;
        this.cols = this.width / this.cellSize;
        this.rows = this.height / this.cellSize;
        this.initCells();
        this.draw();
    }

    getRow(element) {
        return parseInt(element.className.match(/r(\d+)/)[1]);
    }

    getColumn(element) {
        return parseInt(element.className.match(/c(\d+)/)[1]);
    }

    resize() {
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        this.rows = parseInt(this.height / this.cellSize) - 2;
        this.cols = parseInt(this.width / this.cellSize) - 2;
        this.initCells(this.cells);
        this.draw();
    }

    loadLayout(layout, layoutPos) {
        this.stop();
        var rowOffset;
        var colOffset;
        if (layoutPos == GameOfLife.Layouts.CENTER) {
            rowOffset = Math.floor((this.rows - layout.length) / 2);
            colOffset = Math.floor((this.cols - layout[0].length) / 2);
        } else if (layoutPos == GameOfLife.Layouts.TOP_LEFT) {
            rowOffset = 0;
            colOffset = 0;
        } else if (layoutPos == GameOfLife.Layouts.TOP_RIGHT) {
            rowOffset = 0;
            colOffset = this.cols - layout[0].length;
        } else if (layoutPos == GameOfLife.Layouts.BOTTOM_LEFT) {
            rowOffset = this.rows - layout.length;
            colOffset = 0;
        } else if (layoutPos == GameOfLife.Layouts.BOTTOM_RIGHT) {
            rowOffset = this.rows - layout.length;
            colOffset = this.cols - layout[0].length;
        } else if (layoutPos == GameOfLife.Layouts.TOP_CENTER) {
            rowOffset = 0;
            colOffset = Math.floor((this.cols - layout[0].length) / 2);
        } else if (layoutPos == GameOfLife.Layouts.BOTTOM_CENTER) {
            rowOffset = this.rows - layout.length;
            colOffset = Math.floor((this.cols - layout[0].length) / 2);
        } else if (layoutPos == GameOfLife.Layouts.LEFT_CENTER) {
            rowOffset = Math.floor((this.rows - layout.length) / 2);
            colOffset = 0;
        } else if (layoutPos == GameOfLife.Layouts.RIGHT_CENTER) {
            rowOffset = Math.floor((this.rows - layout.length) / 2);
            colOffset = this.cols - layout[0].length;
        } else if (layoutPos == GameOfLife.Layouts.TOP_CENTER) {
            rowOffset = 0;
            colOffset = Math.floor((this.cols - layout[0].length) / 2);
        } else if (layoutPos == GameOfLife.Layouts.LEFT_CENTER) {
            rowOffset = Math.floor((this.rows - layout.length) / 2);
            colOffset = 0;
        } else if (layoutPos == GameOfLife.Layouts.RIGHT_CENTER) {
            rowOffset = Math.floor((this.rows - layout.length) / 2);
            colOffset = this.cols - layout[0].length;
        }

        for (var i = 0; i < layout.length; i++) {
            for (var j = 0; j < layout[i].length; j++) {
                this.cells[i + rowOffset][j + colOffset] = layout[i][j];
                if (layout[i][j] == 1) {
                    this.cellsDomElements[i + rowOffset][j + colOffset].classList.add('alive');
                }
                else {
                    this.cellsDomElements[i + rowOffset][j + colOffset].classList.remove('alive');
                }
            }
        }
    }

    static initGliderGun1() {
        var rows = 11;
        var cols = 38;

        var cells = [];
        for (var i = 0; i < rows; i++) {
            cells[i] = [];
            for (var j = 0; j < cols; j++) {
                cells[i][j] = 0;
            }
        }

        cells[5][1] = 1;
        cells[5][2] = 1;
        cells[6][1] = 1;
        cells[6][2] = 1;

        cells[3][13] = 1;
        cells[3][14] = 1;
        cells[4][12] = 1;
        cells[4][16] = 1;
        cells[5][11] = 1;
        cells[5][17] = 1;
        cells[6][11] = 1;
        cells[6][15] = 1;
        cells[6][17] = 1;
        cells[6][18] = 1;
        cells[7][11] = 1;
        cells[7][17] = 1;
        cells[8][12] = 1;
        cells[8][16] = 1;
        cells[9][13] = 1;
        cells[9][14] = 1;

        cells[1][25] = 1;
        cells[2][23] = 1;
        cells[2][25] = 1;
        cells[3][21] = 1;
        cells[3][22] = 1;
        cells[4][21] = 1;
        cells[4][22] = 1;
        cells[5][21] = 1;
        cells[5][22] = 1;
        cells[6][23] = 1;
        cells[6][25] = 1;
        cells[7][25] = 1;

        cells[3][35] = 1;
        cells[3][36] = 1;
        cells[4][35] = 1;
        cells[4][36] = 1;

        return cells;
    }

    static initFlower1() {
        var rows = 17;
        var cols = 17;

        var cells = [];
        for (var i = 0; i < rows; i++) {
            cells[i] = [];
            for (var j = 0; j < cols; j++) {
                cells[i][j] = 0;
            }
        }

        // north left wing
        cells[1][5] = 1;
        cells[2][5] = 1;
        cells[3][5] = 1;
        cells[3][6] = 1;

        // north right wing
        cells[1][11] = 1;
        cells[2][11] = 1;
        cells[3][10] = 1;
        cells[3][11] = 1;

        // south left wing
        cells[15][5] = 1;
        cells[14][5] = 1;
        cells[13][5] = 1;
        cells[13][6] = 1;

        // south right wing
        cells[15][11] = 1;
        cells[14][11] = 1;
        cells[13][10] = 1;
        cells[13][11] = 1;

        // east top wing
        cells[5][15] = 1;
        cells[5][14] = 1;
        cells[5][13] = 1;
        cells[6][13] = 1;

        // east bottom wing
        cells[11][15] = 1;
        cells[11][14] = 1;
        cells[10][13] = 1;
        cells[11][13] = 1;

        // west top wing
        cells[5][1] = 1;
        cells[5][2] = 1;
        cells[5][3] = 1;
        cells[6][3] = 1;

        // west bottom wing
        cells[11][1] = 1;
        cells[11][2] = 1;
        cells[10][3] = 1;
        cells[11][3] = 1;

        // center top left
        cells[5][6] = 1;
        cells[5][7] = 1;
        cells[6][7] = 1;
        cells[6][5] = 1;
        cells[7][5] = 1;
        cells[7][6] = 1;

        // center top right
        cells[5][10] = 1;
        cells[5][9] = 1;
        cells[6][9] = 1;
        cells[6][11] = 1;
        cells[7][11] = 1;
        cells[7][10] = 1;

        // center bottom left
        cells[9][5] = 1;
        cells[9][6] = 1;
        cells[10][5] = 1;
        cells[10][7] = 1;
        cells[11][7] = 1;
        cells[11][6] = 1;

        // center bottom right
        cells[9][11] = 1;
        cells[9][10] = 1;
        cells[10][11] = 1;
        cells[10][9] = 1;
        cells[11][9] = 1;
        cells[11][10] = 1;

        return cells;
    }


    static maxDensityCells() {
        // this.clear();

        // import txt file from corderShip.txt using FileReader
        var file = ["OO..OO.OO.O.OO.OO.OO",
            "O..O.O.O.OOO.O.OO.O.",
            ".O.O.O.O.....O.....O",
            "OO.O.O.OOOOOO.OOOOOO",
            ".O.O.O......O.O.....",
            "O..O.OOOOOO.O.O.OOOO",
            "OOOO......O.O.O.O..O",
            "....OOOOO.O.O.O.O.O.",
            "OOOO....O.O.O.O.O.OO",
            "O..O.OO.O.O.O.O.O.O.",
            ".O.O.O.O.O.O.OO.O..O",
            "OO.O.O.O.O.O....OOOO",
            ".O.O.O.O.O.OOOOO....",
            "O..O.O.O.O......OOOO",
            "OOOO.O.O.OOOOOO.O..O",
            ".....O.O......O.O.O.",
            "OOOOOO.OOOOOO.O.O.OO",
            "O.....O.....O.O.O.O.",
            ".O.OO.O.OOO.O.O.O..O",
            "OO.OO.OO.O.OO.OO..OO"];

        var rows = file.length;
        var cols = file[0].length;

        var cells = [];
        for (var i = 0; i < rows; i++) {
            cells[i] = [];
            for (var j = 0; j < cols; j++) {
                if (file[i][j] == "O") {
                    cells[i][j] = 1;
                } else {
                    cells[i][j] = 0;
                }
            }
        }
        return cells;
    }

    static initFromText(fileName) {
        var cells = [];
        $.ajax({
            url: "./layouts/" + fileName,
            dataType: "text",
            type: "GET",
            success: function (data) {
                var file = data.split("\r\n");
                var rows = file.length;
                var cols = file[0].length;
                for (var i = 0; i < rows; i++) {
                    cells[i] = [];
                    for (var j = 0; j < cols; j++) {
                        if (file[i][j] == "O") {
                            cells[i][j] = 1;
                        } else {
                            cells[i][j] = 0;
                        }
                    }
                }
            },
            error: function (data) {
                console.log("error");
            },
            async: false
        });
        return cells;
    }


}