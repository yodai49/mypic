//システム系
var mode = 1; //mode 0タイトル画面　1探索画面　2戦闘画面
var nextMode=0; //次に遷移するモード
var modeAnimation = 1; //nextmodeにうつるタイミング
var messageWindow=0;//メッセージウィンドウの表示非表示
var myPicWindow=0;//マイピク描画画面の表示非表示
var menuWindow=0;//メニューウィンドウの表示非表示
var shopWindow=0;//ショップウィンドウの表示非表示
var globalTime=0;//タイム　1ループで1増える

//フィールド系
var myposx=0,myposy=0, myposworld=0;//キャラクターの位置　x：横　y:縦　world:ワールド番号
const fieldnum=5;//フィールドの数

//描画系
const width = 960, height = 540; //ウィンドウのサイズ
const mainfontName="Reggae One";
var ctx2d; //メインキャンバス
var field2d;//フィールドキャンバスのコンテキスト
var spacekey=false, leftkey=false, upkey=false, rightkey=false, downkey=false;
var zkey=0,xkey=0,ckey=0,vkey=0;
var characanvas,fieldcanvas,fieldbackcanvas; //プリレンダリング用のキャンバス fieldcanvasは前景、fieldbackcanvasは背景（当たり判定なし）
var items=[[0,39],[1,39],[2,3],[3,39],[4,3],[5,39],[6,3],[7,39],[8,3],[9,3],[10,39],[11,3]];
var mypic=[
    [0,"椅子",[[0,10,30,25,15],[0,25,15,40,30],[0,60,30,75,15],[0,75,15,90,30],[0,30,70,50,90],[0,50,90,70,70]],300,300,50,50,100,100,98,5,100,3],
    [0,"机",[[0,10,30,25,15],[0,25,15,40,30],[0,60,30,75,15],[0,75,15,90,30],[0,30,70,50,90],[0,50,90,70,70]],300,300,50,50,100,100,98,5,100,3],
    [0,"たらこ",[[1,50,50,50],[0,10,30,25,15],[0,25,15,40,30],[0,60,30,75,15],[0,75,15,90,30],[0,30,70,50,90],[0,50,90,70,70]],300,300,50,50,100,100,98,5,100,3],
    [0,"きのみ",[[0,0,0,10,10]],300,300,50,50,100,100,98,5,100,3],
    [0,"タバコ",[[0,0,0,10,10]],300,300,50,50,100,100,98,5,100,3],
    [0,"酒",[[0,0,0,10,10]],300,300,50,50,100,100,98,5,100,3]
]//管理番号、名前、形状、今のHP、maxHP、今のMP、maxMP、攻撃、防御、命中、運、素早さ、特性
//形状は[形,x,y,dx,dy] 形は0:線　1:円　円はdyはなし、dxが半径

function keypress(mykey,mykeycode){ //キー入力イベント
    if(mykey=="z") zkey=true;
    if(mykey=="x") xkey=true;
    if(mykey=="c") ckey=true;
    if(mykey=="v") vkey=true;
    if(mykey==" ") spacekey=true;
    if(mykeycode==37) leftkey=true;
    if(mykeycode==38) upkey=true;
    if(mykeycode==39) rightkey=true;
    if(mykeycode==40) downkey=true;
    if(mykey=="b") onBattle=true;
}
function keyup(mykey,mykeycode){ //キー離したときのイベント
    if(mykey=="z") zkey=false;
    if(mykey=="x") xkey=false;
    if(mykey=="c") ckey=false;
    if(mykey=="v") vkey=false;
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

        globalTime++;
        requestAnimationFrame(tick); //次のフレーム呼び出し（再帰）
    }
}