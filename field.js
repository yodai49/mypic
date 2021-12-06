var walkanimation=0,walkdir=3; //歩くアニメーション,方向
const charasize=30; //キャラクターのサイズ
const pre_charasize=60; //プリレンダリング用のキャラクターのサイズ
const fieldwidth=960;//フィールドの幅の最大値
const fieldheight=540;//フィールドの高さの最大値
const debugMode=3; //デバッグモード　1ならワープ位置を赤で表示
var walkspeed=3;//歩くスピード
var menuSelectNum=0,menuSelectFlg=0;
var menuSelectChildNum=0,menuWindowChildAni=0,itemsScroll=0;
var menuMypicDetailAni=0,menuSortMypicNum=-1;
var imgCnt=0,loadedimgCnt=0,warpAni=0;
var fieldReDrawFlg=0,warpFlg=0,nowWarpObj,eventflgs=[];
var menuMypicDetailposX=200,menuMypicDetailposY=100,menuzflg=0,happenedEvent=0;
var eventWindowAni=0,eventWindowKind=0,stockMypicScroll=0,stockMypicSelectNum=0,stockMypicChgWindow=0,stockMypicChgNum=0,eventProcreateStep=0;
var tempEggList=[],eventEggScroll=0,eventEggAni=0,procdrawMypicMode=0;
var eventEggSelectNum=0;  //孵化させる卵の番号（tempEggList内での番号）
var inDrawField=0,drawFieldX=0,drawFieldY=0,inFieldX=0,inFieldY=0;
var drawMypicStatus=0; //0なら何も描いていない　1なら始点を描いた
var drawMypicTempPos=[0,0];//描いた始点を保持
var drawMypicTempObj=[];//描き途中のマイピクの形状を保持
var drawMypicRadius=0,drawMypicTempName="";

function drawMypic(drawMypicNum,dx,dy,dw,dh,trans,mode){
    if (mode==1){
        for(var i = 0;i < drawMypicTempObj.length;i++){
            ctx2d.strokeStyle="rgba(255,255,255,"+trans+")";
            ctx2d.strokeWidth=1;
            ctx2d.beginPath();
            if (drawMypicTempObj[i][0] == 0){ //線
                ctx2d.moveTo(dx+dw*drawMypicTempObj[i][1]/100,dy+dh*drawMypicTempObj[i][2]/100);
                ctx2d.lineTo(dx+dw*drawMypicTempObj[i][3]/100,dy+dh*drawMypicTempObj[i][4]/100);    
            } else if(drawMypicTempObj[i][0] == 1){ //円
                ctx2d.arc(dx+dw*drawMypicTempObj[i][1]/100,dy+dh*drawMypicTempObj[i][2]/100,dw*drawMypicTempObj[i][3]/100,0,Math.PI*2);
            }
            ctx2d.stroke();
        }    
    } else{
        for(var i = 0;i < mypicstock[drawMypicNum][1].length;i++){
            ctx2d.strokeStyle="rgba(255,255,255,"+trans+")";
            ctx2d.strokeWidth=1;
            ctx2d.beginPath();
            if (mypicstock[drawMypicNum][1][i][0] == 0){ //線
                ctx2d.moveTo(dx+dw*mypicstock[drawMypicNum][1][i][1]/100,dy+dh*mypicstock[drawMypicNum][1][i][2]/100);
                ctx2d.lineTo(dx+dw*mypicstock[drawMypicNum][1][i][3]/100,dy+dh*mypicstock[drawMypicNum][1][i][4]/100);    
            } else if(mypicstock[drawMypicNum][1][i][0] == 1){ //円
                ctx2d.arc(dx+dw*mypicstock[drawMypicNum][1][i][1]/100,dy+dh*mypicstock[drawMypicNum][1][i][2]/100,dw*mypicstock[drawMypicNum][1][i][3]/100,0,Math.PI*2);
            }
            ctx2d.stroke();
        }    
    }
}

function clickEveDraw(x,y){ //クリックイベント
    if (mode==1 && eventWindowKind==2 && eventWindowAni && eventProcreateStep==1){ //マイピクドロー中のみ反応
        if (inDrawField && drawMypicTempObj.length <15){ //ドローフィールドの中なら
            if (!drawMypicStatus){
                drawMypicStatus=1;
                drawMypicTempPos[0] = x;
                drawMypicTempPos[1]  = y;
            } else {
                if (!procdrawMypicMode){
                    drawMypicTempObj.push([0,(drawMypicTempPos[0]-(width/2-135))/270*100,(drawMypicTempPos[1]-(height/2-110))/270*100,drawFieldX,drawFieldY]);
                } else{
                    drawMypicTempObj.push([1,(drawMypicTempPos[0]-(width/2-135))/270*100,(drawMypicTempPos[1]-(height/2-110))/270*100,drawMypicRadius/270*100]);
                }
                drawMypicStatus=0;
            }
        }
        if (635 <= x && x <= 715){
            if (330 <= y && y <= 350){
                drawMypicStatus=0;
                procdrawMypicMode=0;
            } else if (350 <= y && y <= 370){
                drawMypicStatus=0;
                procdrawMypicMode=1;
            } else if(387<= y && y <= 407){
                drawMypicTempObj.pop();
            }
        }
    }
    if (eventProcreateStep == 2){
        if (254<=x && x <= 711  && eventEggAni>=10){
            if (262 <= y && y <= 449){
                var procCharaX= Math.floor(13-(x-254)/(711-254)*13);
                var procCharaY=Math.floor((y-262)/(449-262)*7);
                if (keyboarddata[procCharaX][procCharaY] == "←"){
                    drawMypicTempName=drawMypicTempName.substr(0,drawMypicTempName.length-1);
                } else if(keyboarddata[procCharaX][procCharaY] == "゛"){
                        drawMypicTempName=drawMypicTempName.substr(0,drawMypicTempName.length-1)+chgChara(drawMypicTempName.substr(drawMypicTempName.length-1,1),0);
                } else if(keyboarddata[procCharaX][procCharaY] == "゜"){
                    drawMypicTempName=drawMypicTempName.substr(0,drawMypicTempName.length-1)+chgChara(drawMypicTempName.substr(drawMypicTempName.length-1,1),1);
                } else if(keyboarddata[procCharaX][procCharaY] == "小"){
                    drawMypicTempName=drawMypicTempName.substr(0,drawMypicTempName.length-1)+chgChara(drawMypicTempName.substr(drawMypicTempName.length-1,1),2);
                } else if(keyboarddata[procCharaX][procCharaY] == "ア"){
                    drawMypicTempName=drawMypicTempName.substr(0,drawMypicTempName.length-1)+chgChara(drawMypicTempName.substr(drawMypicTempName.length-1,1),3);
                } else if (drawMypicTempName.length<6){
                    drawMypicTempName+=keyboarddata[procCharaX][procCharaY];
                }
            }
        }    
    }
}
function moveEveDraw(x,y){ //マウスのムーブイベント
    if (mode==1 && eventWindowKind==2 && eventWindowAni && eventProcreateStep==1){ //マイピクドロー中のみ反応
        drawFieldX = (x-(width/2-135))/270*100;
        drawFieldY=(y-(height/2-110))/270*100;
        if (procdrawMypicMode==0){
            inDrawField=(0<=drawFieldX && drawFieldX <= 100 && 0 <= drawFieldY && drawFieldY <= 100);
        } else{
            if (!drawMypicStatus){
                inDrawField=(0<=drawFieldX && drawFieldX <= 100 && 0 <= drawFieldY && drawFieldY <= 100);
            } else{
                var tempCirPosX= (drawMypicTempPos[0]-(width/2-135))/270*100;
                var tempCirPosY=(drawMypicTempPos[1]-(height/2-110))/270*100;
                inDrawField=(0<=tempCirPosX-drawMypicRadius/270*100 && tempCirPosX+drawMypicRadius/270*100 <= 100 && 0 <= tempCirPosY-drawMypicRadius/270*100 && tempCirPosY+drawMypicRadius/270*100 <= 100);    
            }
        }
    }
    inFieldX=x,inFieldY=y;
    drawMypicRadius = (x-drawMypicTempPos[0])* (x-drawMypicTempPos[0])+ (y-drawMypicTempPos[1])*(y-drawMypicTempPos[1])
    drawMypicRadius=Math.sqrt(drawMypicRadius);
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
    if (!warpAni){
        for(let i = 0;i < fieldwarpobj[myposworld].length;i++){
            if (fieldwarpobj[myposworld][i][0] < myposx+charasize && fieldwarpobj[myposworld][i][0] + fieldwarpobj[myposworld][i][2] > myposx){
                if (fieldwarpobj[myposworld][i][1] < myposy+charasize && fieldwarpobj[myposworld][i][1] + fieldwarpobj[myposworld][i][3] > myposy){
                    nowWarpObj=fieldwarpobj[myposworld][i];
                    warpFlg=1;
                    warpAni=1;
                    return 0;
                }
            }
        }
    }
    for(let i = 0;i < eventobj[myposworld].length;i++){
        eventflgs[i]=0;
        if (eventobj[myposworld][i][0] < myposx+charasize && eventobj[myposworld][i][0] + eventobj[myposworld][i][2] > myposx){
            if (eventobj[myposworld][i][1] < myposy+charasize && eventobj[myposworld][i][1] + eventobj[myposworld][i][3] > myposy){
                eventflgs[i]=1;
            }
        }
    }
    var tempColision = 0;
    for(let j = 0;j < 10;j++){
        tempColision = 1;
        var checkimgdata=fieldcanvas.getContext("2d").getImageData(myposx+checkConflictPosx,myposy+checkConflictPosy,1,1);
        for(let i = 0;i < walkCol.length;i++){
            if (checkimgdata.data[0] == walkCol[i][0] && checkimgdata.data[1] == walkCol[i][1] && checkimgdata.data[2] == walkCol[i][2]) tempColision=0;
        }
        if (dir==2 || dir == 3) checkConflictPosx+=(charasize/10);
        if (dir==0 || dir == 1) checkConflictPosy+=(charasize/10);
        if (tempColision) return 1;
    }
    return 0;
}
function createField(){
    fieldcanvas=document.createElement("canvas");
    fieldcanvas.width=fieldwidth, fieldcanvas.height=fieldheight;
    var fieldcanvasctx=fieldcanvas.getContext("2d"); //フィールドは横並びに描画　幅はfieldwidth
    for(let j = 0;j < fieldbackdata[myposworld].length ;j++){
        fieldcanvasctx.fillStyle=fieldbackdata[myposworld][j][0];
        fieldcanvasctx.fillRect(fieldbackdata[myposworld][j][1],fieldbackdata[myposworld][j][2],fieldbackdata[myposworld][j][3],fieldbackdata[myposworld][j][4]);
    }
    for(let j = 0; j < fielddata[myposworld].length;j++){
        imgCnt++;
        const fieldimg=new Image();
        fieldimg.src="./imgs/fieldobjects/fieldobj" + myposworld + "_" + j + ".png";
        fieldimg.onload=function(){fieldcanvasctx.drawImage(fieldimg,fielddata[myposworld][j][0],fielddata[myposworld][j][1]);loadedimgCnt++;}
    }
    eventflgs=[];
    checkConflict();
}
function initiate_field(){
    /*　フィールド・キャラクターの初期化処理/////////////////////////////////////////
    @param なし
    @return なし
    */
   myposx=30,myposy=30,myposworld=0;//ポジションのセッティング
   menuSelectNum=0,menuSelectFlg=0; //選択中のメニュー
   fieldReDrawFlg=1;

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
    createField();
}
function myposmodify(){
    /*　自分の位置がはみ出さないようにする関数
        param なし
        return なし
    */
    if(myposx<10) myposx=10;
    if (myposx+charasize>width-10) myposx=fieldwidth-10-charasize;
    if(myposy<10) myposy=10;
    if (myposy+charasize>height-10) myposy=fieldheight-10-charasize;
}
function walkeve(){ //歩くときに発生する処理
    myposmodify();
    walkanimation=(walkanimation+1)%30; //歩く処理
}
function trigEvent(trigEventnum){
    if (trigEventnum==1){ //マイピク整理のイベント
        eventWindowAni++;
        eventWindowKind=1;
        happenedEvent=1;
        stockMypicScroll=0;
        stockMypicSelectNum=0;
    }　else if (trigEventnum==2){ //マイピク孵化のイベント
        eventWindowAni++;
        eventWindowKind=2;
        eventProcreateStep=0;
        happenedEvent=1;
        eventEggScroll=0,eventEggSelectNum=0;
        procdrawMypicMode=0;
        drawMypicTempObj=[];
        drawMypicTempName="";
        //持っている卵のリストを作成
        tempEggList=[];
        for(var i = 0;i < items.length;i++){
            if(itemdata[items[i][0]][4]!=-1){
                tempEggList.push(items[i]);
            }
        }
    }
    menuSelectFlg=1;
}
function fieldMain() {
    var menuWindowTrans,menuWindowTransChild;
    const menuWindowAniSpeed=15;
    const menuWindowTxt =["マイピク","もちもの","マップ","セーブ","タイトル"];
    /*
    @param なし
    @return なし
    */
    if (fieldReDrawFlg && loadedimgCnt==imgCnt) field2d.drawImage(fieldcanvas,0,0,width,height,0,0,width,height),fieldReDrawFlg=0; //背景の描画
    ctx2d.drawImage(characanvas,pre_charasize*Math.floor(walkanimation/15),pre_charasize*walkdir,pre_charasize,pre_charasize,myposx,myposy,charasize,charasize); //キャラクターの描画
    if (happenedEvent){
        for(var i = 0;i < eventobj[myposworld].length;i++){
            happenedEvent*=(1-eventflgs[i]);
        }
        happenedEvent=1-happenedEvent;
    }
    ////////////////////////////////////////////////////////キー入力等処理
    if (eventWindowAni){ //イベントウィンドウが表示されている時
        if (eventWindowKind==1){ //整理イベント
            ctx2d.fillStyle="rgba(0,0,0,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*0.8+")";
            ctx2d.fillRect(width/2-250,height/2-200,500,400);
            ctx2d.font="20pt " + mainfontName;
            ctx2d.fillStyle="rgba(255,255,255,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*0.8+")";
            ctx2d.fillText("マイピクいれかえ",width/2-230,height/2-160);    
            var stockMypicOffsetX,stockMypicOffsetY;
            for(var i = 0;i < 6;i++){
                if (mypicstock.length > i+stockMypicScroll){ ////ストックマイピクを描画
                    ctx2d.font="16pt " + mainfontName;
                    stockMypicOffsetY=height/2-200+83;
                    stockMypicOffsetX=width/2-250;
                    if (!(i % 2)) stockMypicOffsetX+=20;
                    if (i%2) stockMypicOffsetX+=260;
                    if (i>1) stockMypicOffsetY+=110;
                    if (i>3) stockMypicOffsetY+=110;
                    ctx2d.fillStyle="rgba(0,0,0,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*0.8+")";
                    ctx2d.fillRect(stockMypicOffsetX+105,stockMypicOffsetY-15,100,100);
                    if (mypic.includes(i+stockMypicScroll)){ //スタメンなら枠で囲う
                        ctx2d.strokeStyle="rgba(170,0,0,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*1+")";
                        ctx2d.strokeRect(stockMypicOffsetX+105,stockMypicOffsetY-15,100,100);    
                        ctx2d.fillStyle="rgba(105,105,105,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*0.8+")";
                    } else{
                        ctx2d.fillStyle="rgba(255,255,255,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*0.8+")";
                    }
                    ctx2d.fillText(mypicstock[i+stockMypicScroll][0],stockMypicOffsetX,stockMypicOffsetY);    
                    ctx2d.font="10pt " + mainfontName;
                    ctx2d.fillText("Lv. "+ mypicstock[i+stockMypicScroll][12],stockMypicOffsetX+10,stockMypicOffsetY+20);    
                    ctx2d.fillText("Exp. "+ mypicstock[i+stockMypicScroll][13],stockMypicOffsetX+10,stockMypicOffsetY+36);    
                    ctx2d.fillText("HP "+ mypicstock[i+stockMypicScroll][3],stockMypicOffsetX+10,stockMypicOffsetY+56);
                    ctx2d.fillText("DP "+ mypicstock[i+stockMypicScroll][5],stockMypicOffsetX+10,stockMypicOffsetY+72);    
                    drawMypic(i+stockMypicScroll,stockMypicOffsetX+105,stockMypicOffsetY-15,100,100,(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed));
                }
                if(i == stockMypicSelectNum-stockMypicScroll){
                    ctx2d.strokeStyle="rgba(255,255,255,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*(Math.sin(globalTime/10)*0.3+0.7)+")";
                    ctx2d.strokeRect(stockMypicOffsetX-10,stockMypicOffsetY-20,225,108)
                }
            }
            if (upkey && !menuSelectFlg){
                if (!stockMypicChgWindow && stockMypicSelectNum>1){
                    stockMypicSelectNum-=2,menuSelectFlg=1;
                    if (spacekey) menuSelectFlg=0;
                    if (stockMypicSelectNum<stockMypicScroll) stockMypicScroll-=2;    
                } else if(stockMypicChgWindow){
                    if (stockMypicChgNum) stockMypicChgNum--,menuSelectFlg=1;
                }
            }
            if (downkey && !menuSelectFlg) {
                if (!stockMypicChgWindow&& stockMypicSelectNum<(mypicstock.length-2)){
                    stockMypicSelectNum+=2,menuSelectFlg=1;
                    if (spacekey) menuSelectFlg=0;
                    if (stockMypicSelectNum>stockMypicScroll+5) stockMypicScroll+=2;
                } else if(stockMypicChgWindow){
                    if (stockMypicChgNum!=5) stockMypicChgNum++,menuSelectFlg=1;
                }
            }
            if (leftkey && (stockMypicSelectNum%2) && !menuSelectFlg && !stockMypicChgWindow) stockMypicSelectNum--,menuSelectFlg=1;
            if (rightkey &&!(stockMypicSelectNum%2) && !menuSelectFlg && !stockMypicChgWindow) stockMypicSelectNum++,menuSelectFlg=1;
            if (zkey && !menuSelectFlg){
                if (!mypic.includes(stockMypicSelectNum) && !stockMypicChgWindow){
                    stockMypicChgWindow++;
                    menuSelectFlg=1;
                } else if(stockMypicChgWindow){
                    mypic[stockMypicChgNum]=stockMypicSelectNum;
                    stockMypicChgWindow++;
                    menuSelectFlg=1;
                }
            } 
            if (xkey && !menuSelectFlg){
                if (stockMypicChgWindow==menuWindowAniSpeed) stockMypicChgWindow++,menuSelectFlg=1;
            }
            if (stockMypicChgWindow){
                ctx2d.fillStyle="rgba(0,0,0,"+ (1-Math.abs(stockMypicChgWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                ctx2d.fillRect(width/2-150,height/2-100,300,200);
                ctx2d.font="14pt " + mainfontName; 
                ctx2d.fillStyle="rgba(255,255,255,"+ (1-Math.abs(stockMypicChgWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                ctx2d.fillText("だれといれかえる？",width/2-135,height/2-75);
                for(var i = 0; i < 6;i++){
                    if (stockMypicChgNum == i){
                        ctx2d.fillStyle="rgba(255,255,255,"+ (1-Math.abs(stockMypicChgWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                    } else{
                        ctx2d.fillStyle="rgba(105,105,105,"+ (1-Math.abs(stockMypicChgWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                    }
                    ctx2d.font="12pt " + mainfontName; 
                    ctx2d.fillText(mypicstock[mypic[i]][0],width/2-125,height/2-45+23*i);
                    ctx2d.font="10pt " + mainfontName; 
                    ctx2d.fillText("Lv." + mypicstock[mypic[i]][12],width/2-20,height/2-45+23*i);
                    ctx2d.fillText("Exp. "+mypicstock[mypic[i]][13],width/2+35,height/2-45+23*i);
                }
            }
            if (xkey && !(eventWindowAni-menuWindowAniSpeed) && !menuSelectFlg) {
                eventWindowAni++;
                menuSelectFlg=1;
            }    
            if (stockMypicChgWindow && (stockMypicChgWindow-menuWindowAniSpeed)) stockMypicChgWindow++;
            if (stockMypicChgWindow==2*menuWindowAniSpeed) stockMypicChgWindow=0;
        } else if(eventWindowKind==2){ //孵化イベント
            if (zkey && !menuSelectFlg){
                if (eventProcreateStep == 0){
                    eventProcreateStep++,menuSelectFlg=1,eventEggAni=0;
                } else if(eventProcreateStep==1 && drawMypicTempObj.length){
                    eventProcreateStep++,menuSelectFlg=1,eventEggAni=0;
                } else if(eventProcreateStep==2){
                    eventProcreateStep++,menuSelectFlg=1,eventEggAni=0;
                } else if(eventProcreateStep==3){
                    eventWindowAni++,menuSelectFlg=1;
                }
            } 
            if(xkey && !menuSelectFlg){
                if (!eventProcreateStep){
                    eventWindowAni++;
                } else{
                    eventProcreateStep--;
                    eventEggAni=0;
                }
                menuSelectFlg++;
            }
            ctx2d.fillStyle="rgba(0,0,0,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*0.8+")";
            ctx2d.fillRect(width/2-250,height/2-200,500,400);
            ctx2d.fillStyle="rgba(255,255,255,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
            ctx2d.font="16pt "+mainfontName; 
            if (eventProcreateStep<3){
                ctx2d.fillText("ステップ　" +(1+ eventProcreateStep) + " / 3",width/2+75,height/2-160);
            } else{
                ctx2d.fillText("かんせい！",width/2+125,height/2-160);

            }
            ctx2d.font="20pt " + mainfontName;
            ctx2d.fillText("たまごをかえす",width/2-230,height/2-160);    
            if (eventProcreateStep==0){ //卵の選択
                ctx2d.font="16pt " + mainfontName;
                ctx2d.fillText("どのたまごをふかさせる？".substr(0,eventEggAni/2),width/2-230,height/2-120);    
                if (upkey && !menuSelectFlg && eventEggSelectNum){
                    eventEggSelectNum--,menuSelectFlg=1;
                    if (eventEggSelectNum<eventEggScroll) eventEggScroll=eventEggSelectNum;
                } 
                if (downkey && !menuSelectFlg && (eventEggSelectNum-tempEggList.length+1)){
                    eventEggSelectNum++,menuSelectFlg=1;
                    if (eventEggSelectNum-eventEggScroll>=10) eventEggScroll++;
                } 
                if(spacekey && !zkey && !xkey) menuSelectFlg=0; 
                ctx2d.font="14pt " + mainfontName;
                ctx2d.fillStyle="rgba(105,105,105,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                for(var i = 0;i < Math.min(10,tempEggList.length);i++){
                    if (i != eventEggSelectNum-eventEggScroll){
                        ctx2d.fillText(itemdata[tempEggList[i+eventEggScroll][0]][0],width/2-230,height/2-80+23*i);  
                        ctx2d.fillText("× "+tempEggList[i+eventEggScroll][1],width/2+180,height/2-80+23*i);     
                    }
                }
                ctx2d.fillStyle="rgba(255,255,255,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                ctx2d.fillText(itemdata[tempEggList[eventEggSelectNum][0]][0],width/2-230,height/2-80+23*(eventEggSelectNum-eventEggScroll));  
                ctx2d.fillText("× "+tempEggList[eventEggSelectNum][1],width/2+180,height/2-80+23*(eventEggSelectNum-eventEggScroll)); 
                ctx2d.font="12pt " + mainfontName;
                ctx2d.fillText(itemdata[tempEggList[eventEggSelectNum][0]][3].substr(0,28),width/2-230,height/2-80+23*10.5);
                ctx2d.fillText(itemdata[tempEggList[eventEggSelectNum][0]][3].substr(28,28),width/2-230,height/2-80+23*11.2);
            } else if(eventProcreateStep==1){ //お絵かき
                ctx2d.fillStyle="rgba(255,255,255,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*Math.min(1,eventEggAni/20)+")";
                ctx2d.font="16pt " + mainfontName;
                ctx2d.fillText("マイピクをマウスでドローしよう！".substr(0,eventEggAni/2),width/2-230,height/2-120);
                ctx2d.font="12pt " + mainfontName;
                ctx2d.fillText("えらんだたまご：" + itemdata[tempEggList[eventEggSelectNum][0]][0],width/2-ctx2d.measureText("えらんだたまご：" + itemdata[tempEggList[eventEggSelectNum][0]][0]).width/2,height/2+183);    
                ctx2d.font="10pt " + mainfontName;
                if (!procdrawMypicMode){
                    ctx2d.fillStyle="rgba(105,105,105,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*Math.min(1,eventEggAni/20)+")";
                    ctx2d.fillText("えん",width/2+158,height/2+98);        
                    ctx2d.fillStyle="rgba(255,255,255,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*Math.min(1,eventEggAni/20)+")";
                    ctx2d.fillText("ちょくせん",width/2+158,height/2+78);    
                } else{
                    ctx2d.fillStyle="rgba(105,105,105,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*Math.min(1,eventEggAni/20)+")";
                    ctx2d.fillText("ちょくせん",width/2+158,height/2+78);    
                    ctx2d.fillStyle="rgba(255,255,255,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*Math.min(1,eventEggAni/20)+")";
                    ctx2d.fillText("えん",width/2+158,height/2+98);        
                }
                ctx2d.fillText("けす",width/2+158,height/2+133);    
                if (drawMypicTempObj.length==15){
                    ctx2d.fillStyle="rgba(200,0,0,"+0.8*(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*0.8*Math.min(1,eventEggAni/20)+")";
                }
                ctx2d.fillText("のこり："+(15-drawMypicTempObj.length),width/2+158,height/2+160);    
                ctx2d.fillStyle="rgba(0,0,0,"+0.8*(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*0.8*Math.min(1,eventEggAni/20)+")";
                ctx2d.fillRect(width/2-135,height/2-110,270,270);
                //一時的なマイピクの描画
                if (drawMypicStatus && inDrawField){ //始点を描いていたら
                    if (!procdrawMypicMode){ //線
                        ctx2d.beginPath();
                        ctx2d.strokeStyle="rgba(255,255,255,1)";
                        ctx2d.strokeWidth=1;
                        ctx2d.moveTo(drawMypicTempPos[0],drawMypicTempPos[1]);
                        ctx2d.lineTo(inFieldX,inFieldY);
                        ctx2d.stroke();    
                    } else { //円
                        ctx2d.beginPath();
                        ctx2d.strokeStyle="rgba(255,255,255,1)";
                        ctx2d.strokeWidth=1;
                        ctx2d.arc(drawMypicTempPos[0],drawMypicTempPos[1],drawMypicRadius,0,Math.PI*2);
                        ctx2d.stroke();    
                    }
                }
                drawMypic(0,width/2-135,height/2-110,270,270,1,1);
            } else if(eventProcreateStep==2){ //ネーミング
                ctx2d.fillStyle="rgba(255,255,255,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*Math.min(1,eventEggAni/20)*Math.sin(globalTime/5)+")";
                ctx2d.fillText("　".repeat(drawMypicTempName.length) + "_",width/2-215,height/2-60);
                ctx2d.fillStyle="rgba(255,255,255,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*Math.min(1,eventEggAni/20)+")";
                ctx2d.font="16pt " + mainfontName;
                ctx2d.fillText("この子になまえをつけよう！".substr(0,eventEggAni/2),width/2-230,height/2-120);
                ctx2d.font="20pt " + mainfontName;
                ctx2d.fillText(drawMypicTempName,width/2-215,height/2-60);
                for(var i = 0;i < keyboarddata.length;i++){
                    for(var j = 0;j < keyboarddata[i].length;j++){
                        ctx2d.fillText(keyboarddata[i][j],width/2+200-i*35,height/2+20+j*26);
                    }
                }
                ctx2d.fillStyle="rgba(0,0,0,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*Math.min(1,eventEggAni/20)*0.8+")";
                ctx2d.fillRect(width/2+100,height/2-140,130,130);
                drawMypic(0,width/2+100,height/2-140,130,130,1,1);
            }
            eventEggAni++;
        }
        if (!upkey && !downkey && !zkey && !leftkey && !rightkey && !xkey) menuSelectFlg=0;
        if (eventWindowAni && (eventWindowAni-menuWindowAniSpeed)) eventWindowAni++;
        if (eventWindowAni == 2*menuWindowAniSpeed) eventWindowAni=0,happenedEvent=0; 
    } else if(!menuWindow){ /////メニューウィンドウが表示されていない時
        if(ckey) menuWindow++;
        if (leftkey) walkdir=0;
        if (rightkey) walkdir=1;
        if (upkey) walkdir=2;
        if (downkey) walkdir=3;
        if (leftkey && !checkConflict(0)) myposx-=walkspeed,walkeve();
        if (rightkey && !checkConflict(1)) myposx+=walkspeed,walkeve();
        if (upkey && !checkConflict(2)) myposy-=walkspeed,walkeve();
        if (downkey && !checkConflict(3)) myposy+=walkspeed,walkeve();
        if (zkey){ //アクションキー
            for(var i = 0; i < eventobj[myposworld].length;i++){
                if (eventflgs[i] && !happenedEvent) trigEvent(eventobj[myposworld][i][4]);
            }
        }
    } else { /////メニューウィンドウが表示されている時
        if(xkey && !(menuWindow-menuWindowAniSpeed) && !menuWindowChildAni) menuWindow++;
        if(zkey && menuWindow && !menuWindowChildAni){
            if (menuSelectNum==3){ //セーブ
                
            } else if(menuSelectNum==4){ //タイトル
    
            } else { //メニューを開く時
                menuWindowChildAni++;
                menuSelectChildNum=0, itemsScroll=0;
                menuSortMypicNum=-1;
            }
        } else if(zkey && !menuzflg&& menuWindow&&menuWindowChildAni && menuSelectNum==0 && !menuMypicDetailAni && !(menuWindowChildAni-menuWindowAniSpeed) && menuSortMypicNum==-1){ //マイピクの詳細画面を見る時
            menuMypicDetailAni++;
        } else if(zkey && menuWindow&&menuWindowChildAni && menuSelectNum==0 && !menuMypicDetailAni && !(menuWindowChildAni-menuWindowAniSpeed) && menuSortMypicNum!=-1){ //マイピクの詳細画面を見る時
            //入れ替え処理
            var menuTmpSort=mypic[menuSortMypicNum];
            mypic[menuSortMypicNum]=mypic[menuSelectChildNum];
            mypic[menuSelectChildNum]=menuTmpSort;
            menuSortMypicNum=-1;
            menuzflg=1;
        }
        if (upkey && !menuSelectFlg && !menuWindowChildAni) menuSelectNum--,menuSelectFlg=1;
        if (downkey && !menuSelectFlg && !menuWindowChildAni) menuSelectNum++,menuSelectFlg=1;
        if (upkey && !menuSelectFlg && menuWindowChildAni) {  //上キー
            if (menuSelectNum==0 && menuSelectChildNum>=2 && !menuMypicDetailAni){//マイピク
                menuSelectChildNum-=2,menuSelectFlg=1;
            } else if (menuSelectNum==1 && menuSelectChildNum&& !menuMypicDetailAni){
                menuSelectChildNum--,menuSelectFlg=1;
                if (spacekey) menuSelectFlg=0;
                if (menuSelectChildNum < itemsScroll && itemsScroll) itemsScroll--;    
            }
        }
        if (downkey && !menuSelectFlg && menuWindowChildAni) {//下キー
            if (menuSelectNum==0 && menuSelectChildNum<=3 && !menuMypicDetailAni){//マイピク
                menuSelectChildNum+=2,menuSelectFlg=1;
            } else if (menuSelectNum==1 && (menuSelectChildNum!=(items.length-1)) && !menuMypicDetailAni){
                menuSelectChildNum++,menuSelectFlg=1;
                if (spacekey) menuSelectFlg=0;
                if (menuSelectChildNum>=10 && menuSelectChildNum-itemsScroll == 10) itemsScroll++;
            }
        }
        if (leftkey && !menuSelectFlg && menuWindowChildAni) { //左キー
            if (menuSelectNum==0 && (menuSelectChildNum%2)&& !menuMypicDetailAni){//マイピク
                menuSelectChildNum--,menuSelectFlg=1;
            } 
        }
        if (rightkey && !menuSelectFlg && menuWindowChildAni) {//右キー
            if (menuSelectNum==0 && !(menuSelectChildNum%2)&& !menuMypicDetailAni){//マイピク
                menuSelectChildNum++,menuSelectFlg=1;
            } 
        }
        if (!upkey && !downkey && !leftkey && !rightkey) menuSelectFlg=0;
        if (menuSelectNum<0) menuSelectNum=0;
        if (menuSelectNum >= menuWindowTxt.length) menuSelectNum=menuWindowTxt.length-1;
    }
    //メニューの表示処理
    menuWindowTrans=(1-Math.abs(menuWindow-menuWindowAniSpeed)/menuWindowAniSpeed);
    menuWindowTransChild=(1-Math.abs(menuWindowChildAni-menuWindowAniSpeed)/menuWindowAniSpeed);
    if(menuWindow && menuWindow!=menuWindowAniSpeed) menuWindow++;
    if(menuWindow == menuWindowAniSpeed*2) menuWindow=0;
    if (menuWindowChildAni && menuWindowChildAni!=menuWindowAniSpeed) menuWindowChildAni++;
    if (menuWindowChildAni == menuWindowAniSpeed*2) menuWindowChildAni=0;
    if (menuMypicDetailAni && menuMypicDetailAni!=menuWindowAniSpeed) menuMypicDetailAni++;
    if (menuMypicDetailAni == menuWindowAniSpeed*2) menuMypicDetailAni=0;
    if (!zkey) menuzflg=0;
    if(xkey && !(menuWindowChildAni-menuWindowAniSpeed) && menuWindowChildAni && !menuMypicDetailAni) menuWindowChildAni++;
    if(xkey && !(menuWindowChildAni-menuWindowAniSpeed) && menuWindowChildAni && !(menuMypicDetailAni-menuWindowAniSpeed)) menuMypicDetailAni++;
    if(vkey &&  !(menuWindowChildAni-menuWindowAniSpeed) && menuWindowChildAni && !menuMypicDetailAni) menuSortMypicNum=menuSelectChildNum;
    if(menuWindow){    //メニューの描画
        ctx2d.fillStyle="rgba(0,0,0," + menuWindowTrans*0.8+")";
        ctx2d.fillRect(-300+menuWindowTrans*300,0,300,height*0.8);
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
        if (menuWindowChildAni){ //子メニューの描画
            ctx2d.fillStyle="rgba(0,0,0," + menuWindowTransChild*0.8+")";
            ctx2d.fillRect(300,0,500*menuWindowTransChild,height*0.8);
            ctx2d.fillStyle="rgba(255,255,255," + menuWindowTransChild+")";
            ctx2d.fillRect(300,height*0.05,2,height*0.7);
            if (menuSelectNum==0){ ////マイピク
                let mypicOffsetX=0,mypicOffsetY=0;
                for(var i = 0; i < Math.min(6,mypic.length);i++){
                    if (!(i % 2)) mypicOffsetX=320;
                    if (i % 2) mypicOffsetX=560;
                    mypicOffsetY=height*0.1;
                    if (i >= 2) mypicOffsetY+=height*0.7/3;
                    if (i >= 4) mypicOffsetY+=height*0.7/3;
                    ctx2d.fillStyle="rgba(255,255,255," + menuWindowTransChild+")";
                    ctx2d.font="20px "+mainfontName;
                    ctx2d.fillText(mypicstock[mypic[i]][0],mypicOffsetX,mypicOffsetY);
                    ctx2d.font="12px "+mainfontName;
                    ctx2d.fillText("HP: " + mypicstock[mypic[i]][2]+ " / " + mypicstock[mypic[i]][3],mypicOffsetX,mypicOffsetY+20);
                    ctx2d.fillText("DP: "+ mypicstock[mypic[i]][4]+ " / " + mypicstock[mypic[i]][5],mypicOffsetX,mypicOffsetY+37);
                    ctx2d.fillText("レベル: "+ mypicstock[mypic[i]][12],mypicOffsetX,mypicOffsetY+57);
                    ctx2d.fillText("けいけん: "+ mypicstock[mypic[i]][13],mypicOffsetX,mypicOffsetY+74);
                    ctx2d.fillStyle="rgba(0,0,0," + menuWindowTransChild*0.8+")";
                    ctx2d.fillRect(mypicOffsetX+100,mypicOffsetY-20,120,120);
                    drawMypic(mypic[i],mypicOffsetX+100,mypicOffsetY-20,120,120,menuWindowTransChild);
                    if (i == menuSelectChildNum){
                        ctx2d.strokeStyle="rgba(255,255,255,"+(Math.sin(globalTime/8)*0.3+0.7)+")";
                        ctx2d.strokeWidth=3;
                        ctx2d.strokeRect(mypicOffsetX-5,mypicOffsetY-25,230,height*0.7/3+2);
                    }
                    if (i == menuSortMypicNum){
                        ctx2d.strokeStyle="rgba(255,255,0,"+(Math.sin(globalTime/8)*0.3+0.7)+")";
                        ctx2d.strokeWidth=3;
                        ctx2d.strokeRect(mypicOffsetX-5,mypicOffsetY-25,230,height*0.7/3+2);
                    }
                }
                if (menuMypicDetailAni){
                    ctx2d.fillStyle="rgba(30,30,30," + (1-Math.abs(menuMypicDetailAni-menuWindowAniSpeed)/menuWindowAniSpeed)*0.9+")";
                    ctx2d.fillRect(menuMypicDetailposX,menuMypicDetailposY,400,250);
                    ctx2d.fillStyle="rgba(255,255,255," + (1-Math.abs(menuMypicDetailAni-menuWindowAniSpeed)/menuWindowAniSpeed)*0.9+")";
                    ctx2d.font="25px "+mainfontName;
                    ctx2d.fillText(mypicstock[mypic[menuSelectChildNum]][0],menuMypicDetailposX+20,menuMypicDetailposY+40);
                    ctx2d.font="18px "+mainfontName;
                    ctx2d.fillText("Lv."+mypicstock[mypic[menuSelectChildNum]][12],menuMypicDetailposX+330,menuMypicDetailposY+35);
                    ctx2d.font="12px "+mainfontName;
                    ctx2d.fillText("HP: " + mypicstock[mypic[menuSelectChildNum]][2]+ " / " + mypicstock[mypic[menuSelectChildNum]][3],menuMypicDetailposX+30,menuMypicDetailposY+70);
                    ctx2d.fillText("DP: "+ mypicstock[mypic[menuSelectChildNum]][4]+ " / " + mypicstock[mypic[menuSelectChildNum]][5],menuMypicDetailposX+30,menuMypicDetailposY+86);
                    ctx2d.fillText("こうげき: "+ mypicstock[mypic[menuSelectChildNum]][6],menuMypicDetailposX+30,menuMypicDetailposY+102);
                    ctx2d.fillText("ぼうぎょ: "+ mypicstock[mypic[menuSelectChildNum]][7],menuMypicDetailposX+30,menuMypicDetailposY+118);
                    ctx2d.fillText("うん: "+ mypicstock[mypic[menuSelectChildNum]][9],menuMypicDetailposX+30,menuMypicDetailposY+134);
                    ctx2d.fillText("すばやさ: "+ mypicstock[mypic[menuSelectChildNum]][10],menuMypicDetailposX+30,menuMypicDetailposY+150);
                    ctx2d.fillText("とくせい: "+ specialAvilityText[mypicstock[mypic[menuSelectChildNum]][11]],menuMypicDetailposX+240,menuMypicDetailposY+242);
                    ctx2d.fillText("けいけんち: "+ mypicstock[mypic[menuSelectChildNum]][13],menuMypicDetailposX+30,menuMypicDetailposY+166);
                    for(var i = 0; i <4;i++){
                        if (i <  mypicstock[mypic[menuSelectChildNum]][14]){
                            ctx2d.fillStyle="rgba("+ typeDataCol[skillData[mypicstock[mypic[menuSelectChildNum]][8][i]][3]]+"," + (1-Math.abs(menuMypicDetailAni-menuWindowAniSpeed)/menuWindowAniSpeed)*0.9+")";
                            ctx2d.fillText(skillData[mypicstock[mypic[menuSelectChildNum]][8][i]][0],menuMypicDetailposX+30,menuMypicDetailposY+190+i*16);
                            ctx2d.fillStyle="rgba(255,255,255," + (1-Math.abs(menuMypicDetailAni-menuWindowAniSpeed)/menuWindowAniSpeed)*0.9+")";
                            ctx2d.fillText("DP:"+skillData[mypicstock[mypic[menuSelectChildNum]][8][i]][4],menuMypicDetailposX+150,menuMypicDetailposY+190+i*16);
                            ctx2d.fillText(skillData[mypicstock[mypic[menuSelectChildNum]][8][i]][1],menuMypicDetailposX+120,menuMypicDetailposY+190+i*16);
                        } else {
                            ctx2d.fillStyle="rgba(255,255,255," + (1-Math.abs(menuMypicDetailAni-menuWindowAniSpeed)/menuWindowAniSpeed)*0.9+")";
                            ctx2d.fillText("???",menuMypicDetailposX+30,menuMypicDetailposY+190+i*16);
                        }
                    }
                    ctx2d.fillStyle="rgba(0,0,0," + (1-Math.abs(menuMypicDetailAni-menuWindowAniSpeed)/menuWindowAniSpeed)*0.9+")";
                    ctx2d.fillRect(menuMypicDetailposX+197,menuMypicDetailposY+45,180,180);
                    drawMypic(mypic[menuSelectChildNum],menuMypicDetailposX+197,menuMypicDetailposY+45,180,180,(1-Math.abs(menuMypicDetailAni-menuWindowAniSpeed)/menuWindowAniSpeed));
                }
            } else if(menuSelectNum==1){ ////もちもの
                ctx2d.fillStyle="rgba(105,105,105," + menuWindowTransChild+")";
                ctx2d.font="20px "+mainfontName;
                for(var i = 0;i < Math.min(10,items.length-itemsScroll);i++){
                    if (i != menuSelectChildNum-itemsScroll){
                        ctx2d.fillText(itemdata[items[i+itemsScroll][0]][0],360,60+32*i);
                        ctx2d.fillText("× " + items[i+itemsScroll][1],700,60+32*i);    
                    }
                }
                ctx2d.fillStyle="rgba(255,255,255," + menuWindowTransChild+")";
                ctx2d.font="20px "+mainfontName;
                ctx2d.fillText(itemdata[items[menuSelectChildNum][0]][0],360,60+32*(menuSelectChildNum-itemsScroll));
                ctx2d.fillText("× " + items[menuSelectChildNum][1],700,60+32*(menuSelectChildNum-itemsScroll));
                ctx2d.fillRect(360,60+32*9.5,300,1);
                ctx2d.font="16px "+mainfontName;
                ctx2d.fillText(itemdata[items[menuSelectChildNum][0]][3].substr(0,25),360,60+32*10.3);
                ctx2d.fillText(itemdata[items[menuSelectChildNum][0]][3].substr(25,25),360,60+32*11);
            } else if(menuSelectNum==2){//////マップ

            }
        }
    }
    if (warpAni) { //ワープの処理 
        warpAni++;
        ctx2d.fillStyle="rgba(0,0,0," + (1-Math.abs(warpAni-10)/10)  +")";
        ctx2d.fillRect(0,0,width,height);
    }
    if (warpAni==10 && warpFlg){ //ワープする瞬間
        myposworld=nowWarpObj[4];
        myposx=nowWarpObj[5];
        myposy=nowWarpObj[6];
        createField();
        fieldReDrawFlg=1;
        warpFlg=0;
    } else if(warpAni==20){ //ワープアニメーション終了時
        warpAni=0;
    }

    ////////////////////////////////////////////////////////////////デバッグモード
    if(debugMode%2){ //デバッグモード 1が立っていたらワープを表示
        for(let i = 0;i < fieldwarpobj[myposworld].length;i++){
            ctx2d.fillStyle="rgba(255,0,0,0.3)";
            ctx2d.fillRect(fieldwarpobj[myposworld][i][0],fieldwarpobj[myposworld][i][1],fieldwarpobj[myposworld][i][2],fieldwarpobj[myposworld][i][3]);
        }    
    }
    if (Math.floor(debugMode/2)%2){
        for(let i = 0;i < eventobj[myposworld].length;i++){
            ctx2d.fillStyle="rgba(0,255,0,0.3)";
            ctx2d.fillRect(eventobj[myposworld][i][0],eventobj[myposworld][i][1],eventobj[myposworld][i][2],eventobj[myposworld][i][3]);
        }    
    }
}
