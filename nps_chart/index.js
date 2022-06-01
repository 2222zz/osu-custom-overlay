// made by 2ky(@s2skky)

// no touch
let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");
socket.onopen = () => console.log("Successfully Connected");
socket.onclose = event => {
  console.log("Socket Closed Connection: ", event);
  socket.send("Client Closed!");
};
socket.onerror = error => console.log("Socket Error: ", error);

let section = document.getElementById("section");
let myChart = echarts.init(document.getElementById('chart'));
let nps = document.getElementById("nps");
let option;

let state;
let currentTime;
let currentNote;
let previousNote = [0,0,0,0,0,0];
let flag = 0;
let maxNps = 0;
let isRefresh = false;

function displaySection(){   
    section.style.opacity = 1;
}
function setOption(){
}

socket.onmessage = event => {
    try {
        let data = JSON.parse(event.data);
        let menu = data.menu;
        let play = data.gameplay;

        if(menu.bm.time.current > 0){
            currentTime = data.menu.bm.time.current;
        }
        if (menu.bm.time.current > 0 && currentNote !== play.hits.geki + play.hits[300] + play.hits.katu + play.hits[100] + play.hits[50] + play.hits[0]){
            currentNote = play.hits.geki + play.hits[300] + play.hits.katu + play.hits[100] + play.hits[50] + play.hits[0];
        }
        
        if (state !== menu.state){
            state = menu.state;

            option = {
                grid: [
                    {
                        show: true,
                        backgroundColor: '#1A1A1A',
                        borderColor: '#FFFFFF',
                    },
                ],
                xAxis: [
                    {
                        type: 'category',
                        show: false,
                        boundaryGap: true,
                        data: (function (){
                            currentTime = menu.bm.time.current;
                            var res = [];
                            var len = 100;
                            while (len--) {
                                res.unshift(currentTime);
                                currentTime = currentTime - 200;
                            }
                            return res;
                        })()
                    },
                ],
                yAxis: [
                    {
                        type: 'value',
                        show: false,
                        scale: true,
                        name: 'nps',
                        max: 0,
                        min: 0,
                        boundaryGap: [0.2, 0.2],
                    }
                ],
                series: [
                    {
                        name: 'nps',
                        type: 'line',
                        lineStyle:{
                            color:'#FFFFFF' 
                        },
                        symbol: 'none',
                        //smooth: true,
                        yAxisIndex: 0, 
                        data: (function (){
                            var res = [];
                            var len = 0;
                            while (len < 100) {
                                res.push(0);
                                len++;
                            }
                            return res;
                        })()
                    }
                ]
            };
            
            myChart.setOption(option);
            
            if(state == 2){
                setTimeout(displaySection, 1000);
                maxNps = 0;
            }
            else{
                section.style.opacity = 0;
                maxNps = 0;
            }
            
        }
      	
  } catch (err) { console.log(err); };
};

//데이터를 생성하고 삭제합니다.
setInterval(function (){
    flag += 1;
    var value = 0;
    if(flag == 1){
        value = currentNote - previousNote[1];
        previousNote[1] = currentNote;
    }
    else if(flag == 2){
        value = currentNote - previousNote[2];
        previousNote[2] = currentNote;
    }
    else if(flag == 3){
        value = currentNote - previousNote[3];
        previousNote[3] = currentNote;
    }
    else if(flag == 4){
        value = currentNote - previousNote[4];
        previousNote[4] = currentNote;
    }
    else if(flag == 5){
        flag = 0;
        value = currentNote - previousNote[5];
        previousNote[5] = currentNote;
    }
    var axisData = currentTime;
    var data0 = option.series[0].data; 

    data0.shift();
    if(isRefresh){
        data0.push(value);
        nps.innerHTML = value + " Nps";
        if(value > maxNps){
            maxNps = value;
            option.yAxis[0].max = maxNps;
        }
    }
    else
        data0.push(0);
    option.xAxis[0].data.shift();
    option.xAxis[0].data.push(axisData);

    if(flag == 0)
        isRefresh = true;
    myChart.setOption(option);
}, 200);