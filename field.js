var walkanimation=0; //歩くアニメーション
const charasize=30; //キャラクターのサイズ
const pre_charasize=60; //プリレンダリング用のキャラクターのサイズ
const fieldwidth=4000;//フィールドの幅の最大値
const fieldheight=4000;//フィールドの高さの最大値
const walkspeed=3;//歩くスピード

function initiate_field(){
    /*　フィールド・キャラクターの初期化処理
    @param なし
    @return なし
    */
    var charaimg1=new Image(),charaimg2=new Image(); //キャラクターのプリレンダリングの処理
    charaimg1.src="./imgs/character_field1.png";
    charaimg2.src="./imgs/character_field2.png";
    characanvas=document.createElement("canvas");
    characanvas.width=pre_charasize*2, characanvas.height=pre_charasize;
    var characanvasctx=characanvas.getContext("2d"); //charaimg1は0,0、charaimg2はその右側に描画
    charaimg1.onload=function(){characanvasctx.drawImage(charaimg1,0,0,pre_charasize,pre_charasize)}
    charaimg2.onload=function(){characanvasctx.drawImage(charaimg2,pre_charasize,0,pre_charasize,pre_charasize)}

    fieldcanvas=document.createElement("canvas");
    fieldcanvas.width=fieldwidth*fieldnum, fieldcanvas.height=fieldheight;
    var fieldcanvasctx=fieldcanvas.getContext("2d"); //フィールドは横並びに描画　幅はfieldwidth
    for(let i = 0;i <fieldnum;i++){
        for(let j = 0;j < fieldbackdata[i].length ;j++){
            fieldcanvasctx.fillStyle=fieldbackdata[i][j][0];
            fieldcanvasctx.fillRect(fieldbackdata[i][j][1],fieldbackdata[i][j][2],fieldbackdata[i][j][3],fieldbackdata[i][j][4]);
        }
        for(let j = 0; j < fielddata[i].length;j++){
            const fieldimg=new Image();
            fieldimg.src="./imgs/fieldobj" + i + "_" + j + ".png";
            fieldimg.onload=function(){fieldcanvasctx.drawImage(fieldimg,fielddata[i][j][0] + fieldwidth*i,fielddata[i][j][1])}
        }
    }

    myposx=200,myposy=200,myposworld=0;//ポジションのセッティング
}
function myposmodify(){
    /*　自分の位置がはみ出さないようにする関数
        param なし
        return なし
    */
    if(myposx<10) myposx=10;
    if (myposx>fieldwidth-10) myposx=fieldwidth-10;
    if(myposy<10) myposy=10;
    if (myposy>fieldheight-10) myposx=fieldheight-10;
}
function fieldMain() {
    /*
    @param なし
    @return なし
    */
    if (leftkey) myposx-=walkspeed;
    if (rightkey) myposx+=walkspeed;
    if (upkey) myposy-=walkspeed;
    if (downkey) myposy+=walkspeed;
    myposmodify();
    walkanimation=(walkanimation+1)%30; //歩く処理
    ctx2d.drawImage(fieldcanvas,myposx,myposy,width,height,0,0,width,height); //背景の描画
    ctx2d.drawImage(characanvas,60*Math.floor(walkanimation/15),0,60,60,(width-charasize)/2,(height-charasize)/2,60,60); //キャラクターの描画
}
