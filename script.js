//システム系
var mode = 2; //mode 0タイトル画面　1探索画面　2戦闘画面
var nextMode=0; //次に遷移するモード
var modeAnimation = 1; //nextmodeにうつるタイミング
var messageWindow=0;//メッセージウィンドウの表示非表示
var myPicWindow=0;//マイピク描画画面の表示非表示
var menuWindow=0;//メニューウィンドウの表示非表示
var shopWindow=0;//ショップウィンドウの表示非表示

//フィールド系
var myposx=0,myposy=0, myposworld=0;//キャラクターの位置　x：横　y:縦　world:ワールド番号
const fieldnum=5;//フィールドの数

//描画系
const width = 960, height = 540; //ウィンドウのサイズ
const mainfontName="Reggae One";
var ctx2d; //メインキャンバス
var field2d;//フィールドキャンバスのコンテキスト
var spacekey=false, leftkey=false, upkey=false, rightkey=false, downkey=false;
var zkey;
var characanvas,fieldcanvas,fieldbackcanvas; //プリレンダリング用のキャンバス fieldcanvasは前景、fieldbackcanvasは背景（当たり判定なし）

function keypress(mykey,mykeycode){ //キー入力イベント
    if(mykey=="z") zkey=true;
    if(mykey==" ") spacekey=true;
    if(mykeycode==37) leftkey=true;
    if(mykeycode==38) upkey=true;
    if(mykeycode==39) rightkey=true;
    if(mykeycode==40) downkey=true;
    if(mykey=="b") onBattle=true;
}
function keyup(mykey,mykeycode){ //キー離したときのイベント
    if(mykey=="z") zkey=false;
    if(mykey==" ") spacekey=false;
    if(mykeycode==37) leftkey=false;
    if(mykeycode==38) upkey=false;
    if(mykeycode==39) rightkey=false;
    if(mykeycode==40) downkey=false;
}

window.addEventListener('load', init); //ロードイベント登録
window.addEventListener('DOMContentLoaded', function(){ ///キー入力イベント登録
    window.addEventListener("keydown", function(e){
        keypress(e.key,e.keyCode);
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }    
    });
    window.addEventListener("keyup", function(e){
        keyup(e.key,e.keyCode);
    });
});

//起動時の処理//
initiate_field();

function init() {
    //2Dの処理
    ctx2d=document.getElementById("mainCanvas").getContext("2d");
    field2d=document.getElementById("fieldCanvas").getContext("2d");
    ctx2d.width = width,ctx2d.height = height;
    field2d.width=width,field2d.height=height;

    tick();

    function tick() { //メイン関数
        //2次元のリセット処理
        ctx2d.clearRect(0,0,width,height);

        //各モジュールのMain関数を呼び出し
        if (mode == 0){ //タイトル

        } else if(mode == 1) { //フィールド
            fieldMain();
        } else if(mode == 2){　//バトル
            battleMain();
        }
        mypicMain();
        messageMain();

        requestAnimationFrame(tick); //次のフレーム呼び出し（再帰）
    }
}