var walkanimation=0; //歩くアニメーション
const charasize=60; //キャラクターのサイズ
const pre_charasize=60; //プリレンダリング用のキャラクターのサイズ
const fieldwidth=4000;//フィールドの幅の最大値
const fieldheight=4000;//フィールドの高さの最大値
var walkspeed=3;//歩くスピード

function initiate_field(){
    /*　フィールド・キャラクターの初期化処理/////////////////////////////////////////
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

    myposx=800,myposy=800,myposworld=0;//ポジションのセッティング
}
function myposmodify(){
    /*　自分の位置がはみ出さないようにする関数
        param なし
        return なし
    */
    if(myposx-(width-charasize)/2<10) myposx=10+(width-charasize)/2;
    if (myposx>fieldwidth-10) myposx=fieldwidth-10;
    if(myposy-(height-charasize)/2<10) myposy=10+(height-charasize)/2;
    if (myposy>fieldheight-10) myposx=fieldheight-10;
}
function walkeve(){ //歩くときに発生する処理
    myposmodify();
    walkanimation=(walkanimation+1)%30; //歩く処理
}
function checkConflict(dir){
    /* 当たり判定
    @param dir--移動しようとする方向　0-3で、左右上下の順番
    @return 0-衝突なし　1-衝突あり
    */
    var checkConflictPosx=0,checkConflictPosy=0;
    if (dir==0) checkConflictPosx= -walkspeed-1,checkConflictPosy=0;
    if (dir==1) checkConflictPosx= charasize+walkspeed+1,checkConflictPosy=0;
    if (dir==2) checkConflictPosx= 0,checkConflictPosy=-walkspeed-1;
    if (dir==3) checkConflictPosx= 0,checkConflictPosy=charasize+walkspeed+1;
    var tempColision = 0;
    for(let i = 0;i < walkCol[myposworld].length;i++){
        tempColision = 0;
        for(let j = 0;j < 10;j++){
            var checkimgdata=ctx2d.getImageData((width-charasize)/2+checkConflictPosx,(height-charasize)/2+checkConflictPosy,1,1);
            if (dir==2 || dir == 3) checkConflictPosx+=(charasize/10);
            if (dir==0 || dir == 1) checkConflictPosy+=(charasize/10);
            if (checkimgdata.data[0] != walkCol[myposworld][i][0] || checkimgdata.data[1] != walkCol[myposworld][i][1] ||  checkimgdata.data[2] != walkCol[myposworld][i][2]) tempColision=1;
        }
        if (!tempColision) return 0;
    }
    return 1;
}

function fieldMain() {
    /*
    @param なし
    @return なし
    */
    ctx2d.drawImage(fieldcanvas,myposx-(width-charasize)/2,myposy-(height-charasize)/2,width,height,0,0,width,height); //背景の描画
    ctx2d.drawImage(characanvas,charasize*Math.floor(walkanimation/15),0,charasize,charasize,(width-charasize)/2,(height-charasize)/2,charasize,charasize); //キャラクターの描画

    //移動処理
    if (leftkey && !checkConflict(0)) myposx-=walkspeed,walkeve();
    if (rightkey && !checkConflict(1)) myposx+=walkspeed,walkeve();
    if (upkey && !checkConflict(2)) myposy-=walkspeed,walkeve();
    if (downkey && !checkConflict(3)) myposy+=walkspeed,walkeve();
}
