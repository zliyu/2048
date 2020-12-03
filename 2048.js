import Game from "./engine/game.js";
import View from "./engine/view.js"
let model = null;
let view = null;

let won = false;
const w = `<span><b>You win!</b> Continue or start a new game.</span>`;
const l = `<span><b>Game over.</b> Click "New Game" to restart.</span>`;
const p = `<span style="color: #776E65">Join the tiles to get <b>2048</b>!</span>`;

let display = function(){
    view.render();
    $('#game').empty().append(view.div);
    $('#score').empty().append(model.getGameState().score);
    if(!won && model.getGameState().won){
        won = true;
        $('#winlose').css('background-color', '#F77C5F').empty().append(w);
    }
    if(model.getGameState().over){
        $('#winlose').css('background-color', '#F69664').empty().append(l);
    }
}
$(document).ready(() => {
    model = new Game(4);
    view = new View(model);
    $('#winlose').css('background-color', '#FAF8EF').empty().append(p);
    display(); 
    
    $('#start').click((e)=>{
        won = false;
        $('#winlose').css('background-color', '#FAF8EF').empty().append(p);
        model.setupNewGame();
        display();
    })

    $(document).keydown((e)=>{
        if(e.keyCode === (37||65)){
            model.move("left");
        } else if(e.keyCode === (39||68)){
            model.move("right");
        } else if(e.keyCode === (38||87)){
            model.move("up");
        } else if(e.keyCode === (40||83)){
            model.move("down");
        }
        display();
    })
});



