// connecting to websocket
import WebSocketManager from './deps/socket.js';

const socket = new WebSocketManager('127.0.0.1:24050');



// cache values here to prevent constant updating
const cache = {};

var cycle = '';
var cycle2 = '0';

var npBarTranslateOn;
var npBarTranslateOff;
var loadingBgTranslateOn;
var loadingBgTranslateOff;

if(subcontent == 'pp') document.getElementById("subcontentText").innerHTML = 'PP';
else if(subcontent == 'ur') document.getElementById("subcontentText").innerHTML = 'UnstableRate'

// animate setting
if(animatedType == 'us'){
    npBarTranslateOn        = "translateY(0px)";
    npBarTranslateOff       = "translateY(700px)"
    loadingBgTranslateOn    = "translateY(700px)"
    loadingBgTranslateOff   = "translateY(0px)";

}
else if(animatedType == 'ls'){
    npBarTranslateOn    = "translateX(0px)";
    npBarTranslateOff   =  "translateX(-500px)"
    loadingBgTranslateOn    = "translateX(-500px)"
    loadingBgTranslateOff   = "translateX(0px)";
}
else if(animatedType == 'rs'){
    npBarTranslateOn    = "translateX(0px)";
    npBarTranslateOff   =  "translateX(500px)"
    loadingBgTranslateOn    = "translateX(500px)"
    loadingBgTranslateOff   = "translateX(0px)";
}
// bk loadingBg option
else{
    loadingBgTranslateOn    = "translateY(700px)"
    loadingBgTranslateOff   = "translateY(0px)";
}






socket.api_v2(({ state, settings, session, profile, performance, resultsScreen, play, beatmap, directPath, folders, leaderboard }) => {

    if (cache['data.menu.state'] != state.number) {
        cache['data.menu.state'] = state.number;

        // 플레이 중
        if(state.number == '2'){
            cycle = '';
            cycle2 = '0';

            // 항목 표시
            const npBar = document.getElementById("npBar");
            npBar.style.transition = 'all 0.5s ease-out'

            if(animatedType == 'bk')
                npBar.style.opacity = 1;
            else
                npBar.style.transform = npBarTranslateOn

            // npBar 로딩 완료후
            setTimeout(function(){

                // 로딩 항목 표기
                const loading = document.getElementById("loading");
                loading.style.opacity = 1;

                // 로딩 항목 표기 완료 후
                setTimeout(function(){
                    // 로딩 게이지
                    const loadingBarGauge = document.getElementById("loadingBarGauge");
                    loadingBarGauge.style.width = '100%';

                    // 로딩 게이지 완료 후
                    setTimeout(function(){
                        // 내리기
                        const loadingText = document.getElementById("loadingText");
                        loadingText.innerHTML = "Completed";
                        loadingText.style.animation = "blink 0.05s linear infinite";

                        setTimeout(function(){
                            loadingText.style.animation = "";
                            const loadingBg = document.getElementById("loadingBg");
                            loadingBg.style.transform = loadingBgTranslateOn;

                            setTimeout(function(){
                                loading.style.opacity = 0;
                                loadingText.innerHTML = "Loading...";
                            }, 1000)
                        }, 500)
                    }, 1500);
                }, 500);
            }, 500);

            
        }
        // 플레이중 아님
        else{
            cycle = '';
            cycle2 = '0';

            const subArea = document.getElementById("subArea");
            const subArea2 = document.getElementById("subArea2");
            
            subArea2.style.transition = 'all 1s ease-in'
            subArea2.style.transform = "translateY(300px)";

            setTimeout(() => {
                subArea.style.transition = 'all 1s ease-out'
                subArea.style.transform = "translateY(0px)";
            }, 300);


            const loadingBg = document.getElementById("loadingBg");
            loadingBg.style.transform = loadingBgTranslateOff;

            const npBar = document.getElementById("npBar");
            npBar.style.transition = 'all 0.5s ease-in'
            const loadingBarGauge = document.getElementById("loadingBarGauge");
            loadingBarGauge.style.width = '0%';

            setTimeout(function(){
                if(animatedType == 'bk')
                    npBar.style.opacity = 0;
                else
                    npBar.style.transform = npBarTranslateOff;
            }, 500);
        }
    }


    // change img disk
    if (cache['menu.bm.path.full'] != directPath.beatmapBackground) {
        cache['menu.bm.path.full'] = directPath.beatmapBackground;
    
        const background_path = directPath.beatmapBackground.replace(folders.songs, '');
        const background_path_div = background_path.replace(/%/g, '%25').replace(/#/g, '%23').replace(/\'/g, '%27').replace(/\\/g, '/');
    
        const background = document.getElementById("beatmap_img");
        const background_bar = document.getElementById("background_blur");

        console.log(directPath.beatmapBackground);
        console.log(background_path);
    
        background.src = `http://127.0.0.1:24050/Songs${background_path_div}`;
        background_bar.style.backgroundImage = `url('http://127.0.0.1:24050/Songs${background_path_div}')`;
    
    
        const image = new Image();
        image.src = `http://127.0.0.1:24050/Songs${background_path_div}`;

        // image.onerror = () => document.querySelector('.backgroundLoadError').classList.add('active');
        // image.onload = () => document.querySelector('.backgroundLoadError').classList.remove('active');
    };

    if(cache['np'] != beatmap.artist + '-' + beatmap.title){
        cache['np'] = beatmap.artist + '-' + beatmap.title;

        const title = document.getElementById("title");
        const artist = document.getElementById("artist");

        title.innerHTML = beatmap.title;
        title.style.width = 'max-content';
        const titleWidth = title.offsetWidth;

        if (titleWidth >= 220) {
            title.classList.add("over");
            let slideTime = 5 * titleWidth / 220;
            title.style.animation = "slide " + slideTime + "s linear infinite";
        } else {
            title.style.width = '220px';
            title.style.animation = "";
            title.classList.remove("over");
        }

        artist.innerHTML = beatmap.artist;
        artist.style.width = 'max-content';
        const artistWidth = artist.offsetWidth;

        if (artistWidth >= 180) {
            artist.classList.add("over2");
            let slideTime = 5 * artistWidth / 180;
            artist.style.animation = "slide2 " + slideTime + "s linear infinite";
        } else {
            artist.style.width = '180px';
            artist.style.animation = "";
            artist.classList.remove("over2");
        }
    }

    // time
    if(cache['time.live'] != beatmap.time.live){
        cache['time.live'] = beatmap.time.live;

        // 프로그레스 설정
        const pgrsBarBg = document.getElementById("pgrsBarBg");
        const pgrsBar = document.getElementById("pgrsBar");
        const pgrsBarCircle = document.getElementById("pgrsBarCircle");
        
        const width = window.getComputedStyle(pgrsBarBg).getPropertyValue('width').replace('px', '');

        const bg_left = window.getComputedStyle(pgrsBarBg).getPropertyValue('left').replace('px', '');
        const circle_width = window.getComputedStyle(pgrsBarCircle).getPropertyValue('width').replace('px', '');

        const left = parseFloat(bg_left) - (parseFloat(circle_width) / 2);
        var result = (beatmap.time.live / beatmap.time.lastObject);

        // 너비 초과한 경우 최대로 고정
        if(result > 1) result = 1;
        
        // 프로그레스 너비 설정
        pgrsBar.style.width = (result * parseFloat(width)) + 'px';

        // 프로그레스 써클 설정
        pgrsBarCircle.style.left = (parseFloat(left) + (result * parseFloat(width))) + 'px' 


        // 프로그레스 타임 설정
        const sTime = document.getElementById("sTime");
        const eTime = document.getElementById("eTime");


        // 라이브 타임 설정
        var liveTimeSec = Math.floor((beatmap.time.live) / 1000);
        var liveTimeMin = Math.floor((liveTimeSec) / 60);

        var live = '';
        if(beatmap.time.live > 0)   var live = liveTimeMin + ':' + ('00' + (liveTimeSec % 60)).slice(-2);
        else live = '00:00';

        

        // 전체 시간 설정
        var totalTimeSec = Math.floor((beatmap.time.lastObject) / 1000);
        var totalTimeMin = Math.floor((totalTimeSec) / 60);

        var total = totalTimeMin + ':' + ('00' + (totalTimeSec % 60)).slice(-2);
    
        sTime.innerHTML = live;
        eTime.innerHTML = total;


        // 15초마다 서브아레나 변경
        // 플레이중인 경우에만
        if(state.number == '2'){
            const subArea = document.getElementById("subArea");
            const subArea2 = document.getElementById("subArea2");
            if(beatmap.time.live < 0){}
            else{
                const hz = Math.floor((beatmap.time.live) / 1000);
                
                if((hz % 15) == 0){
                    if(cycle == '1'){
                        if(cycle2 == '0'){
                            subArea.style.transition = 'all 1s ease-in'
                            subArea.style.transform = "translateY(300px)";

                            setTimeout(() => {
                                subArea2.style.transition = 'all 1s ease-out'
                                subArea2.style.transform = "translateY(0px)";
                            }, 300);

                            cycle = '0';
                            cycle2 = '1';
                        }
                        else if(cycle2 == '1'){
                            subArea2.style.transition = 'all 1s ease-in'
                            subArea2.style.transform = "translateY(300px)";

                            setTimeout(() => {
                                subArea.style.transition = 'all 1s ease-out'
                                subArea.style.transform = "translateY(0px)";
                            }, 300);

                            cycle = '0';
                            cycle2 = '0';
                        }
                    }
                } 
                else{
                    cycle = '1';
                }
            }
        }
    }

    // star
    if(cache['stars.total'] != beatmap.stats.stars.total){
        cache['stars.total'] = beatmap.stats.stars.total;

        const sr = document.getElementById("sr");

        sr.innerHTML = beatmap.stats.stars.total.toFixed(2);
    }

    // od
    if(cache['stats.od'] != beatmap.stats.od.original){
        
        cache['stats.od'] = beatmap.stats.od.original;

        const od = document.getElementById("od");

        od.innerHTML = beatmap.stats.od.original.toFixed(1);
    }

    // hp
    if(cache['stats.hp'] != beatmap.stats.hp.original){
        cache['stats.hp'] = beatmap.stats.hp.original;

        const hp = document.getElementById("hp");

        hp.innerHTML = beatmap.stats.hp.original.toFixed(1);
    }

    //bpm
    if(cache['stats.bpm'] != beatmap.stats.bpm.common){
        cache['stats.bpm'] = beatmap.stats.bpm.common;

        const bpm = document.getElementById("bpm");

        bpm.innerHTML = beatmap.stats.bpm.common.toFixed(0);
    }

    // ur
    if(cache['ur'] != play.unstableRate && subcontent == 'ur'){
        cache['ur'] = play.unstableRate;

        const ur = document.getElementById("ur");

        ur.innerHTML = play.unstableRate.toFixed(2);
    }

    // note
    if(cache['hitcount'] != play.hits.geki + play.hits[300] + play.hits.katu + play.hits[100] + play.hits[50] + play.hits[0]){
        cache['hitcount'] = play.hits.geki + play.hits[300] + play.hits.katu + play.hits[100] + play.hits[50] + play.hits[0];

        const totalNote = document.getElementById("totalNote");

        totalNote.innerHTML = beatmap.stats.objects.total - (play.hits.geki + play.hits[300] + play.hits.katu + play.hits[100] + play.hits[50] + play.hits[0]);
    }


    //pp
    if(cache['pp.current'] != play.pp.current && subcontent == 'pp'){
        cache['pp.current'] = play.pp.current;

        const pp = document.getElementById("ur");

        pp.innerHTML = play.pp.current.toFixed(1) + " / " + performance.accuracy[100].toFixed(1);
    }
});
