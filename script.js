var t = 0; //time
var mode = 0; //mode 0タイトル画面　1セレクト画面　2プレイ画面　3リザルト画面　
var animationmax = 1; //nextmodeにうつるタイミング
var animationcnt=0; //アニメーションのカウンター 1でスタート -1処理前
var nextmode=0; //次にうつるモード

// ページの読み込みを待つ


function keypress(mykey,mykeycode){ //キー入力イベント
    if(mykey=="z"){
        window.alert("z");
    }
}

window.addEventListener('load', init); //ロードイベント登録
window.addEventListener('DOMContentLoaded', function(){ ///キー入力イベント登録
    window.addEventListener("keydown", function(e){
      keypress(e.key,e.keyCode);
    });
});

function init() {
    //ローディング処理////////////////////////////////////////

    // サイズを指定
    const width = 960;
    const height = 540;

    //2Dの処理
    ctx2d=document.getElementById("myCanvas2").getContext("2d");
    ctx2d.width = width;
    ctx2d.height = height;

    tick();

    function tick() {
        t++;//システム系の処理
        //2次元のリセット処理
        ctx2d.clearRect(0,0,width,height);

        ctx2d.fillStyle="rgba(255,255,0,1.0)";
        ctx2d.fillRect(30+t,30,30,30);

        requestAnimationFrame(tick);
    }
}