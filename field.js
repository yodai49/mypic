var walkanimation=0,walkdir=3; //歩くアニメーション,方向
const charasize=35; //キャラクターのサイズ
const pre_charasize=60; //プリレンダリング用のキャラクターのサイズ
const material_size=30;//マテリアルの描画サイズ
const fieldwidth=960;//フィールドの幅の最大値
const fieldheight=540;//フィールドの高さの最大値
var debugMode=0; //デバッグモード　1ならワープ位置を赤で表示
var walkspeed=3;//歩くスピード
var menuSelectNum=0,menuSelectFlg=0;
var menuSelectChildNum=0,menuWindowChildAni=0,itemsScroll=0;
var menuMypicDetailAni=0,menuSortMypicNum=-1;
var imgCnt=0,loadedimgCnt=0,warpAni=0;
var fieldReDrawFlg=0,warpFlg=0,nowWarpObj,eventflgs=[],itemflgs=[],materialflgs=[];
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
var eventMessageWindow=0,eventMessageWindowMsg="",eventMessageSelectNum=0,procreateMsg="",eventMessageWindowMsgStack=[],eventMessageWindowAni=0;
var encount_down=0,encount_down_cnt=0;
var nowShopData,eventShopSelectNum=0,showmoney=0,eventShopScrollNum=0,eventRecipeData=[];
var checkSkillConflict=[],encountEnemyNum=0,inMsgBattleFlg=0,searchablelg=0;
var creatingFieldFlg=0, itemRedrawFlg=1;
var nowMaterialData=[]; //[[[x,y,番号],[...]]]の形式 createFieldごとに変わる
var lastFieldVisit=[]; //最後にフィールドを訪れた時間を格納
var fieldimg=[],fieldbackimg=[];//フィールドのImageオブジェクトをを格納する
var itemMenuImg=[],itemKeyImg,battleBackImg=[],battleGround,msgWindowImg=[]; //Imageオブジェクト系
var fieldImgComplete=[-1],itemKindTxt=["道具","マテリアル","秘伝書"],itemSynsAni=0;
function checkImg(imgSrc){
    let checkImg=new Image();
    checkImg.src=imgSrc;
    checkImg.onerror=function(){
        return -1;
    }
}
for(var i = 0;i < itemdata.length;i++) {
    itemMenuImg[i]=new Image(); //アイテムデータを読み込み
    if(i<=50){
        itemMenuImg[i].src="./imgs/itemImgs/itemImg" + i + ".png";
    }else if(i <= 100 &&i >= 51){//レシピ
        itemMenuImg[i].src="./imgs/itemImgs/itemImgRecipe.png"; 
    } else if(i <= 195){//マテリアル
        itemMenuImg[i].src="./imgs/itemImgs/itemImg"+i+".png";
    }else{
        itemMenuImg[i].src="./imgs/itemImgs/itemImgSec.png";
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

const itemBagImg=new Image();
itemBagImg.src="./imgs/item.png";
itemKeyImg=new Image();
itemKeyImg.src="./imgs/itemImgs/itemImgKey.png";

function drawMypic(drawMypicNum,dx,dy,dw,dh,trans,mode,redMode){
    if (mypic.length<=drawMypicNum && mode==0) return 0;
    ctx2d.lineWidth=1;
    if (dw>50) ctx2d.lineWidth=2;
    if (dw>100) ctx2d.lineWidth=3;
    if (dw>150) ctx2d.lineWidth=4;
    if (mode==1){
        for(var i = 0;i < drawMypicTempObj.length;i++){
            ctx2d.strokeStyle="rgba(255,255,255,"+trans+")";
            if(redMode) ctx2d.strokeStyle="rgba(150,0,0,"+trans+")";
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
        let tempitemflg=0;
        for(let i = 0;i < items.length;i++){
            if(items[i][0] == 50) tempitemflg=1;
        }
        for(var i = 0;i < mypicstock[drawMypicNum][1].length;i++){
            ctx2d.strokeStyle="rgba(255,255,255,"+trans+")";
            if(redMode) ctx2d.strokeStyle="rgba(150,0,0,"+trans+")";
            if(tempitemflg) ctx2d.strokeStyle="rgba("+typeDataCol[mypicstock[drawMypicNum][15]]+","+trans+")";
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
    neweggData[4]*= (1-randomrate+randomrate*Math.random())*Math.min(1.6,(0.9+0.8*Math.pow(lineratio,1)));//攻撃力
    neweggData[5]*= (1-randomrate+randomrate*Math.random())*Math.min(1.6,(0.9+0.8*Math.pow((1-lineratio),1)));//防御力
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
function clickEveDraw(x,y){ //クリックイベント/
    if (debugMode==3) console.log(x,y);
    if (mode==1 && eventWindowKind==2 && eventWindowAni && eventProcreateStep==1){ //マイピクドロー中のみ反応
        if (inDrawField && drawMypicTempObj.length <15){ //ドローフィールドの中なら
            if (!drawMypicStatus){
                drawMypicStatus=1;
                drawMypicTempPos[0] = x;
                drawMypicTempPos[1]  = y;
                inDrawField=0;
                crosskeySE.play();
            } else {
                if (!procdrawMypicMode){
                    drawMypicTempObj.push([0,(drawMypicTempPos[0]-(width/2-135))/270*100,(drawMypicTempPos[1]-(height/2-110))/270*100,drawFieldX,drawFieldY]);
                } else{
                    drawMypicTempObj.push([1,(drawMypicTempPos[0]-(width/2-135))/270*100,(drawMypicTempPos[1]-(height/2-110))/270*100,drawMypicRadius/270*100]);
                }
                drawMypicStatus=0;
                ckeySE.play();
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
                crosskeySE.play();
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

function setMaterials(){
    //マテリアルの処理　ここから
    if(globalTime-lastFieldVisit[myposworld] > 6*60*30 || lastFieldVisit[myposworld]==-1||lastFieldVisit[myposworld]<10){ //マテリアルの再配置条件　6分以上経過or初訪問
        lastFieldVisit[myposworld]=globalTime;
        nowMaterialData[myposworld]=[];
        for(var i = 0;i < fieldMaterialDataSet[fieldMaterial[myposworld]].length;i++){
            for(var j = 0;j < 5;j++){ //最大5こ配置
                if(Math.random() < fieldMaterialDataSet[fieldMaterial[myposworld]][i][1]/5){//マテリアリ配置条件成立なら
                    let lCounter=0;
                    while (true){
                        lCounter++;
                        if(lCounter>10000) break;
                        let tempColision=0;
                        materialX=Math.random()*width;
                        materialY=Math.random()*height;
                        for(var k = 0; k < fieldwarpobj[myposworld].length;k++){
                            if (fieldwarpobj[myposworld][k][0] + fieldwarpobj[myposworld][k][2] > materialX && fieldwarpobj[myposworld][k][0] < materialX+material_size){
                                if (fieldwarpobj[myposworld][k][1] + fieldwarpobj[myposworld][k][3] > materialY && fieldwarpobj[myposworld][k][1] < materialY+material_size){
                                    tempColision=1;
                                }
                            }
                        }
                        for(var k = 0;k < nowMaterialData[myposworld].length;k++){ //他のアイテムとかぶらないようにする
                            if (nowMaterialData[myposworld][k][0] + material_size> materialX && nowMaterialData[myposworld][k][0] < materialX+material_size){
                                if (nowMaterialData[myposworld][k][1] + material_size > materialY && nowMaterialData[myposworld][k][1] < materialY+material_size){
                                    tempColision=1;
                                }
                            }
                        }
                        let checkimgdata=fieldcanvas.getContext("2d").getImageData(materialX,materialY,1,1);
                        if (checkimgdata.data[0] || checkimgdata.data[1]  || checkimgdata.data[2] || checkimgdata.data[3]) tempColision=1;
                        checkimgdata=fieldcanvas.getContext("2d").getImageData(materialX,materialY+material_size,1,1);
                        if (checkimgdata.data[0] || checkimgdata.data[1]  || checkimgdata.data[2] || checkimgdata.data[3]) tempColision=1;
                        checkimgdata=fieldcanvas.getContext("2d").getImageData(materialX+material_size,materialY,1,1);
                        if (checkimgdata.data[0] || checkimgdata.data[1]  || checkimgdata.data[2] || checkimgdata.data[3]) tempColision=1;
                        checkimgdata=fieldcanvas.getContext("2d").getImageData(materialX+material_size,materialY+material_size,1,1);
                        if (checkimgdata.data[0] || checkimgdata.data[1]  || checkimgdata.data[2] || checkimgdata.data[3]) tempColision=1;
                        checkimgdata=fieldcanvas.getContext("2d").getImageData(materialX+3,materialY+3,1,1);
                        if (checkimgdata.data[0] || checkimgdata.data[1]  || checkimgdata.data[2] || checkimgdata.data[3]) tempColision=1;
                        checkimgdata=fieldcanvas.getContext("2d").getImageData(materialX+1,materialY+material_size/2,1,1);
                        if (checkimgdata.data[0] || checkimgdata.data[1]  || checkimgdata.data[2] || checkimgdata.data[3]) tempColision=1;
                        checkimgdata=fieldcanvas.getContext("2d").getImageData(materialX+1+material_size/2,materialY+1,1,1);
                        if (checkimgdata.data[0] || checkimgdata.data[1]  || checkimgdata.data[2] || checkimgdata.data[3]) tempColision=1;
                        checkimgdata=fieldcanvas.getContext("2d").getImageData(materialX+1+material_size/2,materialY+material_size/2,1,1);
                        if (checkimgdata.data[0] || checkimgdata.data[1]  || checkimgdata.data[2] || checkimgdata.data[3]) tempColision=1;
                        if(!tempColision) break; //ここに当たり判定条件を追加する
                    }
                    nowMaterialData[myposworld].push([materialX,materialY,fieldMaterialDataSet[fieldMaterial[myposworld]][i][0]]);
                }
            }
        }
    }
    //マテリアルの描画
    for(let i = 0;i < nowMaterialData[myposworld].length;i++){
        field2d.drawImage(itemMenuImg[nowMaterialData[myposworld][i][2]],nowMaterialData[myposworld][i][0],nowMaterialData[myposworld][i][1],material_size,material_size);
    }
}
function encount_check(){//敵との遭遇率encount=6*((200−運)/200)
    if (mypic.length==0 || (debugMode && debugMode!=5) || warpAni || eventWindowAni) return 0;
    var encountRate = (6*((200 - mypicstock[mypic[0]][9],0,100,100),0,100/200));
    var tempEncRandom=((10+encount_down*3000)*Math.random());
    if (encountRate>=tempEncRandom && fieldenemyDataSet[fieldenemy[myposworld]].length!=0 || debugMode==5) {
        encount=true;
        console.log(battleAnimationCount);
        let oddsSum=0,tmpodds=0,encountDice=0;
        encountEnemyNum=0;
        for(let i = 0;i < fieldenemyDataSet[fieldenemy[myposworld]].length;i++){
            oddsSum+=fieldenemyDataSet[fieldenemy[myposworld]][i][1];
        }
        encountDice=oddsSum*Math.random();
        for(let i = 0; i<fieldenemyDataSet[fieldenemy[myposworld]].length;i++){
            tmpodds+=fieldenemyDataSet[fieldenemy[myposworld]][i][1];
            if (tmpodds>=encountDice) {
                encountEnemyNum=fieldenemyDataSet[fieldenemy[myposworld]][i][0];
                break;
            }
        }
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
    if(battleAnimationFlg) return 1;
    if(creatingFieldFlg) return 1;
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
    searchableflg=0;
    for(let i = 0;i < eventobj[myposworld].length;i++){
        eventflgs[i]=0;
        if (eventobj[myposworld][i][0] < myposx+charasize && eventobj[myposworld][i][0] + eventobj[myposworld][i][2] > myposx){
            if (eventobj[myposworld][i][1] < myposy+charasize && eventobj[myposworld][i][1] + eventobj[myposworld][i][3] > myposy){
                eventflgs[i]=1;
                searchableflg=1;
            }
        }    
    }

    let tmpdirfix=[0,0,0,0];
    tmpdirfix[dir]=5;

    for(let i = 0;i  < eventobj[myposworld].length;i++){
        if (eventobj[myposworld][i][4] == 4){
            eventflgs[i]=0;
            if (eventobj[myposworld][i][0] < myposx+charasize+tmpdirfix[1]-tmpdirfix[0] && eventobj[myposworld][i][0] + eventobj[myposworld][i][2] > myposx+tmpdirfix[1]-tmpdirfix[0]){
                if (eventobj[myposworld][i][1] < myposy+charasize+tmpdirfix[3]-tmpdirfix[2] && eventobj[myposworld][i][1] + eventobj[myposworld][i][3] > myposy+tmpdirfix[3]-tmpdirfix[2]){
                    let tempitemflg=0;
                    for(let j = 0;j < items.length;j++){
                        if(items[j][0] == eventobj[myposworld][i][5]) tempitemflg=1;
                    }
                    if (!tempitemflg){
                        eventflgs[i]=1;
                        if(!popupMsg.length) popupMsg.push(["この場所へ行けないようだ！　またあとで来てみよう",120,0,0,-1]);
                        return 1;    
                    }
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
    for(let i = 0;i < nowMaterialData[myposworld].length;i++){
        materialflgs[i]=0;
        if (nowMaterialData[myposworld][i][0] < myposx+charasize && nowMaterialData[myposworld][i][0] + material_size > myposx){
            if (nowMaterialData[myposworld][i][1] < myposy+charasize && nowMaterialData[myposworld][i][1] + material_size > myposy){
                materialflgs[i]=1;
            }
        }
    }
    var tempColision = 0;
    for(let j = 0;j < 10;j++){
        tempColision = 1;
        var checkimgdata=fieldcanvas.getContext("2d").getImageData(myposx+checkConflictPosx,myposy+checkConflictPosy,1,1);
        for(let i = 0;i < walkCol.length;i++){
            if (checkimgdata.data[0] == walkCol[i][0] && checkimgdata.data[1] == walkCol[i][1] && checkimgdata.data[2] == walkCol[i][2]) tempColision=0;
            if (!checkimgdata.data[0] && !checkimgdata.data[1]  && !checkimgdata.data[2] && !checkimgdata.data[3]) tempColision=0;
        }
        if (dir==2 || dir == 3) checkConflictPosx+=(charasize/10);
        if (dir==0 || dir == 1) checkConflictPosy+=(charasize/10);
        if (tempColision) return 1;
    }
    return 0;
}
function createField(){
    creatingFieldFlg=1;
    fieldcanvas=document.createElement("canvas");
    fieldcanvas.width=fieldwidth, fieldcanvas.height=fieldheight;
    var fieldcanvasctx=fieldcanvas.getContext("2d"); //フィールドは横並びに描画　幅はfieldwidth
    fieldcanvasctx.drawImage(fieldimg[myposworld],fielddata[myposworld][0],fielddata[myposworld][1]);
    eventflgs=[];
    fieldbackcanvas=document.createElement("canvas");
    fieldbackcanvas.width=fieldwidth, fieldbackcanvas.height=fieldheight;
    fieldbackcanvas.getContext("2d").drawImage(fieldbackimg[fieldbackdata[myposworld]],0,0); creatingFieldFlg=0;
}
function initiate_field(){
    /*　フィールド・キャラクターの初期化処理 　呼び出しは一度だけ　////////////////////////
    @param なし
    @return なし
    */
   //////DEBUG MODE
   if(debugMode) walkspeed=12;
   //////
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
    if (trigEventnum==1) { //マイピク整理のイベント
        zkeySE.play(); 
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
        zkeySE.play(); 
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
        zkeySE.play(); 
        eventWindowKind=3;
        eventWindowAni++;
        eventShopSelectNum=0;
        showmoney=money;
        nowShopData=shopData[trigEventObj[5]]
    } else if(trigEventnum==5 && !menuSelectFlg){ //ボス戦

    } else if(trigEventnum==6 && !menuSelectFlg){
        let tempitemflg=0;
        for(let i = 0; i < items.length;i++){
            if(items[i][0] == trigEventObj[6]) tempitemflg=1;
        }
        if(trigEventObj[7]!=undefined){
            if(nextEventNum!=trigEventObj[7]) {
                return 0;
            }
        }
        if(!tempitemflg){
            eventMessageWindow=1;
            eventMessageWindowMsgStack=[];
            eventMessageWindowMsg="+"+eventMsgText[trigEventObj[5]][0];
            for(var i = 0;i < (eventMsgText[trigEventObj[5]].length-1);i++){
                eventMessageWindowMsgStack[i]="+"+eventMsgText[trigEventObj[5]][i+1];
            }
            eventMessageWindowAni=1;
        }
        if(trigEventObj[7]!=undefined) nextEventNum=trigEventObj[8];
    } else if(trigEventnum==7 && !menuSelectFlg){ //合成
        zkeySE.play();  
        eventWindowKind=7;
        eventWindowAni++;
        eventShopSelectNum=0;
        eventShopScrollNum=0;
        eventRecipeData=[];
        for(var i = 0;i < items.length;i++){ //レシピデータの作成
            if(items[i][0] >= 51 && items[i][0] <= 100){
                eventRecipeData.push(items[i][0]);
            }
        }
    }
    menuSelectFlg=1;
}
function fieldMain() {
    var menuWindowTrans,menuWindowTransChild;
    const menuWindowAniSpeed=15;
    const menuWindowTxt =["マイピク","もちもの","ずかん","セーブ","タイトル"];
    /*
    @param なし
    @return なし
    */
   if(debugMode==5) encount_check();
    if (fieldReDrawFlg) {
        fieldback2d.clearRect(0,0,width,height),fieldback2d.drawImage(fieldbackcanvas,0,0,width,height,0,0,width,height);
        field2d.clearRect(0,0,width,height),field2d.drawImage(fieldcanvas,0,0,width,height,0,0,width,height),fieldReDrawFlg=0, checkConflict(0);//背景の描画
        //アイテムの描画
        for(let i = 0;i < fieldItemStatus[myposworld].length;i++){
            if(fieldItemStatus[myposworld][i][5]){
                field2d.drawImage(itemBagImg,fieldItemStatus[myposworld][i][0],fieldItemStatus[myposworld][i][1],fieldItemStatus[myposworld][i][2],fieldItemStatus[myposworld][i][3])
            }
        }
        //マテリアルの描画
        for(let i = 0;i < nowMaterialData[myposworld].length;i++){
            field2d.drawImage(itemMenuImg[nowMaterialData[myposworld][i][2]],nowMaterialData[myposworld][i][0],nowMaterialData[myposworld][i][1],material_size,material_size);
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

    if(isFromFirst==1){ ////最初に強制的に出すメッセージ
        trigEvent(6,[339,286,30,30,6,0,-1]); 
        isFromFirst=2;
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
                crosskeySE.play();
                if (!stockMypicChgWindow && stockMypicSelectNum>1){
                    stockMypicSelectNum-=2,menuSelectFlg=1;
                    if (spacekey) menuSelectFlg=0;
                    if (stockMypicSelectNum<stockMypicScroll) stockMypicScroll-=2;    
                } else if(stockMypicChgWindow){
                    if (stockMypicChgNum) stockMypicChgNum--,menuSelectFlg=1;
                }
            }
            if (downkey && !menuSelectFlg && !eventMessageWindow) {
                crosskeySE.play();
                if (!stockMypicChgWindow&& stockMypicSelectNum<(mypicstock.length-2)){
                    stockMypicSelectNum+=2,menuSelectFlg=1;
                    if (spacekey) menuSelectFlg=0;
                    if (stockMypicSelectNum>stockMypicScroll+5) stockMypicScroll+=2;
                } else if(stockMypicChgWindow){
                    if (stockMypicChgNum!=5) stockMypicChgNum++,menuSelectFlg=1;
                }
            }
            if (leftkey&& !eventMessageWindow && (stockMypicSelectNum%2) && !menuSelectFlg && !stockMypicChgWindow) stockMypicSelectNum--,menuSelectFlg=1, crosskeySE.play(); 
            if (rightkey&& !eventMessageWindow &&!(stockMypicSelectNum%2) && !menuSelectFlg && !stockMypicChgWindow && mypicstock.length!=1) stockMypicSelectNum++,menuSelectFlg=1, crosskeySE.play(); 
            if (zkey && !menuSelectFlg){
                if (!mypic.includes(stockMypicSelectNum) && !stockMypicChgWindow){
                    zkeySE.play(); 
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
                if (stockMypicChgWindow==menuWindowAniSpeed) stockMypicChgWindow++,menuSelectFlg=1,xkeySE.play();
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
                xkeySE.play();
            }    
            if (stockMypicChgWindow && (stockMypicChgWindow-menuWindowAniSpeed)) stockMypicChgWindow++;
            if (stockMypicChgWindow==2*menuWindowAniSpeed) stockMypicChgWindow=0;
        } else if(eventWindowKind==2){ //孵化イベント
            if (zkey && !menuSelectFlg){
                zkeySE.play(); 
                if (eventProcreateStep == 0){
                    eventProcreateStep++,menuSelectFlg=1,eventEggAni=0;
                    selectEggItemNum=tempEggList[eventEggSelectNum][2];
                    selectEggKind=itemdata[items[selectEggItemNum][0]][4];
                } else if(eventProcreateStep==1 && drawMypicTempObj.length){
                    eventProcreateStep++,menuSelectFlg=1,eventEggAni=0;
                } else if(eventProcreateStep==2 && drawMypicTempName.length){ //生まれる時の処理
                    procreateProcess();
                    consumeItem(selectEggItemNum);
                    eventSE.play();
                    eventProcreateStep++,menuSelectFlg=1,eventEggAni=0;
                    if (mypic.length!=6) {
                        procreateMsg="なかまにくわわった！";
                        mypic.push(mypicstock.length-1);
                    } else{ 
                        procreateMsg="おうちにおくられた"
                    }
                } else if(eventProcreateStep==3){
                    eventWindowAni++,menuSelectFlg=1;
                    if (isFromFirst==2) isFromFirst=0, menuSelectFlg=0,trigEvent(6,[339,286,30,30,6,4,-1]); 
                }
            } 
            if(xkey && !menuSelectFlg){
                if (!eventProcreateStep){
                    eventWindowAni++;
                    xkeySE.play();
                } else if(eventProcreateStep!=3){
                    eventProcreateStep--;
                    eventEggAni=0;
                    xkeySE.play();
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
                    crosskeySE.play();
                    eventEggSelectNum--,menuSelectFlg=1;
                    if (eventEggSelectNum<eventEggScroll) eventEggScroll=eventEggSelectNum;
                } 
                if (downkey && !menuSelectFlg && (eventEggSelectNum-tempEggList.length+1)){
                    crosskeySE.play(); 
                    eventEggSelectNum++,menuSelectFlg=1;
                    if (eventEggSelectNum-eventEggScroll>=10) eventEggScroll++;
                } 
                if(spacekey && !zkey && !xkey && !vkey) menuSelectFlg=0; 
                ctx2d.font="14pt " + mainfontName;
                ctx2d.fillStyle="rgba(105,105,105,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                for(var i = 0;i < Math.min(10,tempEggList.length);i++){
                    if (i != eventEggSelectNum-eventEggScroll){
                        ctx2d.fillText(itemdata[tempEggList[i+eventEggScroll][0]][0],width/2-230+30,height/2-80+23*i);  
                        ctx2d.fillText("× "+tempEggList[i+eventEggScroll][1],width/2+180,height/2-80+23*i); 
                        ctx2d.drawImage(itemMenuImg[tempEggList[i+eventEggScroll][0]],width/2-230+2,height/2-95+23*i,17,17);
                    }
                }
                ctx2d.fillStyle="rgba(255,255,255,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*(Math.sin(globalTime/6)*0.3+0.7)+")";
                ctx2d.fillText(itemdata[tempEggList[eventEggSelectNum][0]][0],width/2-230+30,height/2-80+23*(eventEggSelectNum-eventEggScroll));  
                ctx2d.drawImage(itemMenuImg[tempEggList[eventEggSelectNum][0]],width/2-230+2,height/2-95+23*(eventEggSelectNum-eventEggScroll),17,17);
                ctx2d.fillText("× "+tempEggList[eventEggSelectNum][1],width/2+180,height/2-80+23*(eventEggSelectNum-eventEggScroll)); 
                ctx2d.font="12pt " + mainfontName;
                ctx2d.fillStyle="rgba(255,255,255,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                ctx2d.fillText(itemdata[tempEggList[eventEggSelectNum][0]][3].substr(0,28),width/2-230,height/2-80+23*10.5);
                ctx2d.fillText(itemdata[tempEggList[eventEggSelectNum][0]][3].substr(28,28),width/2-230,height/2-80+23*11.2);
            } else if(eventProcreateStep==1){ //お絵かき
                ctx2d.fillStyle="rgba(255,255,255,"+(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*Math.min(1,eventEggAni/20)+")";
                ctx2d.font="16pt " + mainfontName;
                ctx2d.fillText("マイピクをマウスでドローしよう！　Zで決定".substr(0,eventEggAni/2),width/2-230,height/2-120);
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
                ctx2d.fillStyle="rgba(50,50,50,"+0.8*(1-Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*0.8*Math.min(1,eventEggAni/20)+")";
                ctx2d.fillRect(width/2-135,height/2-110,270,270);
                //一時的なマイピクの描画
                ctx2d.lineWidth=5;
                if (drawMypicStatus && inDrawField){ //始点を描いていたら
                    if (!procdrawMypicMode){ //線
                        ctx2d.beginPath();
                        ctx2d.strokeStyle="rgba(255,255,255,"+(Math.sin(globalTime/5)*0.3+0.7)+")";
                        ctx2d.moveTo(drawMypicTempPos[0],drawMypicTempPos[1]);
                        ctx2d.lineTo(inFieldX,inFieldY);
                        ctx2d.stroke();
                    } else { //円
                        ctx2d.beginPath();
                        ctx2d.strokeStyle="rgba(255,255,255,"+(Math.sin(globalTime/5)*0.3+0.7)+")";
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
                ctx2d.font="12pt " + mainfontName;
                ctx2d.fillText("マウスで文字をクリック。Zで決定。".substr(0,eventEggAni/2),width/2-230,height/2-100);
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
            ctx2d.font="8pt " + mainfontName;
            if(itemdata[nowShopData[eventShopSelectNum][0]][3].length>30){
                ctx2d.fillText(itemdata[nowShopData[eventShopSelectNum][0]][3].substr(0,30)+"...", width/2-200+35,height/2-150+55+10*20);
            } else{
                ctx2d.fillText(itemdata[nowShopData[eventShopSelectNum][0]][3], width/2-200+35,height/2-150+55+10*20);
            }
            ctx2d.font="13pt " + mainfontName;
            ctx2d.fillStyle="rgba(105,105,105," +(1- Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed) + ")";
            for(var i = 0;i < Math.min(10,nowShopData.length);i++){
                if (i!=eventShopSelectNum){
                    ctx2d.fillText(itemdata[nowShopData[i][0]][0], width/2-200+35,height/2-150+56+i*20);
                    ctx2d.fillText(nowShopData[i][1], width/2+200-105-ctx2d.measureText(nowShopData[i][1]).width,height/2-150+56+i*20);
                    ctx2d.fillText(currencyName, width/2+200-85,height/2-150+56+i*20);
                }
                ctx2d.drawImage(itemMenuImg[nowShopData[i][0]],width/2-200+15,height/2-161+52+i*20,16,16);
            }
            ctx2d.fillStyle="rgba(255,255,255," +(1- Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*(Math.sin(globalTime/6)*0.3+0.7) + ")";
            ctx2d.fillText(itemdata[nowShopData[eventShopSelectNum][0]][0], width/2-200+35,height/2-150+56+eventShopSelectNum*20);
            ctx2d.fillText(nowShopData[eventShopSelectNum][1], width/2+200-105-ctx2d.measureText(nowShopData[eventShopSelectNum][1]).width,height/2-150+56+eventShopSelectNum*20);
            ctx2d.fillText(currencyName, width/2+200-85,height/2-150+56+eventShopSelectNum*20);
            ctx2d.fillStyle="rgba(255,255,255," +(1- Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed) + ")";
            ctx2d.fillRect(width/2-200+20,height/2-150+260,360,1);
            ctx2d.fillText("おかね　" + showmoney  + " "+currencyName, width/2+180-ctx2d.measureText("おかね　" + money  + " "+currencyName).width,height/2-150+285);
            if(xkey && !(eventWindowAni-menuWindowAniSpeed)&& !menuSelectFlg && !eventMessageWindow) eventWindowAni++,menuSelectFlg=1,xkeySE.play();
            if(upkey && eventShopSelectNum && !(eventWindowAni-menuWindowAniSpeed) && !menuSelectFlg) eventShopSelectNum--,menuSelectFlg=1, crosskeySE.play();
            if(downkey && eventShopSelectNum != nowShopData.length-1&& !(eventWindowAni-menuWindowAniSpeed)&& !menuSelectFlg) eventShopSelectNum++,menuSelectFlg=1, crosskeySE.play();
            if(zkey && !(eventWindowAni-menuWindowAniSpeed)&& !menuSelectFlg && !eventMessageWindow) {
                zkeySE.play();
                if(nowShopData[eventShopSelectNum][0]>=51&&nowShopData[eventShopSelectNum][0]<=100&&countItem(nowShopData[eventShopSelectNum][0])){
                    eventMessageWindow=1;
                    eventMessageWindowMsg="このレシピは既に持っている！";
                    menuSelectFlg=1;    
                } else if (money >= nowShopData[eventShopSelectNum][1]){
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
        } else if(eventWindowKind==7){ //合成
            ctx2d.fillStyle="rgba(0,0,0," +(1- Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)*0.8 + ")";
            ctx2d.fillRect(width/2-300,height/2-155,600,300);
            ctx2d.fillStyle="rgba(255,255,255," +(1- Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed) + ")";
            ctx2d.font="18pt " + mainfontName;
            ctx2d.fillText("ごうせい" , width/2-300+15,height/2-150+30);
            //レシピデータの表示
            ctx2d.font="13pt " + mainfontName;
            ctx2d.fillStyle="rgba(105,105,105," +(1- Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed) + ")";
            for(var i = 0;i < Math.min(10,eventRecipeData.length);i++){
                if (i!=eventShopSelectNum-eventShopScrollNum){
                    ctx2d.fillText(itemdata[eventRecipeData[i+eventShopScrollNum]][0], width/2-300+35,height/2-150+60+i*20);
                }
                ctx2d.drawImage(itemMenuImg[eventRecipeData[i+eventShopScrollNum]],width/2-300+13,height/2-150+46+i*20,18,18)
            }
            ctx2d.fillStyle="rgba(255,255,255," +(1- Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed) + ")";
            ctx2d.fillText(itemdata[eventRecipeData[eventShopSelectNum]][0], width/2-300+35,height/2-150+60+(eventShopSelectNum-eventShopScrollNum)*20);
            ctx2d.fillText("できるアイテム" , width/2+5,height/2-150+60);
            ctx2d.fillText("ひつようなマテリアル" , width/2+5,height/2-150+150);
            ctx2d.drawImage(itemMenuImg[itemdata[eventRecipeData[eventShopSelectNum]][5]],width/2,height/2-150+70,20,20);
            ctx2d.font="11pt " + mainfontName;
            ctx2d.fillText(itemdata[itemdata[eventRecipeData[eventShopSelectNum]][5]][0] ,width/2+25,height/2-150+85);
            ctx2d.font="8pt " + mainfontName;
            ctx2d.fillText(itemdata[itemdata[eventRecipeData[eventShopSelectNum]][5]][3].substr(0,25) ,width/2+15,height/2-150+108);
            ctx2d.fillText(itemdata[itemdata[eventRecipeData[eventShopSelectNum]][5]][3].substr(26,25) ,width/2+15,height/2-150+120);
            ctx2d.font="10pt " + mainfontName;
            ctx2d.fillText(itemdata[eventRecipeData[eventShopSelectNum]][3], width/2-300+35,height/2-150+60+10.5*20);
            ctx2d.fillRect(469.5,164,1,195);
            ctx2d.font="10pt " + mainfontName;
            for(var i = 0;i <itemdata[eventRecipeData[eventShopSelectNum]][6].length;i++){
                if(countItem(itemdata[eventRecipeData[eventShopSelectNum]][6][i][0])<itemdata[eventRecipeData[eventShopSelectNum]][6][i][1]){
                    ctx2d.fillStyle="rgba(105,105,105," +(1- Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed) + ")";
                } else{
                    ctx2d.fillStyle="rgba(255,255,255," +(1- Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed) + ")";
                }
                ctx2d.drawImage(itemMenuImg[itemdata[eventRecipeData[eventShopSelectNum]][6][i][0]],width/2+7,height/2-150+160+i*18,15,15)
                ctx2d.fillText(itemdata[itemdata[eventRecipeData[eventShopSelectNum]][6][i][0]][0] , width/2+25,height/2-150+170+i*18);
                ctx2d.fillText("×" , width/2+175,height/2-150+170+i*18);
                ctx2d.fillText(itemdata[eventRecipeData[eventShopSelectNum]][6][i][1] , width/2+185,height/2-150+170+i*18);
                ctx2d.fillText("( /" , width/2+220,height/2-150+170+i*18);
                ctx2d.fillText(countItem(itemdata[eventRecipeData[eventShopSelectNum]][6][i][0]) ,width/2+240,height/2-150+170+i*18);
                ctx2d.fillText(")" , width/2+275,height/2-150+170+i*18);
            }
            ctx2d.font="13pt " + mainfontName;
            if (isSyntheticable(eventShopSelectNum)){
                ctx2d.fillStyle="rgba(255,255,255," +(0.3*Math.sin(globalTime/8)+0.7*(1- Math.abs(eventWindowAni-menuWindowAniSpeed)/menuWindowAniSpeed)) + ")";
            } else{
                ctx2d.fillStyle="rgba(105,105,105,1)";
            }
            ctx2d.fillText("Zで合成！" , width/2+200,height/2+130);
            if(xkey && !(eventWindowAni-menuWindowAniSpeed)&& !menuSelectFlg && !eventMessageWindow) eventWindowAni++,menuSelectFlg=1,xkeySE.play();
            if(upkey && eventShopSelectNum && !(eventWindowAni-menuWindowAniSpeed) && !menuSelectFlg){
                eventShopSelectNum--,menuSelectFlg=1, crosskeySE.play();
                if(eventShopScrollNum>eventShopSelectNum)eventShopScrollNum=eventShopSelectNum;
            }
            if(downkey && eventShopSelectNum != eventRecipeData.length-1&& !(eventWindowAni-menuWindowAniSpeed)&& !menuSelectFlg){
                eventShopSelectNum++,menuSelectFlg=1, crosskeySE.play();
                if(eventShopSelectNum>=eventShopScrollNum+10)eventShopScrollNum=eventShopSelectNum-9;
            } 
            if(zkey && isSyntheticable(eventShopSelectNum)&&!menuSelectFlg&& !(eventWindowAni-menuWindowAniSpeed)&& !menuSelectFlg && !eventMessageWindow){//合成のときの処理
                menuSelectFlg=1;
                eventMessageWindowMsg="`"+itemdata[eventRecipeData[eventShopSelectNum]][5]+"`"+itemdata[itemdata[eventRecipeData[eventShopSelectNum]][5]][0]+"を合成した！";
                eventMessageWindowAni=1;
                eventMessageWindow=1;
                itemSynsAni=1;
                //popupMsg.push([itemdata[itemdata[eventRecipeData[eventShopSelectNum]][5]][0]+"を合成した！",120,0,0,"*"+itemdata[eventRecipeData[eventShopSelectNum]][5]]);
                getItem(itemdata[eventRecipeData[eventShopSelectNum]][5]);
                for(var i = 0;i <itemdata[eventRecipeData[eventShopSelectNum]][6].length;i++){
                    for(var j = 0;j < itemdata[eventRecipeData[eventShopSelectNum]][6][i][1];j++){
                        for(var k = 0;k < items.length;k++){
                            if(items[k][0] == itemdata[eventRecipeData[eventShopSelectNum]][6][i][0]) consumeItem(k);
                        }
                    }
                }
            } else if(zkey && !isSyntheticable(eventShopSelectNum)&&!menuSelectFlg&& !(eventWindowAni-menuWindowAniSpeed)&& !menuSelectFlg && !eventMessageWindow){
                popupMsg.push(["マテリアルが足りない！",120,0,0,-1]);
                menuSelectFlg=1;
            }
        }
        if (!upkey && !downkey && !zkey && !leftkey && !rightkey && !xkey && !zkey && !vkey) menuSelectFlg=0;
        if (eventWindowAni && (eventWindowAni-menuWindowAniSpeed)) eventWindowAni++;
        if (eventWindowAni == 2*menuWindowAniSpeed) eventWindowAni=0,happenedEvent=0; 
        if (spacekey) menuSelectFlg=0;
    } else if(!menuWindow&& !eventMessageWindow){ /////メニューウィンドウが表示されていない時
        if(ckey&& !isFromFirst) menuWindow++,menuSelectNum=0,menuWindowChildAni=0,ckeySE.play();
        if (leftkey) walkdir=0;
        if (rightkey) walkdir=1;
        if (upkey) walkdir=2;
        if (downkey) walkdir=3;
        if (leftkey && !checkConflict(0)) myposx-=walkspeed,walkeve();
        if (rightkey && !checkConflict(1)) myposx+=walkspeed,walkeve();
        if (upkey && !checkConflict(2)) myposy-=walkspeed,walkeve();
        if (downkey && !checkConflict(3)) myposy+=walkspeed,walkeve();
        if (zkey && !selectTitleFlg&& !eventMessageWindow && !battleAnimationFlg) { //アクションキー
            for(var i = 0; i < eventobj[myposworld].length;i++){
                if (eventflgs[i] && !happenedEvent) trigEvent(eventobj[myposworld][i][4],eventobj[myposworld][i]);
            }
            for(var i = 0;i < itemobj[myposworld].length;i++){
                if (itemflgs[i] && !menuSelectFlg && fieldItemStatus[myposworld][i][5]){
                    popupMsg.push([itemdata[fieldItemStatus[myposworld][i][4]][0]+"をゲットした！",120,0,0,"*"+fieldItemStatus[myposworld][i][4]]);
                    fieldItemStatus[myposworld][i][5]--;
                    getItem(fieldItemStatus[myposworld][i][4]);
                    eventSE.play();
                    fieldReDrawFlg=1;
                }
            }
            for(var i = 0;i < nowMaterialData[myposworld].length;i++){
                if (materialflgs[i] && !menuSelectFlg){
                    popupMsg.push([itemdata[nowMaterialData[myposworld][i][2]][0]+"をゲットした！",120,0,0,"*"+nowMaterialData[myposworld][i][2]]);
                    getItem(nowMaterialData[myposworld][i][2]);
                    nowMaterialData[myposworld].splice(i,1);
                    eventSE.play();
                    fieldReDrawFlg=1;
                    menuSelectFlg=1;
                }
            }
        }
        if (zkey && eventWindowAni && !menuSelectFlg) {
            if(eventMessageWindowMsg.substr(0,1)=="`"){
               if(itemSynsAni>=40)  eventWindowAni++, zkeySE.play(); 
            } else{
                eventWindowAni++, zkeySE.play(); 
            }
        }
        if (!zkey) selectTitleFlg=0;
    } else { /////メニューウィンドウが表示されている時
        if(xkey && !(menuWindow-menuWindowAniSpeed) && !menuWindowChildAni && !titleConfirmWindow && !menuSelectFlg && !eventMessageWindow) menuWindow++,xkeySE.play();
        if(xkey && !(menuWindow-menuWindowAniSpeed) && !menuWindowChildAni && titleConfirmWindow && !menuSelectFlg && !eventMessageWindow) titleConfirmWindow++,menuSelectFlg=1,xkeySE.play();
        if(zkey && menuWindow && !menuWindowChildAni && !titleConfirmWindow && !menuSelectFlg && !eventMessageWindow){
            zkeySE.play(); 
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
            zkeySE.play(); 
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
                    playFieldBGM(-1);
                    checkfirstLaunch();
                }
            }
        }  else if(zkey &&!menuSelectFlg&& !menuzflg&& menuWindow&&menuWindowChildAni && menuSelectNum==0 && !menuMypicDetailAni && !(menuWindowChildAni-menuWindowAniSpeed) && menuSortMypicNum==-1){ //マイピクの詳細画面を見る時
            menuMypicDetailAni++;
            menuSelectFlg=1;
            zkeySE.play(); 
        } else if(zkey &&!menuSelectFlg&& menuWindow&&menuWindowChildAni && menuSelectNum==0 && !menuMypicDetailAni && !(menuWindowChildAni-menuWindowAniSpeed) && menuSortMypicNum!=-1){ //マイピクの詳細画面を見る時
            //入れ替え処理
            if((menuSelectChildNum == 0 && mypicstock[mypic[menuSortMypicNum]][2]==0) || (menuSortMypicNum == 0 && mypicstock[mypic[menuSelectChildNum]][2]==0)){
                popupMsg.push(["このマイピクはひんしだ！",120,0,0,-1]);
                menuzflg=1;
                menuSelectFlg=1;
            } else{
                var menuTmpSort=mypic[menuSortMypicNum];
                mypic[menuSortMypicNum]=mypic[menuSelectChildNum];
                mypic[menuSelectChildNum]=menuTmpSort;
                menuSortMypicNum=-1;
                menuzflg=1;
                zkeySE.play(); 
            }
        }
        if (upkey &&!titleConfirmWindow&& !eventMessageWindow&& !menuSelectFlg && !menuWindowChildAni && !eventMessageWindow) menuSelectNum--,menuSelectFlg=1, crosskeySE.play();
        if (downkey &&!titleConfirmWindow&& !eventMessageWindow&& !menuSelectFlg && !menuWindowChildAni && !eventMessageWindow) menuSelectNum++,menuSelectFlg=1, crosskeySE.play();
        if (spacekey) menuSelectFlg=0;
        if (upkey && !menuSelectFlg && menuWindowChildAni&& !eventMessageWindow) {  //上キー
            if (menuSelectNum==0 && menuSelectChildNum>=2 && !menuMypicDetailAni){//マイピク
                crosskeySE.play(); 
                menuSelectChildNum-=2,menuSelectFlg=1;
            } else if (menuSelectNum==1 && menuSelectChildNum&& !menuMypicDetailAni){
                crosskeySE.play(); 
                menuSelectChildNum--,menuSelectFlg=1;
                if (menuSelectChildNum < itemsScroll && itemsScroll) itemsScroll--;
            }
        }
        if (downkey && !menuSelectFlg && menuWindowChildAni && !eventMessageWindow) {//下キー
            if (menuSelectNum==0 && menuSelectChildNum+2<mypic.length && !menuMypicDetailAni){//マイピク
                crosskeySE.play(); 
                menuSelectChildNum+=2,menuSelectFlg=1;
            } else if (menuSelectNum==1 && (menuSelectChildNum!=(items.length-1)) && !menuMypicDetailAni){
                crosskeySE.play(); 
                menuSelectChildNum++,menuSelectFlg=1;
                if (menuSelectChildNum>=10 && menuSelectChildNum-itemsScroll == 10) itemsScroll++;
            }
        }
        if (leftkey && !menuSelectFlg && menuWindowChildAni&& !eventMessageWindow) { //左キー
            if (menuSelectNum==0 && (menuSelectChildNum%2)&& !menuMypicDetailAni){//マイピク
                crosskeySE.play(); 
                menuSelectChildNum--,menuSelectFlg=1;
            } 
        }
        if (rightkey && !menuSelectFlg && menuWindowChildAni&& !eventMessageWindow) {//右キー
            if (menuSelectNum==0 && !(menuSelectChildNum%2) && mypic.length != 1 &&!(mypic.length == 3 && menuSelectChildNum==2)&&!(mypic.length == 5 && menuSelectChildNum==4)&& !menuMypicDetailAni){//マイピク
                crosskeySE.play(); 
                menuSelectChildNum++,menuSelectFlg=1;
            } 
        }
        if (zkey && menuSelectNum==1 && !menuSelectFlg && menuWindowChildAni && !eventMessageWindow){//アイテムの使用
            zkeySE.play(); 
            if (!itemdata[items[menuSelectChildNum][0]][1]){
                eventMessageWindow=1;
                eventMessageWindowMsg="ここではつかえない！";
            } else{
                if ((items[menuSelectChildNum][0] >=0 && items[menuSelectChildNum][0] <= 10)||(items[menuSelectChildNum][0] >= 16 && items[menuSelectChildNum][0] <= 18)|| items[menuSelectChildNum][0]>=200){
                    eventMessageWindow=1;
                    eventMessageWindowMsg="/だれにつかう？";
                } else if (items[menuSelectChildNum][0] == 19){
                    nextMode=1;
                    modeAnimation=1;
                    myposx=homposx,myposy=homposy,myposworld=homposworld;
                    playFieldBGM(myposworld);
                    eventMessageWindow=1;
                    eventMessageWindowMsg=itemdata[items[menuSelectChildNum][0]][0] + "をつかった！";
                    consumeItem(menuSelectChildNum);
                } else if(items[menuSelectChildNum][0] == 20){
                    encount_down_cnt=3000;
                    eventMessageWindow=1;
                    eventMessageWindowMsg=itemdata[items[menuSelectChildNum][0]][0] + "をつかった！";    
                    consumeItem(menuSelectChildNum);
                }
                eventMessageSelectNum=0;
                if (eventMessageWindowMsg=="/だれにつかう？" && mypic.length==0){
                    eventMessageWindowMsg="つかえるマイピクを持っていない！";
                }
            }
            menuSelectFlg=1;
            if (menuSelectChildNum>= items.length) menuSelectChildNum=items.length-1;
        }
        if (!upkey && !downkey && !leftkey && !rightkey && !zkey && !xkey && !vkey) menuSelectFlg=0;
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
    if(xkey && !(menuWindowChildAni-menuWindowAniSpeed) && menuWindowChildAni && !menuMypicDetailAni && !eventMessageWindow) menuWindowChildAni++,xkeySE.play();
    if(xkey && !(menuWindowChildAni-menuWindowAniSpeed) && menuWindowChildAni && !(menuMypicDetailAni-menuWindowAniSpeed) && !eventMessageWindow) menuMypicDetailAni++,xkeySE.play();
    if(vkey &&  !(menuWindowChildAni-menuWindowAniSpeed) && menuWindowChildAni && !menuMypicDetailAni) menuSortMypicNum=menuSelectChildNum;
    if(menuWindow){    //メニューの描画
        ctx2d.fillStyle="rgba(0,0,0," + menuWindowTrans*0.4+")";
        ctx2d.fillRect(0,0,width,height);
        ctx2d.fillStyle="rgba(0,0,0," + menuWindowTrans*0.7+")";
        ctx2d.fillRect(-300+menuWindowTrans*300,0,290,height*0.8);
        ctx2d.lineWidth=2;
        ctx2d.strokeStyle="rgba(255,255,255," + menuWindowTrans+")";
        ctx2d.strokeRect(-300+menuWindowTrans*300+3,0+3,290,height*0.8);
        ctx2d.strokeRect(-300+menuWindowTrans*300+7,0+7,290,height*0.8);
        ctx2d.fillStyle="rgba(255,255,255," + menuWindowTrans+")";
        ctx2d.font="50px "+mainfontName;
        ctx2d.fillText("メニュー",30,70);
        ctx2d.fillStyle="rgba(0,0,0," + menuWindowTrans*0.7+")";
        ctx2d.font="20px "+mainfontName;
        ctx2d.beginPath();
        ctx2d.moveTo(width,24);
        ctx2d.lineTo(width-ctx2d.measureText("現在地　"+ fieldNameDatabase2[myposworld]).width-30-10,24)
        ctx2d.lineTo(width-ctx2d.measureText("現在地　"+ fieldNameDatabase2[myposworld]).width-30-23,37)
        ctx2d.lineTo(width,37)
        ctx2d.fill();
        ctx2d.fillStyle="rgba(255,255,255," + menuWindowTrans+")";
        ctx2d.fillText("現在地　"+ fieldNameDatabase2[myposworld],width-ctx2d.measureText("現在地　"+ fieldNameDatabase2[myposworld]).width-30,30);
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
            if (menuSelectNum==0){ ////マイピク
                let mypicOffsetX=0,mypicOffsetY=0;
                ctx2d.fillStyle="rgba(255,255,255,1)";
                ctx2d.font="16px "+mainfontName;
                if (mypic.length >= 2) ctx2d.fillText("Vキー→Zキーで入れ替え",30,410);
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
                    ctx2d.fillText("LvUpまで"+ Math.floor(Math.pow(mypicstock[mypic[i]][12],2.25+(mypicstock[mypic[i]][16])/12) -mypicstock[mypic[i]][13]),mypicOffsetX,mypicOffsetY+91);
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
                        if(!debugMode) ctx2d.drawImage(itemMenuImg[items[i+itemsScroll][0]],332,72+28*i+2,24,24);
                        ctx2d.fillText(itemdata[items[i+itemsScroll][0]][0],360,90+28*i);
                        ctx2d.fillText("× " + items[i+itemsScroll][1],700,90+28*i);    
                    }
                }
                if (items.length > menuSelectChildNum){
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
                    ctx2d.drawImage(itemMenuImg[items[menuSelectChildNum][0]],332,72+28*(menuSelectChildNum-itemsScroll)+2,24,24);
                    ctx2d.fillStyle="rgba(255,255,255," + menuWindowTransChild+")";
                    ctx2d.fillRect(360,60+32*9.5,300,1);
                    ctx2d.font="16px "+mainfontName;
                    ctx2d.fillStyle="rgba(105,105,105," + menuWindowTransChild+")";
                    if((Math.floor(items[menuSelectChildNum][0]/100))%3==0)  ctx2d.fillStyle="rgba(255,255,255," + menuWindowTransChild*(Math.sin(globalTime/5)*0.3+0.7)+")";
                    ctx2d.fillText(itemKindTxt[0],350+0*60,48);
                    ctx2d.fillStyle="rgba(105,105,105," + menuWindowTransChild+")";
                    if((Math.floor(items[menuSelectChildNum][0]/100))%3==1)  ctx2d.fillStyle="rgba(255,255,255," + menuWindowTransChild*(Math.sin(globalTime/5)*0.3+0.7)+")";
                    ctx2d.fillText(itemKindTxt[1],350+1*60,48);
                    ctx2d.fillStyle="rgba(105,105,105," + menuWindowTransChild+")";
                    if((Math.floor(items[menuSelectChildNum][0]/100))%3==2)  ctx2d.fillStyle="rgba(255,255,255," + menuWindowTransChild*(Math.sin(globalTime/5)*0.3+0.7)+")";
                    ctx2d.fillText(itemKindTxt[2],350+2*60+50,48);
                    ctx2d.fillStyle="rgba(255,255,255,1)";
                    ctx2d.fillText("おかね："+ money + currencyName,750-ctx2d.measureText("おかね："+ money + currencyName).width,48);
                    ctx2d.fillText("左右キーでジャンプ",30,410);
                    ctx2d.fillText("スペースキーで一気にスクロール",30,390);
                    ctx2d.font="16px "+mainfontName;
                    ctx2d.fillStyle="rgba(255,255,255," + menuWindowTransChild+")";
                    ctx2d.fillText(itemdata[items[menuSelectChildNum][0]][3].substr(0,25),360,60+32*10.3);
                    ctx2d.fillText(itemdata[items[menuSelectChildNum][0]][3].substr(25,25),360,60+32*11);
                    if(rightkey&&!menuSelectFlg){
                        if((Math.floor(items[menuSelectChildNum][0]/100))%3==2){ //道具へ行く時
                        } else {
                            let tempItemKind=(Math.floor(items[menuSelectChildNum][0]/100)+1)%3;
                            for(var i = menuSelectChildNum;i<items.length;i++){
                                menuSelectChildNum=i;
                                itemsScroll=menuSelectChildNum;
                                if((Math.floor((items[menuSelectChildNum][0]-1)/100))%3==tempItemKind){
                                    break;
                                }
                            }
                        }
                        menuSelectFlg=1;
                    } else if(leftkey&&!menuSelectFlg){
                        if((Math.floor(items[menuSelectChildNum][0]/100))%3==0){ //道具へ行く時
                        }  else if((Math.floor(items[menuSelectChildNum][0]/100))%3==1){ //道具へ行く時
                            menuSelectChildNum=0;
                            itemsScroll=0;
                        } else {
                            let tempItemKind=(Math.floor(items[menuSelectChildNum][0]/100)+2)%3;
                            for(var i = 0;i<items.length;i++){
                                menuSelectChildNum=i;
                                itemsScroll=menuSelectChildNum;
                                if((Math.floor((items[menuSelectChildNum][0]-1)/100))%3==tempItemKind){
                                    break;
                                }
                            }
                        }
                        menuSelectFlg=1;
                    }
                    if(!debugMode)ctx2d.drawImage(itemMenuImg[items[menuSelectChildNum][0]],315.5,376,30,30);
                }
            } else if(menuSelectNum==2){//////ずかん
                ctx2d.font="26px "+mainfontName;
                ctx2d.fillStyle="rgba(255,255,255,"+menuWindowTransChild+")";
                ctx2d.fillText("マテリアルずかん",320,48);
                ctx2d.font="16px "+mainfontName;
                for(var i = 0;i < 15;i++){
                    ctx2d.fillStyle="rgba(105,105,105,"+menuWindowTransChild+")";
                    if(i==menuSelectChildNum%15) ctx2d.fillStyle="rgba(255,255,255,"+menuWindowTransChild*(Math.sin(globalTime/6)*0.3+0.7)+")";
                    if(i+101+Math.floor(menuSelectChildNum/15)*15<=195){
                        ctx2d.fillText("No." + (1+i+Math.floor(menuSelectChildNum/15)*15),360,80+i*22);
                        if(materialVisible[i+1+Math.floor(menuSelectChildNum/15)*15]){ //見える時
                            ctx2d.drawImage(itemMenuImg[i+101+Math.floor(menuSelectChildNum/15)*15],332,63+i*22,22,22)
                            ctx2d.fillText(itemdata[i+101+Math.floor(menuSelectChildNum/15)*15][0],435,80+i*22);        
                        } else{ //見えない時（未取得）
                            ctx2d.drawImage(itemKeyImg,332,63+i*22,22,22);
                            ctx2d.fillText("???",435,80+i*22);        
                        }
                    }
                }
                /////ここから現在のアイテムの描画 ////！！！！未取得のときの処理を追加
                ctx2d.fillStyle="rgba(50,50,50,"+menuWindowTransChild+")";
                ctx2d.strokeStyle="rgba(255,255,255,"+menuWindowTransChild+")";
                ctx2d.lineWidth=1;
                ctx2d.fillRect(625,53,165,250);
                ctx2d.strokeRect(625,53,165,250);
                ctx2d.strokeRect(625-4,53-4,165,250);                
                ctx2d.fillStyle="rgba(255,255,255,"+menuWindowTransChild+")";
                if(materialVisible[menuSelectChildNum+1]){ //見える時
                    ctx2d.fillText(itemdata[menuSelectChildNum+101][0],682+25-ctx2d.measureText(itemdata[menuSelectChildNum+101][0]).width/2,150); 
                    ctx2d.drawImage(itemMenuImg[menuSelectChildNum+101],682,68,50,50);
                    ctx2d.fillText(itemdata[menuSelectChildNum+101][3].substr(0,9),630+5,230);
                    ctx2d.fillText(itemdata[menuSelectChildNum+101][3].substr(9,9),630+5,250);
                    ctx2d.fillText(itemdata[menuSelectChildNum+101][3].substr(18,9),630+5,270);    
                } else{ //見えない時
                    ctx2d.fillText("???",682+25-ctx2d.measureText("???").width/2,150); 
                    ctx2d.drawImage(itemKeyImg,682,68,50,50);
                    ctx2d.fillText("???",630+5,230);
                }
                ctx2d.fillText("No.",630+5,180);
                ctx2d.fillText((menuSelectChildNum+1),690+5,180);
                ctx2d.fillText("所持数 ",630+5,200);
                ctx2d.fillText((countItem(menuSelectChildNum+1)),690+5,200);
                ctx2d.fillStyle="rgba(255,255,255,"+menuWindowTransChild+")";
                ctx2d.font="13px "+mainfontName;
                ctx2d.fillText((Math.floor(menuSelectChildNum/15)+1)+" / 7 ページ",500,415);
                if(upkey && !menuSelectFlg && menuSelectChildNum) menuSelectChildNum--,menuSelectFlg=1,zkeySE.play();
                if(downkey&&!menuSelectFlg&&menuSelectChildNum!=94)menuSelectChildNum++,menuSelectFlg=1,zkeySE.play();
                if(leftkey && !menuSelectFlg)menuSelectChildNum-=15,menuSelectFlg=1,zkeySE.play();
                if(rightkey && !menuSelectFlg)menuSelectChildNum+=15,menuSelectFlg=1,zkeySE.play();
                if(menuSelectChildNum<0) menuSelectChildNum+=15;
                if(menuSelectChildNum>94)menuSelectChildNum-=15;
            }
        }
        if (titleConfirmWindow && (titleConfirmWindow-menuWindowAniSpeed)) titleConfirmWindow++;
        if (titleConfirmWindow && (titleConfirmWindow-2*menuWindowAniSpeed)>=0) titleConfirmWindow=0;
        if (titleConfirmWindow){
            ctx2d.fillStyle="rgba(0,0,0,"+ (1-Math.abs(titleConfirmWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
            ctx2d.fillRect(width/2-200,height/2-60,400,120);
            ctx2d.font="14pt "+ mainfontName;
            ctx2d.fillStyle="rgba(255,255,255,"+ (1-Math.abs(titleConfirmWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
            ctx2d.lineWidth=2;
            ctx2d.strokeRect(width/2-200,height/2-60,400,120);
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
            if (leftkey && !menuSelectFlg) titleConfirmSelect=0,menuSelectFlg=1, crosskeySE.play();
            if (rightkey && !menuSelectFlg) titleConfirmSelect=1,menuSelectFlg=1, crosskeySE.play(); 
        }
    }
    if (checkSkillConflict.length && !eventMessageWindow){
        eventMessageWindow=1;
        eventMessageWindowMsg="@" + checkSkillConflict.pop();
    }
    if(eventMessageWindow){
        if (eventMessageWindowMsg.substr(0,1)=="/"){
            if (upkey && !menuSelectFlg) menuSelectFlg=1,eventMessageSelectNum=Math.max(0,eventMessageSelectNum-1), crosskeySE.play(); 
            if (downkey && !menuSelectFlg) menuSelectFlg=1,eventMessageSelectNum=Math.min(mypic.length-1,eventMessageSelectNum+1), crosskeySE.play(); 
            if (zkey && !menuSelectFlg) { //使う処理はここに書く
                zkeySE.play(); 
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
                } else if(items[menuSelectChildNum][0] >=201 && items[menuSelectChildNum][0] <=250){ //教え系
                    checkSkillConflict.push(eventMessageSelectNum);
                    mypicstock[mypic[eventMessageSelectNum]][14].push(itemdata[items[menuSelectChildNum][0]][5]);
                }
                if(!notConsume){
                    eventMessageWindowMsg=itemdata[items[menuSelectChildNum][0]][0]+"を"+mypicstock[mypic[eventMessageSelectNum]][0]+"につかった！"; 
                    consumeItem(menuSelectChildNum);
                    menuSelectFlg=1;
                    if (menuSelectChildNum>= items.length) menuSelectChildNum=items.length-1;
                }
                menuSelectFlg=1;
            }
            if (xkey && !menuSelectFlg){
                menuSelectFlg=1;
                eventMessageWindow++;
                xkeySE.play();
            }
            ctx2d.fillStyle="rgba(0,0,0," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
            ctx2d.fillRect((width-400)/2,height/2-100,400,200);
            ctx2d.lineWidth=2;
            ctx2d.strokeStyle="rgba(255,255,255," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
            ctx2d.strokeRect((width-400)/2,height/2-100,400,200);
            ctx2d.strokeRect((width-400)/2+4,height/2-100+4,400,200);
            ctx2d.font="16pt " + mainfontName;
            ctx2d.fillStyle="rgba(255,255,255," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
            ctx2d.fillText(eventMessageWindowMsg.substr(
                1),(width-350)/2,height/2-65);    
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
            if (mypicstock[mypic[Number(eventMessageWindowMsg.substr(1,1))]][14].length) {
                if (upkey && !menuSelectFlg) menuSelectFlg=1,eventMessageSelectNum=Math.max(0,eventMessageSelectNum-1), crosskeySE.play();
                if (downkey && !menuSelectFlg) menuSelectFlg=1,eventMessageSelectNum=Math.min(4,eventMessageSelectNum+1), crosskeySE.play(); 
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
                    zkeySE.play(); 
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
        }else if(eventMessageWindowMsg.substr(0,1) == "+"){ //連続でメッセージが現れる場合
            if(!(eventMessageWindowAni%5) && (eventMessageWindowAni/2<eventMessageWindowMsg.length)) messageSE.play();
            eventMessageWindowAni++;
            ctx2d.fillStyle="rgba(0,0,0," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
            ctx2d.font="16pt " + mainfontName;
            if(eventMessageWindowMsg.substr(1,1)=="="){ //手紙の時
                ctx2d.fillStyle="rgba(255,255,255," +0.8*(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                ctx2d.font="16pt Klee One";
            }  else if (eventMessageWindowMsg.substr(1,1) == "~"){
                ctx2d.fillStyle="rgba(255,255,255," +0.8*(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                ctx2d.font="16pt Yomogi";
            }
            ctx2d.fillRect(30,400,width-60,110);
            ctx2d.strokeStyle="rgba(255,255,255," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
            ctx2d.lineWidth=1;
            ctx2d.strokeRect(30-4,400-4,width-60,110);
            ctx2d.strokeRect(30,400,width-60,110);
            ctx2d.fillStyle="rgba(255,255,255," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
            if(eventMessageWindowMsg.substr(1,1)=="="|| eventMessageWindowMsg.substr(1,1) == "~"){
                ctx2d.fillStyle="rgba(0,0,0," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
            }
            if (eventMessageWindowMsg.substr(1,1)=="¥"){
                for(var i = 0;i < mypic.length;i++){
                    mypicstock[mypic[i]][2]=mypicstock[mypic[i]][3];
                    mypicstock[mypic[i]][4]=mypicstock[mypic[i]][5];
                }
            }
            if(!encount){
                ctx2d.fillText(eventMessageWindowMsg.substr(1,Math.min(41,Math.floor(eventMessageWindowAni/2))).replace("=","").replace("~","").replace("¥",""),40,430);
                ctx2d.fillText(eventMessageWindowMsg.substr(42,Math.max(0,Math.min(41,Math.floor(eventMessageWindowAni/2)-41))).replace("=","").replace("~","").replace("¥",""),40,460);
                ctx2d.fillText(eventMessageWindowMsg.substr(83,Math.max(0,Math.min(41,Math.floor(eventMessageWindowAni/2)-82))).replace("=","").replace("~","").replace("¥",""),40,490);
            }
            ctx2d.font="12pt " + mainfontName;
            ctx2d.fillStyle="rgba(255,255,255," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)*(0.7+0.3*Math.sin(globalTime/8))+")";
            ctx2d.fillText("Zキーで次へ",38,387);
            if (zkey && !(eventMessageWindow-menuWindowAniSpeed) && !menuSelectFlg && (debugMode!=0 || eventMessageWindowAni/2>eventMessageWindowMsg.length)){//メッセージの更新処理
                messageNextSE.play(); 
                eventMessageWindowAni=1;
                if (eventMessageWindowMsgStack.length==0){
                    eventMessageWindow++,menuSelectFlg=1; //終わりの時
                    eventMessageWindowMsg="+";
                } else{
                    eventMessageWindowMsg=eventMessageWindowMsgStack[0];
                    eventMessageWindowMsgStack.shift();
                    menuSelectFlg=1;
                    if(eventMessageWindowMsg.substr(1,1)=="*" && !isNaN(Number(eventMessageWindowMsg.substr(2,3)))){ //バトル勃発の時
                        //戦闘のときの書式は"+*XXX"
                        inMsgBattleFlg=1;
                        encountEnemyNum=Number(eventMessageWindowMsg.substr(2,3));
                        encount=true;
                        eventMessageWindowMsg=eventMessageWindowMsgStack[0];
                        eventMessageWindowMsgStack.shift();
                        menuSelectFlg=1;
                    } else if(eventMessageWindowMsg.substr(1,1)=="^" && !isNaN(Number(eventMessageWindowMsg.substr(2,3)))){ //アイテム入手のとき
                        //アイテム入手のときの書式は"+^XXX"
                        getItem(Number(eventMessageWindowMsg.substr(2,3)));
                        eventSE.play();
                        popupMsg.push([itemdata[Number(eventMessageWindowMsg.substr(2,3))][0] + "を手に入れた！",120,0,0,-1]);
                        eventMessageWindowMsg=eventMessageWindowMsgStack[0];
                        eventMessageWindowMsgStack.shift();
                        menuSelectFlg=1;
                    }  
                }
            }
        }else{
            if (eventMessageWindowMsg.substr(0,1)=='`'){ ///アイテム合成の時 "`hoge`を合成した!"
                ctx2d.fillStyle="rgba(0,0,0," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                ctx2d.font="16pt " + mainfontName;
                ctx2d.fillRect(width/2-(40+ctx2d.measureText(eventMessageWindowMsg).width)/2-30,height/2-50,(40+ctx2d.measureText(eventMessageWindowMsg).width)+60,100);

                let ItemSynX=7+width/2-(40+ctx2d.measureText(eventMessageWindowMsg).width)/2-30+20+22.5;
                let ItemSynY=7+height/2-50+20+22.5;
                let gradationItemSyn = ctx2d.createRadialGradient(ItemSynX, ItemSynY, 3, ItemSynX, ItemSynY, Math.sin(globalTime/12)*4+40);
                //色
                gradationItemSyn.addColorStop(0, 'rgba(255,255,255,'+(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+')');
                gradationItemSyn.addColorStop(1, 'rgba(255,255,255,0)');
                ctx2d.fillStyle = gradationItemSyn;
                //円
                ctx2d.beginPath();
                ctx2d.arc(ItemSynX, ItemSynY, Math.sin(globalTime/12)*4+40, 0, 2 * Math.PI, false);
                ctx2d.fill();// 描画    

                let synItemNum=Number(eventMessageWindowMsg.substr(1,eventMessageWindowMsg.indexOf('`',1)-1));
                ctx2d.strokeStyle="rgba(255,255,255," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                ctx2d.lineWidth=1;
                ctx2d.strokeRect(width/2-(40+ctx2d.measureText(eventMessageWindowMsg).width)/2-30,height/2-50,(40+ctx2d.measureText(eventMessageWindowMsg).width)-4+60,100-4);
                ctx2d.strokeRect(width/2-(40+ctx2d.measureText(eventMessageWindowMsg).width)/2+4-30,height/2-50+4,(40+ctx2d.measureText(eventMessageWindowMsg).width)-4+60,100-4);
                ctx2d.fillStyle="rgba(255,255,255," +(1- Math.abs(eventMessageWindow-menuWindowAniSpeed)/menuWindowAniSpeed)+")";
                if((eventMessageWindow<=menuWindowAniSpeed)) ctx2d.drawImage(itemMenuImg[synItemNum],width/2-(40+ctx2d.measureText(eventMessageWindowMsg).width)/2-30+20,height/2-50+20,55,55);
                ctx2d.fillText(eventMessageWindowMsg.substr(eventMessageWindowMsg.indexOf('`',1)+1),(width-ctx2d.measureText(eventMessageWindowMsg.substr(eventMessageWindowMsg.indexOf('`',1)+1)).width)/2+30,height/2+5);    
                ctx2d.fillStyle="rgba(255,255,255," +Math.max(0,(50-itemSynsAni)/50)*0.8+")";
                ctx2d.font="16pt " + mainfontName;
                ctx2d.fillRect(width/2-(40+ctx2d.measureText(eventMessageWindowMsg).width)/2-30,height/2-50,(40+ctx2d.measureText(eventMessageWindowMsg).width)+60,100);
                itemSynsAni++;
            } else{ //それ以外
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
        }
        if (eventMessageWindow-menuWindowAniSpeed) eventMessageWindow++;
        if (!(eventMessageWindow-menuWindowAniSpeed*2)) eventMessageWindow=0;
        if (!zkey && !xkey && !upkey && !downkey && !leftkey && !rightkey && !vkey) menuSelectFlg=0;
        if ((zkey||xkey) &&eventMessageWindowMsg.substr(0,1) != "+"&& !(eventMessageWindow-menuWindowAniSpeed) && !menuSelectFlg) zkeySE.play(),eventMessageWindow++,menuSelectFlg=1;
    }
    if (!upkey && !downkey && !zkey && !leftkey && !rightkey && !xkey && !zkey && !vkey) menuSelectFlg=0;

    if (warpAni) { //ワープの処理 
        if (warpAni==1) warpMapSE.play();
        warpAni++;
        ctx2d.fillStyle="rgba(0,0,0," + (1-Math.abs(warpAni-10)/10)  +")";
        ctx2d.fillRect(0,0,width,height);
    }
    if (warpAni==10 && warpFlg){ //ワープする瞬間
        if(Math.floor(myposworld/10)!=Math.floor(nowWarpObj[4]/10)) playFieldBGM(nowWarpObj[4]);//違うワールドなら再生
        myposworld=nowWarpObj[4];
        myposx=nowWarpObj[5];
        myposy=nowWarpObj[6];
        createField();
        fieldReDrawFlg=1;
        warpFlg=0;
        if (fieldNameDatabase[myposworld].length) popupMsg.push([fieldNameDatabase[myposworld],120,0,0,-1]);
    }else if(warpAni==12){//フィールド描画後に一度だけ行う処理
        setMaterials();
    } else if(warpAni==20){ //ワープアニメーション終了時
        warpAni=0;
    }
    let tempitemflgs=0;
    for(let i = 0;i < itemflgs.length;i++){
        if(itemflgs[i] && fieldItemStatus[myposworld][i][5]) tempitemflgs=1;
    }
    if(tempitemflgs){
        ctx2d.font="14pt " + mainfontName;
        ctx2d.fillStyle="rgba(255,255,255," + (Math.sin(globalTime/5)*0.3+0.7)+")";    
        ctx2d.fillText("Zキーで調べる",800,30);
    }
    if(creatingFieldFlg){
        warpAni=11;
        ctx2d.font="26pt " + mainfontName;
        ctx2d.fillStyle="rgba(255,255,255,1)";
        ctx2d.fillText("Loading" + ".".repeat(Math.floor(globalTime/10)%3),30,500);
        if(mypicstock.length) drawMypic(Math.floor(globalTime/120)% mypicstock.length,width-100,height-100+Math.max(0,Math.sin(globalTime/7)*20-17),80,80,1,0,(globalTime<=30&& (Math.floor(globalTime/4)%2)));
    }
}

function playFieldBGM(fieldNum){ //-1でタイトルを流せる
    stopFieldBGM();
    if (fieldNum==-1){
        streetBgm.play();
    } else if (fieldNum<=9){
        homeBgm.play();
    } else if(fieldNum<=19){
        forestFieldBgm.play();
    } else if(fieldNum<=29){
        caveFieldBgm.play();
    } else if(fieldNum<=39){
        remainsFieldBgm.play();
    } else{
        desertFieldBgm.play();
    }
}
function stopFieldBGM(){
    homeBgm.stop();
    forestFieldBgm.stop();
    caveFieldBgm.stop();
    remainsFieldBgm.stop();
    desertFieldBgm.stop();
    streetBgm.stop();
}


function playBattleBGM(encountEnemyNum){
    stopBattleBGM();
    if(encountEnemyNum == 4)lastBossBattle1Bgm.play();//lastboss
    else if(encountEnemyNum == 5)dungeonBossBattle1Bgm.play();//forestboss
    else if(encountEnemyNum == 6)dungeonBossBattle2Bgm.play();//caveboss
    else if(encountEnemyNum == 7)dungeonBossBattle3Bgm.play();//remainsboss
    else if(encountEnemyNum == 8)dungeonBossBattle4Bgm.play();//desertboss
    else if((encountEnemyNum>=9 && encountEnemyNum <=15) || (encountEnemyNum>=19 && encountEnemyNum <=25) || (encountEnemyNum>=29 && encountEnemyNum <=35) || (encountEnemyNum>=39 && encountEnemyNum <=45)){
        normalBattleBgm.play();}//baseEnemy
    else if((encountEnemyNum>=16 && encountEnemyNum <=18) || (encountEnemyNum>=26 && encountEnemyNum <=28) || (encountEnemyNum>=36 && encountEnemyNum <=38) || (encountEnemyNum>=46 && encountEnemyNum <=48)){
        rareBattleBgm.play();}//rareEnemy
}

function stopBattleBGM(){
    lastBossBattle1Bgm.stop();
    dungeonBossBattle1Bgm.stop();
    dungeonBossBattle2Bgm.stop();
    dungeonBossBattle3Bgm.stop();
    dungeonBossBattle4Bgm.stop();
    normalBattleBgm.stop();
    rareBattleBgm.stop();
}