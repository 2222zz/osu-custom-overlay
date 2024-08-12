// connecting to websocket
import WebSocketManager from './deps/socket.js';

const socket = new WebSocketManager('127.0.0.1:24050');



// cache values here to prevent constant updating
const cache = {};

if(leftContent == 'pp') document.getElementById("ppText").innerHTML = 'Performance';
else if(leftContent == 'ur') document.getElementById("ppText").innerHTML = 'Unstable Rate'



socket.api_v2(({ state, settings, session, profile, performance, resultsScreen, play, beatmap, directPath, folders, leaderboard }) => {

    if (cache['data.menu.state'] != state.number) {
        cache['data.menu.state'] = state.number;

        // 플레이 중
        if(state.number == '2'){

            // hitcount 로딩
            const cntAreaBg = document.getElementById("cntAreaBg");
            cntAreaBg.style.transition = 'all 0.5s ease-in'
            cntAreaBg.style.opacity = 1;

            // 카운트 색상 랜덤 변경
            const cntText = document.querySelectorAll('.cntText');
            var n = Math.floor(Math.random() * (7-1) + 1);
            var color = '';

            if(textColor == 'red')          n = 1;
            else if(textColor == 'orange')  n = 2;
            else if(textColor == 'yellow')  n = 3;
            else if(textColor == 'green')   n = 4;
            else if(textColor == 'blue')    n = 5;
            else if(textColor == 'purple')  n = 6;
            else if(textColor == 'pink')    n = 7;

            if(n == 1)
                color = 'rgba(255, 162, 162, 0.8)';  // red
            else if(n == 2)
                color = 'rgba(255, 204, 162, 0.8)';  // orange
            else if(n == 3)
                color = 'rgba(253, 255, 162, 0.8)';  // yellow
            else if(n == 4)
                color = 'rgba(170, 255, 162, 0.8)';  // green
            else if(n == 5)
                color = 'rgba(162, 213, 255, 0.8)';  // blue
            else if(n == 6)
                color = 'rgba(198, 162, 255, 0.8)';  // purple
            else if(n == 7)
                color = 'rgba(255, 162, 250, 0.8)';  // pink

            for(var i = 0; i < cntText.length; i++)
                cntText[i].style.color = color;
        }
        // 플레이중 아님
        else{

            //히든처리
            const cntAreaBg = document.getElementById("cntAreaBg");
            cntAreaBg.style.transition = 'all 0.5s ease-out'
            cntAreaBg.style.opacity = 0;

        }
    }




    

    //geki
    if(cache['hits.geki'] != play.hits.geki){
        cache['hits.geki'] = play.hits.geki;

        const geki = document.getElementById("geki");

        geki.innerHTML = play.hits.geki;

        $("#gekiDash").css("opacity", "1");
        $("#gekiDash").stop().animate({opacity : 0}, 1000);
    }

    //katu
    if(cache['hits.katu'] != play.hits.katu){
        cache['hits.katu'] = play.hits.katu;

        const katu = document.getElementById("katu");

        katu.innerHTML = play.hits.katu;

        $("#katuDash").css("opacity", "1");
        $("#katuDash").stop().animate({opacity : 0}, 1000);
    }

    //hit300
    if(cache['hits.hit300'] != play.hits[300]){
        cache['hits.hit300'] = play.hits[300];

        const hit300 = document.getElementById("hit300");

        hit300.innerHTML = play.hits[300];

        $("#hit300Dash").css("opacity", "1");
        $("#hit300Dash").stop().animate({opacity : 0}, 1000);
    }

    //hit100
    if(cache['hits.hit100'] != play.hits[100]){
        cache['hits.hit100'] = play.hits[100];

        const hit100 = document.getElementById("hit100");

        hit100.innerHTML = play.hits[100];

        $("#hit100Dash").css("opacity", "1");
        $("#hit100Dash").stop().animate({opacity : 0}, 1000);
    }

    //hit50
    if(cache['hits.hit50'] != play.hits[50]){
        cache['hits.hit50'] = play.hits[50];

        const hit50 = document.getElementById("hit50");

        hit50.innerHTML = play.hits[50];

        $("#hit50Dash").css("opacity", "1");
        $("#hit50Dash").stop().animate({opacity : 0}, 1000);
    }

    //hit0
    if(cache['hits.hit0'] != play.hits[0]){
        cache['hits.hit0'] = play.hits[0];

        const hit0 = document.getElementById("hit0");

        hit0.innerHTML = play.hits[0];

        $("#hit0Dash").css("opacity", "1");
        $("#hit0Dash").stop().animate({opacity : 0}, 1000);
    }

    //pp
    if(cache['pp.current'] != play.pp.current && leftContent == 'pp'){
        cache['pp.current'] = play.pp.current;

        const pp = document.getElementById("pp");

        pp.innerHTML = play.pp.current.toFixed(1) + " / " + performance.accuracy[100].toFixed(1);
    }

    if(cache['ur'] != play.unstableRate && leftContent == 'ur'){
        cache['ur'] = play.unstableRate;

        const ur = document.getElementById("pp");

        pp.innerHTML = play.unstableRate.toFixed(3);
    }
});
