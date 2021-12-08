//システム系
var mode = 0; //mode 0タイトル画面　1探索画面　2戦闘画面
var nextMode=0; //次に遷移するモード
var modeAnimation = 0; //nextmodeにうつるタイミング
var messageWindow=0;//メッセージウィンドウの表示非表示
var myPicWindow=0;//マイピク描画画面の表示非表示
var menuWindow=0;//メニューウィンドウの表示非表示
var shopWindow=0;//ショップウィンドウの表示非表示
var globalTime=0;//タイム　1ループで1増える
var isFirst=localStorage.getItem("xpos");//初回起動時かどうかを確認
const modeChangeAniSpeed=30;

//フィールド系
var myposx=0,myposy=0, myposworld=0;//キャラクターの位置　x：横　y:縦　world:ワールド番号
const fieldnum=5;//フィールドの数

//描画系
const width = 960, height = 540; //ウィンドウのサイズ
const mainfontName="Reggae One";
var ctx2d; //メインキャンバス
var field2d;//フィールドキャンバスのコンテキスト
var spacekey=false, leftkey=false, upkey=false, rightkey=false, downkey=false;
var zkey=0,xkey=0,ckey=0,vkey=0, bkey=0;
var characanvas,fieldcanvas,fieldbackcanvas; //プリレンダリング用のキャンバス fieldcanvasは前景、fieldbackcanvasは背景（当たり判定なし）
var items=[[0,39],[1,39],[2,3],[3,4],[4,2],[5,1],[6,30],[7,50],[8,5],[9,33],[10,2],[23,7],[24,7],[26,7],[27,7],[28,7],[29,2],[31,3],[32,4],[33,7],[35,7],[36,1]];
var mypic=[0,1,2,3,4,5];//ストックでの管理番号
var mypicstock=[
    ["うああ",[[0,10,30,25,15],[0,25,15,40,30],[0,60,30,75,15],[0,75,15,90,30],[0,30,70,50,90],[0,50,90,70,70]],250,300,50,50,100,100,[4,20,30,9],5,100,3,2,120,4,0,0],
    ["机",[[0,10,30,25,15],[0,25,15,40,30],[0,60,30,75,15],[0,75,15,90,30],[0,30,70,50,90],[0,50,90,70,70]],200,300,50,50,100,100,[0,1,2,3],5,100,3,3,3100,4,0,0],
    ["たらこ",[[1,50,50,50],[0,10,30,25,15],[0,25,15,40,30],[0,60,30,75,15],[0,75,15,90,30],[0,30,70,50,90],[0,50,90,70,70]],300,300,50,50,100,100,[0,1,2,3],5,100,3,99,99999,4,0,0],
    ["きのみ",[[0,0,0,10,10]],300,300,50,50,100,100,[0,1,2,3],5,100,3,12,5000,4,0,0],
    ["タバコ",[[0,0,0,10,10]],300,300,50,50,100,100,[0,1,2,3],5,100,3,12,4908,4,0,0],
    ["酒",[[0,0,0,10,10]],300,300,50,50,100,100,[0,1,2,3],5,100,3,32,32000,4,1,0],
    ["ベッド",[[0,10,30,25,15],[0,25,15,40,30],[0,60,30,75,15],[0,75,15,90,30],[0,30,70,50,90],[0,50,90,70,70]],300,300,50,50,100,100,[0,1,2,3],5,100,3,2,120,4,2,0],
    ["たまぼ",[[0,10,30,25,15],[0,25,15,40,30],[0,60,30,75,15],[0,75,15,90,30],[0,30,70,50,90],[0,50,90,70,70]],300,300,50,50,100,100,[0,1,2,3],5,100,3,3,3100,4,3,0],
    ["キャビア",[[1,50,50,50],[0,10,30,25,15],[0,25,15,40,30],[0,60,30,75,15],[0,75,15,90,30],[0,30,70,50,90],[0,50,90,70,70]],300,300,50,50,100,100,[0,1,2,3],5,100,3,99,99999,4,4,0],
]//管理番号、名前、形状、今のHP(2)、maxHP(3)、今のDP(4)、maxDP(5)、攻撃(6)、防御(7)、わざリスト(8)、運(9)、素早さ(10)、特性(11)、レベル(12)、経験値(13)、何番目の技まで覚えてるか 0は何も覚えていない(14)、属性(15)、種族値(16)
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
    if(mykey=="b") bkey=true;
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
    if(mykey=="b") bkey=false;
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
    document.getElementById("mainCanvas").addEventListener('mousedown', function(e) {
        clickEveDraw(e.clientX-document.getElementById("mainCanvas").getBoundingClientRect().left,
        e.clientY-document.getElementById("mainCanvas").getBoundingClientRect().top)
    });
    document.getElementById("mainCanvas").addEventListener('mousemove', function(e) {
        moveEveDraw(e.clientX-document.getElementById("mainCanvas").getBoundingClientRect().left,
        e.clientY-document.getElementById("mainCanvas").getBoundingClientRect().top)
    });
});

if (isFirst==undefined){//初回起動時だったら
    isFirst=1;
    resetData();
    selectTitleNum=0;
} else {
    isFirst=0;
}

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

        if(encount || bkey) mode=2, onMessage=true,battleLaunchFlg=1,encount=0;//バトル開始の処理

        //各モジュールのMain関数を呼び出し
        if (mode == 0){ //タイトル
            titleMain();
        } else if(mode == 1) { //フィールド
            fieldMain();
        } else if(mode == 2){　//バトル
            battleMain();
        }
        messageMain();
        ctx2d.fillStyle="rgba(0,0,0," +(1-Math.abs(modeAnimation-modeChangeAniSpeed)/modeChangeAniSpeed)+")";
        ctx2d.fillRect(0,0,width,height);

        if (modeAnimation && (modeAnimation-2*modeChangeAniSpeed)) modeAnimation++;
        if(!(modeAnimation-modeChangeAniSpeed)) fieldReDrawFlg=1,mode=nextMode,initiate_field(),menuWindow=0;
        if (!(modeAnimation-2*modeChangeAniSpeed)) modeAnimation=0;

        globalTime++;
        requestAnimationFrame(tick); //次のフレーム呼び出し（再帰）
    }
}