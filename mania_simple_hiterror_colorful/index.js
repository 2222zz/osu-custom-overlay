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
for (var t = 0; t < 100; t++) {
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
let tickPos = [];
let fullPos;
let tempAvg;
let tempSmooth;
let currentErrorValue = [];
let preHitErrorArrayLength = 0;
let hitErrorArrayPos = [];

let error_320 = 16;
let error_300 = 0;
let error_200 = 0;
let error_100 = 0;
let error_50 = 0;
let error_0 = 0;

function calculate_od(temp){
    error_300 = 64 - (3 * temp);
    error_200 = 97 - (3 * temp);
    error_100 = 127 - (3 * temp);
    error_50 = 151 - (3 * temp);
    error_0 = 188 - (3 * temp);
}

socket.onmessage = event => {
    let data = JSON.parse(event.data);
    if (state !== data.menu.state) {
        state = data.menu.state;
        if (state !== 2) {
            for (var y = 0; y < 100; y++) {
                tick[y].style.transform = "translateX(0)";
                tick[y].style.opacity = 0;
            }
            tickPos = [];
            tempAvg = 0;
            arrow.style.transform = "translateX(0)";  
            bar.style.opacity = 0;
            early.style.opacity = 0;
            late.style.opacity = 0;
        } else {
            tickPos = [];
            currentErrorValue = [];
            hitErrorArrayPos = [];
            preHitErrorArrayLength = 0;
            tempHitErrorArrayLength = 0;

            bar.style.opacity = 1;
            early.style.opacity = 1;
            late.style.opacity = 1;
            calculate_od(data.menu.bm.stats.memoryOD);
            
            setTimeout(function(){
                early.style.opacity = 0;
                late.style.opacity = 0;
            }, 1200);
        }
    }
    if (data.gameplay.hits.unstableRate == 0) {
        for (var y = 0; y < 100; y++) {
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
            preHitErrorArrayLength = tempHitErrorArrayLength;
            tempHitErrorArrayLength = tempSmooth.length;
            tickPos = [];
            currentErrorValue = [];
            hitErrorArrayPos = [];

            for (var a = 0; a < tempHitErrorArrayLength; a++) {
                tempAvg = tempAvg * 0.90 + tempSmooth[a] * 0.1;
            }
            fullPos = (-10 * OD + 199.5);

            // push hitErrorValue
            for(var b = preHitErrorArrayLength; b < tempHitErrorArrayLength; b++){
                tickPos.push((data.gameplay.hits.hitErrorArray[b] / fullPos * 145));
                currentErrorValue.push((data.gameplay.hits.hitErrorArray[b]));
                hitErrorArrayPos.push(b);
            }
            //tickPos = data.gameplay.hits.hitErrorArray[tempHitErrorArrayLength - 1] / fullPos * 145;
            //currentErrorValue = data.gameplay.hits.hitErrorArray[tempHitErrorArrayLength - 1];

            // s: adjust arrow
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
            // e: adjst arrow

            for(var c = 0; c < hitErrorArrayPos.length; c++){
                var curTickPos = hitErrorArrayPos[c] % 100;
                tick[curTickPos].style.opacity = 1;
                tick[curTickPos].style.transform = `translateX(${tickPos[c]}px)`;

                if(currentErrorValue[c] >= -(error_320) && currentErrorValue[c] <= error_320){
                    tick[curTickPos].style.backgroundColor = '#FFF';
                }
                else if(currentErrorValue[c] >= -(error_300) && currentErrorValue[c] <= error_300){
                    tick[curTickPos].style.backgroundColor = '#FFA500';
                }
                else if(currentErrorValue[c] >= -(error_200) && currentErrorValue[c] <= error_200){
                    tick[curTickPos].style.backgroundColor = '#228B22';
                }
                else if(currentErrorValue[c] >= -(error_100) && currentErrorValue[c] <= error_100){
                    tick[curTickPos].style.backgroundColor = '#1E90FF';
                }
                else if(currentErrorValue[c] >= -(error_50) && currentErrorValue[c] <= error_50){
                    tick[curTickPos].style.backgroundColor = '#FF69B4';
                }
                else{
                    tick[curTickPos].style.backgroundColor = '#DC143C';
                }

                $("#tick" + curTickPos).stop().animate({opacity : 0}, 1200);

            }
        }
    }

}
