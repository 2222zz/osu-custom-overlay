// made by 2ky(@s2skky)

// no touch
let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");
socket.onopen = () => console.log("Successfully Connected");
socket.onclose = event => {
  console.log("Socket Closed Connection: ", event);
  socket.send("Client Closed!");
};
socket.onerror = error => console.log("Socket Error: ", error);


let hitcountBox = document.getElementById("hitcount_box");
let pp = document.getElementById("pp");
let ur = document.getElementById("ur");
let ratio = document.getElementById("ratio");

let h300g = document.getElementById("h300g");
let h300 = document.getElementById("h300");
let h200 = document.getElementById("h200");
let h100 = document.getElementById("h100");
let h50 = document.getElementById("h50");
let miss = document.getElementById("miss");



let curH320;
let curH300;
let curH200;
let curH100;
let curH50;
let curH0;
let curUR;
let curTotalNote = 0;
let curScore = 0;
let curPP;

let state;


function display_section(){   
    hitcountBox.style.opacity = 1;
}

socket.onmessage = event => {
    try {
        let data = JSON.parse(event.data);
        let menu = data.menu;
        let play = data.gameplay;
        
        
        if (state !== menu.state){
            state = menu.state;
            
            if(state == 2){
                setTimeout(display_section, 1000);
            }
            else{
                hitcountBox.style.opacity = 0;
            }
            
        }
        
        if (curPP !== play.pp.current){
            curPP = play.pp.current;
            pp.innerHTML = curPP + 'pp';
        }
        if (curUR !== play.hits.unstableRate){
            curUR = play.hits.unstableRate;
            ur.innerHTML = 'UR : ' + curUR.toFixed(2);
        }
        if (curTotalNote !== play.hits.geki + play.hits[300] + play.hits.katu + play.hits[100] + play.hits[50] + play.hits[0]){
            curTotalNote = play.hits.geki + play.hits[300] + play.hits.katu + play.hits[100] + play.hits[50] + play.hits[0];
            let k;
            if(curTotalNote == 0){
                ratio.innerHTML = 'Ratio : NaN:1';
            }
            else if((curTotalNote - play.hits.geki) != 0){
                k = play.hits.geki / (curTotalNote - play.hits.geki);
                ratio.innerHTML = 'Ratio : ' + k.toFixed(1) + ':1';
            }
            else{
                ratio.innerHTML = 'Ratio : ∞:1';
            }
            
        }
        if (curH320 !== play.hits.geki){
            curH320 = play.hits.geki;
            h300g.innerHTML = 'MAX : ' + curH320;
        }
        if (curH300 !== play.hits[300]){
            curH300 = play.hits[300];
            h300.innerHTML = 'Perf : ' + curH300;
        }
        if (curH200 !== play.hits.katu){
            curH200 = play.hits.katu;
            h200.innerHTML = 'Great : ' + curH200;
        }
        if (curH100 !== play.hits[100]){
            curH100 = play.hits[100];
            h100.innerHTML = 'Good : ' + curH100;
        }
        if (curH50 !== play.hits[50]){
            curH50 = play.hits[50];
            h50.innerHTML = 'Bad : ' + curH50;
        }
        if (curH0 !== play.hits[0]){
            curH0 = play.hits[0];
            miss.innerHTML = 'Miss : ' + curH0;
        }
        
        if(curScore !== play.score){
            curScore = play.score;
        }
      	
  } catch (err) { console.log(err); };
};