var characanvas,fieldPreCanvas,fieldcanvas,fieldbackcanvas; //プリレンダリング用のキャンバス fieldcanvasは前景、fieldbackcanvasは背景（当たり判定なし）
var fieldimg=[],fieldbackimg=[];//フィールドのImageオブジェクトをを格納する
var fieldImgComplete=[-1],itemKindTxt=["道具","マテリアル","秘伝書"],itemSynsAni=0;
var nowMaterialData=[]; //[[[x,y,番号],[...]]]の形式 createFieldごとに変わる
var lastFieldVisit=[]; //最後にフィールドを訪れた時間を格納
var itemMenuImg=[],itemKeyImg,battleBackImg=[],battleGround,msgWindowImg=[],arrowImgs=[]//Imageオブジェクト系
var befImg=[],lastEnemySkill;
var ctx2d;
const efWidth=192;
const efHeight=192;
var loadedimgCnt=0,imgCnt=0;
var fieldReDrawFlg=0,titleClickedFlg=0;
const IMG_CNT_FINAL=120;
const width=960,height=540;
const mainfontName="Stick";
var globalTime=0;//タイム　1ループで1増える

function fieldCanvasCreate(){
    characanvas=document.createElement("canvas");
    characanvas.width=pre_charasize*2+480, characanvas.height=pre_charasize*4+600;
    fieldcanvas=document.createElement("canvas");
    fieldcanvas.width=fieldwidth, fieldcanvas.height=fieldheight;
    fieldbackcanvas=document.createElement("canvas");
    fieldbackcanvas.width=fieldwidth, fieldbackcanvas.height=fieldheight;
}
function createField(){
    creatingFieldFlg=1;
    var fieldcanvasctx=fieldcanvas.getContext("2d"); //フィールドは横並びに描画　幅はfieldwidth
    fieldcanvasctx.clearRect(0,0,width,height);
    fieldcanvasctx.drawImage(fieldimg[myposworld],fielddata[myposworld][0],fielddata[myposworld][1]);
    eventflgs=[];
    fieldbackcanvas.getContext("2d").clearRect(0,0,width,height);
    fieldbackcanvas.getContext("2d").drawImage(fieldbackimg[fieldbackdata[myposworld]],0,0); creatingFieldFlg=0;
}
function battleEffectCreate(){
    battleEffectCanvas=document.createElement("canvas"); //バトルエフェクトの生成
    battleEffectCanvas.width=efWidth*5*4, battleEffectCanvas.height=efHeight*2*7;
    befctx=battleEffectCanvas.getContext("2d"); 
    for(var i = 0;i < skillEffect.length;i++) {
        imgCnt++;
        befImg[i]=new Image();
        befImg[i].src="./imgs/skillEffects/" + i + ".png";
        befImg[i].onload=function(){
            loadedimgCnt++;
            redrawTitleLoading(loadedimgCnt);
        }
    }
}

imgCnt=0; //イメージの総数はここで管理
loadedimgCnt=0;

//2Dの処理
ctx2d=document.getElementById("mainCanvas").getContext("2d");
field2d=document.getElementById("fieldCanvas").getContext("2d");
fieldback2d=document.getElementById("fieldbackCanvas").getContext("2d");
ctx2d.width = width,ctx2d.height = height;
field2d.width=width,field2d.height=height;

function redrawTitleLoading(loadingCnt){
    ctx2d.fillStyle="rgba(0,0,0,1)";
    ctx2d.fillRect(0,0,width,height);
    ctx2d.fillStyle="rgba(255,255,255,1)";
    ctx2d.font="26pt " + mainfontName;
    if (!titleLoadingFlg && IMG_CNT_FINAL<=loadingCnt){
        ctx2d.fillText("画面クリックでスタート",width/2-ctx2d.measureText("画面クリックでスタート").width/2,320);
        ctx2d.font="16pt " + mainfontName;
        ctx2d.fillText("以降の操作は全てキーボードで行います",width/2-ctx2d.measureText("以降の操作は全てキーボードで行います").width/2,370);
        ctx2d.font="20pt sans-serif";
        ctx2d.fillText("Loaded!",width/2-ctx2d.measureText("Loaded!").width/2,180);
    } else{
        ctx2d.font="20pt sans-serif";
        ctx2d.fillText("Loading" + ".".repeat(Math.floor(globalTime/10)%3),width/2-ctx2d.measureText("Loading..").width/2,180);
    }
    ctx2d.fillText(loadingCnt + " / " +IMG_CNT_FINAL,width/2-ctx2d.measureText(loadingCnt + " / " +IMG_CNT_FINAL).width/2,220);
    ctx2d.font="26pt " + mainfontName;
    ctx2d.fillRect(width/2-200,250,400,3);
    ctx2d.fillStyle="rgba(200,255,200,1)";
    ctx2d.fillRect(width/2-200,250,400*loadingCnt/imgCnt,3);
}

battleEffectCreate();
battleBackImg[0]=new Image(),battleBackImg[0].src="./imgs/battleFieldBackForest.png";//バトル背景の読み込み
battleBackImg[1]=new Image(),battleBackImg[1].src="./imgs/battleFieldBackCave.png";
battleBackImg[2]=new Image(),battleBackImg[2].src="./imgs/battleFieldBackRemains.png";
battleBackImg[3]=new Image(),battleBackImg[3].src="./imgs/battleFieldBackDesert.png";
for(var i = 0;i < 4;i++) imgCnt++,battleBackImg[i].onload=function(){loadedimgCnt++};
imgCnt++,battleGround=new Image(),battleGround.src="./imgs/battleField.png",battleGround.onload=function(){loadedimgCnt++};
msgWindowImg[0]=new Image(),msgWindowImg[0].src="./imgs/messageWindow.png";//メッセージの画像の読み込み
msgWindowImg[1]=new Image(),msgWindowImg[1].src="./imgs/battleBack2.png";
msgWindowImg[2]=new Image(),msgWindowImg[2].src="./imgs/battleBack1.png";
for(var i = 0;i < 3;i++) imgCnt++,msgWindowImg[i].onload=function(){loadedimgCnt++};