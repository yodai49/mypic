var walkanimation=0,walkdir=3; //歩くアニメーション,方向
const charasize=30; //キャラクターのサイズ
const pre_charasize=60; //プリレンダリング用のキャラクターのサイズ
const fieldwidth=2000;//フィールドの幅の最大値
const fieldheight=2000;//フィールドの高さの最大値
var walkspeed=3;//歩くスピード
var menuSelectNum=0,menuSelectFlg=0;

function initiate_field(){
    /*　フィールド・キャラクターの初期化処理/////////////////////////////////////////
    @param なし
    @return なし
    */
    characanvas=document.createElement("canvas");
    characanvas.width=pre_charasize*2, characanvas.height=pre_charasize*4;
    var characanvasctx=characanvas.getContext("2d"); //charaimg1は0,0、charaimg2はその右側に描画
    for(let i = 0;i<4;i++){
        for(let j = 0;j<2;j++){
            const charaimg=new Image();
            charaimg.src="./imgs/character_field"+i+"_"+j+".png";
            charaimg.onload=function(){characanvasctx.drawImage(charaimg,j*pre_charasize,i*pre_charasize,pre_charasize,pre_charasize)}
        }
    }
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
            fieldimg.src="./imgs/fieldobjects/fieldobj" + i + "_" + j + ".png";
            fieldimg.onload=function(){fieldcanvasctx.drawImage(fieldimg,fielddata[i][j][0] + fieldwidth*i,fielddata[i][j][1])}
        }
    }

    myposx=800,myposy=800,myposworld=0;//ポジションのセッティング
    menuSelectNum=0,menuSelectFlg=0; //選択中のメニュー
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
    for(let j = 0;j < 10;j++){
        tempColision = 1;
        var checkimgdata=fieldcanvas.getContext("2d").getImageData(myposx+checkConflictPosx,myposy+checkConflictPosy,1,1);
        for(let i = 0;i < walkCol[myposworld].length;i++){
            if (checkimgdata.data[0] == walkCol[myposworld][i][0] && checkimgdata.data[1] == walkCol[myposworld][i][1] && checkimgdata.data[2] == walkCol[myposworld][i][2]) tempColision=0;
        }
        if (dir==2 || dir == 3) checkConflictPosx+=(charasize/10);
        if (dir==0 || dir == 1) checkConflictPosy+=(charasize/10);
        if (tempColision) return 1;
    }
    return 0;
}

function fieldMain() {
    var menuWindowTrans;
    const menuWindowAniSpeed=15;
    const menuWindowTxt =["マイピク","もちもの","マップ","セーブ","タイトル"];
    /*
    @param なし
    @return なし
    */
    ctx2d.drawImage(fieldcanvas,myposx-(width-charasize)/2,myposy-(height-charasize)/2,width,height,0,0,width,height); //背景の描画
    ctx2d.drawImage(characanvas,pre_charasize*Math.floor(walkanimation/15),pre_charasize*walkdir,pre_charasize,pre_charasize,(width-charasize)/2,(height-charasize)/2,charasize,charasize); //キャラクターの描画

    //移動処理
    if(!menuWindow){
        if (leftkey) walkdir=0;
        if (rightkey) walkdir=1;
        if (upkey) walkdir=2;
        if (downkey) walkdir=3;
        if (leftkey && !checkConflict(0)) myposx-=walkspeed,walkeve();
        if (rightkey && !checkConflict(1)) myposx+=walkspeed,walkeve();
        if (upkey && !checkConflict(2)) myposy-=walkspeed,walkeve();
        if (downkey && !checkConflict(3)) myposy+=walkspeed,walkeve();
    } else {
        if (upkey && !menuSelectFlg) menuSelectNum--,menuSelectFlg=1;
        if (downkey && !menuSelectFlg) menuSelectNum++,menuSelectFlg=1;
        if (!upkey && !downkey) menuSelectFlg=0;
        if (menuSelectNum<0) menuSelectNum=0;
        if (menuSelectNum >= menuWindowTxt.length) menuSelectNum=menuWindowTxt.length-1;
    }
    //メニューの表示処理
    menuWindowTrans=(1-Math.abs(menuWindow-menuWindowAniSpeed)/menuWindowAniSpeed);
    if(menuWindow && menuWindow!=menuWindowAniSpeed) menuWindow++;
    if(menuWindow == menuWindowAniSpeed*2) menuWindow=0;
    if(zkey && !menuWindow) menuWindow++;
    if(zkey && !(menuWindow-menuWindowAniSpeed)) menuWindow++;
    if(menuWindow){    //メニューの描画
        ctx2d.fillStyle="rgba(0,0,0," + menuWindowTrans*0.8+")";
        ctx2d.fillRect(-400+menuWindowTrans*400,0,400,height);
        ctx2d.fillStyle="rgba(255,255,255," + menuWindowTrans+")";
        ctx2d.font="50px "+mainfontName;
        ctx2d.fillText("メニュー",30,70);
        ctx2d.font="30px "+mainfontName;
        for(let i = 0; i < menuWindowTxt.length;i++){
            if (menuSelectNum==i){
                ctx2d.fillStyle="rgba(255,255,255," + menuWindowTrans+")";
            } else{
                ctx2d.fillStyle="rgba(100,100,100," + menuWindowTrans+")";                
            }
            ctx2d.fillText(menuWindowTxt[i],60,130+i*45);
        }
    }

}
