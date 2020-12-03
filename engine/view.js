export default class View {

    constructor(model) {
        this.model = model;
        this.listeners = [];
        this.div = $('<div class="gamebg"></div>');
        this.render();

    }

    render(){
        this.div.empty();
        this.model.gs.board.forEach(elt => {
            let tile = $(`<div class="dftile">${elt}</div>`);
            if(elt>4){tile.css('color', 'white');}
            if(elt>64 && elt<1024){tile.css('font-size', '40px');}
            else if(elt>512 && elt<=8192){tile.css('font-size', '35px');}
            else if(elt>8192){tile.css('font-size', '20px');}

            if(elt === 0){
                this.div.append(`<div class="dftile"></div>`);
            } else if(elt === 2){
                this.div.append(tile.css('background-color', '#EEE4DA'));
            } else if(elt === 4){
                this.div.append(tile.css('background-color', '#EEE1C9'));
            } else if(elt === 8){
                this.div.append(tile.css('background-color', '#F3B27A'));
            } else if(elt === 16){
                this.div.append(tile.css('background-color', '#F69664'));
            } else if(elt === 32){
                this.div.append(tile.css('background-color', '#F77C5F'));
            } else if(elt === 64){
                this.div.append(tile.css('background-color', '#F75F3B'));
            } else if(elt <= 256){
                this.div.append(tile.css('background-color', '#EDD073'));
            } else {
                this.div.append(tile.css('background-color', '#EDC951'));
            }
        });
    }


}