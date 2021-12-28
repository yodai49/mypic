//システム系
var mode = 0; //mode 0タイトル画面　1探索画面　2戦闘画面
var nextMode=0; //次に遷移するモード
var modeAnimation = 0; //nextmodeにうつるタイミング
var messageWindow=0;//メッセージウィンドウの表示非表示
var myPicWindow=0;//マイピク描画画面の表示非表示
var menuWindow=0;//メニューウィンドウの表示非表示
var shopWindow=0;//ショップウィンドウの表示非表示
var globalTime=0;//タイム　1ループで1増える
var titleAni=0;
var isFirst=localStorage.getItem("xpos");//初回起動時かどうかを確認
var isFromFirst=0;///はじめからを選択した場合1を格納
var materialVisible=[];//マテリアルをゲットしたことがあれば1
var popupMsg=[];//ポップアップで表示するメッセージを格納 形式[msgの内容、生き残り時間、0、ディレイ、ピクチャ(なにもないなら[]を指定)]
const modeChangeAniSpeed=30;

//フィールド系
var myposx=0,myposy=0, myposworld=0;//キャラクターの位置　x：横　y:縦　world:ワールド番号
var fieldItemStatus,nextEventNum=0,fieldCharaStatus=[];
var fieldHumanStatus;
const fieldnum=5;//フィールドの数

//描画系　コンフィグはここ
const width = 960, height = 540; //ウィンドウのサイズ
const mainfontName="Stick";
const currencyName="マイル";
var ctx2d; //メインキャンバス
var field2d;//フィールドキャンバスのコンテキスト
var fieldback2d;//フィールドの背景キャンバスのコンテキスト　当たり判定なし
var spacekey=false, leftkey=false, upkey=false, rightkey=false, downkey=false;
var zkey=0,xkey=0,ckey=0,vkey=0, bkey=0;
var characanvas,fieldPreCanvas,fieldcanvas,fieldbackcanvas; //プリレンダリング用のキャンバス fieldcanvasは前景、fieldbackcanvasは背景（当たり判定なし）
var items=[[0,39],[1,39],[2,3],[3,4],[4,2],[5,1],[6,30],[7,50],[8,5],[9,33],[10,2],[23,7],[24,7],[26,7],[27,7],[28,7],[29,2],[31,3],[32,4],[33,7],[35,7],[36,1]];
var money=0;
var mypic=[0,1,2,3,4,5];//ストックでの管理番号
var mypicstock=[
    ["うああ",[[0,10,30,25,15],[0,25,15,40,30],[0,60,30,75,15],[0,75,15,90,30],[0,30,70,50,90],[0,50,90,70,70]],250,300,50,50,100,100,[4,20,30,9],5,100,3,2,120,[],0,0],
    ["机",[[0,10,30,25,15],[0,25,15,40,30],[0,60,30,75,15],[0,75,15,90,30],[0,30,70,50,90],[0,50,90,70,70]],200,300,50,50,100,100,[0,1,2,3],5,100,3,3,3100,[],0,0]
]//管理番号、名前、形状、今のHP(2)、maxHP(3)、今のDP(4)、maxDP(5)、攻撃(6)、防御(7)、わざリスト(8)、運(9)、素早さ(10)、特性(11)、レベル(12)、経験値(13)、衝突チェックの技リスト(14)、属性(15)、種族値(16)
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

function checkfirstLaunch(){
    isFirst=localStorage.getItem("myposx");
    if (isFirst==undefined){//初回起動時だったら
        isFirst=1;
        resetData();
        selectTitleNum=0;
    } else {
        isFirst=0;
    }    
}

//起動時の処理//
checkfirstLaunch();
fieldCanvasCreate();
initiate_field();

for(var i = 0;i < 50;i++ )nowMaterialData[i]=[];
for(var i = 0;i < 50;i++){
    lastFieldVisit[i]=-1;
}

function init() {
    //2Dの処理
    ctx2d=document.getElementById("mainCanvas").getContext("2d");
    field2d=document.getElementById("fieldCanvas").getContext("2d");
    fieldback2d=document.getElementById("fieldbackCanvas").getContext("2d");
    ctx2d.width = width,ctx2d.height = height;
    field2d.width=width,field2d.height=height;

    tick();

    function tick() { //メイン関数
        //2次元のリセット処理
//        console.log("2:"+oneMoveFlg, globalTime)
        ctx2d.clearRect(0,0,width,height);
        if(encount) battleAnimationFlg=true;
        //各モジュールのMain関数を呼び出し
        if (mode == 0){ //タイトル
            titleMain();
        } else if(mode == 1) { //フィールド
            fieldMain();
        } else if(mode == 2){ //バトル
            battleMain();
        }
        messageMain();
        drawPopupMsg();
        if(battleAnimationFlg) battleStartAnimation();
        ctx2d.fillStyle="rgba(0,0,0," +(1-Math.abs(modeAnimation-modeChangeAniSpeed)/modeChangeAniSpeed)+")";
        ctx2d.fillRect(0,0,width,height);

        if (modeAnimation && (modeAnimation-2*modeChangeAniSpeed)) modeAnimation++;
        if(!(modeAnimation-modeChangeAniSpeed)){
            fieldReDrawFlg=1,mode=nextMode,initiate_field(),menuWindow=0;
            if (mode==0) titleAni=0;
        } 
        if (!(modeAnimation-2*modeChangeAniSpeed)) modeAnimation=0;

        globalTime++;
        requestAnimationFrame(tick); //次のフレーム呼び出し（再帰）
    }
}