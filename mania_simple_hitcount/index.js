// made by 2ky(@s2skky)

// no touch
let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");
socket.onopen = () => console.log("Successfully Connected");
socket.onclose = event => {
  console.log("Socket Closed Connection: ", event);
  socket.send("Client Closed!");
};
socket.onerror = error => console.log("Socket Error: ", error);

let section_3 = document.getElementById("section_3");

let hitcountBox = document.getElementById("hitcount_box");
let h300g = document.getElementById("h300g");
let h300 = document.getElementById("h300");
let h200 = document.getElementById("h200");
let h100 = document.getElementById("h100");
let h50 = document.getElementById("h50");
let miss = document.getElementById("miss");
let ur = document.getElementById("ur");

let texth300g = document.getElementById("textH300g");
let texth300 = document.getElementById("textH300");
let texth200 = document.getElementById("textH200");
let texth100 = document.getElementById("textH100");
let texth50 = document.getElementById("textH50");
let textmiss = document.getElementById("textMiss");
let textur = document.getElementById("textUr");

let bar_h300g = document.getElementById("bar_h300g");
let bar_h300 = document.getElementById("bar_h300");
let bar_h200 = document.getElementById("bar_h200");
let bar_bad = document.getElementById("bar_bad");

let tH300g;
let tH300;
let tH200;
let tH100;
let tH50;
let tMiss;
let tUr;
let tTotal = 0;
let tScore = 0;

let state;


function display_section(){   
    section_3.style.opacity = 1;
}
function set_hitcount_bar(total){
    let tempH300 = Math.floor((tH300 / total) * 200);
    let tempH200 = Math.floor((tH200 / total) * 200);
    let tempMiss = Math.floor(((tH100+ tH50 + tMiss) / total) * 200);
    let tempH320 = 200 - tempH300 - tempH200 - tempMiss;

    bar_h300g.style.width = tempH320 + 'px';
    bar_h300.style.width = tempH300 + 'px';
    bar_h200.style.width = tempH200 + 'px';
    bar_bad.style.width = tempMiss + 'px';
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
                bar_h300g.style.width = '0px';
                bar_h300.style.width = '0px';
                bar_h200.style.width = '0px';
                bar_bad.style.width = '0px';

                section_3.style.opacity = 0;
            }
            
        }
                 
        
        if (tTotal !== play.hits.geki + play.hits[300] + play.hits.katu + play.hits[100] + play.hits[50] + play.hits[0]){
            tTotal = play.hits.geki + play.hits[300] + play.hits.katu + play.hits[100] + play.hits[50] + play.hits[0];
        }
        
        if (tH300g !== play.hits.geki){
            tH300g = play.hits.geki;
            h300g.innerHTML = tH300g;
            if(tTotal != 0){
                set_hitcount_bar(tTotal);
            }
        }
        if (tH300 !== play.hits[300]){
            tH300 = play.hits[300];
            h300.innerHTML = tH300;
            if(tTotal != 0){
                set_hitcount_bar(tTotal);
            }
        }
        if (tH200 !== play.hits.katu){
            tH200 = play.hits.katu;
            h200.innerHTML = tH200;
            if(tTotal != 0){
                set_hitcount_bar(tTotal);
            }
        }
        if (tH100 !== play.hits[100]){
            tH100 = play.hits[100];
            h100.innerHTML = tH100;
            if(tTotal != 0){
                set_hitcount_bar(tTotal);
            }
        }
        if (tH50 !== play.hits[50]){
            tH50 = play.hits[50];
            h50.innerHTML = tH50;
            if(tTotal != 0){
                set_hitcount_bar(tTotal);
            }
        }
        if (tMiss !== play.hits[0]){
            tMiss = play.hits[0];
            miss.innerHTML = tMiss;
            if(tTotal != 0){
                set_hitcount_bar(tTotal);
            }
        }
        if (tUr !== play.hits.unstableRate){
            tUr = play.hits.unstableRate;
            ur.innerHTML = tUr;
        }
        
        if(tScore !== play.score){
            tScore = play.score;
            if(tScore == 0){
                bar_h300g.style.width = '0px';
                bar_h300.style.width = '0px';
                bar_h200.style.width = '0px';
                bar_bad.style.width = '0px';
            }
        }
      	
  } catch (err) { console.log(err); };
};