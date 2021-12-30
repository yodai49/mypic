var characanvas,fieldPreCanvas,fieldcanvas,fieldbackcanvas; //プリレンダリング用のキャンバス fieldcanvasは前景、fieldbackcanvasは背景（当たり判定なし）
var fieldimg=[],fieldbackimg=[];//フィールドのImageオブジェクトをを格納する
var fieldImgComplete=[-1],itemKindTxt=["道具","マテリアル","秘伝書"],itemSynsAni=0;
var nowMaterialData=[]; //[[[x,y,番号],[...]]]の形式 createFieldごとに変わる
var lastFieldVisit=[]; //最後にフィールドを訪れた時間を格納
var itemMenuImg=[],itemKeyImg,battleBackImg=[],battleGround,msgWindowImg=[],arrowImgs=[]//Imageオブジェクト系
var befImg=[],lastEnemySkill;
const efWidth=192;
const efHeight=192;
var loadedimgCnt=0,imgCnt=0;
var fieldReDrawFlg=0,titleClickedFlg=0;

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
        befImg[i].onload=function(){loadedimgCnt++;}
    }
}

imgCnt=0; //イメージの総数はここで管理
loadedimgCnt=0;
for(var i = 0; i < 50;i++){ //フィールド画像データの読み込み
    fieldImgComplete[i]=0;
    if(fielddata[i][0]!= -1){
        imgCnt++;
        fieldimg[i]=new Image();
        fieldimg[i].src="./imgs/fieldobjects/fieldobj" + i + "_0.png";
        fieldimg[i].onload=function(){loadedimgCnt++};
    }
}
for(var i = 0; i < 6;i++){ //フィールド背景データの読み込み
    imgCnt++;
    fieldbackimg[i]=new Image();
    fieldbackimg[i].src="./imgs/fieldobjects/fieldbackobj" + i + ".jpg";
    fieldbackimg[i].onload=function(){
        loadedimgCnt++;
    }
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