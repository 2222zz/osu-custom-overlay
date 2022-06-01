// made by 2ky(@s2skky)

// no touch
let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");
socket.onopen = () => console.log("Successfully Connected");
socket.onclose = event => {
  console.log("Socket Closed Connection: ", event);
  socket.send("Client Closed!");
};
socket.onerror = error => console.log("Socket Error: ", error);

let section_2 = document.getElementById("section_2");

let nowPlayingBox = document.getElementById("nowPlayingBox");
let map_pic = document.getElementById("map_pic");
let map_title = document.getElementById("map_title");
let mask_title = document.getElementById("mask_title");
let mask_background = document.getElementById("mask_background");
let map_artist = document.getElementById("map_artist");
let map_mapper = document.getElementById("map_mapper");
let map_diff = document.getElementById("map_diff");
let map_star_bar = document.getElementById("map_star_bar");

let temp_title;
let temp_artist;
let temp_mapper;
let temp_diff;
let temp_path;

let state;
function display_section(){
    section_2.style.opacity = 1;
}

socket.onmessage = event => {
    try {
        let data = JSON.parse(event.data);
        let menu = data.menu;
        let play = data.gameplay;
        
        if(temp_title != menu.bm.metadata.title){
            temp_title = menu.bm.metadata.title;
            map_title.innerHTML = temp_title;
            map_title.style.width = 'max-content';
            let title_width = map_title.offsetWidth;
            
            if(title_width >= 205){
                mask_title.style.width = '205px';
                mask_background.style.width = '235px';
                map_title.classList.add("over");
            }else{
                map_title.style.width = 'auto';
                mask_background.style.width = (title_width+20) + 'px';
                map_title.classList.remove("over");
            }
        }
        
        if (state !== menu.state){
            state = menu.state;          
            if(state == 2){
                setTimeout(display_section, 1000);
            }
            else{
                section_2.style.opacity = 0;
            }        
        }
        if(temp_mapper != menu.bm.metadata.mapper){
            temp_mapper = menu.bm.metadata.mapper;
            map_mapper.innerHTML = 'by ' + temp_mapper;
        }
        if(temp_artist != menu.bm.metadata.artist){
            temp_artist = menu.bm.metadata.artist;
            map_artist.innerHTML = temp_artist;
        }
        if(temp_diff != menu.bm.stats.fullSR){
            temp_diff = menu.bm.stats.fullSR;
            map_diff.innerHTML = parseFloat(temp_diff).toFixed(2) + ' star';
            
            if(parseFloat(temp_diff).toFixed(2) >= 10){
                map_star_bar.style.width = '240px';
            }
            else{
                map_star_bar.style.width = ( (parseFloat(temp_diff) / 10) * 240 ) + 'px';
            }
            if (parseFloat(menu.bm.stats.fullSR) < 2){
                nowPlayingBox.style.backgroundColor = '#88B300';
                map_star_bar.style.backgroundColor = '#88B300';
            }
            else if(parseFloat(menu.bm.stats.fullSR) >= 2 && parseFloat(menu.bm.stats.fullSR) < 2.5){	
                nowPlayingBox.style.backgroundColor = '#66CCFF';
                map_star_bar.style.backgroundColor = '#66CCFF';
            }
            else if(parseFloat(menu.bm.stats.fullSR) >= 2.5 && parseFloat(menu.bm.stats.fullSR) < 4){	
                nowPlayingBox.style.backgroundColor = '#FFCC22';
                map_star_bar.style.backgroundColor = '#FFCC22';
            }
            else if(parseFloat(menu.bm.stats.fullSR) >= 4 && parseFloat(menu.bm.stats.fullSR) < 5.30){		
                nowPlayingBox.style.backgroundColor = '#FF66AA';
                map_star_bar.style.backgroundColor = '#FF66AA';
            }
            else if(parseFloat(menu.bm.stats.fullSR) >= 5.30 && parseFloat(menu.bm.stats.fullSR) < 6.5){
                nowPlayingBox.style.backgroundColor = '#AA88FF';
                map_star_bar.style.backgroundColor = '#AA88FF';
            }
            else{											
                nowPlayingBox.style.backgroundColor = '#787878';
                map_star_bar.style.backgroundColor = '#999999';
            }
        }
        if (temp_path !== menu.bm.path.full){
            temp_path = data.menu.bm.path.full;
            data.menu.bm.path.full = data.menu.bm.path.full.replace(/#/g, '%23').replace(/%/g, '%25').replace(/\'/g, '%27').replace(/\\/g, '/');
            map_pic.style.backgroundImage = `url('http://127.0.0.1:24050/Songs/${data.menu.bm.path.full}?a=${Math.random(10000)}')`;
            map_pic.style.backgroundPosition = "50% 50%";
    	}	
  } catch (err) { console.log(err); };
};