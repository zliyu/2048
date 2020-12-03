export default class Game {

    constructor(dim) {
        this.dim = dim;
        this.len = dim * dim;
        this.gs;
        this.setupNewGame();
        this.moveHandlers = [];
        this.winHandlers = [];
        this.loseHandlers = [];
    }

    setupNewGame() {
        this.gs = {
            board: new Array(this.len).fill(0),
            score: 0,
            won: false,
            over: false
        }
        //this.gs.board=[0,0,4,8,0,2,4,0,16,32,64,128,256,512,1024,1024];
        //this.gs.board=[2,4,8,16,16,8,2,4,32,4,8,16,8,2,4,0];       
        this.addTile();
        this.addTile();
        this.state = 0;
    }

    loadGame(gameState) {
        this.gs = gameState;
    }

    move(dir) {
        let prev = [...this.gs.board]; // state before moving
        if (this.gs.over) { return; }  // can only move if not lost

        // modify board and add score
        if (dir === "up") {
            for (let c = 0; c < this.dim; c++) {
                let arr = [];
                for (let r = 0; r < this.dim; r++) {
                    arr.push(this.gs.board[this.dim * r + c]);
                }
                arr = this.collapse(arr);
                for (let r = 0; r < this.dim; r++) {
                    this.gs.board[this.dim * r + c] = arr[r];
                }
            }
        } else if (dir === "down") {
            for (let c = 0; c < this.dim; c++) {
                let arr = [];
                for (let r = 0; r < this.dim; r++) {
                    arr.push(this.gs.board[this.dim * r + c]);
                }
                arr.reverse();
                arr = this.collapse(arr).reverse();
                for (let r = 0; r < this.dim; r++) {
                    this.gs.board[this.dim * r + c] = arr[r];
                }
            }
        } else if (dir === "right") {
            for (let r = 0; r < this.dim; r++) {
                let arr = this.gs.board.slice(r * this.dim, (r + 1) * this.dim).reverse();
                arr = this.collapse(arr).reverse();
                for (let c = 0; c < this.dim; c++) {
                    this.gs.board[this.dim * r + c] = arr[c];
                }
            }
        } else if (dir === "left") {
            for (let r = 0; r < this.dim; r++) {
                let arr = this.gs.board.slice(r * this.dim, (r + 1) * this.dim);
                arr = this.collapse(arr);
                for (let c = 0; c < this.dim; c++) {
                    this.gs.board[this.dim * r + c] = arr[c];
                }
            }
        } else {
            console.log("Something wrong with direction");
        }

        let moved = false; // check if actually moved
        for (let i = 0; i < this.len; i++) {
            if (this.gs.board[i] != prev[i]) { moved = true; break; }
        }
        if (moved) {
            this.addTile(); // add a tile
            this.checkWin(); // check states
            this.checkLose();
            //notify move
            this.onMove();
        }
    }

    onMove(callback) {
        if(callback != undefined){
            let idx = this.moveHandlers.findIndex((l) => l == callback);
            if (idx == -1) {this.moveHandlers.push(callback);}
        }
        this.moveHandlers.forEach((l) => l(this.gs));
    }

    onLose(callback) {
        if(callback != undefined){
            let idx = this.loseHandlers.findIndex((l) => l == callback);
            if (idx == -1) {this.loseHandlers.push(callback);}
        }
        this.loseHandlers.forEach((l) => l(this.gs));
    }

    onWin(callback) {
        if(callback != undefined){
            let idx = this.winHandlers.findIndex((l) => l == callback);
            if (idx == -1) {this.winHandlers.push(callback);}
        }
        this.winHandlers.forEach((l) => l(this.gs));
    }

    addTile() {
        let n = (Math.random() < 0.9) ? 2 : 4;
        let tiles = [];
        for (let i = 0; i < this.len; i++) {
            if (this.gs.board[i] === 0) {
                tiles.push(i);
            }
        }
        this.gs.board[tiles[Math.floor(Math.random() * tiles.length)]] = n;
    }

    // true if 2048 reached; check after every move before win
    checkWin() {
        if (!this.gs.won) {
            if (this.gs.board.findIndex(elt => elt === 2048) > -1) {
                this.gs.won = true;
                this.onWin();
            }
        }
    }

    // true if no move can be made and update gamestate
    checkLose() {
        if (this.gs.board.findIndex(elt => elt === 0) > -1) {
            this.gs.over = false; // still have empty space
            return false;
        }
        for (let r = 0; r < this.dim; r++) {
            for (let c = 0; c < this.dim - 1; c++) {
                //horizontal direction
                let idx = this.dim * r + c;
                if (this.gs.board[idx] === this.gs.board[idx + 1]) {
                    this.gs.over = false; return false;
                }
                //vertical direction
                idx = this.dim * c + r;
                if (this.gs.board[idx] === this.gs.board[idx + this.dim]) {
                    this.gs.over = false; return false;
                }
            }
        }
        this.gs.over = true; // update gamestate
        this.onLose();
        return true;
    }

    // collapse arr (one row/column) and change score
    collapse(arr) {
        let res = new Array(arr.length).fill(0); // array to return
        let nonzero = arr.filter(elt => elt != 0); // non-zero tiles
        let l = nonzero.length;
        let index = 0; // index for res
        for (let i = 0; i < l; i++) {
            if (i === l - 1) { // last elt
                res[index] = nonzero[i];
            }
            if (nonzero[i] === nonzero[i + 1]) {
                res[index] = 2 * nonzero[i];
                this.gs.score += 2 * nonzero[i]; // add score
                index++;
                i++; // skip next elt in non-zero array
            } else {
                res[index] = nonzero[i];
                index++;
            }
        }
        return res;
    }

    getGameState() {
        return this.gs;
    }

    toString() {
        let str = "\n";
        for (let r = 0; r < this.dim; r++) {
            for (let c = 0; c < this.dim; c++) {
                str = str + this.gs.board[this.dim * r + c] + " ";
            }
            str = str + "\n";
        }
        return str;
    }
}