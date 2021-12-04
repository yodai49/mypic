var mode = 0; //mode 0タイトル画面　1探索画面　2戦闘画面
var nextMode=0; //次に遷移するモード
var modeAnimation = 1; //nextmodeにうつるタイミング
var messageWindow=0;//メッセージウィンドウの表示非表示
var myPicWindow=0;//マイピク描画画面の表示非表示
var menuWindow=0;//メニューウィンドウの表示非表示
var shopWindow=0;//ショップウィンドウの表示非表示
const width = 960, height = 540; //ウィンドウのサイズ
var ctx2d; //メインキャンバス
var spacekey=false;
var leftkey=false, upkey=false, rightkey=false, downkey=false;

function keypress(mykey,mykeycode){ //キー入力イベント
    if(mykey=="z"){
        window.alert("z");
    }
    else if(mykey==" "){
        spacekey=true;
    }
    else if(mykeycode==37){
        leftkey=true;
    }
    else if(mykeycode==38){
        upkey=true;
    }
    else if(mykeycode==39){
        rightkey=true;
    }
    else if(mykeycode==40){
        downkey=true;
    }
    else if(mykey=="b"){
        onBattle=true;
    }
}

window.addEventListener('load', init); //ロードイベント登録
window.addEventListener('DOMContentLoaded', function(){ ///キー入力イベント登録
    window.addEventListener("keydown", function(e){
        keypress(e.key,e.keyCode);
    });
});

function init() {
    //2Dの処理
    ctx2d=document.getElementById("mainCanvas").getContext("2d");
    ctx2d.width = width;
    ctx2d.height = height;

    tick();

    function tick() { //メイン関数
        //2次元のリセット処理
        ctx2d.clearRect(0,0,width,height);

        //各モジュールのMain関数を呼び出し
        battleMain();
        fieldMain();
        mypicMain();
        messageMain();

        ctx2d.fillStyle="rgba(255,255,0,1.0)";
        ctx2d.fillRect(30,30,30,30);

        requestAnimationFrame(tick); //次のフレーム呼び出し（再帰）
    }
}