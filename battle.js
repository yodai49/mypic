var battleMode=0;//バトル状態の状態, 0:intro, 1;battle選択, 2:攻撃選択時の処理, 3:アイテム選択時, 4: マイピク選択時, 5: 逃げる選択時, 6:勝利した時, 7:味方が一人やられた時, 8:味方が全員やられ負ける時
var loopmode=0;//battlelMode=1の状態遷移中　0:No選択,1:戦闘,2:アイテム,3:マイピク↓
var loopselect=0;//loop内での現在選択値(0-3)
var lstnum=0;//Messageリスト内の扱うリストを指定
var in_lstnum=0;//各リスト内の出力位置を管理
var encount=false;//敵出現ポインタ
var attackorder=true;//攻撃の順番
var firstSt, secondSt;
var damage;//攻撃のダメージ量(HP基準)
var Acount=0, Acheck=true;//attackcount, 攻撃時のカウンタ, attackcheck,zkey入力に１回だけ作動するように
var chgCount=0;//マイピク交代のカウンタ
var itemCount=0;
var attackMiss=false;
var baseEnemyData;
var oneMoveFlg=false;//1回だけ作動させたい時に使う
var BerrorFlg=false;
var BtopItem=0;
var BwhoUse=0;//アイテムを誰に使用するか
var moneyUpFlg=false, experienceUpFlg=false;//金運の知らせ使用
var bMemory=[0,0,0,0,0];//0:攻撃,1:防御,2:MaxHP,3:素早さ, 4;命中率
var unFightFlg=false;//戦闘不能
var gameoverFlg=false;//敗北
var damageMessageFlg=false;
var getCurrencyAmount, getExperienceAmount;//戦闘後に入手するお金と経験値
var pressureFlg;//特性pressure
var battleAnimationFlg=false;//戦闘開始アニメーション
var battleAnimationCount=0;//短冊カウンタ
var battleAnimationTrans=0;//透明度設定
var battleTransIncrease=true;//透明度増加
var battleFirstAniCount=0;///1個目のアニメーションの回数
var mypicIsDamagedAni=100;//アニメーション用
var enemyIsDamagedAni=100;
var showMypicHP=0,showEnemyHP=0,showMaxEnemyHP=1,showEnemyHPConst=-1;
var EnemyMoveChoice;//敵の技選択
var unEscapeFlg=false;//ボス戦の時に逃げられないように管理するフラグ
var trait4Flg=0, trait9Flg=0;//特性フラグ
var typeMatchFlg;
var shortDpFlg=false;//Dp枯渇フラグ
var DEBUGcount_oneMove=0,DEBUGcount_fieldDraw=0,battleZkeyFlg=0;
var myskillNum=0;
const efWidth=192;
const efHeight=192;
var battleEffectCanvas,drawBattleEffects=[],befctx,battleEffectCanvas;//エフェクト系
var befImg=[],lastEnemySkill;
function getbefX(efNum,aniNum){return (efNum%4)*efWidth*5+efWidth*(aniNum%5)};
function getbefY(efNum,aniNum){return Math.floor(aniNum/5)*efHeight+efHeight*7*Math.floor(efNum/4)};

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
function battleEffectRedraw(mySkills,enemySkills){
    befctx.clearRect(0,0,25*efWidth,14*efHeight);
    for(var i = 0; i < 4;i++){
        befctx.drawImage(befImg[skillData[mySkills[i]][7]],efWidth*5*i,0);
        befctx.drawImage(befImg[skillData[enemySkills[i]][7]],efWidth*5*i,efHeight*7);
    }
}

function battleMain() {
    //character
    if(debugMode==5 && globalTime%6==0) zkey=true;
    ctx2d.fillStyle="rgba(0,0,0,0.6)";
    ctx2d.fillRect(20,160,140,3);
    if(showMypicHP/mypicstock[mypic[0]][3]<0.2){///味方のHP
        ctx2d.fillStyle="rgba(150,0,0,0.9)";
    } else if(showMypicHP/mypicstock[mypic[0]][3]<0.5){
        ctx2d.fillStyle="rgba(200,200,50,0.9)";
    } else{
        ctx2d.fillStyle="rgba(50,200,50,0.9)";
    }
    ctx2d.fillRect(20,160,140*showMypicHP/mypicstock[mypic[0]][3],3);
    if(showEnemyHPConst!=-1){
        ctx2d.fillStyle="rgba(0,0,0,0.6)"; ///敵のHP
        ctx2d.fillRect(600,300,140,3);
        if(showEnemyHP/showMaxEnemyHP<0.2){
            ctx2d.fillStyle="rgba(150,0,0,0.9)";
        } else if(showEnemyHP/showMaxEnemyHP<0.5){
            ctx2d.fillStyle="rgba(200,200,50,0.9)";
        } else{
            ctx2d.fillStyle="rgba(50,200,50,0.9)";
        }
        ctx2d.fillRect(600,300,140*showEnemyHP/showMaxEnemyHP,3);
        if(showEnemyHP<baseEnemyData[2]) showEnemyHP++;
        if(showEnemyHP>baseEnemyData[2]) showEnemyHP--;
    }

    if(showMypicHP<mypicstock[mypic[0]][2]) showMypicHP++;
    if(showMypicHP>mypicstock[mypic[0]][2]) showMypicHP--;
    
    drawMypic(mypic[0],190,130+Math.max(0,Math.sin(globalTime/7)*20-17),180,180,1,0,(mypicIsDamagedAni<=30&& (Math.floor(mypicIsDamagedAni/4)%2)));
    mypicIsDamagedAni++;
    enemyIsDamagedAni++;
    //enemy
    drawEnemy();
    //effects
    for(var i = 0;i < drawBattleEffects.length;i++){
        ctx2d.drawImage(battleEffectCanvas,getbefX(drawBattleEffects[i][0],Math.floor(drawBattleEffects[i][3]/skillEffect[drawBattleEffects[i][0]].slow)),getbefY(drawBattleEffects[i][0],Math.floor(drawBattleEffects[i][3]/skillEffect[drawBattleEffects[i][0]].slow)),192,192,drawBattleEffects[i][1],drawBattleEffects[i][2],192,192);
        drawBattleEffects[i][3]++;
        if(drawBattleEffects[i][3]>skillEffect[drawBattleEffects[i][0]].max*skillEffect[drawBattleEffects[i][0]].slow) drawBattleEffects.splice(i,1);
    }

    //zkey入力時に次のメッセージに進む
    if(zkey &&!modeAnimation&& !battleZkeyFlg && (!battleAnimationCount || battleAnimationCount > 210)){
        if(battleMode==0){
            in_lstnum++;
            if(in_lstnum == BattleMessage[lstnum].length && lstnum==0){
                battleMode=1, in_lstnum=0;}//loopに行く
        } else if(battleMode==1){
            if(loopmode==0) {//No選択
                if(loopselect==0){
                    if(mypicstock[mypic[0]][4] < Math.min(skillData[mypicstock[mypic[0]][8][0]][4], skillData[mypicstock[mypic[0]][8][1]][4],skillData[mypicstock[mypic[0]][8][2]][4], skillData[mypicstock[mypic[0]][8][3]][4])){
                        //悪あがき使用
                        battleMode=2, shortDpFlg=true, Acount=0, Acheck=true, damageMessageFlg=false;}
                    else loopmode=1;//戦う技選択
                }
                else if(loopselect==1)loopmode=2, loopselect=0;//アイテム選択
                else if(loopselect==2)loopmode=3, loopselect=0;//マイピク選択
                else if(loopselect==3)battleMode=5;//逃げる
                else loopmode=loopselect+1, loopselect=0;
            } else if(loopmode==1) {//技実行
                if(mypicstock[mypic[0]][4] < skillData[mypicstock[mypic[0]][8][loopselect]][4]) shortDpFlg=true;//DP不足
                else battleMode=2, Acount=0, Acheck=true, shortDpFlg=false, damageMessageFlg=false;
            } else if(loopmode==2){//アイテム選択
                if(!itemdata[items[loopselect][0]][2] || (loopselect==14 && moneyUpFlg) || (loopselect==15 && experienceUpFlg))BerrorFlg=true;
                else if(items[loopselect][0] == 14 || items[loopselect][0] == 15)battleMode=3, oneMoveFlg=true;//金運の知らせか経験値Up
                else loopmode=4;
            } else if(loopmode==4){
                if(items[loopselect][0]==6 || items[loopselect][0]==7){
                    if(mypicstock[mypic[BwhoUse]][2]!=0) BerrorFlg=true;
                    else battleMode=3, oneMoveFlg=true;}
                else if(mypicstock[mypic[BwhoUse]][2]==0) BerrorFlg=true;
                else battleMode=3, oneMoveFlg=true;//誰に使用するか決める
            } else if(loopmode==3){//マイピク交代
                if(mypicstock[mypic[loopselect]][2]==0) BerrorFlg=true;
                else battleMode=4;
            }
        } else if(battleMode==2){Acheck=true;
            if(oneMoveFlg) battleMode=6;
            else if(unFightFlg) battleMode=7, chgCount=0, loopselect=0, unFightFlg=false;
            else if(gameoverFlg) battleMode=8, chgCount=0, oneMoveFlg=true, gameoverFlg=false;
            else if(Acount==1 && !damageMessageFlg)damageMessageFlg=true, attackMiss=false;
            else if(Acount==1 && damageMessageFlg)Acount++, damageMessageFlg=false;
            else if(Acount==2 && !damageMessageFlg)damageMessageFlg=true, attackMiss=false;
            else if((Acount==2 && damageMessageFlg && trait9Flg == 0) || Acount==3)battleMode=1, Acount=0, loopmode=0,loopselect=0, damageMessageFlg=false, trait9Flg=0;
            else Acount=3, oneMoveFlg=true;
        } else if(battleMode==3){
            if(unFightFlg) battleMode=7, chgCount=0, loopselect=0, unFightFlg=false;
            else if(gameoverFlg) battleMode=8, chgCount=0, oneMoveFlg=true, gameoverFlg=false;
            else if(itemCount==0)itemCount++, oneMoveFlg=true;
            else if(itemCount==1)itemCount++;
            else if((itemCount==2 && trait9Flg==0) || itemCount==3)battleMode=1, itemCount=0, loopmode=0, loopselect=0, BtopItem=0, trait9Flg=0;
            else itemCount=3, oneMoveFlg=true;
        } else if(battleMode==4){
            if(unFightFlg) battleMode=7, chgCount=0, loopselect=0, unFightFlg=false;
            else if(gameoverFlg) battleMode=8, chgCount=0, oneMoveFlg=true, gameoverFlg=false;
            else if(chgCount==0 || chgCount==1)chgCount++, oneMoveFlg=true;
            else if ((chgCount==2 && trait9Flg == 0) || chgCount==3){
                battleMode=1, chgCount=0, loopmode=0, loopselect=0, trait9Flg=0;}
            else chgCount=3, oneMoveFlg=true;
        } else if(battleMode==5){
            if(!attackorder){//逃げれない
                battleMode=1, loopmode=0, loopselect=0;}
            else{//逃げてfieldに遷移
                modeAnimation=1, nextMode=1, battleMode=0, loopmode=0, loopselect=0, lstnum=0, in_lstnum=0;
                stopBattleBGM(),playFieldBGM(myposworld);}
        } else if(battleMode==6){
            in_lstnum++;
        } else if(battleMode==7){
            if (chgCount==1 && mypicstock[mypic[loopselect]][2]==0)BerrorFlg=true;
            else if(chgCount==0 || chgCount==1)chgCount++;
            else if(chgCount==2)chgCount++, oneMoveFlg=true;
        } else if(battleMode==8){
            in_lstnum++;
        }
        zkeySE.play();
        battleZkeyFlg=1;
    }
    if(!zkey) battleZkeyFlg=0;
    
    //////

    //xkey入力:キャンセルに使用
    if(xkey){
        if(battleMode==1 && (loopmode==1 || loopmode==2 || loopmode==3)) loopmode=0, BtopItem=0, loopselect=0;
        else if(battleMode==1 && loopmode==4) loopmode=2, BwhoUse=0;
        xkeySE.play();
        xkey=false;
    }
    //////
    if(battleMode==0){//敵データの保存
        if(oneMoveFlg){
            baseEnemyData=[];
            for(var i = 0;i < enemyData[0].length;i++){
                baseEnemyData[i]=enemyData[encountEnemyNum][i];
            }
            decideEnemyStatis();
            bMemory[0]=mypicstock[mypic[0]][6];
            bMemory[1]=mypicstock[mypic[0]][7];
            bMemory[2]=mypicstock[mypic[0]][3];
            bMemory[3]=mypicstock[mypic[0]][10];//speed
            oneMoveFlg=false;
            battleEffectRedraw(mypicstock[mypic[0]][8],baseEnemyData[8]);
        }
    } else if(battleMode==1){//行動選択(loop)
        if(downkey) {
            if (loopmode==2){
                loopselect=Math.min(items.length-1,loopselect+1);
                if(loopselect-BtopItem==4)BtopItem++;}
            else if(loopmode==3){loopselect=Math.min(mypic.length-1,loopselect+1);}
            else if(loopmode==4){BwhoUse=Math.min(mypic.length-1,BwhoUse+1);}
            else{loopselect=Math.min(3,loopselect+1);}
            crosskeySE.play();
            downkey=false;}
        else if(upkey){
            if(loopmode==4)BwhoUse=Math.max(0,BwhoUse-1);
            else loopselect=Math.max(0,loopselect-1);
            if(loopmode==2 && loopselect<BtopItem)BtopItem--;
            crosskeySE.play();
            upkey=false;}
        else if(rightkey){
            if(loopmode==3){loopselect=Math.min(mypic.length-1,loopselect+3);}
            else if(loopmode==4){BwhoUse=Math.min(mypic.length-1,BwhoUse+3);}
            crosskeySE.play();
            rightkey=false;}
        else if(leftkey){
            if(loopmode==3){loopselect=Math.max(0,loopselect-3);}
            else if(loopmode==4){BwhoUse=Math.max(0,BwhoUse-3);}
            crosskeySE.play();
            leftkey=false;}
    } else if(battleMode==2){//攻撃選択時の処理
        if(Acount==0 && Acheck){
            Acount++;
            hitorder();
            myskillNum=loopselect;
            if(attackorder) {
                firstSt=mypicstock[mypic[0]], secondSt=baseEnemyData;
                if(shortDpFlg) firstSkill=skillData[74], shortDpFlg=false;
                else firstSkill=skillData[firstSt[8][loopselect]];//技データのリストが取れる
                secondSkill=skillData[secondSt[8][battleEnemyMove()]];//敵技がランダムで入る
            }
            else {
                firstSt=baseEnemyData, secondSt=mypicstock[mypic[0]];
                firstSkill=skillData[firstSt[8][battleEnemyMove()]];//敵技がランダムで入る
                if(shortDpFlg) secondSkill = skillData[74], shortDpFlg=false;
                else secondSkill=skillData[secondSt[8][loopselect]];//技データのリストが取れる
            } //先攻後攻のキャラデータが入った
        }
        else if(Acount==1 && Acheck && damageMessageFlg){//先攻
            Acheck=false;
            if(hitcheck(firstSkill[2], secondSt[9], firstSt[11])){//MPの残り判定も追加しないと意見//
                attackMiss=false;
                //命中する　
                damage = calcDamage(firstSt[12], firstSkill[1], firstSt[6], secondSt[7], firstSkill[3], secondSt[15], firstSt, secondSt);
                /////   特性ふくつ   /////
                if(secondSt[11] == 4 && secondSt[2] == secondSt[3] && damage >= secondSt[2]) damage = secondSt[2] - 1, trait4Flg=1;
                else trait4Flg=0;
                ////////////////////////
                changeHPMP(0, (-1)*damage, attackorder,0, 0);//HP変化
                if(!attackorder) { //自分がダメージ食らう
                    skillSE[baseEnemyData[8][lastEnemySkill]].play("playse");
                    drawBattleEffects.push([lastEnemySkill+4,
                        skillEffect[baseEnemyData[8][lastEnemySkill]].x+190+90-efWidth/2,
                        skillEffect[baseEnemyData[8][lastEnemySkill]].y+130+90-efHeight/2,0]);
                    mypicIsDamagedAni=1;
                } else if(attackorder) {//相手がダメージ食らう
                    skillSE[mypicstock[mypic[0]][8][myskillNum]].play("playse");
                    drawBattleEffects.push([myskillNum,
                        skillEffect[mypicstock[mypic[0]][8][myskillNum]].x+enemyImagePos[encountEnemyNum][4]+enemyImagePos[encountEnemyNum][6]/2-efWidth/2,
                        skillEffect[mypicstock[mypic[0]][8][myskillNum]].y+enemyImagePos[encountEnemyNum][5]+enemyImagePos[encountEnemyNum][7]/2-efHeight/2,0]);
                    enemyIsDamagedAni=1;
                }
                //   プレッシャー特性判定   //
                if(secondSt[11]==1) pressureFlg=2;
                else pressureFlg=1;
                //////////////////////////
                changeHPMP(1, (-1)*pressureFlg*firstSkill[4], !attackorder, 0, 0);//MP消費
                if(secondSt[2] == 0){//HP=0
                    if(attackorder){//敵が死んだので勝利
                        oneMoveFlg=true;
                    } else if(mypicstock[mypic[0]][2]==0&&mypicstock[mypic[Math.min(1,mypic.length-1)]][2]==0&&mypicstock[mypic[Math.min(2,mypic.length-1)]][2]==0&&mypicstock[mypic[Math.min(3,mypic.length-1)]][2]==0&&mypicstock[mypic[Math.min(4,mypic.length-1)]][2]==0&&mypicstock[mypic[Math.min(5,mypic.length-1)]][2]==0){
                        //味方6体全員死んだ場合
                        gameoverFlg=true;
                    } else{ //生存残りマイピクがいる
                        unFightFlg=true;}}
            }
            else attackMiss=true;
        }
        //後攻の攻撃
        if(Acount==2 && Acheck && damageMessageFlg){
            Acheck=false;
            lateEnemyAttack();}
        else if(Acount==3){//特性おやつもちの効果実行
            if(oneMoveFlg){
                if(trait9Flg==1){changeHPMP(0,Math.min(Math.floor(mypicstock[mypic[0]][3]*4/100), 1),0,0,0);}
                if(trait9Flg==2){changeHPMP(0,Math.min(Math.floor(baseEnemyData[3]*4/100), 1),1,0,0);}
                if(trait9Flg==3){
                    changeHPMP(0,Math.min(mypicstock[mypic[0]][3]*4/100, 1),0,0,0);
                    changeHPMP(0,Math,min(Math.floor(baseEnemyData[3]*4/100), 1),1,0,0);}
                oneMoveFlg=false;
            }
        }

    } else if(battleMode==3){//アイテム選択時
        //selectmode: 選択しているアイテムのitemでの番号
        //BwhoUse:使用するマイピクのmypicでの番号
        if(oneMoveFlg && itemCount==0){
            //HP,MP回復系
            if(items[loopselect][0] == 0){
                changeHPMP(0,Math.floor(mypicstock[mypic[BwhoUse]][3]*0.3),0,BwhoUse,0);}
            else if(items[loopselect][0] == 1){
                changeHPMP(0,Math.floor(mypicstock[mypic[BwhoUse]][3]*0.6),0,BwhoUse,0);}
            else if(items[loopselect][0] == 2){
                changeHPMP(0,mypicstock[mypic[BwhoUse]][3],0,BwhoUse,0);}
            else if(items[loopselect][0] == 3){
                changeHPMP(0,50,0,BwhoUse,0);}
            else if(items[loopselect][0] == 4){
                changeHPMP(0,100,0,BwhoUse,0);}
            else if(items[loopselect][0] == 5){
                changeHPMP(0,150,0,BwhoUse,0);}
            else if(items[loopselect][0] == 6){
                changeHPMP(0,Math.floor(mypicstock[mypic[BwhoUse]][3]*0.5),0,BwhoUse,0);}
            else if(items[loopselect][0] == 7){
                changeHPMP(0,mypicstock[mypic[BwhoUse]][3],0,BwhoUse,0);}
            else if(items[loopselect][0] == 8){
                changeHPMP(1,30,0,BwhoUse,0);}
            else if(items[loopselect][0] == 9){
                changeHPMP(1,60,0,BwhoUse,0);}

            //強化系
            else if(items[loopselect][0] == 11){
                mypicstock[mypic[BwhoUse]][6] = Math.floor(mypicstock[mypic[BwhoUse]][6]*1.4);}
            else if(items[loopselect][0] == 12){
                mypicstock[mypic[BwhoUse]][7] = Math.floor(mypicstock[mypic[BwhoUse]][7]*1.4);}
            else if(items[loopselect][0] == 13){
                var hpAmount = Math.floor(mypicstock[mypic[BwhoUse]][3]/5);
                mypicstock[mypic[BwhoUse]][3] = Math.floor(mypicstock[mypic[BwhoUse]][3]*1.4);
                mypicstock[mypic[BwhoUse]][2] += hpAmount;}
            //獲得金Up
            else if(items[loopselect][0] == 14) moneyUpFlg=true;
            //獲得経験値Up
            else if(items[loopselect][0] == 15) experienceUpFlg=true;
            //itemcount1での処理に必要
            firstSt=mypicstock[mypic[0]], secondSt=baseEnemyData;
            secondSkill=skillData[secondSt[8][battleEnemyMove()]];
            oneMoveFlg=false;
        }
        else if(itemCount==1){
            if(oneMoveFlg){oneMoveFlg=false;
                consumeItem(loopselect);//アイテム消費
                attackorder = true;//後攻に敵が来るように
                lateEnemyAttack();
            }
        }
        else if(itemCount==3){
            if(oneMoveFlg){
                if(trait9Flg==1){changeHPMP(0,Math.min(Math.floor(mypicstock[mypic[0]][3]*4/100), 1),0,0,0);}
                if(trait9Flg==2){changeHPMP(0,Math.min(Math.floor(baseEnemyData[3]*4/100), 1),1,0,0);}
                if(trait9Flg==3){
                    changeHPMP(0,Math.min(mypicstock[mypic[0]][3]*4/100, 1),0,0,0);
                    changeHPMP(0,Math,min(Math.floor(baseEnemyData[3]*4/100), 1),1,0,0);}
                oneMoveFlg=false;
            }
        }
    } else if(battleMode==4){//マイピク交代
        //マイピク交代処理
        if(chgCount==1){
            if(oneMoveFlg) {oneMoveFlg=false;
                mypicstock[mypic[0]][6]=bMemory[0];
                mypicstock[mypic[0]][7]=bMemory[1];
                mypicstock[mypic[0]][3]=bMemory[2];//バフを元に戻す
                mypic[0]=[mypic[loopselect], mypic[loopselect]=mypic[0]][0]//交換
                battleEffectRedraw(mypicstock[mypic[0]][8],baseEnemyData[8]);//技の画像生成
                showMypicHP=mypicstock[mypic[0]][2];
                bMemory[0]=mypicstock[mypic[0]][6];
                bMemory[1]=mypicstock[mypic[0]][7];
                bMemory[2]=mypicstock[mypic[0]][3];
                firstSt=mypicstock[mypic[0]], secondSt=baseEnemyData;
                secondSkill=skillData[secondSt[8][battleEnemyMove()]];//敵技ランダム
            }
        }
        if(chgCount==2){
            if(oneMoveFlg){oneMoveFlg=false;
            attackorder = true;//後攻に敵が来るように
            lateEnemyAttack();
            }
        }
        else if(chgCount==3){
            if(oneMoveFlg){
                if(trait9Flg==1){changeHPMP(0,Math.min(Math.floor(mypicstock[mypic[0]][3]*4/100), 1),0,0,0);}
                if(trait9Flg==2){changeHPMP(0,Math.min(Math.floor(baseEnemyData[3]*4/100), 1),1,0,0);}
                if(trait9Flg==3){
                    changeHPMP(0,Math.min(mypicstock[mypic[0]][3]*4/100, 1),0,0,0);
                    changeHPMP(0,Math,min(Math.floor(baseEnemyData[3]*4/100), 1),1,0,0);}
                oneMoveFlg=false;
            }
        }
        //敵の攻撃処理
    } else if(battleMode==5){//逃げる選択
        hitorder();
    } else if(battleMode==6){//勝利
        if(oneMoveFlg) {
            getCurrencyAmount=getCurrency(baseEnemyData[12]);
            getExperienceAmount=getEx(baseEnemyData[12]);}
        else {//onemoveflgでwinmessageが読み込まれるのを待ってから実行
            if(in_lstnum == winMessage.length){ //勝利後、フィールドに戻る時の処理はここに追加
                nextMode=1, modeAnimation=1, battleMode=0, loopmode=0, loopselect=0, lstnum=0,in_lstnum=0;
                stopBattleBGM();//bgm停止
                money+=getCurrencyAmount;//獲得金額を追加
                mypicstock[mypic[0]][6]=bMemory[0];
                mypicstock[mypic[0]][7]=bMemory[1];
                mypicstock[mypic[0]][3]=bMemory[2];
                changeEXP(getExperienceAmount, 0);//獲得経験値を戦闘マイピクに追加
                battleGetItem();
                createField();
                playFieldBGM(myposworld);}}
    } else if(battleMode==7){//戦闘不能
        if(downkey && chgCount==1)loopselect=Math.min(mypic.length-1,loopselect+1), crosskeySE.play(), downkey=false;
        else if(upkey && chgCount==1)loopselect=Math.max(0,loopselect-1), crosskeySE.play(), upkey=false;
        else if(rightkey && chgCount==1)loopselect=Math.min(mypic.length-1,loopselect+3), crosskeySE.play(), rightkey=false;
        else if(leftkey && chgCount==1)loopselect=Math.max(0,loopselect-3), crosskeySE.play(), leftkey=false;
        if(chgCount==3){
            if(oneMoveFlg) {oneMoveFlg=false;
                mypicstock[mypic[0]][6]=bMemory[0];
                mypicstock[mypic[0]][7]=bMemory[1];
                mypicstock[mypic[0]][3]=bMemory[2];//バフを元に戻す
                mypic[0]=[mypic[loopselect], mypic[loopselect]=mypic[0]][0]//交換
                battleEffectRedraw(mypicstock[mypic[0]][8],baseEnemyData[8]);//技の画像生成
                bMemory[0]=mypicstock[mypic[0]][6];
                bMemory[1]=mypicstock[mypic[0]][7];
                bMemory[2]=mypicstock[mypic[0]][3];
            }
            battleMode=1, loopmode=0, loopselect=0, chgCount=0;
        }
    } else if(battleMode==8){//敗北
        if(!oneMoveFlg){//onemoveflgでwinmessageが読み込まれるのを待ってから実行
            if(in_lstnum == loseMessage.length){ //勝利後、フィールドに戻る時の処理はここに追加
                nextMode=0, modeAnimation=1, battleMode=0, loopmode=0, loopselect=0, lstnum=0, in_lstnum=0;
                stopBattleBGM();//bgm停止
                mypicstock[mypic[0]][6]=bMemory[0];
                mypicstock[mypic[0]][7]=bMemory[1];
                mypicstock[mypic[0]][3]=bMemory[2];
                createField();}}
    }
}

function hitorder(){//先攻後攻決め: floor(素早さ*(乱数0.95-1.05))
    //     特性しんそく    //////
    var mypicSpecial=1, enemySpacial=1;
    if(battleMode==2){
        if(mypicstock[mypic[0]][11] == 10 && Math.random()<0.3)mypicSpecial=2;
        else if(baseEnemyData[11] == 10 && Math.random()<0.3)enemySpacial=2;}
    ///////////////////////////
    var mypicSpeed = Math.floor(mypicstock[mypic[0]][10]*(0.95+(1.05-0.95)*Math.random())) * mypicSpecial;
    var enemySpeed = Math.floor(baseEnemyData[10]*(0.95+(1.05-0.95)*Math.random())) * enemySpacial;
    if(mypicSpeed>=enemySpeed) {
        if(encountEnemyNum>=4 && encountEnemyNum<=8) attackorder=false, unEscapeFlg=true;//ボス戦の時は逃げられない
        else attackorder=true, unEscapeFlg=false;}//味方の方が速い
    else attackorder=false, unEscapeFlg=false;
}

function hitcheck(my_hitrate, oppLucky, trait){//命中判定: (技の命中率*((200-敵の運)/200))  特性集中は先に反映させる
    //////  特性集中  /////////
    var traitFlg=1;
    if(trait == 5 && Math.random() < 0.5) traitFlg=5/4;
    /////////////////////////
    var hitodds = Math.floor(my_hitrate*((200-infToRange(oppLucky,0,100,30))/200) * traitFlg);
    if(hitodds>=Math.floor(100*Math.random())) return true;
    else return false;
}

function calcDamage(myLevel, skillPower, myAttack, oppDefend, fskill, stype, Attack, Defend){//ダメージ計算: (((レベル∗2/4+2)∗技の威力∗自分の攻撃力/敵の防御力+2)∗タイプ相性∗(乱数0.9−1.1))
    //    特性の効果   ///////
    var specialAttack=1, specialDefend=1;
    if(Attack[11] == 2 && Attack[2] < Attack[3]/5) specialAttack=1.5; //馬鹿力発動
    else if(Attack[11] == 6 && Math.random()<0.2) specialAttack=1.5; //トリッキー発動
    else if(Defend[11] == 3 && Defend[2] > Defend[3]*7/10) specialDefend=1.3;//てっぺき
    else if(Defend[11] == 7 && Defend[2] == Defend[3]) specialDefend=2;//ゆとり
    else if(Attack[11] == 8 && Defend[2] % 10 == 7) specialDefend=1.8; //こだわり
    /////////////////////////
//  return Math.floor(Math.floor(Math.floor(myLevel*2/6+2)* skillPower * myAttack/oppDefend+2) * typeMatch(fskill, stype) * (0.9+(1.1-0.9)*Math.random()));
    typeMatchFlg = typeMatch(fskill, stype);
    return Math.max(0,Math.floor(((Math.pow(myLevel,0.05)/4+2)/3* skillPower * Math.abs((myAttack * specialAttack),0.8)/(oppDefend * specialDefend)) * typeMatchFlg * (0.9+(1.1-0.9)*Math.random())));
}

function typeMatch(fskill, stype){//引数は技属性番号とタイプ番号
    //(1/2): 0-6, 1-2, 1-5, 2-3, 3-1, 3-4, 4-6, 5-6
    if( (fskill == 0 && stype == 6) ||
        (fskill == 1 && (stype == 2 || stype == 5)) ||
        (fskill == 2 && stype == 3) ||
        (fskill == 3 && (stype == 1 || stype == 4)) ||
        (fskill == 4 && stype == 6) ||
        (fskill == 5 && stype == 6)
    ) { ;
        return 1/2}
    //(1): 0-(0,1,2,3,4,5), 1-(0,1,4,6), 2-(0,2,4,5,6), 3-(0,3,5,6), 4-(0,1,2,4,5), 5-(0,2,3,4,5), 6-(1,2,3)
    else if((fskill == 0 && (stype == 0 || stype == 1 || stype == 2 || stype == 3 || stype == 4 || stype == 5)) || 
            (fskill == 1 && (stype == 0 || stype == 1 || stype == 4 || stype == 6)) || 
            (fskill == 2 && (stype == 0 || stype == 2 || stype == 4 || stype == 5 || stype == 6)) || 
            (fskill == 3 && (stype == 0 || stype == 3 || stype == 5 || stype == 6)) ||
            (fskill == 4 && (stype == 0 || stype == 1 || stype == 2 || stype == 4 || stype == 5)) ||
            (fskill == 5 && (stype == 0 || stype == 2 || stype == 3 || stype == 4 || stype == 5)) ||
            (fskill == 6 && (stype == 1 || stype == 2 || stype == 3))
    ) { ;
        return 1}
    //(2): 1-3, 2-1, 3-2, 4-3, 5-1, 6-(0,4,5,6)
    else if((fskill == 1 && stype == 3) ||
            (fskill == 2 && stype == 1) ||
            (fskill == 3 && stype == 2) ||
            (fskill == 4 && stype == 3) ||
            (fskill == 5 && stype == 1) ||
            (fskill == 6 && (stype == 0 || stype == 4 || stype == 5 || stype == 6))
    ) {;
        return 2}
}

function needEx(level){//(レベル)^2.5
    return Math.floor(Math.pow(level, 2.5))
}

function getCurrency(enemylevel){//戦闘後獲得するお金
    if(moneyUpFlg) var itemBonus=1.5
    else var itemBonus=1;
    return Math.floor(Math.pow(enemylevel,0.9)*8*(0.9+(1.1-0.9)*Math.random()*itemBonus));//(level)^0.9*8*(0.9~1.1)
}

function getEx(enemylevel){//戦闘後獲得する経験値
    if(experienceUpFlg) var itemBonus=1.5
    else var itemBonus=1;
    //bossbonusの判定
    return Math.floor(Math.floor(4*Math.pow(enemylevel,1.2)*(0.9+(1.1-0.9)*Math.random()))*itemBonus);//*BossBonus
}

function lateEnemyAttack(){
    if(hitcheck(secondSkill[2], firstSt[9], secondSt[11])){//MPの残り判定も追加しないと意見//
        attackMiss=false;
        //命中する
        damage = calcDamage(secondSt[12], secondSkill[1], secondSt[6], firstSt[7], secondSkill[3], firstSt[15], secondSt, firstSt);
        /////   特性ふくつ   /////
        if(firstSt[11] == 4 && firstSt[2] == firstSt[3] && damage >= firstSt[2]) damage = firstSt[2] - 1, trait4Flg=1;
        else trait4Flg=0;
        ////////////////////////
        changeHPMP(0, (-1)*damage, !attackorder, 0, 0);//HP変化
        if(!attackorder) { //相手がダメージ食らう
            skillSE[mypicstock[mypic[0]][8][myskillNum]].play("playse");
            drawBattleEffects.push([myskillNum,
                enemyImagePos[encountEnemyNum][4]+enemyImagePos[encountEnemyNum][6]/2-efWidth/2,
                enemyImagePos[encountEnemyNum][5]+enemyImagePos[encountEnemyNum][7]/2-efHeight/2,0]);
            enemyIsDamagedAni=1;
        } else if(attackorder) {//自分がダメージ食らう
            skillSE[baseEnemyData[8][lastEnemySkill]].play("playse");
            drawBattleEffects.push([lastEnemySkill+4,
                190+90-efWidth/2,
                130+90-efHeight/2,0]);
            mypicIsDamagedAni=1;
        }
        //   プレッシャー特性判定    //
        if(firstSt[11]==1) pressureFlg=2;
        else pressureFlg=1;
        ///////////////////////////
        changeHPMP(1, (-1)*pressureFlg*secondSkill[4], attackorder, 0, 0);//MP消費
        if(firstSt[2] == 0){//HP=0
            if(!attackorder){//敵が死んだので勝利
                oneMoveFlg=true;
            } else if(mypicstock[mypic[0]][2]==0&&mypicstock[mypic[Math.min(1,mypic.length-1)]][2]==0&&mypicstock[mypic[Math.min(2,mypic.length-1)]][2]==0&&mypicstock[mypic[Math.min(3,mypic.length-1)]][2]==0&&mypicstock[mypic[Math.min(4,mypic.length-1)]][2]==0&&mypicstock[mypic[Math.min(5,mypic.length-1)]][2]==0){
                //味方6体全員死んだ場合
                gameoverFlg=true;
            } else{ //生存残りマイピクがいる
                unFightFlg=true;
            }
        }
    }
    else{
        //攻撃が外れた
        attackMiss=true;
    }
    /////   特性　おやつもち   /////
    //  0:両者なし, 1:味方のみ, 2:敵のみ, 3:両方あり
    if(mypicstock[mypic[0]][11] == 9) trait9Flg++;
    if(baseEnemyData[11] == 9) trait9Flg +=2;
    /////////////////////////////
}

function battleStartAnimation(){
    mypicIsDamagedAni=100;
    enemyIsDamagedAni=100;
    showMypicHP=mypicstock[mypic[0]][2];
    if(battleAnimationCount==0){
        if(battleFirstAniCount==0 && battleAnimationTrans==0 && battleTransIncrease) stopFieldBGM(),playBattleBGM(encountEnemyNum);
        if(battleTransIncrease)battleAnimationTrans += 0.1;
        else battleAnimationTrans -= 0.1;
        ctx2d.fillStyle="rgba(0,0,0,"+battleAnimationTrans+")";
        ctx2d.fillRect(0,0,width,height);
        if(battleAnimationTrans>1)battleTransIncrease=false;
        else if(battleAnimationTrans<0)battleTransIncrease=true, battleFirstAniCount++;
    }
    if(battleFirstAniCount==2)battleAnimationCount++;//animation2個目への移動
    if(battleAnimationCount!=0 && battleAnimationCount<=122){
        ctx2d.fillStyle=black;
        for(let i=0; i<45; i++){
            if(i%2==0) ctx2d.fillRect(0,12*i,width*battleAnimationCount/60,12);//偶数左から
            else ctx2d.fillRect(width-battleAnimationCount*width/60,12*i,width*battleAnimationCount/60,12);//奇数右から
        } battleAnimationCount++;
    }
    else if(battleAnimationCount>122 && battleAnimationCount<=201){//fadein animation
        if(myposworld>=10 && myposworld<=19 || myposworld == 3)ctx2d.fillStyle=pastleGreen;
        else if(myposworld>=20 && myposworld<=29)ctx2d.fillStyle=cavecol;
        else if(myposworld>=30 && myposworld<=39)ctx2d.fillStyle=remainscol;
        else if(myposworld>=40 && myposworld<=49)ctx2d.fillStyle=desertcol;
        ctx2d.fillRect(0,0,width,height);
        //円形グラデーション
        var gradation = ctx2d.createRadialGradient(width/2, height/2, 5, width/2, height/2, 5+8*(battleAnimationCount-122));
        //色
        gradation.addColorStop(0, 'white');
        gradation.addColorStop(0.5, white_trans1);
        gradation.addColorStop(1, white_trans2);
        ctx2d.fillStyle = gradation;
        //円
        ctx2d.beginPath();
        ctx2d.arc(width/2, height/2, 5+8*(battleAnimationCount-122), 0, 2 * Math.PI, false);
        ctx2d.fill();// 描画

        //下のメッセージ部分表示
        ctx2d.fillStyle=black;
        ctx2d.fillRect(0,height*(100 - Math.min(35, Math.floor((battleAnimationCount-122)/1.2)))/100,width, height*Math.min(35, Math.floor((battleAnimationCount-122)/1.2))/100);
        //if(battleAnimationCount==152) {
          //  nextMode=2, modeAnimation=1, onMessage=true,battleLaunchFlg=1, encount=0, oneMoveFlg=true;}//バトル開始の処理
        battleAnimationCount++;
        if(battleAnimationCount>201) {
            mode=2, battleLaunchFlg=1, encount=0, battleMode=0, oneMoveFlg=true, onMessage=true;
        }
    }
    else if(battleAnimationCount > 201){
        //if(battleAnimationCount==220) mode=2, battleLaunchFlg=1, encount=0, battleMode=0, oneMoveFlg=true, onMessage=true,in_lstnum=0;
        ctx2d.fillStyle="rgba(255,255,255,"+((302-battleAnimationCount)/100)+")";
        ctx2d.fillRect(0,0,width,height*65/100);
        ctx2d.fillStyle="rgba(0,0,0,"+((302-battleAnimationCount)/100)+")";
        ctx2d.fillRect(0,height*65/100,width,height*35/100);
        if(battleAnimationCount==302){
            battleAnimationFlg=false;
            battleAnimationCount=0;
            battleAnimationTrans=0;
            battleFirstAniCount=0;}
    }
}

function decideEnemyStatis(){//敵のランダムステータスを確定させる
    //HP,攻撃,防御,レベル
    var fluctuationValue=Math.floor(Math.random()*2*baseEnemyData[12][1]) - baseEnemyData[12][1];//変動値決定
    baseEnemyData[12] = baseEnemyData[12][0] + fluctuationValue;//レベル
    baseEnemyData[3] = baseEnemyData[3][0] + fluctuationValue;//MaxHP
    baseEnemyData[2] = baseEnemyData[3];
    showEnemyHP=baseEnemyData[2];
    showEnemyHPConst=baseEnemyData[2];
    showMaxEnemyHP=baseEnemyData[3];
    baseEnemyData[6] = baseEnemyData[6][0] + fluctuationValue;//攻撃
    baseEnemyData[7] = baseEnemyData[7][0] + fluctuationValue;//防御
}

function drawEnemy(){//敵の画像表示
    var drawEnemySin=Math.max(0,Math.cos(globalTime/7)*23-15); //ピクピク 未使用
    if((enemyIsDamagedAni>30 && showEnemyHP) || (enemyIsDamagedAni<=30 && (Math.floor(enemyIsDamagedAni/4)%2))){
        ctx2d.drawImage(enemyImg[encountEnemyNum],
            enemyImagePos[encountEnemyNum][0],
            enemyImagePos[encountEnemyNum][1]+drawEnemySin,
            enemyImagePos[encountEnemyNum][2],
            enemyImagePos[encountEnemyNum][3],
            enemyImagePos[encountEnemyNum][4],
            enemyImagePos[encountEnemyNum][5],
            enemyImagePos[encountEnemyNum][6],
            enemyImagePos[encountEnemyNum][7]);
    }
}

function battleGetItem(){//戦闘後のアイテム入手
    //1-3番目のアイテムが獲得できるか確率で決める
    for (let i=0; i<=2; i++){
        var battleItemRate = Math.floor(100*Math.random());//0-99
        if(baseEnemyData[17+i*2] > battleItemRate){//アイテム入手
            getItem(baseEnemyData[16+i*2]);
            eventSE.play();
            popupMsg.push([itemdata[baseEnemyData[16+i*2]][0]+"を手に入れた!",120,0,0,"*"+baseEnemyData[16+i*2]]);//windoemessage
        }
    }
    
}

function battleEnemyMove(){//敵の攻撃ムーブ
    EnemyMoveChoice = Math.floor(100 * Math.random());
    var tempEnemyMove;
    if(EnemyMoveChoice>=0 && EnemyMoveChoice<=30) tempEnemyMove= 0
    else if(EnemyMoveChoice> 30 && EnemyMoveChoice<=65) tempEnemyMove= 1
    else if(EnemyMoveChoice> 65 && EnemyMoveChoice<=90) tempEnemyMove= 2
    else if(EnemyMoveChoice> 90 && EnemyMoveChoice<=100) tempEnemyMove= 3
    lastEnemySkill=tempEnemyMove;
    return tempEnemyMove;
}
