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
var fieldReDrawFlg=0,warpFlg=0,nowWarpObj,eventflgs=[],itemflgs=[];
var menuMypicDetailposX=200,menuMypicDetailposY=100,menuzflg=0,happenedEvent=0;
var eventWindowAni=0,eventWindowKind=0,stockMypicScroll=0,stockMypicSelectNum=0,stockMypicChgWindow=0,stockMypicChgNum=0,eventProcreateStep=0;
var tempEggList=[],eventEggScroll=0,eventEggAni=0,procdrawMypicMode=0;
var eventEggSelectNum=0;  //孵化させる卵の番号（tempEggList内での番号）
var inDrawField=0,drawFieldX=0,drawFieldY=0,inFieldX=0,inFieldY=0;
var drawMypicStatus=0; //0なら何も描いていない　1なら始点を描いた
var drawMypicTempPos=[0,0];//描いた始点を保持
var drawMypicTempObj=[];//描き途中のマイピクの形状を保持
var drawMypicRadius=0,drawMypicTempName="",selectEggItemNum=0,selectEggKind=0;
var titleConfirmWindow=0,titleConfirmSelect=1,titleConfirmMessage="",titleConfirmMessage2="",titleConfirmMode=0;
var eventMessageWindow=0,eventMessageWindowMsg="",eventMessageSelectNum=0,procreateMsg="";
var encount_down=0,encount_down_cnt=0;
var nowShopData,eventShopSelectNum=0,showmoney=0;
var checkSkillConflict=[];

function drawMypic(drawMypicNum,dx,dy,dw,dh,trans,mode){
    if (mypic.length<=drawMypicNum) return 0;
    ctx2d.lineWidth=1;
    if (dw>50) ctx2d.lineWidth=2;
    if (dw>100) ctx2d.lineWidth=3;
    if (dw>150) ctx2d.lineWidth=4;
    if (mode==1){
        for(var i = 0;i < drawMypicTempObj.length;i++){
            ctx2d.strokeStyle="rgba(255,255,255,"+trans+")";
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
function procreateProcess(){ //卵の孵化処理
    var linecnt=0,arccnt=0,linelength=0,arclength=0,lineratio=0,lineCarc=0,lineCline=0,arcCarc=0;
    for(var i = 0; i < drawMypicTempObj.length;i++){
        if (drawMypicTempObj[i][0] == 0){//線なら 
            linecnt++;
            linelength+=Math.sqrt(Math.pow((drawMypicTempObj[i][1]-drawMypicTempObj[i][3]),2)+Math.pow((drawMypicTempObj[i][2]-drawMypicTempObj[i][4]),2));
        } else { //円なら
            arccnt++;
            arclength+=drawMypicTempObj[i][3]*2*Math.PI;
        }
        for(var j = 0; j < drawMypicTempObj.length;j++){//交わりのチェック
            if (i != j){
                if (drawMypicTempObj[i][0] == 0 && drawMypicTempObj[j][0] == 0){
                    var tc=(drawMypicTempObj[i][1] - drawMypicTempObj[i][3])*(drawMypicTempObj[j][2] - drawMypicTempObj[i][2])+(drawMypicTempObj[i][2] - drawMypicTempObj[i][4])*(drawMypicTempObj[i][1] - drawMypicTempObj[j][1]);
                    var td=(drawMypicTempObj[i][1] - drawMypicTempObj[i][3])*(drawMypicTempObj[j][4] - drawMypicTempObj[i][2])+(drawMypicTempObj[i][2] - drawMypicTempObj[i][4])*(drawMypicTempObj[i][1] - drawMypicTempObj[j][3]);
                    if (tc*td<0) lineCline++;
                } else if(drawMypicTempObj[i][0] == 0 && drawMypicTempObj[j][0] == 1){
                    let x1=drawMypicTempObj[i][1],x2=drawMypicTempObj[i][3],y1=drawMypicTempObj[i][2],y2=drawMypicTempObj[i][4];
                    let xr=drawMypicTempObj[j][1],yr=drawMypicTempObj[j][2],r=drawMypicTempObj[j][3];
                    if (r >= Math.sqrt(Math.pow(x1-xr,2)+Math.pow(y1-yr,2))){
                        lineCarc++;
                    } else if (r >= Math.sqrt(Math.pow(x2-xr,2)+Math.pow(y2-yr,2))){
                        lineCarc++;
                    }  else if((xr-x1)*(xr-x2)+(yr-y1)*(yr-y2) < 0){
                        lineCarc++;
                    }
                } else if(drawMypicTempObj[i][0] == 1 && drawMypicTempObj[j][0] == 1){
                    if (Math.sqrt(Math.pow(drawMypicTempObj[i][1]-drawMypicTempObj[j][1],2)+Math.pow(drawMypicTempObj[i][2]-drawMypicTempObj[j][2],2))< drawMypicTempObj[i][3]+drawMypicTempObj[j][3]) arcCarc++;
                }
            }
        }
    }
    lineCline/=2;
    arcCarc/=2;
    lineratio=linelength/(linelength+arclength);
    let neweggData=[];
    const randomrate=0.15;//ランダムで決まる割合　0.2なら元データの0.8〜1の範囲になる
    for(var i=0;i<12;i++) neweggData[i] = eggData[selectEggKind][i];
    neweggData[2]*= (1-randomrate+randomrate*Math.random())*Math.min(1.5,(0.8+0.07*lineCline));//HP
    neweggData[3]*= (1-randomrate+randomrate*Math.random())*Math.min(1.5,(0.8+0.07*lineCarc));//MP
    neweggData[4]*= (1-randomrate+randomrate*Math.random())*Math.min(1.2,(0.9+0.4*Math.pow(lineratio,1)));//攻撃力
    neweggData[5]*= (1-randomrate+randomrate*Math.random())*Math.min(1.2,(0.9+0.4*Math.pow((1-lineratio),1)));//防御力
    neweggData[7]+= 3*(randomrate*Math.random()+(1-randomrate)*Math.min(1,0.3*Math.sqrt(arcCarc)));//運
    neweggData[8]*= (1-randomrate+randomrate*Math.random())*Math.max(1.6,(1.5-(linecnt+arccnt)/15*0.8));//すばやさ
    neweggData[5]*= Math.min(1.5,(0.7+(linecnt+arccnt)/15*0.8));//防御力
    let specialAvilityDice=[],diceConfig=[0.35/2,0.1,0.05,0.025];
    for(var i = 0;i < specialAvilityText.length;i++) specialAvilityDice[i]=0;
    for(var i = 0;i < diceConfig.length;i++){
        specialAvilityDice[(linecnt+arccnt+i+specialAvilityText)%specialAvilityText.length]+=diceConfig[i];
        specialAvilityDice[(linecnt+arccnt-i+specialAvilityText)%specialAvilityText.length]+=diceConfig[i];
    }
    let procMypicDice=Math.random();
    let tempsum=0;
    for(var i = 0;i < specialAvilityText.length;i++){
        tempsum+=specialAvilityDice[i];
        if (procMypicDice<tempsum) {
            procMypicDice=i;
            break;
        }   
    }
    neweggData[11] = procMypicDice;
    neweggData[2]=Math.floor(neweggData[2]);
    neweggData[3]=Math.floor(neweggData[3]);
    neweggData[4]=Math.floor(neweggData[4]);
    neweggData[5]=Math.floor(neweggData[5]);
    neweggData[7]=Math.floor(neweggData[7]);
    neweggData[8]=Math.floor(neweggData[8]);
    mypicstock.push(
        [drawMypicTempName,drawMypicTempObj,
            neweggData[2],neweggData[2],neweggData[3],neweggData[3],
            neweggData[4],neweggData[5],neweggData[6],
            neweggData[7],neweggData[8],Math.floor(Math.random()*specialAvilityText.length),1,0,
            [],neweggData[10],neweggData[11]]
    );
}
function clickEveDraw(x,y){ //クリックイベント
    if (mode==1 && eventWindowKind==2 && eventWindowAni && eventProcreateStep==1){ //マイピクドロー中のみ反応
        if (inDrawField && drawMypicTempObj.length <15){ //ドローフィールドの中なら
            if (!drawMypicStatus){
                drawMypicStatus=1;
                drawMypicTempPos[0] = x;
                drawMypicTempPos[1]  = y;
                inDrawField=0;
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

function encount_check(){//敵との遭遇率encount=6*((200−運)/200)
    if (mypic.length==0) return 0;
    var encountRate = (6*((200 - infToRange(mypicstock[mypic[0]][9],0,100,30))/200));
    var tempEncRandom=((3000+encount_down*6000)*Math.random());
    
    if (encountRate>=tempEncRandom) {
        encount=true;
    } else {
        encount=false;
    }
    if (encount_down_cnt){
        encount_down_cnt--;
        if(!encount_down_cnt) encount_down=0,popupMsg.push(["むしよけスプレーの効果がきれた！",120,0,0,-1]);
    }
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

    for(let i = 0;i  < eventobj[myposworld].length;i++){
        if (eventobj[myposworld][i][4] == 4){
            eventflgs[i]=0;
            let tmpdirfix=[0,0,0,0];
            tmpdirfix[dir]=5;
            if (eventobj[myposworld][i][0] < myposx+charasize+tmpdirfix[1]-tmpdirfix[0] && eventobj[myposworld][i][0] + eventobj[myposworld][i][2] > myposx+tmpdirfix[1]-tmpdirfix[0]){
                if (eventobj[myposworld][i][1] < myposy+charasize+tmpdirfix[3]-tmpdirfix[2] && eventobj[myposworld][i][1] + eventobj[myposworld][i][3] > myposy+tmpdirfix[3]-tmpdirfix[2] ){
                    eventflgs[i]=1;
                    if(!popupMsg.length) popupMsg.push(["この場所へ行けないようだ！　またあとで来てみよう",120,0,0,-1]);
                    return 1;
                }
            }    
        } 
    }

    for(let i = 0;i < itemobj[myposworld].length;i++){
        itemflgs[i]=0;
        if (itemobj[myposworld][i][0] < myposx+charasize && itemobj[myposworld][i][0] + itemobj[myposworld][i][2] > myposx){
            if (itemobj[myposworld][i][1] < myposy+charasize && itemobj[myposworld][i][1] + itemobj[myposworld][i][3] > myposy){
                itemflgs[i]=1;
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
}
function initiate_field(){
    /*　フィールド・キャラクターの初期化処理/////////////////////////////////////////
    @param なし
    @return なし
    */
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
    encount_check();
    walkanimation=(walkanimation+1)%30; //歩く処理
}
function trigEvent(trigEventnum,trigEventObj){
    if (trigEventnum==1){ //マイピク整理のイベント
        if (mypicstock.length){
            eventWindowAni++;
            eventWindowKind=1;
            happenedEvent=1;
            stockMypicScroll=0;
            stockMypicSelectNum=0;
        } else{
            eventMessageWindowMsg="マイピクを持っていない！";
            eventMessageWindow=1;
        }
    }　else if (trigEventnum==2){ //マイピク孵化のイベント
        //持っている卵のリストを作成
        tempEggList=[];
        for(var i = 0;i < items.length;i++){
            if(itemdata[items[i][0]][4]!=-1){
                tempEggList.push(items[i]);
                tempEggList[tempEggList.length-1][2]=i;
            }
        }
        if (tempEggList.length){ //卵をもっているとき
            eventWindowAni++;
            eventWindowKind=2;
            eventProcreateStep=0;
            happenedEvent=1;
            eventEggScroll=0,eventEggSelectNum=0;
            procdrawMypicMode=0;
            drawMypicTempObj=[];
            drawMypicTempName="";
        }  else{
            eventMessageWindow=1;
            eventMessageWindowMsg="かえせるたまごを持っていないようだ！";
        }
    } else if(trigEventnum==3 && !menuSelectFlg){ //お店
        eventWindowKind=3;
        eventWindowAni++;
        showmoney=money;
        nowShopData=shopData[trigEventObj[5]]
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
    if (fieldReDrawFlg && loadedimgCnt==imgCnt) {
        field2d.clearRect(0,0,width,height),field2d.drawImage(fieldcanvas,0,0,width,height,0,0,width,height),fieldReDrawFlg=0, checkConflict(0);//背景の描画
        //アイテムの描画
        for(let i = 0;i < fieldItemStatus[myposworld].length;i++){
            if(fieldItemStatus[myposworld][i][5]){
                const itemimg=new Image();
                itemimg.src="./imgs/item.png";
                itemimg.onload=function(){field2d.drawImage(itemimg,fieldItemStatus[myposworld][i][0],fieldItemStatus[myposworld][i][1],fieldItemStatus[myposworld][i][2],fieldItemStatus[myposworld][i][3])}    
            }
        }
    }
    ctx2d.drawImage(characanvas,pre_charasize*Math.floor(walkanimation/15),pre_charasize*walkdir,pre_charasize,pre_charasize,myposx,myposy,charasize,charasize); //キャラクターの描画
    if (happenedEvent){
        for(var i = 0;i < eventobj[myposworld].length;i++){
            happenedEvent*=(1-eventflgs[i]);
        }
        happenedEvent=1-happenedEvent;
    }

    ////////////////////////////////////////////////////////////////デバッグモード
    if(debugMode%2){ //デバッグモード 1が立っていたらワープを表示
        for(let i = 0;i < fieldwarpobj[myposworld].length;i++){
            field2d.fillStyle="rgba(255,0,0,0.3)";
            field2d.fillRect(fieldwarpobj[myposworld][i][0],fieldwarpobj[myposworld][i][1],fieldwarpobj[myposworld][i][2],fieldwarpobj[myposworld][i][3]);
        }    
    }
    if (Math.floor(debugMode/2)%2){
        for(let i = 0;i < eventobj[myposworld].length;i++){
            field2d.fillStyle="rgba(0,255,0,0.3)";
            field2d.fillRect(eventobj[myposworld][i][0],eventobj[myposworld][i][1],eventobj[myposworld][i][2],eventobj[myposworld][i][3]);
        }
    }

    ////////////////////////////////////////////////////////キー入力等処理
    if (eventWindowAni){ //イベントウィンドウが表示されている時
        if (eventWindowKind==1){ //整理イベント
            ctx2d.fillStyle="rgba(0,0,0,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*0.8+")";
            ctx2d.fillRect(width/2-250,height/2-200,500,400);
            ctx2d.font="20pt " + mainfontName;
            ctx2d.fillStyle="rgba(255,255,255,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
            ctx2d.fillText("マイピクのおうち",width/2-230,height/2-160);    
            var stockMypicOffsetX,stockMypicOffsetY;
            for(var i = 0;i < 6;i++){
                if (mypicstock.length > i+stockMypicScroll){ ////ストックマイピクを描画
                    stockMypicOffsetY=height/2-200+83;
                    stockMypicOffsetX=width/2-240;
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
                    ctx2d.font="14pt " + mainfontName;
                    ctx2d.fillText(mypicstock[i+stockMypicScroll][0],stockMypicOffsetX-15,stockMypicOffsetY);    
                    ctx2d.font="10pt " + mainfontName;
                    ctx2d.fillText("Lv. "+ mypicstock[i+stockMypicScroll][12],stockMypicOffsetX+10,stockMypicOffsetY+20);    
                    ctx2d.fillText("Exp. "+ mypicstock[i+stockMypicScroll][13],stockMypicOffsetX+10,stockMypicOffsetY+36);    
                    ctx2d.fillText("HP "+ mypicstock[i+stockMypicScroll][3],stockMypicOffsetX+10,stockMypicOffsetY+56);
                    ctx2d.fillText("DP "+ mypicstock[i+stockMypicScroll][5],stockMypicOffsetX+10,stockMypicOffsetY+72);    
                    drawMypic(i+stockMypicScroll,stockMypicOffsetX+105,stockMypicOffsetY-15,100,100,(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed));
                }
                if(i == stockMypicSelectNum-stockMypicScroll){
                    ctx2d.strokeStyle="rgba(255,255,255,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*(Math.sin(globalTime/10)*0.3+0.7)+")";
                    ctx2d.strokeRect(stockMypicOffsetX-25,stockMypicOffsetY-20,240,108)
                }
            }
            if (upkey && !menuSelectFlg && !eventMessageWindow){
                if (!stockMypicChgWindow && stockMypicSelectNum>1){
                    stockMypicSelectNum-=2,menuSelectFlg=1;
                    if (spacekey) menuSelectFlg=0;
                    if (stockMypicSelectNum<stockMypicScroll) stockMypicScroll-=2;    
                } else if(stockMypicChgWindow){
                    if (stockMypicChgNum) stockMypicChgNum--,menuSelectFlg=1;
                }
            }
            if (downkey && !menuSelectFlg && !eventMessageWindow) {
                if (!stockMypicChgWindow&& stockMypicSelectNum<(mypicstock.length-2)){
                    stockMypicSelectNum+=2,menuSelectFlg=1;
                    if (spacekey) menuSelectFlg=0;
                    if (stockMypicSelectNum>stockMypicScroll+5) stockMypicScroll+=2;
                } else if(stockMypicChgWindow){
                    if (stockMypicChgNum!=5) stockMypicChgNum++,menuSelectFlg=1;
                }
            }
            if (leftkey&& !eventMessageWindow && (stockMypicSelectNum%2) && !menuSelectFlg && !stockMypicChgWindow) stockMypicSelectNum--,menuSelectFlg=1;
            if (rightkey&& !eventMessageWindow &&!(stockMypicSelectNum%2) && !menuSelectFlg && !stockMypicChgWindow && mypicstock.length!=1) stockMypicSelectNum++,menuSelectFlg=1;
            if (zkey && !menuSelectFlg){
                if (!mypic.includes(stockMypicSelectNum) && !stockMypicChgWindow){
                    if (mypic.length!=6){
                        mypic.push(stockMypicSelectNum);
                        eventMessageWindow=1;
                        eventMessageWindowMsg=mypicstock[stockMypicSelectNum][0]+"がなかまにくわわった！";
                    } else{
                        stockMypicChgWindow++;
                        menuSelectFlg=1;    
                    }
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
                        ctx2d.fillStyle="rgba(255,255,255,"+ (1-Math.abs(stockMypicChgWindow-menuWindowAniSpeed)/menuWindowAniSpeed)*(Math.sin(globalTime/6)*0.3+0.7)+")";
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
                    selectEggItemNum=tempEggList[eventEggSelectNum][2];
                    selectEggKind=itemdata[items[selectEggItemNum][0]][4];
                } else if(eventProcreateStep==1 && drawMypicTempObj.length){
                    eventProcreateStep++,menuSelectFlg=1,eventEggAni=0;
                } else if(eventProcreateStep==2 && drawMypicTempName.length){ //生まれる時の処理
                    procreateProcess();
                    consumeItem(selectEggItemNum);
                    eventProcreateStep++,menuSelectFlg=1,eventEggAni=0;
                    if (mypic.length!=6) {
                        procreateMsg="なかまにくわわった！";
                        mypic.push(mypicstock.length-1);
                    } else{ 
                        procreateMsg="おうちにおくられた"
                    }
                } else if(eventProcreateStep==3){
                    eventWindowAni++,menuSelectFlg=1;
                }
            } 
            if(xkey && !menuSelectFlg){
                if (!eventProcreateStep){
                    eventWindowAni++;
                } else if(eventProcreateStep!=3){
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
                ctx2d.fillStyle="rgba(255,255,255,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*(Math.sin(globalTime/6)*0.3+0.7)+")";
                ctx2d.fillText(itemdata[tempEggList[eventEggSelectNum][0]][0],width/2-230,height/2-80+23*(eventEggSelectNum-eventEggScroll));  
                ctx2d.fillText("× "+tempEggList[eventEggSelectNum][1],width/2+180,height/2-80+23*(eventEggSelectNum-eventEggScroll)); 
                ctx2d.font="12pt " + mainfontName;
                ctx2d.fillStyle="rgba(255,255,255,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
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
                        ctx2d.moveTo(drawMypicTempPos[0],drawMypicTempPos[1]);
                        ctx2d.lineTo(inFieldX,inFieldY);
                        ctx2d.stroke();    
                    } else { //円
                        ctx2d.beginPath();
                        ctx2d.strokeStyle="rgba(255,255,255,1)";
                        ctx2d.arc(drawMypicTempPos[0],drawMypicTempPos[1],drawMypicRadius,0,Math.PI*2);
                        ctx2d.stroke();    
                    }
                }
                drawMypic(0,width/2-135,height/2-110,270,270,1,1);
            } else if(eventProcreateStep==2){ //ネーミング
                ctx2d.fillStyle="rgba(255,255,255,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*Math.min(1,eventEggAni/20)*Math.sin(globalTime/5)+")";
                if (drawMypicTempName.length != 6) ctx2d.fillText("_",width/2-215+ctx2d.measureText(drawMypicTempName).width,height/2-60);
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
            } else if(eventProcreateStep==3){ //生まれた！
                ctx2d.font="16pt " + mainfontName;
                ctx2d.fillStyle="rgba(255,255,255,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*Math.min(1,eventEggAni/20)*Math.min(1,eventEggAni/20)*(Math.sin(globalTime/10)*0.3+0.7)+")";
                ctx2d.fillText((drawMypicTempName + "がうまれた！　"+procreateMsg).substr(0,eventEggAni/3),width/2-225,height/2-125);
                ctx2d.fillStyle="rgba(255,255,255,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*Math.min(1,eventEggAni/20)*Math.min(1,eventEggAni/20)+")";
                ctx2d.font="11pt " + mainfontName;
                ctx2d.fillText("さいだいHP: " + mypicstock[mypicstock.length-1][3],width/2-230,height/2+113);
                ctx2d.fillText("さいだいDP: " + mypicstock[mypicstock.length-1][5],width/2-230,height/2+133);
                ctx2d.fillText("こうげき: " + mypicstock[mypicstock.length-1][6],width/2-230,height/2+158);
                ctx2d.fillText("ぼうぎょ: " + mypicstock[mypicstock.length-1][7],width/2-230,height/2+178);

                ctx2d.fillText("うん: " + mypicstock[mypicstock.length-1][9],width/2-100,height/2+113);
                ctx2d.fillText("すばやさ: " + mypicstock[mypicstock.length-1][10],width/2-100,height/2+133);
                ctx2d.fillText("とくせい:" + specialAvilityText[mypicstock[mypicstock.length-1][11]],width/2-100,height/2+158);
                ctx2d.strokeStyle="rgba(255,255,255,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*Math.min(1,eventEggAni/20)*Math.min(1,eventEggAni/20)+")";
                ctx2d.lineWidth=1;
                ctx2d.strokeRect(width/2+57,height/2+97,180,87);
                ctx2d.fillText("わざ",width/2+60,height/2+113);
                ctx2d.font="9pt " + mainfontName;
                for(var i = 0;i < 4;i++){
                    ctx2d.fillStyle="rgba("+typeDataCol[skillData[mypicstock[mypicstock.length-1][8][i]][3]] +","+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*Math.min(1,eventEggAni/20)*Math.min(1,eventEggAni/20)+")";
                    ctx2d.fillText(skillData[mypicstock[mypicstock.length-1][8][i]][0],width/2+70,height/2+133+i*15);
                    ctx2d.fillText("MP:"+skillData[mypicstock[mypicstock.length-1][8][i]][4],width/2+195,height/2+133+i*15);
                }
                ctx2d.font="11pt " + mainfontName;
                ctx2d.fillStyle="rgba("+ typeDataCol[mypicstock[mypicstock.length-1][15]]+","+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                ctx2d.fillText("ぞくせい:" + typeDataText[mypicstock[mypicstock.length-1][15]],width/2-100,height/2+178);

                ctx2d.fillStyle="rgba(0,0,0,"+0.8*(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                ctx2d.fillRect(width/2-100,height/2-110,200,200);
                drawMypic(0,width/2-100,height/2-110,200,200,1,1);
                ctx2d.fillStyle="rgba(0,0,0,"+(1-Math.pow(Math.min(1,eventEggAni/100),1))+")";
                ctx2d.fillRect(width/2-250,height/2-200,500,400);
            }
            eventEggAni++;
        } else if(eventWindowKind==3){ //お店
            ctx2d.fillStyle="rgba(0,0,0," +(1- Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed) + ")";
            ctx2d.fillRect(width/2-200,height/2-150,400,300);
            ctx2d.fillStyle="rgba(255,255,255," +(1- Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed) + ")";
            ctx2d.font="18pt " + mainfontName;
            ctx2d.fillText("おみせ" , width/2-200+15,height/2-150+30);
            ctx2d.font="13pt " + mainfontName;
            ctx2d.fillStyle="rgba(105,105,105," +(1- Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed) + ")";
            for(var i = 0;i < Math.min(10,nowShopData.length);i++){
                if (i!=eventShopSelectNum){
                    ctx2d.fillText(itemdata[nowShopData[i][0]][0], width/2-200+35,height/2-150+60+i*20);
                    ctx2d.fillText(nowShopData[i][1], width/2+200-105-ctx2d.measureText(nowShopData[i][1]).width,height/2-150+60+i*20);
                    ctx2d.fillText(currencyName, width/2+200-85,height/2-150+60+i*20);
                }
            }
            ctx2d.fillStyle="rgba(255,255,255," +(1- Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*(Math.sin(globalTime/6)*0.3+0.7) + ")";
            ctx2d.fillText(itemdata[nowShopData[eventShopSelectNum][0]][0], width/2-200+35,height/2-150+60+eventShopSelectNum*20);
            ctx2d.fillText(nowShopData[eventShopSelectNum][1], width/2+200-105-ctx2d.measureText(nowShopData[eventShopSelectNum][1]).width,height/2-150+60+eventShopSelectNum*20);
            ctx2d.fillText(currencyName, width/2+200-85,height/2-150+60+eventShopSelectNum*20);
            ctx2d.fillStyle="rgba(255,255,255," +(1- Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed) + ")";
            ctx2d.fillRect(width/2-200+20,height/2-150+260,360,1);
            ctx2d.fillText("おかね　" + showmoney  + " "+currencyName, width/2+180-ctx2d.measureText("おかね　" + money  + " "+currencyName).width,height/2-150+285);
            if(xkey && !(eventWindowAni-menuWindowAniSpeed)&& !menuSelectFlg && !eventMessageWindow) eventWindowAni++,menuSelectFlg=1;
            if(upkey && eventShopSelectNum && !(eventWindowAni-menuWindowAniSpeed) && !menuSelectFlg) eventShopSelectNum--,menuSelectFlg=1;
            if(downkey && eventShopSelectNum != nowShopData.length-1&& !(eventWindowAni-menuWindowAniSpeed)&& !menuSelectFlg) eventShopSelectNum++,menuSelectFlg=1;
            if(zkey && !(eventWindowAni-menuWindowAniSpeed)&& !menuSelectFlg && !eventMessageWindow) {
                if (money >= nowShopData[eventShopSelectNum][1]){
                    money-=nowShopData[eventShopSelectNum][1];
                    getItem(nowShopData[eventShopSelectNum][0]);
                    eventMessageWindow=1;
                    eventMessageWindowMsg=itemdata[nowShopData[eventShopSelectNum][0]][0]+"を買った！";
                    menuSelectFlg=1;    
                } else {
                    eventMessageWindow=1;
                    eventMessageWindowMsg="お金が足りない！";
                    menuSelectFlg=1;    
                }
            }
            if(money < showmoney) showmoney-=10;
            if (money > showmoney) showmoney+=10;
            if (Math.abs(showmoney-money)<10) showmoney=money;
        }
        if (!upkey && !downkey && !zkey && !leftkey && !rightkey && !xkey && !zkey) menuSelectFlg=0;
        if (eventWindowAni && (eventWindowAni-menuWindowAniSpeed)) eventWindowAni++;
        if (eventWindowAni == 2*menuWindowAniSpeed) eventWindowAni=0,happenedEvent=0; 
        if (spacekey) menuSelectFlg=0;
    } else if(!menuWindow&& !eventMessageWindow){ /////メニューウィンドウが表示されていない時
        if(ckey) menuWindow++;
        if (leftkey) walkdir=0;
        if (rightkey) walkdir=1;
        if (upkey) walkdir=2;
        if (downkey) walkdir=3;
        if (leftkey && !checkConflict(0)) myposx-=walkspeed,walkeve();
        if (rightkey && !checkConflict(1)) myposx+=walkspeed,walkeve();
        if (upkey && !checkConflict(2)) myposy-=walkspeed,walkeve();
        if (downkey && !checkConflict(3)) myposy+=walkspeed,walkeve();
        if (zkey && !selectTitleFlg&& !eventMessageWindow) { //アクションキー
            for(var i = 0; i < eventobj[myposworld].length;i++){
                if (eventflgs[i] && !happenedEvent) trigEvent(eventobj[myposworld][i][4],eventobj[myposworld][i]);
            }
            for(var i = 0;i < itemobj[myposworld].length;i++){
                if (itemflgs[i] && !menuSelectFlg && fieldItemStatus[myposworld][i][5]){
                    popupMsg.push([itemdata[fieldItemStatus[myposworld][i][4]][0]+"をゲットした！",120,0,0,-1]);
                    fieldItemStatus[myposworld][i][5]--;
                    getItem(fieldItemStatus[myposworld][i][4]);
                    fieldReDrawFlg=1;
                    console.log(fieldItemStatus);
                }
            }
        }
        if (zkey && eventWindowAni && !menuSelectFlg) eventWindowAni++;
        if (!zkey) selectTitleFlg=0;
    } else { /////メニューウィンドウが表示されている時
        if(xkey && !(menuWindow-menuWindowAniSpeed) && !menuWindowChildAni && !titleConfirmWindow && !menuSelectFlg && !eventMessageWindow) menuWindow++;
        if(xkey && !(menuWindow-menuWindowAniSpeed) && !menuWindowChildAni && titleConfirmWindow && !menuSelectFlg && !eventMessageWindow) titleConfirmWindow++,menuSelectFlg=1;
        if(zkey && menuWindow && !menuWindowChildAni && !titleConfirmWindow && !menuSelectFlg && !eventMessageWindow){
            if (menuSelectNum==3){ //セーブ
                titleConfirmWindow=1;
                menuSelectFlg=1;
                titleConfirmMessage="セーブしますか？";
                titleConfirmMessage2="";
                titleConfirmMode=3;
            } else if(menuSelectNum==4){ //タイトル
                titleConfirmWindow=1;
                menuSelectFlg=1;
                titleConfirmMessage="ほんとうにタイトルにもどりますか？";
                titleConfirmMessage2="セーブしていないデータはうしなわれます";
                titleConfirmMode=3;
            } else { //メニューを開く時
                if (menuSelectNum==0 && mypic.length==0){
                    eventMessageWindowMsg="マイピクを持っていない！";
                    eventMessageWindow=1;
                    menuSelectFlg=1;
                }  else{
                    menuWindowChildAni++;
                    menuSelectChildNum=0, itemsScroll=0;
                    menuSortMypicNum=-1;    
                }
            }
            menuSelectFlg=1;
        }else if(zkey && menuWindow  && titleConfirmWindow && !menuSelectFlg){
            if (menuSelectNum==3){ //セーブ
                if (titleConfirmMode==3){
                    if (!titleConfirmSelect){
                        saveData();
                        titleConfirmMessage="セーブしました！";
                        titleConfirmMessage2="";
                        titleConfirmMode=5;    
                    } else{
                        titleConfirmWindow++;
                    }
                } else if (titleConfirmMode==5){
                    titleConfirmWindow++;
                }
                menuSelectFlg=1;
            } else if(menuSelectNum==4){ //タイトル
                titleConfirmWindow++;
                menuSelectFlg=1;
                if (!titleConfirmSelect) {
                    nextMode=0;
                    modeAnimation=1;
                    checkfirstLaunch();
                }
            }
        }  else if(zkey &&!menuSelectFlg&& !menuzflg&& menuWindow&&menuWindowChildAni && menuSelectNum==0 && !menuMypicDetailAni && !(menuWindowChildAni-menuWindowAniSpeed) && menuSortMypicNum==-1){ //マイピクの詳細画面を見る時
            menuMypicDetailAni++;
            menuSelectFlg=1;
        } else if(zkey &&!menuSelectFlg&& menuWindow&&menuWindowChildAni && menuSelectNum==0 && !menuMypicDetailAni && !(menuWindowChildAni-menuWindowAniSpeed) && menuSortMypicNum!=-1){ //マイピクの詳細画面を見る時
            //入れ替え処理
            var menuTmpSort=mypic[menuSortMypicNum];
            mypic[menuSortMypicNum]=mypic[menuSelectChildNum];
            mypic[menuSelectChildNum]=menuTmpSort;
            menuSortMypicNum=-1;
            menuzflg=1;
        }
        if (upkey && !eventMessageWindow&& !menuSelectFlg && !menuWindowChildAni && !eventMessageWindow) menuSelectNum--,menuSelectFlg=1;
        if (downkey && !eventMessageWindow&& !menuSelectFlg && !menuWindowChildAni && !eventMessageWindow) menuSelectNum++,menuSelectFlg=1;
        if (spacekey) menuSelectFlg=0;
        if (upkey && !menuSelectFlg && menuWindowChildAni&& !eventMessageWindow) {  //上キー
            if (menuSelectNum==0 && menuSelectChildNum>=2 && !menuMypicDetailAni){//マイピク
                menuSelectChildNum-=2,menuSelectFlg=1;
            } else if (menuSelectNum==1 && menuSelectChildNum&& !menuMypicDetailAni){
                menuSelectChildNum--,menuSelectFlg=1;
                if (menuSelectChildNum < itemsScroll && itemsScroll) itemsScroll--;    
            }
        }
        if (downkey && !menuSelectFlg && menuWindowChildAni && !eventMessageWindow) {//下キー
            if (menuSelectNum==0 && menuSelectChildNum+2<mypic.length && !menuMypicDetailAni){//マイピク
                menuSelectChildNum+=2,menuSelectFlg=1;
            } else if (menuSelectNum==1 && (menuSelectChildNum!=(items.length-1)) && !menuMypicDetailAni){
                menuSelectChildNum++,menuSelectFlg=1;
                if (menuSelectChildNum>=10 && menuSelectChildNum-itemsScroll == 10) itemsScroll++;
            }
        }
        if (leftkey && !menuSelectFlg && menuWindowChildAni&& !eventMessageWindow) { //左キー
            if (menuSelectNum==0 && (menuSelectChildNum%2)&& !menuMypicDetailAni){//マイピク
                menuSelectChildNum--,menuSelectFlg=1;
            } 
        }
        if (rightkey && !menuSelectFlg && menuWindowChildAni&& !eventMessageWindow) {//右キー
            if (menuSelectNum==0 && !(menuSelectChildNum%2) && mypic.length != 1 && !menuMypicDetailAni){//マイピク
                menuSelectChildNum++,menuSelectFlg=1;
            } 
        }
        if (zkey && menuSelectNum==1 && !menuSelectFlg && menuWindowChildAni && !eventMessageWindow){//アイテムの使用
            if (!itemdata[items[menuSelectChildNum][0]][1]){
                eventMessageWindow=1;
                eventMessageWindowMsg="ここではつかえない！";
            } else{
                if (items[menuSelectChildNum][0] >=0 && items[menuSelectChildNum][0] <= 10){
                    eventMessageWindow=1;
                    eventMessageWindowMsg="/だれにつかう？";
                } else if(items[menuSelectChildNum][0] >= 16 && items[menuSelectChildNum][0] <= 18){
                    eventMessageWindow=1;
                    eventMessageWindowMsg="/だれにつかう？";
                } else if (items[menuSelectChildNum][0] == 15){
                    consumeItem(menuSelectChildNum);
                    nextMode=1;
                    modeAnimation=1;
                    myposx=homposx,myposy=homposy,myposworld=homposworld;
                    eventMessageWindow=1;
                    eventMessageWindowMsg=itemdata[items[menuSelectChildNum][0]][0] + "をつかった！";
                } else if(items[menuSelectChildNum][0] == 16){
                    consumeItem(menuSelectChildNum);
                    encount_down_cnt=3000;
                    eventMessageWindow=1;
                    eventMessageWindowMsg=itemdata[items[menuSelectChildNum][0]][0] + "をつかった！";    
                }
                eventMessageSelectNum=0;
                if (eventMessageWindowMsg=="/だれにつかう？" && mypic.length==0){
                    eventMessageWindowMsg="つかえるマイピクを持っていない！";
                }
            }
            menuSelectFlg=1;
        }
        if (!upkey && !downkey && !leftkey && !rightkey && !zkey && !xkey) menuSelectFlg=0;
        if (menuSelectNum<0) menuSelectNum=0;
        if (menuSelectNum >= menuWindowTxt.length) menuSelectNum=menuWindowTxt.length-1;
        if (titleConfirmWindow && (titleConfirmWindow-menuWindowAniSpeed)) titleConfirmWindow++;
        if (titleConfirmWindow && (titleConfirmWindow-2*menuWindowAniSpeed)>=0) titleConfirmWindow=0;
        if (titleConfirmWindow){
            ctx2d.fillStyle="rgba(0,0,0,"+ (1-Math.abs(titleConfirmWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
            ctx2d.fillRect(width/2-200,height/2-60,400,120);
            ctx2d.font="14pt "+ mainfontName;
            ctx2d.fillStyle="rgba(255,255,255,"+ (1-Math.abs(titleConfirmWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
            ctx2d.fillText(titleConfirmMessage,width/2-180,height/2-20);
            ctx2d.fillText(titleConfirmMessage2,width/2-180,height/2);
            if (titleConfirmMode != 5){
                if (!titleConfirmSelect){
                    ctx2d.fillStyle="rgba(255,255,255,"+ (1-Math.abs(titleConfirmWindow-menuWindowAniSpeed)/menuWindowAniSpeed)*(0.7+Math.sin(globalTime/6)*0.3)+")";
                    ctx2d.fillText("はい",(width-ctx2d.measureText("はい").width)/2-80,height/2+35);
                    ctx2d.fillStyle="rgba(105,105,105,"+ (1-Math.abs(titleConfirmWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                    ctx2d.fillText("いいえ",(width-ctx2d.measureText("いいえ").width)/2+80,height/2+35);        
                } else{
                    ctx2d.fillStyle="rgba(105,105,105,"+ (1-Math.abs(titleConfirmWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                    ctx2d.fillText("はい",(width-ctx2d.measureText("はい").width)/2-80,height/2+35);
                    ctx2d.fillStyle="rgba(255,255,255,"+ (1-Math.abs(titleConfirmWindow-menuWindowAniSpeed)/menuWindowAniSpeed)*(0.7+Math.sin(globalTime/6)*0.3)+")";
                    ctx2d.fillText("いいえ",(width-ctx2d.measureText("いいえ").width)/2+80,height/2+35);    
                }
            }
            if (leftkey && !menuSelectFlg) titleConfirmSelect=0,menuSelectFlg=1;
            if (rightkey && !menuSelectFlg) titleConfirmSelect=1,menuSelectFlg=1;
        }
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
    if(xkey && !(menuWindowChildAni-menuWindowAniSpeed) && menuWindowChildAni && !menuMypicDetailAni && !eventMessageWindow) menuWindowChildAni++;
    if(xkey && !(menuWindowChildAni-menuWindowAniSpeed) && menuWindowChildAni && !(menuMypicDetailAni-menuWindowAniSpeed) && !eventMessageWindow) menuMypicDetailAni++;
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
                if (menuWindowChildAni || eventMessageWindow || titleConfirmWindow){
                    ctx2d.fillStyle="rgba(255,255,255," + menuWindowTrans+")";                    
                } else{
                    ctx2d.fillStyle="rgba(255,255,255," + menuWindowTrans*(Math.sin(globalTime/6)*0.3+0.7)+")";
                }
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
                    if (mypicstock[mypic[i]][0].length==6) ctx2d.font="16px "+mainfontName;
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
                        ctx2d.lineWidth=3;
                        ctx2d.strokeRect(mypicOffsetX-5,mypicOffsetY-25,230,height*0.7/3+2);
                    }
                    if (i == menuSortMypicNum){
                        ctx2d.strokeStyle="rgba(255,255,0,"+(Math.sin(globalTime/8)*0.3+0.7)+")";
                        ctx2d.lineWidth=3;
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
                        ctx2d.fillStyle="rgba("+ typeDataCol[skillData[mypicstock[mypic[menuSelectChildNum]][8][i]][3]]+"," + (1-Math.abs(menuMypicDetailAni-menuWindowAniSpeed)/menuWindowAniSpeed)*0.9+")";
                        ctx2d.fillText(skillData[mypicstock[mypic[menuSelectChildNum]][8][i]][0],menuMypicDetailposX+30,menuMypicDetailposY+190+i*16);
                        ctx2d.fillStyle="rgba(255,255,255," + (1-Math.abs(menuMypicDetailAni-menuWindowAniSpeed)/menuWindowAniSpeed)*0.9+")";
                        ctx2d.fillText("DP:"+skillData[mypicstock[mypic[menuSelectChildNum]][8][i]][4],menuMypicDetailposX+150,menuMypicDetailposY+190+i*16);
                        ctx2d.fillText(skillData[mypicstock[mypic[menuSelectChildNum]][8][i]][1],menuMypicDetailposX+120,menuMypicDetailposY+190+i*16);
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
                        ctx2d.fillText(itemdata[items[i+itemsScroll][0]][0],360,90+28*i);
                        ctx2d.fillText("× " + items[i+itemsScroll][1],700,90+28*i);    
                    }
                }
                if (itemdata[items[menuSelectChildNum][0]][1]){
                    if (!eventMessageWindow){
                        ctx2d.fillStyle="rgba(255,255,255," + menuWindowTransChild*(Math.sin(globalTime/6)*0.3+0.7)+")";
                    } else{
                        ctx2d.fillStyle="rgba(255,255,255,1)";
                    }
                } else{
                    ctx2d.fillStyle="rgba(155,155,155," + menuWindowTransChild*(Math.sin(globalTime/6)*0.3+0.7)+")";
                }
                ctx2d.font="20px "+mainfontName;
                ctx2d.fillText(itemdata[items[menuSelectChildNum][0]][0],360,90+28*(menuSelectChildNum-itemsScroll));
                ctx2d.fillText("× " + items[menuSelectChildNum][1],700,90+28*(menuSelectChildNum-itemsScroll));
                ctx2d.fillStyle="rgba(255,255,255," + menuWindowTransChild+")";
                ctx2d.fillRect(360,60+32*9.5,300,1);
                ctx2d.font="16px "+mainfontName;
                ctx2d.fillText("おかね："+ money + currencyName,750-ctx2d.measureText("おかね："+ money + currencyName).width,48);
                ctx2d.font="16px "+mainfontName;
                ctx2d.fillText(itemdata[items[menuSelectChildNum][0]][3].substr(0,25),360,60+32*10.3);
                ctx2d.fillText(itemdata[items[menuSelectChildNum][0]][3].substr(25,25),360,60+32*11);
            } else if(menuSelectNum==2){//////マップ

            }
        }
    }
    if (checkSkillConflict.length && !eventMessageWindow){
        eventMessageWindow=1;
        eventMessageWindowMsg="@" + checkSkillConflict.pop();
    }
    if(eventMessageWindow){
        if (eventMessageWindowMsg.substr(0,1)=="/"){
            if (upkey && !menuSelectFlg) menuSelectFlg=1,eventMessageSelectNum=Math.max(0,eventMessageSelectNum-1);
            if (downkey && !menuSelectFlg) menuSelectFlg=1,eventMessageSelectNum=Math.min(mypic.length-1,eventMessageSelectNum+1);
            if (zkey && !menuSelectFlg) { //使う処理はここに書く
                let notConsume=0;
                if (items[menuSelectChildNum][0] >= 0 && items[menuSelectChildNum][0] <= 5){
                    if (mypicstock[mypic[eventMessageSelectNum]][2]==0 || mypicstock[mypic[eventMessageSelectNum]][2]==mypicstock[mypic[eventMessageSelectNum]][3]){
                        popupMsg.push(["このマイピクには使えない！",120,0,0,-1]);
                        notConsume=1;
                    }
                } else if(items[menuSelectChildNum][0] == 9 || items[menuSelectChildNum][0] ==8){
                    if (mypicstock[mypic[eventMessageSelectNum]][4]==mypicstock[mypic[eventMessageSelectNum]][5]){
                        popupMsg.push(["このマイピクには使えない！",120,0,0,-1]);
                        notConsume=1;
                    }
                }
                if (items[menuSelectChildNum][0] == 0 && !notConsume){
                    changeHPMP(0,mypicstock[mypic[eventMessageSelectNum]][3]*0.3,0,eventMessageSelectNum,0);
                } else if(items[menuSelectChildNum][0] == 1 && !notConsume){
                    changeHPMP(0,mypicstock[mypic[eventMessageSelectNum]][3]*0.6,0,eventMessageSelectNum,0);
                } else if (items[menuSelectChildNum][0] == 2 && !notConsume){
                    changeHPMP(0,mypicstock[mypic[eventMessageSelectNum]][3]*1,0,eventMessageSelectNum,0);
                } else if(items[menuSelectChildNum][0] == 3 && !notConsume){
                    changeHPMP(0,50,0,eventMessageSelectNum,0);
                } else if (items[menuSelectChildNum][0] == 4 && !notConsume){
                    changeHPMP(0,100,0,eventMessageSelectNum,0);
                } else if(items[menuSelectChildNum][0] ==5 && !notConsume){
                    changeHPMP(0,150,0,eventMessageSelectNum,0);
                } else if(items[menuSelectChildNum][0] ==6){
                    if (mypicstock[mypic[eventMessageSelectNum]][2]!=0){
                        popupMsg.push(["このマイピクには使えない！",120,0,0,-1]);
                        notConsume=1;
                    } else{
                        changeHPMP(0,150,0,eventMessageSelectNum,0);
                    }
                } else if(items[menuSelectChildNum][0] ==7){
                    if (mypicstock[mypic[eventMessageSelectNum]][2]!=0){
                        popupMsg.push(["このマイピクには使えない！",120,0,0,-1]);
                        notConsume=1;
                    } else{
                        changeHPMP(0,150,0,eventMessageSelectNum,0);
                    }
                    changeHPMP(0,150,0,eventMessageSelectNum,0);
                } else if (items[menuSelectChildNum][0] == 8){
                    changeHPMP(1,30,0,eventMessageSelectNum,0);
                } else if(items[menuSelectChildNum][0] == 9){
                    changeHPMP(1,60,0,eventMessageSelectNum,0);
                } else if(items[menuSelectChildNum][0] == 10){ //DP最大値1増やす
                    mypicstock[mypic[eventMessageSelectNum]][5]=Math.min(999,mypicstock[mypic[eventMessageSelectNum]][5]+1);
                } else if(items[menuSelectChildNum][0] == 16){//経験値増やす系
                    changeEXP(100,eventMessageSelectNum);
                } else if (items[menuSelectChildNum][0] == 17){
                    changeEXP(500,eventMessageSelectNum);
                } else if(items[menuSelectChildNum][0] ==18){
                    changeEXP(1000,eventMessageSelectNum);
                }
                if(!notConsume){
                    consumeItem(menuSelectChildNum);
                    menuSelectFlg=1;
                    eventMessageWindowMsg=itemdata[menuSelectChildNum][0]+"を"+mypicstock[mypic[eventMessageSelectNum]][0]+"につかった！";    
                }
            }
            if (xkey && !menuSelectFlg){
                menuSelectFlg=1;
                eventMessageWindow++;
            }
            ctx2d.fillStyle="rgba(0,0,0," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
            ctx2d.fillRect((width-400)/2,height/2-100,400,200);
            ctx2d.font="16pt " + mainfontName;
            ctx2d.fillStyle="rgba(255,255,255," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
            ctx2d.fillText(eventMessageWindowMsg.substr(1),(width-350)/2,height/2-65);    
            ctx2d.font="12pt " + mainfontName;
            for(var i = 0;i < mypic.length;i++){
                if(eventMessageSelectNum==i){
                    ctx2d.fillStyle="rgba(255,255,255," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)*(Math.sin(globalTime/6)*0.3+0.7)+")";
                } else{
                    ctx2d.fillStyle="rgba(105,105,105," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                }
                ctx2d.fillText(mypicstock[mypic[i]][0],(width-350)/2+15,height/2-65+30+i*25);
                ctx2d.fillText("HP: "+ mypicstock[mypic[i]][2] + "/" + mypicstock[mypic[i]][3],(width-350)/2+125,height/2-65+30+i*25);
                ctx2d.fillText("MP: "+ mypicstock[mypic[i]][4] + "/" + mypicstock[mypic[i]][5],(width-350)/2+255,height/2-65+30+i*25);
            }
        } else if(eventMessageWindowMsg.substr(0,1) == "@"){//技を忘れさせる場合
            console.log(mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][14]);
            if (mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][14].length) {
                if (upkey && !menuSelectFlg) menuSelectFlg=1,eventMessageSelectNum=Math.max(0,eventMessageSelectNum-1);
                if (downkey && !menuSelectFlg) menuSelectFlg=1,eventMessageSelectNum=Math.min(4,eventMessageSelectNum+1);
                ctx2d.fillStyle="rgba(0,0,0," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                ctx2d.fillRect((width-400)/2,height/2-100,405,225);
                ctx2d.font="14pt " + mainfontName;
                ctx2d.fillStyle="rgba(255,255,255," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                let selectSkillText=mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][0] + " は "+skillData[mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][14][0]][0]+" を覚えようとしている！　" + "どの技を忘れさせる？";
                    if (selectSkillText.length) ctx2d.fillText(selectSkillText.substr(0,21),(width-350)/2-5,height/2-60);
                    if (selectSkillText.length>20) ctx2d.fillText(selectSkillText.substr(21,21),(width-350)/2-5,height/2-37);
                ctx2d.font="12pt " + mainfontName;
                for(var i = 0;i < 5;i++){
                    if(eventMessageSelectNum==i){
                        ctx2d.fillStyle="rgba(255,255,255," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)*(Math.sin(globalTime/6)*0.3+0.7)+")";
                    } else{
                        ctx2d.fillStyle="rgba(105,105,105," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                    }
                    if (i != 4){
                        ctx2d.fillText(skillData[mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][8][i]][0],(width-350)/2+15,height/2-65+60+i*25);
                        ctx2d.fillText("威力:" + skillData[mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][8][i]][1],(width-350)/2+165,height/2-65+60+i*25);
                        ctx2d.fillText("MP:" + skillData[mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][8][i]][4],(width-350)/2+235,height/2-65+60+i*25);
                        ctx2d.fillText("命中:" + skillData[mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][8][i]][2],(width-350)/2+295,height/2-65+60+i*25);
                        if (i == eventMessageSelectNum){
                            ctx2d.fillStyle="rgba("+typeDataCol[skillData[mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][8][i]][3]]+"," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)*(Math.sin(globalTime/6)*0.3+0.7)+")";
                        } else{
                            ctx2d.fillStyle="rgba("+typeDataCol[skillData[mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][8][i]][3]]+"," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                        }
                        ctx2d.fillText(typeDataText[skillData[mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][8][i]][3]],(width-350)/2+145,height/2-65+60+i*25);
                    } else if (mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][14].length){
                        ctx2d.fillText(skillData[mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][14][0]][0],(width-350)/2+15,height/2-65+60+i*25);
                        ctx2d.fillText("威力:" + skillData[mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][14][0]][1],(width-350)/2+165,height/2-65+60+i*25);
                        ctx2d.fillText("MP:" + skillData[mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][14][0]][4],(width-350)/2+235,height/2-65+60+i*25);
                        ctx2d.fillText("命中:" + skillData[mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][14][0]][2],(width-350)/2+295,height/2-65+60+i*25);
                        ctx2d.fillStyle="rgba(255,180,180," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)*(!(i==eventMessageSelectNum)+(i==eventMessageSelectNum)*(Math.sin(globalTime/6)*0.3+0.7))+")";
                        ctx2d.fillText("!",(width-350)/2,height/2-65+60+i*25);
                        if (i == eventMessageSelectNum){
                            ctx2d.fillStyle="rgba("+typeDataCol[skillData[mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][14][0]][3]]+"," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)*(Math.sin(globalTime/6)*0.3+0.7)+")";
                        } else{
                            ctx2d.fillStyle="rgba("+typeDataCol[skillData[mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][14][0]][3]]+"," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                        }
                        ctx2d.fillText(typeDataText[skillData[mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][14][0]][3]],(width-350)/2+145,height/2-65+60+i*25);
                    }
                }
                if (zkey && !menuSelectFlg) { //使う処理はここに書く
                    if (!(eventMessageSelectNum==4)) { //新しい技を覚えるとき
                        popupMsg.push([mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][0] + "は"+skillData[mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][14][0]][0]+"を覚えた！",120,0,0,Number(eventMessageWindowMsg.substr(1,1))]);
                        popupMsg.push([mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][0] + "は"+skillData[mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][8][eventMessageSelectNum]][0]+"を忘れた",120,0,0,Number(eventMessageWindowMsg.substr(1,1))]);
                        mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][8][eventMessageSelectNum]=mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][14][0];
                        mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][14].splice(0,1);    
                    } else {//何も覚えない時
                        popupMsg.push([mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][0] + "は"+skillData[mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][14][0]][0]+"を忘れた",120,0,0,Number(eventMessageWindowMsg.substr(1,1))]);
                        mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][14].splice(0,1);
                    }
                }
            }
        }else{
            ctx2d.fillStyle="rgba(0,0,0," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
            ctx2d.font="16pt " + mainfontName;
            ctx2d.fillRect(width/2-(40+ctx2d.measureText(eventMessageWindowMsg).width)/2,height/2-50,(40+ctx2d.measureText(eventMessageWindowMsg).width),100);
            ctx2d.strokeStyle="rgba(255,255,255," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
            ctx2d.lineWidth=1;
            ctx2d.strokeRect(width/2-(40+ctx2d.measureText(eventMessageWindowMsg).width)/2,height/2-50,(40+ctx2d.measureText(eventMessageWindowMsg).width)-4,100-4);
            ctx2d.strokeRect(width/2-(40+ctx2d.measureText(eventMessageWindowMsg).width)/2+4,height/2-50+4,(40+ctx2d.measureText(eventMessageWindowMsg).width)-4,100-4);
            ctx2d.fillStyle="rgba(255,255,255," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
            ctx2d.fillText(eventMessageWindowMsg,(width-ctx2d.measureText(eventMessageWindowMsg).width)/2,height/2+5);    
        }
        if (eventMessageWindow-menuWindowAniSpeed) eventMessageWindow++;
        if (!(eventMessageWindow-menuWindowAniSpeed*2)) eventMessageWindow=0;
        if (!zkey && !xkey && !upkey && !downkey && !leftkey && !rightkey) menuSelectFlg=0;
        if ((zkey||xkey) && !(eventMessageWindow-menuWindowAniSpeed) && !menuSelectFlg) eventMessageWindow++,menuSelectFlg=1;
    }
    if (!upkey && !downkey && !zkey && !leftkey && !rightkey && !xkey && !zkey) menuSelectFlg=0;

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
}
