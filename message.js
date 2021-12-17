var introMessage = ["", ""];
var endMess2 = [""];
var BattleMessage = [introMessage, endMess2];
var winMessage, loseMessage;
var onMessage=false;
var Messagenum=1;//0:field, 1:battle
var Bsetcheck=true;
var messChoice=0;//選択肢シーンでの分岐判定
var messCheck=false;
var Choicenum=0;
var battleLaunchFlg=0;
const popupWindowAniSpeed=15;

function messageMain(){
    if(onMessage){
        if(mode==2){
            battlemessMain();
        }
    }
}
function battlemessMain(){
    if(battleMode==0){//intro,end
        ctx2d.fillStyle=white;
        ctx2d.font="26px "+mainfontName;
        if(Bsetcheck){
            introMessage[0]="野生の "+baseEnemyData[0]+" があらわれた！";
            introMessage[1]="勝負だ、 "+mypicstock[mypic[0]][0]+" !";
            endMess2[0]=mypicstock[mypic[0]][0]+"はにげた。";}
        if(!modeAnimation) ctx2d.fillText(introMessage[in_lstnum], width*25/100,height*75/100);
        if (battleLaunchFlg){ /////バトル開始時の処理　ここにまとめる
            fieldReDrawFlg=1,battleLaunchFlg=0;
        }
    }
    battleloop();

    //一連のメッセージ終了時イベント
    if(battleMode==0){
        if(in_lstnum == introMessage.length){
            battleMode=1, in_lstnum=0;}}//loopに行く
    //////
}

function battleloop(){
    ctx2d.font="28px "+mainfontName;
    //////////////////
    //stage名
    ctx2d.setTransform(1,0,-0.5,1,0,0);
    ctx2d.fillStyle="rgba(0,0,0,0.6)";
    ctx2d.fillRect(width*0/100,height*5/100,width*30/100,height*10/100);
    ctx2d.setTransform(1,0,0,1,0,0);
    ctx2d.fillStyle=white;
    ctx2d.fillText(fieldNameDatabase2[myposworld], width*6/100,height*11.5/100);
    //////////////////

    //////////////////
    //味方ステータス表示
    ctx2d.fillStyle=darkgray;
    ctx2d.fillRect(width*3/100,height*69/100,35,35);
    drawMypic(mypic[0],width*3/100,height*69/100,35,35,1,0);
    ctx2d.fillStyle=white;
    ctx2d.font="18px "+mainfontName;
    ctx2d.fillText(mypicstock[mypic[0]][0], width*8/100,height*71/100);
    ctx2d.fillText("Lv."+mypicstock[mypic[0]][12], width*8/100,height*75/100);
    changeColor(mypicstock[mypic[0]][15], 1.0);
    ctx2d.fillText(typeDataText[mypicstock[mypic[0]][15]], width*15/100,height*75/100);//属性表示
    ctx2d.fillStyle=white;
    ctx2d.font="16px "+mainfontName;
    ctx2d.fillText("HP: "+Number(mypicstock[mypic[0]][2]).toFixed(0)+"/"+Number(mypicstock[mypic[0]][3]).toFixed(0), width*3/100,height*81/100);
    ctx2d.fillText("DP: "+mypicstock[mypic[0]][4]+"/"+mypicstock[mypic[0]][5], width*3/100,height*85/100);
    ctx2d.fillText("こうげき: "+mypicstock[mypic[0]][6], width*3/100,height*89/100);
    ctx2d.fillText("ぼうぎょ: "+mypicstock[mypic[0]][7], width*3/100,height*93/100);
    ctx2d.fillText("すばやさ: "+mypicstock[mypic[0]][10], width*3/100,height*97/100);
    /////////////////
    //敵ステータス表示
    ctx2d.fillStyle="rgba("+typeDataCol[baseEnemyData[15]]+",1.0)";
    ctx2d.font="35px "+mainfontName;
    ctx2d.fillText("E",width*82/100,height*74/100);
    ctx2d.fillStyle=white;
    ctx2d.font="18px "+mainfontName;
    ctx2d.fillText(baseEnemyData[0], width*86/100,height*71/100);
    ctx2d.fillText("Lv."+baseEnemyData[12], width*86/100,height*75/100);
    changeColor(baseEnemyData[15], 1.0);
    ctx2d.fillText(typeDataText[baseEnemyData[15]], width*93/100,height*75/100);//属性表示
    ctx2d.fillStyle=white;
    ctx2d.font="16px "+mainfontName;
    ctx2d.fillText("HP: "+baseEnemyData[2]+"/"+baseEnemyData[3], width*82/100,height*81/100);
    /////////////////

    if (fieldReDrawFlg){ /////背景の再描画処理　戦闘開始時にこのフラグが立つ
        field2d.clearRect(0,0,width,height);
        //////////////
        //field部分
        const mypicFieldBackImg=new Image();//mypicField
        if(myposworld>=10 && myposworld<=18 || myposworld == 3){
            field2d.drawImage(battleBackImg[0],0,138,450,200,width*0/100,height*0/100,width,height*65/100);
        } else if(myposworld>=20 && myposworld<=27){
            field2d.drawImage(battleBackImg[1],0,138,450,200,width*0/100,height*0/100,width,height*65/100);
        } else if(myposworld>=30 && myposworld<=36){
            field2d.drawImage(battleBackImg[2],0,138,450,200,width*0/100,height*0/100,width,height*65/100);
        } else if(myposworld>=40 && myposworld<=46){
            field2d.drawImage(battleBackImg[3],0,58,580,386,width*0/100,height*0/100,width,height*65/100);
        }
        //////////////
        field2d.drawImage(battleGround,0,0,250,131,width*5/100,height*50/100,width*44/100,height*15/100);
        field2d.drawImage(battleGround,0,0,250,131,width*53/100,height*23/100,width*44/100,height*20/100);
        field2d.fillStyle=black;
        field2d.fillRect(0,height*65/100,width,height*35/100);
        //message部分
        field2d.drawImage(msgWindowImg[0],0,0,800,200,width*21/100,height*62/100,width*58/100,height*38/100);
        field2d.drawImage(msgWindowImg[1],0,0,685,179,width*1/100,height*64/100,width*20/100,height*38/100);
        field2d.drawImage(msgWindowImg[2],0,0,685,179,width*79/100,height*64/100,width*20/100,height*38/100);
        
        fieldReDrawFlg=0;
    }

    if(battleMode==1){
        ctx2d.font="25px "+mainfontName;
        ctx2d.fillText("たたかう", width*28.5/100,height*75/100);
        ctx2d.fillText("アイテム", width*28.5/100,height*81/100);
        ctx2d.fillText("マイピク", width*28.5/100,height*87/100);
        ctx2d.fillText("にげる", width*28.5/100,height*93/100);

        if(loopmode==0){
            make_pointer(width*27/100,height*(73+6*loopselect)/100,width*25/100,height*(71+6*loopselect)/100,width*25/100,height*(75+6*loopselect)/100);
        }

        if(loopmode==1){
            if(shortDpFlg) popupMsg.push(["DPが足りないよ!",120,0,0,-1]), shortDpFlg=false;
            for(let i=0; i<4; i++){
                if(mypicstock[mypic[0]][4] < skillData[mypicstock[mypic[0]][8][i]][4]) ctx2d.fillStyle=darkgray;
                else changeColor(skillData[mypicstock[mypic[0]][8][i]][3], 1.0);
                ctx2d.font="25px "+mainfontName;
                ctx2d.fillText(skillData[mypicstock[mypic[0]][8][i]][0], width*47/100,height*(75+6*i)/100);
                if(mypicstock[mypic[0]][4] < skillData[mypicstock[mypic[0]][8][i]][4]) ctx2d.fillStyle=darkgray;
                else ctx2d.fillStyle=white;
                ctx2d.font="17px "+mainfontName;
                ctx2d.fillText("DP:"+skillData[mypicstock[mypic[0]][8][i]][4], width*70/100,height*(74+6*i)/100);
            }
            make_pointer(width*45/100,height*(73+6*loopselect)/100,width*43/100,height*(71+6*loopselect)/100,width*43/100,height*(75+6*loopselect)/100);}
            
        else if(loopmode==2){//バッグの表示
            //loopselect: ポインタが指すアイテムの要素番号
            //BtopItem: 表示するアイテムの一番上の要素番号
            if(BerrorFlg){//errorメッセージ表示
                popupMsg.push(["ここでは使えないよ!",120,0,0,-1]);
                BerrorFlg=false;}
            ctx2d.font="18px "+mainfontName;
            for (let i=0; i < Math.min(items.length, 4); i++){
                if(debugMode) console.log(BtopItem,i);
                if(!itemdata[items[BtopItem+i][0]][2]) ctx2d.fillStyle=darkgray2;
                else if(items[BtopItem+i][0] == 14 && moneyUpFlg) ctx2d.fillStyle=darkgray2;
                else if(items[BtopItem+i][0] == 15 && experienceUpFlg) ctx2d.fillStyle=darkgray2;
                else ctx2d.fillStyle=white;
                ctx2d.fillText(itemdata[items[BtopItem+i][0]][0], width*46/100,height*(73+(i*4.5))/100);
                ctx2d.fillText("×"+items[BtopItem+i][1], width*71/100,height*(73+(i*4.5))/100);}
            make_pointer(width*45/100,height*(72+4.5*(loopselect-BtopItem))/100,width*43/100,height*(70+4.5*(loopselect-BtopItem))/100,width*43/100,height*(74+4.5*(loopselect-BtopItem))/100);
            ctx2d.fillStyle=white;
            ctx2d.fillRect(width*42/100, height*89/100, width*33/100, 1);
            ctx2d.font="12px "+mainfontName;
            battleDrawText(itemdata[items[loopselect][0]][3], 26, 43, 92, 3);
            }
            
        else if(loopmode==3){
            //マイピク情報
            if(BerrorFlg){//errorメッセージ表示
                popupMsg.push(["ひんしなので選べない!",120,0,0,-1]);
                BerrorFlg=false;}
            ctx2d.font="20px "+mainfontName;
            ctx2d.fillText("どのマイピクと交代する？", width*48/100,height*74/100);
            for (let i=0; i < mypic.length; i++){
                if(mypicstock[mypic[i]][2]==0)ctx2d.fillStyle=darkgray2;
                else ctx2d.fillStyle=white;
                ctx2d.fillText(mypicstock[mypic[i]][0], width*(47+17*Math.max(0,Math.ceil((i-2)/3)))/100,height*(81+6*(i%3))/100);}
                make_pointer(width*(46+17*Math.max(0,Math.ceil((loopselect-2)/3)))/100,height*(79.5+6*(loopselect%3))/100,width*(44+17*Math.max(0,Math.ceil((loopselect-2)/3)))/100,height*(77.5+6*(loopselect%3))/100,width*(44+17*Math.max(0,Math.ceil((loopselect-2)/3)))/100,height*(81.5+6*(loopselect%3))/100);
        }
        else if(loopmode==4){
            if(BerrorFlg){//errorメッセージ表示
                popupMsg.push(["ここでは使えないよ!",120,0,0,-1]);
                BerrorFlg=false;}
            ctx2d.font="20px "+mainfontName;
            ctx2d.fillText("だれに使用する？", width*53/100,height*74/100);
            for (let i=0; i < mypic.length; i++){
                if(items[loopselect][0]==6 || items[loopselect][0]==7){
                    if(mypicstock[mypic[i]][2]!=0)ctx2d.fillStyle=darkgray2;
                    else ctx2d.fillStyle=white;}
                else if(mypicstock[mypic[i]][2]==0)ctx2d.fillStyle=darkgray2;
                else ctx2d.fillStyle=white;
                ctx2d.fillText(mypicstock[mypic[i]][0], width*(47+17*Math.max(0,Math.ceil((i-2)/3)))/100,height*(81+6*(i%3))/100);}
                make_pointer(width*(46+17*Math.max(0,Math.ceil((BwhoUse-2)/3)))/100,height*(79.5+6*(BwhoUse%3))/100,width*(44+17*Math.max(0,Math.ceil((BwhoUse-2)/3)))/100,height*(77.5+6*(BwhoUse%3))/100,width*(44+17*Math.max(0,Math.ceil((BwhoUse-2)/3)))/100,height*(81.5+6*(BwhoUse%3))/100);
        }
    }
    
    else if(battleMode==2){//戦闘選択時の挙動
        ctx2d.font="26px "+mainfontName;
        switch (Acount){
            case 1:
                if (!damageMessageFlg) {
                    ctx2d.fillText(firstSt[0]+" の ", width*25/100,height*75/100);
                    ctx2d.fillText(firstSkill[0]+" !", width*25/100,height*82/100);}
                else if(attackMiss){
                    ctx2d.fillText(firstSkill[0]+" は当たらなかった...", width*25/100,height*75/100);}
                else {ctx2d.fillText(secondSt[0]+" に "+damage+" のダメージ!", width*25/100,height*75/100);
                    if(typeMatchFlg==1/2){
                        ctx2d.fillText("こうかはいまひとつのようだ...", width*25/100,height*82/100);
                        if(trait4Flg)ctx2d.fillText(secondSt[0]+" はふくつの精神で耐えた!", width*25/100,height*89/100);}
                    else if(typeMatchFlg==2){
                        ctx2d.fillText("こうかはばつぐんだ!!", width*25/100,height*82/100);
                        if(trait4Flg)ctx2d.fillText(secondSt[0]+" はふくつの精神で耐えた!", width*25/100,height*89/100);}
                    else {
                        if(trait4Flg)ctx2d.fillText(secondSt[0]+" はふくつの精神で耐えた!", width*25/100,height*82/100);}
                }
                break;
            case 2:
                if (!damageMessageFlg) {
                    ctx2d.fillText(secondSt[0]+" の ", width*25/100,height*75/100);
                    ctx2d.fillText(secondSkill[0]+" !", width*25/100,height*82/100);}
                else if(attackMiss){
                    ctx2d.fillText(secondSkill[0]+" は当たらなかった...", width*25/100,height*75/100);}
                else {ctx2d.fillText(firstSt[0]+" に "+damage+" のダメージ!", width*25/100,height*75/100);
                    if(typeMatchFlg==1/2){
                        ctx2d.fillText("こうかはいまひとつのようだ...", width*25/100,height*82/100);
                        if(trait4Flg)ctx2d.fillText(firstSt[0]+" はふくつの精神で耐えた!", width*25/100,height*89/100);}
                    else if(typeMatchFlg==2){
                        ctx2d.fillText("こうかはばつぐんだ!!", width*25/100,height*82/100);
                        if(trait4Flg)ctx2d.fillText(firstSt[0]+" はふくつの精神で耐えた!", width*25/100,height*89/100);}
                    else {
                        if(trait4Flg)ctx2d.fillText(firstSt[0]+" はふくつの精神で耐えた!", width*25/100,height*82/100);}
                }
                break;
            case 3:
                if(trait9Flg == 1){
                    ctx2d.fillText(mypicstock[mypic[0]][0]+" は手持ちのおやつを食べて少し回復。",width*25/100,height*75/100);
                }else if(trait9Flg==2){
                    ctx2d.fillText(baseEnemyData[0]+" は手持ちのおやつを食べて少し回復。",width*25/100,height*75/100);
                }else if(trait9Flg==3){
                    ctx2d.fillText(mypicstock[mypic[0]][0]+" は手持ちのおやつを食べて少し回復。",width*25/100,height*75/100);
                    ctx2d.fillText(baseEnemyData[0]+" は手持ちのおやつを食べて少し回復。",width*25/100,height*82/100);
                }
                break;
            
        }
    }
    
    else if(battleMode==3){//アイテム
        ctx2d.font="26px "+mainfontName;
        switch (itemCount){
            case 0:
                ctx2d.fillText(itemdata[items[loopselect][0]][0]+" をつかった!", width*25/100,height*75/100);
                break;
            case 1:
                ctx2d.fillText(baseEnemyData[0]+" の",width*25/100,height*75/100);
                ctx2d.fillText(secondSkill[0]+" !", width*25/100,height*82/100);
                break;
            case 2:
                if(attackMiss){
                    ctx2d.fillText(secondSkill[0]+" は当たらなかった...", width*25/100,height*75/100);}
                else {ctx2d.fillText(firstSt[0]+" に "+damage+" のダメージ!", width*25/100,height*75/100);
                    if(typeMatchFlg==1/2){
                        ctx2d.fillText("こうかはいまひとつのようだ...", width*25/100,height*82/100);
                        if(trait4Flg)ctx2d.fillText(firstSt[0]+" はふくつの精神で耐えた!", width*25/100,height*89/100);}
                    else if(typeMatchFlg==2){
                        ctx2d.fillText("こうかはばつぐんだ!!", width*25/100,height*82/100);
                        if(trait4Flg)ctx2d.fillText(firstSt[0]+" はふくつの精神で耐えた!", width*25/100,height*89/100);}
                    else {
                        if(trait4Flg)ctx2d.fillText(firstSt[0]+" はふくつの精神で耐えた!", width*25/100,height*82/100);}
                }
                break;
            case 3:
                if(trait9Flg == 1){
                    ctx2d.fillText(mypicstock[mypic[0]][0]+" は手持ちのおやつを食べて少し回復。",width*25/100,height*75/100);
                }else if(trait9Flg==2){
                    ctx2d.fillText(baseEnemyData[0]+" は手持ちのおやつを食べて少し回復。",width*25/100,height*75/100);
                }else if(trait9Flg==3){
                    ctx2d.fillText(mypicstock[mypic[0]][0]+" は手持ちのおやつを食べて少し回復。",width*25/100,height*75/100);
                    ctx2d.fillText(baseEnemyData[0]+" は手持ちのおやつを食べて少し回復。",width*25/100,height*82/100);
                }
                break;
            }
    }
    else if(battleMode==4){//マイピク交代
        ctx2d.font="26px "+mainfontName;
        switch (chgCount){
            case 0:
                ctx2d.fillText(mypicstock[mypic[0]][0]+"交代だ!",width*25/100,height*75/100);
                ctx2d.fillText("ゆけ "+mypicstock[mypic[loopselect]][0]+"!!", width*25/100,height*83/100);
                break;
            case 1:
                ctx2d.fillText(baseEnemyData[0]+" の",width*25/100,height*75/100);
                ctx2d.fillText(secondSkill[0]+"!", width*25/100,height*82/100);
                break;
            case 2:
                if(attackMiss){
                    ctx2d.fillText(secondSkill[0]+" は当たらなかった...", width*25/100,height*75/100);}
                else {ctx2d.fillText(firstSt[0]+" に "+damage+" のダメージ!", width*25/100,height*75/100);
                    if(typeMatchFlg==1/2){
                        ctx2d.fillText("こうかはいまひとつのようだ...", width*25/100,height*82/100);
                        if(trait4Flg)ctx2d.fillText(firstSt[0]+" はふくつの精神で耐えた!", width*25/100,height*89/100);}
                    else if(typeMatchFlg==2){
                        ctx2d.fillText("こうかはばつぐんだ!!", width*25/100,height*82/100);
                        if(trait4Flg)ctx2d.fillText(firstSt[0]+" はふくつの精神で耐えた!", width*25/100,height*89/100);}
                    else {
                        if(trait4Flg)ctx2d.fillText(firstSt[0]+" はふくつの精神で耐えた!", width*25/100,height*82/100);}
                }
                break;
            case 3:
                if(trait9Flg == 1){
                    ctx2d.fillText(mypicstock[mypic[0]][0]+" は手持ちのおやつを食べて少し回復。",width*25/100,height*75/100);
                }else if(trait9Flg==2){
                    ctx2d.fillText(baseEnemyData[0]+" は手持ちのおやつを食べて少し回復。",width*25/100,height*75/100);
                }else if(trait9Flg==3){
                    ctx2d.fillText(mypicstock[mypic[0]][0]+" は手持ちのおやつを食べて少し回復。",width*25/100,height*75/100);
                    ctx2d.fillText(baseEnemyData[0]+" は手持ちのおやつを食べて少し回復。",width*25/100,height*82/100);
                }
                break;
        }
    }

    else if(battleMode==5){//逃げるメッセージ
        if(!attackorder){
            ctx2d.font="26px "+mainfontName;
            if(unEscapeFlg) ctx2d.fillText("この敵からは逃げられない!!",width*25/100,height*75/100);
            else ctx2d.fillText("敵が速くて逃げられない!",width*25/100,height*75/100);}
        else{
            ctx2d.font="26px "+mainfontName;
            ctx2d.fillText(mypicstock[mypic[0]][0]+" はにげた", width*25/100,height*75/100);}
    }

    else if(battleMode==6){//勝利message
        if(oneMoveFlg){
            winMessage = [baseEnemyData[0]+" は倒れた。",mypicstock[mypic[0]][0]+" は勝負に勝った!","経験値"+getExperienceAmount+"と"+getCurrencyAmount+"マイルを手にいれた。"];
            oneMoveFlg=false;
        }
        ctx2d.fillStyle=white;
        ctx2d.font="26px "+mainfontName;
        ctx2d.fillText(winMessage[in_lstnum], width*25/100,height*75/100);
    }

    else if(battleMode==7){//戦闘不能後の次のマイピク選択
        ctx2d.font="26px "+mainfontName;
        switch (chgCount){
            case 0:
                ctx2d.fillText(mypicstock[mypic[0]][0]+" は倒れた。",width*25/100,height*75/100);
                break;
            case 1:
                if(BerrorFlg){//errorメッセージ表示
                    popupMsg.push(["ひんしなので選べない!",120,0,0,-1]);
                    BerrorFlg=false;}
                ctx2d.fillText("交代するマイピクを選択してください。", width*25/100,height*75/100);
                for (let i=0; i < mypic.length; i++){
                    if(mypicstock[mypic[i]][2]==0)ctx2d.fillStyle=darkgray2;
                    else ctx2d.fillStyle=white;
                    ctx2d.fillText(mypicstock[mypic[i]][0], width*(40+17*Math.max(0,Math.ceil((i-2)/3)))/100,height*(81+6*(i%3))/100);}
                    make_pointer(width*(38+17*Math.max(0,Math.ceil((loopselect-2)/3)))/100,height*(79.5+6*(loopselect%3))/100,width*(36+17*Math.max(0,Math.ceil((loopselect-2)/3)))/100,height*(77.5+6*(loopselect%3))/100,width*(36+17*Math.max(0,Math.ceil((loopselect-2)/3)))/100,height*(81.5+6*(loopselect%3))/100);
                break;
            case 2:
                ctx2d.fillText(mypicstock[mypic[0]][0]+" 交代だ!",width*25/100,height*75/100);
                ctx2d.fillText("たのんだ "+mypicstock[mypic[loopselect]][0]+"!!", width*25/100,height*83/100);
                break;
        }
    }

    else if(battleMode==8){//敗北message
        if(oneMoveFlg){
            loseMessage = [mypicstock[mypic[0]][0]+" は倒れた。","戦える手持ちのマイピクがいない!!","突然意識が遠のき倒れてしまった..."];
            oneMoveFlg=false;}
        ctx2d.fillStyle=white;
        ctx2d.font="26px "+mainfontName;
        ctx2d.fillText(loseMessage[in_lstnum], width*25/100,height*75/100);
    }
}

function drawPopupMsg(){
    for (var i = 0; i < Math.min(8,popupMsg.length);i++){
        popupMsg[i][1]--;
        if (popupMsg[i][1]<=0){
            popupMsg.splice(i,1);
        } else{
            popupMsg[i][2]++;
            ctx2d.font="10pt " + mainfontName;
            ctx2d.fillStyle="rgba(0,0,0," + Math.min(1,popupMsg[i][1]/popupWindowAniSpeed,popupMsg[i][2]/popupWindowAniSpeed)*0.8 +")";
            ctx2d.fillRect(-20+Math.min(1,popupMsg[i][1]/popupWindowAniSpeed,popupMsg[i][2]/popupWindowAniSpeed)*40,20+40*i,Math.max(250,ctx2d.measureText(popupMsg[i][0]).width+50),35);
            if (isNaN(popupMsg[i][4])){
                if (popupMsg[i][4].substr(0,1)=="*"){
                    if(!isNaN(popupMsg[i][4].substr(1))){
                        ctx2d.drawImage(itemMenuImg[popupMsg[i][4].substr(1)],-20+Math.min(1,popupMsg[i][1]/popupWindowAniSpeed,popupMsg[i][2]/popupWindowAniSpeed)*40+3,20+40*i+3,29,29);
                    }
                }
            } else if(popupMsg[i][4]!=-1){
                ctx2d.fillStyle="rgba(0,0,0," + Math.min(1,popupMsg[i][1]/popupWindowAniSpeed,popupMsg[i][2]/popupWindowAniSpeed) +")";
                ctx2d.fillRect(-20+Math.min(1,popupMsg[i][1]/popupWindowAniSpeed,popupMsg[i][2]/popupWindowAniSpeed)*40+3,20+40*i+3,29,29);
                drawMypic(popupMsg[i][4],-20+Math.min(1,popupMsg[i][1]/popupWindowAniSpeed,popupMsg[i][2]/popupWindowAniSpeed)*40+3,20+40*i+3,29,29,Math.min(1,popupMsg[i][1]/popupWindowAniSpeed,popupMsg[i][2]/popupWindowAniSpeed),0);
            } else{
                ctx2d.fillStyle="rgba(255,255,255," + Math.min(1,popupMsg[i][1]/popupWindowAniSpeed,popupMsg[i][2]/popupWindowAniSpeed) +")";
                ctx2d.fillRect(-20+Math.min(1,popupMsg[i][1]/popupWindowAniSpeed,popupMsg[i][2]/popupWindowAniSpeed)*40+3+13,20+40*i+3+13,3,3);
            }
            ctx2d.font="10pt " + mainfontName;
            ctx2d.fillStyle="rgba(255,255,255," + Math.min(1,popupMsg[i][1]/popupWindowAniSpeed,popupMsg[i][2]/popupWindowAniSpeed) +")";
            ctx2d.fillText(popupMsg[i][0],42-20+Math.min(1,popupMsg[i][1]/popupWindowAniSpeed,popupMsg[i][2]/popupWindowAniSpeed)*40,43+40*i);
        }
    }
}

function battleDrawText(message, limitnum, widthRate, heightRate, gap){
    if(message.length> limitnum){
        ctx2d.fillText(message.substr(0,limitnum), width*widthRate/100, height*heightRate/100);
        ctx2d.fillText(message.substr(limitnum), width*widthRate/100, height*(heightRate+gap)/100);
    }
    else ctx2d.fillText(message,width*widthRate/100,height*heightRate/100);
}