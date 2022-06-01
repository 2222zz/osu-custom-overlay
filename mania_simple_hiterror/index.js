// made by 2ky(@s2skky)

//no touch
let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");
socket.onopen = () => {
    console.log("Successfully Connected");
};
socket.onclose = event => {
    console.log("Socket Closed Connection: ", event);
    socket.send("Client Closed!");
};
socket.onerror = error => {
    console.log("Socket Error: ", error);
};


let tick = [];
for (var t = 0; t < 30; t++) {
    tick[t] = document.querySelectorAll("[id^=tick]")[t];
}

let bar = document.getElementById("bar");
let center = document.getElementById("center");
let arrow = document.getElementById("arrow");

let early = document.getElementById("early");
let late = document.getElementById("late");

let state;
let cur_ur;
let cur_combo;

let tempHitErrorArrayLength;
let OD = 0;
let tickPos;
let fullPos;
let tempAvg;
let tempSmooth;

socket.onmessage = event => {
    let data = JSON.parse(event.data);
    if (state !== data.menu.state) {
        state = data.menu.state;
        if (state !== 2) {
            for (var y = 0; y < 30; y++) {
                tick[y].style.transform = "translateX(0)";
                tick[y].style.opacity = 0;
            }
            tickPos = 0;
            tempAvg = 0;
            arrow.style.transform = "translateX(0)";  
            bar.style.opacity = 0;
            early.style.opacity = 0;
            late.style.opacity = 0;
        } else {
            bar.style.opacity = 1;
            early.style.opacity = 1;
            late.style.opacity = 1;
            
            setTimeout(function(){
                early.style.opacity = 0;
                late.style.opacity = 0;
            }, 1200);
        }
    }
    if (data.gameplay.hits.unstableRate == 0) {
        for (var y = 0; y < 30; y++) {
            tick[y].style.transform = "translateX(0)";
            tick[y].style.opacity = 0;
        }
        arrow.style.transform = "translateX(0)";
    }
    if (cur_ur !== data.gameplay.hits.unstableRate) {
        cur_ur = data.gameplay.hits.unstableRate;
        tempAvg = 0;      
    }
    
    //source reference -> TryZCustomOverlay(made by FukutoTojido)
    if (cur_combo !== data.gameplay.combo.current) {
        OD = data.menu.bm.stats.memoryOD;
        cur_combo = data.gameplay.combo.current;
        tempSmooth = smooth(data.gameplay.hits.hitErrorArray, 4);
        if (tempHitErrorArrayLength !== tempSmooth.length) {
            tempHitErrorArrayLength = tempSmooth.length;
            for (var a = 0; a < tempHitErrorArrayLength; a++) {
                tempAvg = tempAvg * 0.90 + tempSmooth[a] * 0.1;
            }
            fullPos = (-10 * OD + 199.5);
            tickPos = data.gameplay.hits.hitErrorArray[tempHitErrorArrayLength - 1] / fullPos * 145;
            arrow.style.transform = `translateX(${(tempAvg / fullPos) * 150}px)`;
            if((tempAvg / fullPos) * 150 > 2.5){
                arrow.style.borderColor = "#FF4040 transparent transparent transparent"
            }
            else if((tempAvg / fullPos) * 150 < -2.5){
                arrow.style.borderColor = "#1985FF transparent transparent transparent"
            }
            else{
                arrow.style.borderColor = "white transparent transparent transparent"
            }
            for (var c = 0; c < 30; c++) {
                if ((tempHitErrorArrayLength % 30) == ((c + 1) % 30)) {
                    tick[c].style.opacity = 1;
                    tick[c].style.transform = `translateX(${tickPos}px)`;
                    var s = document.querySelectorAll("[id^=tick]")[c].style;
                    s.opacity = 1;
                    (function fade() {
                        (s.opacity -= .05) < 0 ? s.opacity = 0 : setTimeout(fade, 125)
                    })();
                }
            }
        }
    }

}
