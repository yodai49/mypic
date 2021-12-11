var battleMode=0;//バトル状態の状態, 0:intro
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
var bMemory=[0,0,0];//0:攻撃,1:防御,2:MaxHP
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
var showMypicHP=0,showEnemyHP=0;

function battleMain() {
    //character
    ctx2d.fillStyle=blue;
    ctx2d.fillStyle="rgba(150,0,0,0.6)";
    ctx2d.fillRect(20,160,140,3);
    if(showMypicHP/mypicstock[mypic[0]][3]<0.2){///味方のHP
        ctx2d.fillStyle="rgba(150,0,0,0.9)";
    } else if(showMypicHP/mypicstock[mypic[0]][3]<0.5){
        ctx2d.fillStyle="rgba(200,200,50,0.9)";
    } else{
        ctx2d.fillStyle="rgba(50,200,50,0.9)";
    }
    ctx2d.fillRect(20,160,140*showMypicHP/mypicstock[mypic[0]][3],3);
/*
    ctx2d.fillStyle="rgba(150,0,0,0.6)"; ///敵のHP
    ctx2d.fillRect(600,300,140,3);
    if(showEnemyHP/baseEnemyData[3]<0.2){
        ctx2d.fillStyle="rgba(150,0,0,0.9)";
    } else if(showEnemyHP/baseEnemyData[3]<0.5){
        ctx2d.fillStyle="rgba(200,200,50,0.9)";
    } else{
        ctx2d.fillStyle="rgba(50,200,50,0.9)";
    }
    ctx2d.fillRect(600,300,140*showEnemyHP/baseEnemyData[3],3);*/

    if(showMypicHP<mypicstock[mypic[0]][2]) showMypicHP++;
    if(showMypicHP>mypicstock[mypic[0]][2]) showMypicHP--;
    /*
    if(showEnemyHP<baseEnemyData[2]) showEnemyHP++;
    if(showEnemyHP>baseEnemyData[2]) showEnemyHP--;*/

    drawMypic(0,190,130+Math.max(0,Math.sin(globalTime/7)*20-17),180,180,1,0,(mypicIsDamagedAni<=30&& (Math.floor(mypicIsDamagedAni/4)%2)));
    mypicIsDamagedAni++;
    enemyIsDamagedAni++;
    //enemy
    drawEnemy();
    if(!(enemyIsDamagedAni<=30&& (Math.floor(enemyIsDamagedAni/4)%2))){
        ctx2d.fillStyle="rgba(150,0,0,1)";
    }

    //stage名
    ctx2d.setTransform(1,0,-0.5,1,0,0);
    ctx2d.fillStyle=black;
    ctx2d.fillRect(width*0/100,height*5/100,width*30/100,height*10/100);
    ctx2d.setTransform(1,0,0,1,0,0);

    //ctx2d.fillStyle=white;
    //ctx2d.fillRect(150,150,100,20);

    //zkey入力時に次のメッセージに進む
    if(zkey){
        if(battleMode==0){
            in_lstnum++;
            if(in_lstnum == BattleMessage[lstnum].length && lstnum==0){
                battleMode=1, in_lstnum=0;}//loopに行く
        } else if(battleMode==1){
            if(loopmode==0) {//No選択
                if(loopselect==0)loopmode=1;//戦う技選択
                else if(loopselect==1)loopmode=2, loopselect=0;//アイテム選択
                else if(loopselect==2)loopmode=3, loopselect=0;//マイピク選択
                else if(loopselect==3)battleMode=5;//逃げる
                else loopmode=loopselect+1, loopselect=0;
            } else if(loopmode==1) {//技実行
                battleMode=2, Acount=0, Acheck=true;
            } else if(loopmode==2){//アイテム選択
                if(!itemdata[loopselect][2] || (loopselect==14 && moneyUpFlg) || (loopselect==15 && experienceUpFlg))BerrorFlg=true;
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
            else if(Acount==2 && damageMessageFlg)Acount=99, damageMessageFlg=false;
        } else if(battleMode==3){
            if(unFightFlg) battleMode=7, chgCount=0, loopselect=0, unFightFlg=false;
            else if(gameoverFlg) battleMode=8, chgCount=0, oneMoveFlg=true, gameoverFlg=false;
            else if(itemCount==0 || itemCount==1)itemCount++, oneMoveFlg=true;
            else if(itemCount==2)battleMode=1, itemCount=0, loopmode=0, loopselect=0, BtopItem=0;;
        } else if(battleMode==4){
            if(unFightFlg) battleMode=7, chgCount=0, loopselect=0, unFightFlg=false;
            else if(gameoverFlg) battleMode=8, chgCount=0, oneMoveFlg=true, gameoverFlg=false;
            else if(chgCount==0 || chgCount==1)chgCount++, oneMoveFlg=true;
            else if (chgCount==2){
                battleMode=1, chgCount=0, loopmode=0, loopselect=0;
            }
        } else if(battleMode==5){
            if(!attackorder){//逃げれない
                battleMode=1, loopmode=0, loopselect=0;}
            else{//逃げてfieldに遷移
                modeAnimation=1, nextMode=1, battleMode=0, loopmode=0, loopselect=0, lstnum=0, in_lstnum=0;
                normalBattleBgm.stop(),playFieldBGM(myposworld);}
        } else if(battleMode==6){
            in_lstnum++;
        } else if(battleMode==7){
            if (chgCount==1 && mypicstock[mypic[loopselect]][2]==0)BerrorFlg=true;
            else if(chgCount==0 || chgCount==1)chgCount++;
            else if(chgCount==2)chgCount++, oneMoveFlg=true;
        } else if(battleMode==8){
            in_lstnum++;
        }
        zkey2SE.play();
        zkey=false;
    }
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
//            showEnemyHP=baseEnemyData[2];
            decideEnemyStatis();
            bMemory[0]=mypicstock[mypic[0]][6];
            bMemory[1]=mypicstock[mypic[0]][7];
            bMemory[2]=mypicstock[mypic[0]][3];
            oneMoveFlg=false;
        }
    } else if(battleMode==1){//行動選択(loop)
        if(downkey) {
            if (loopmode==2){
                loopselect=Math.min(items.length-1,loopselect+1);
                if(loopselect-BtopItem==5)BtopItem++;}
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
            if(attackorder) firstSt=mypicstock[mypic[0]], secondSt=baseEnemyData;
            else firstSt=baseEnemyData, secondSt=mypicstock[mypic[0]];
            //先攻後攻のキャラデータが入った

            firstSkill=skillData[firstSt[8][loopselect]];//技データのリストが取れる
            secondSkill=skillData[secondSt[8][loopselect]];//技データのリストが取れる
        }
        else if(Acount==1 && Acheck && damageMessageFlg){//先攻
            Acheck=false;
            if(hitcheck(firstSkill[2], secondSt[9], firstSt[11])){//MPの残り判定も追加しないと意見//
                attackMiss=false;
                //命中する　
                damage = calcDamage(firstSt[12], firstSkill[1], firstSt[6], secondSt[7], firstSkill[3], secondSt[15]);
                changeHPMP(0, (-1)*damage, attackorder,0, 0);//HP変化
                if(!attackorder) mypicIsDamagedAni=1;
                if(attackorder) enemyIsDamagedAni=1;
                //プレッシャー特性判定
                if(secondSt[11]==1) pressureFlg=2;
                else pressureFlg=1;
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
        if(Acount==99)battleMode=1, Acount=0, loopmode=0,loopselect=0;//行動選択に戻る

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
                changeHPMP(0,mypicstock[mypic[BwhoUse]][3],BwhoUse,0);}
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
            consumeItem(loopselect);//アイテム消費
            //itemcount1での処理に必要
            firstSt=mypicstock[mypic[0]], secondSt=baseEnemyData;
            secondSkill=skillData[secondSt[8][2]];
            oneMoveFlg=false;
        }
        else if(itemCount==1){
            if(oneMoveFlg){oneMoveFlg=false;
                lateEnemyAttack();
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
                bMemory[0]=mypicstock[mypic[0]][6];
                bMemory[1]=mypicstock[mypic[0]][7];
                bMemory[2]=mypicstock[mypic[0]][3];
                firstSt=mypicstock[mypic[0]], secondSt=baseEnemyData;
                secondSkill=skillData[secondSt[8][2]];//技データのリストが取れる
            }
        }
        if(chgCount==2){
            if(oneMoveFlg){oneMoveFlg=false;
            lateEnemyAttack();
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
                normalBattleBgm.stop();//bgm停止
                money+=getCurrencyAmount;//獲得金額を追加
                mypicstock[mypic[0]][6]=bMemory[0];
                mypicstock[mypic[0]][7]=bMemory[1];
                mypicstock[mypic[0]][3]=bMemory[2];
                changeEXP(getExperienceAmount, 0);//獲得経験値を戦闘マイピクに追加
                fieldReDrawFlg=1;
                playFieldBGM(myposworld);}}
    } else if(battleMode==7){//戦闘不能
        if(downkey && chgCount==1)loopselect=Math.min(mypic.length-1,loopselect+1), downkey=false;
        else if(upkey && chgCount==1)loopselect=Math.max(0,loopselect-1), upkey=false;
        else if(rightkey && chgCount==1)loopselect=Math.min(mypic.length-1,loopselect+3), rightkey=false;
        else if(leftkey && chgCount==1)loopselect=Math.max(0,loopselect-3), leftkey=false;
        if(chgCount==3){
            if(oneMoveFlg) {oneMoveFlg=false;
                mypicstock[mypic[0]][6]=bMemory[0];
                mypicstock[mypic[0]][7]=bMemory[1];
                mypicstock[mypic[0]][3]=bMemory[2];//バフを元に戻す
                mypic[0]=[mypic[loopselect], mypic[loopselect]=mypic[0]][0]//交換
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
                normalBattleBgm.stop();//bgm停止
                mypicstock[mypic[0]][6]=bMemory[0];
                mypicstock[mypic[0]][7]=bMemory[1];
                mypicstock[mypic[0]][3]=bMemory[2];
                fieldReDrawFlg=1;}}
    }
}

function hitorder(){//先攻後攻決め: floor(素早さ*(乱数0.95-1.05))
    var mypicSpeed = Math.floor(mypicstock[mypic[0]][10]*(0.95+(1.05-0.95)*Math.random()));
    var enemySpeed = Math.floor(baseEnemyData[10]*(0.95+(1.05-0.95)*Math.random()));
    if(mypicSpeed>=enemySpeed) attackorder=true;//味方の方が速い
    else attackorder=false;
}

function hitcount(){//攻撃回数: Hitcount=((自分の素早さ)/(敵の素早さ)*16/10)
    if(attackorder) return Math.floor(mypicstock[mypic[0]][10]/enemySpeed*16/10);
    else return Math.floor(enemySpeed/mypicstock[mypic[0]][10]*16/10);
}

function hitcheck(my_hitrate, oppLucky, my_trate){//命中判定: (技の命中率*((200-敵の運)/200)*特性(集中))
    if(my_trate == 5)concentrateFlg=5/4;
    else concentrateFlg=1;
    var hitodds = Math.floor(my_hitrate*((200-infToRange(oppLucky,0,100,30))/200)*concentrateFlg);
    if(hitodds>=Math.floor(100*Math.random())) return true;
    else return false;
}

function calcDamage(myLevel, skillPower, myAttack, oppDefend, fskill, stype){//ダメージ計算: (((レベル∗2/4+2)∗技の威力∗自分の攻撃力/敵の防御力+2)∗タイプ相性∗(乱数0.9−1.1))
//    return Math.floor(Math.floor(Math.floor(myLevel*2/6+2)* skillPower * myAttack/oppDefend+2) * typeMatch(fskill, stype) * (0.9+(1.1-0.9)*Math.random()));
    return Math.max(0,Math.floor(((Math.pow(myLevel,0.2)*20/6+2)* skillPower * Math.abs(myAttack,0.5)/oppDefend) * typeMatch(fskill, stype) * (0.9+(1.1-0.9)*Math.random())));
}

function traitEffect(){//特性によるダメージ変化, 

}

function typeMatch(fskill, stype){//引数は技属性番号とタイプ番号
    //(1/2): 0-6, 1-2, 1-5, 2-3, 3-1, 3-4, 4-6, 5-6
    if( (fskill == 0 && stype == 6) ||
        (fskill == 1 && (stype == 2 || stype == 5)) ||
        (fskill == 2 && stype == 3) ||
        (fskill == 3 && (stype == 1 || stype == 4)) ||
        (fskill == 4 && stype == 6) ||
        (fskill == 5 && stype == 6)
    ) return 1/2
    //(1): 0-(0,1,2,3,4,5), 1-(0,1,4,6), 2-(0,2,4,5,6), 3-(0,3,5,6), 4-(0,1,2,4,5), 5-(0,2,3,4,5), 6-(1,2,3)
    else if((fskill == 0 && (stype == 0 || stype == 1 || stype == 2 || stype == 3 || stype == 4 || stype == 5)) || 
            (fskill == 1 && (stype == 0 || stype == 1 || stype == 4 || stype == 6)) || 
            (fskill == 2 && (stype == 0 || stype == 2 || stype == 4 || stype == 5 || stype == 6)) || 
            (fskill == 3 && (stype == 0 || stype == 3 || stype == 5 || stype == 6)) ||
            (fskill == 4 && (stype == 0 || stype == 1 || stype == 2 || stype == 4 || stype == 5)) ||
            (fskill == 5 && (stype == 0 || stype == 2 || stype == 3 || stype == 4 || stype == 5)) ||
            (fskill == 6 && (stype == 1 || stype == 2 || stype == 3))
    ) return 1
    //(2): 1-3, 2-1, 3-2, 4-3, 5-1, 6-(0,4,5,6)
    else if((fskill == 1 && stype == 3) ||
            (fskill == 2 && stype == 1) ||
            (fskill == 3 && stype == 2) ||
            (fskill == 4 && stype == 3) ||
            (fskill == 5 && stype == 1) ||
            (fskill == 6 && (stype == 0 || stype == 4 || stype == 5 || stype == 6))
    ) return 2
}

function needEx(level){//(レベル)^2.5
    return Math.floor(Math.pow(level, 2.5))
}

function getCurrency(enemylevel){//戦闘後獲得するお金
    if(moneyUpFlg) var itemBonus=1.5
    else var itemBonus=1;
    return Math.floor(Math.pow(enemylevel,1.5)*(0.9+(1.1-0.9)*Math.random()*itemBonus));//(level)^1.5*(0.9~1.1)
}

function getEx(enemylevel){//戦闘後獲得する経験値
    if(experienceUpFlg) var itemBonus=1.5
    else var itemBonus=1;
    //bossbonusの判定
    return Math.floor(Math.floor(5*Math.pow(enemylevel,1.2)*(0.9+(1.1-0.9)*Math.random()))*itemBonus);//*BossBonus
}

function lateEnemyAttack(){
    if(hitcheck(secondSkill[2], firstSt[9], secondSt[11])){//MPの残り判定も追加しないと意見//
        attackMiss=false;
        //命中する
        damage = calcDamage(secondSt[12], secondSkill[1], secondSt[6], firstSt[7], secondSkill[3], firstSt[15]);
        changeHPMP(0, (-1)*damage, !attackorder, 0, 0);//HP変化
        if(!attackorder) mypicIsDamagedAni=1;
        if(attackorder) enemyIsDamagedAni=1;
        //プレッシャー特性判定
        if(firstSt[11]==1) pressureFlg=2;
        else pressureFlg=1;
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
}

function battleStartAnimation(){
    mypicIsDamagedAni=100;
    enemyIsDamagedAni=100;
    showMypicHP=mypicstock[mypic[0]][2];
    if(battleAnimationCount==0){
        if(battleFirstAniCount==0 && battleAnimationTrans==0 && battleTransIncrease) stopFieldBGM(),normalBattleBgm.play();
        if(battleTransIncrease)battleAnimationTrans += 0.1;
        else battleAnimationTrans -= 0.1;
        ctx2d.fillStyle="rgba(0,0,0,"+battleAnimationTrans+")";
        ctx2d.fillRect(0,0,width,height);
        if(battleAnimationTrans>1)battleTransIncrease=false;
        else if(battleAnimationTrans<0)battleTransIncrease=true, battleFirstAniCount++;
    }
    if(battleFirstAniCount==2)battleAnimationCount++;//animation2個目への移動
    if(battleAnimationCount!=0){
        ctx2d.fillStyle=black;
        for(let i=0; i<45; i++){
            if(i%2==0) ctx2d.fillRect(0,12*i,width*battleAnimationCount/60,12);//偶数左から
            else ctx2d.fillRect(width-battleAnimationCount*width/60,12*i,width*battleAnimationCount/60,12);//奇数右から
        } battleAnimationCount++;

        if(battleAnimationCount==72) {
            nextMode=2, modeAnimation=1, onMessage=true,battleLaunchFlg=1, encount=0, oneMoveFlg=true;}//バトル開始の処理
        if(battleAnimationCount>121) {
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
    baseEnemyData[3] = baseEnemyData[3][0] + fluctuationValue*baseEnemyData[3][1];//MaxHP
    baseEnemyData[2] = baseEnemyData[3];
    baseEnemyData[6] = baseEnemyData[6][0] + fluctuationValue*baseEnemyData[6][1];//攻撃
    baseEnemyData[7] = baseEnemyData[7][0] + fluctuationValue*baseEnemyData[7][1];//防御
}

function drawEnemy(){//敵の画像表示
    const enemyImg=new Image();//enemy
    switch(encountEnemyNum){
        case 4://lastboss
            enemyImg.src="./imgs/enemyImgs/lastBoss.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,1048,1860,width*67/100,height*5/100,width*14/100,height*25*3/2/100);};
            break;
        case 5://forestBoss
            enemyImg.src="./imgs/enemyImgs/forestBoss.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,2000,2200,width*64/100,height*6/100,width*22/100,height*24*3/2/100);};
            break;
        case 6://caveBoss
            enemyImg.src="./imgs/enemyImgs/caveBoss.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,2000,2100,width*64/100,height*6/100,width*23/100,height*24*3/2/100);};
            break;
        case 7://remainsBoss
            enemyImg.src="./imgs/enemyImgs/remainsBoss.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,1826,1380,width*58/100,height*9/100,width*29/100,height*20*3/2/100);};
            break;
        case 8://desertBoss
            enemyImg.src="./imgs/enemyImgs/desertBoss.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,1410,1320,width*63/100,height*5/100,width*26/100,height*24*3/2/100);};
            break;
        case 9://normal1
            enemyImg.src="./imgs/enemyImgs/normal1.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,800,800,width*63/100,height*3/100,width*25/100,height*25*3/2/100);};
            break;
        case 10://normal2
            enemyImg.src="./imgs/enemyImgs/forestNormal2.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,1500,1131,width*61/100,height*12/100,width*25/100,height*18*3/2/100);};
            break;
        case 11://forestbase1
            enemyImg.src="./imgs/enemyImgs/forest1.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,1424,1928,width*66/100,height*6/100,width*16/100,height*22*3/2/100);};
            break;
        case 12://forestbase2
            enemyImg.src="./imgs/enemyImgs/forest2.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,1647,1770,width*66/100,height*7/100,width*16/100,height*20*3/2/100);};
            break;
        case 13://forestspeed
            enemyImg.src="./imgs/enemyImgs/forest3.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,2000,1796,width*63/100,height*7/100,width*25/100,height*20*3/2/100);};
            break;
        case 14://forestattack
            enemyImg.src="./imgs/enemyImgs/forest4.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,1791,1929,width*66/100,height*7/100,width*19/100,height*22*3/2/100);};
            break;
        case 15://foresttank
            enemyImg.src="./imgs/enemyImgs/forest5.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,1188,1129,width*60/100,height*6/100,width*26/100,height*23*3/2/100);};
            break;
        case 16://forestrare
            enemyImg.src="./imgs/enemyImgs/forestRare.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,2000,2000,width*62/100,height*4/100,width*25/100,height*25*3/2/100);};
            break;
        case 17://forestsuperrare
            enemyImg.src="./imgs/enemyImgs/forestSuperRare.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,2000,1926,width*62/100,height*4/100,width*26/100,height*25*3/2/100);};
            break;
        case 18://forestwater1
            enemyImg.src="./imgs/enemyImgs/waterSuperRare.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,1753,2000,width*64/100,height*3/100,width*20/100,height*26*3/2/100);};
            break;
        case 19://normal1
            enemyImg.src="./imgs/enemyImgs/normal1.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,800,800,width*63/100,height*3/100,width*25/100,height*25*3/2/100);};
            break;
        case 20://normal2
            enemyImg.src="./imgs/enemyImgs/caveNormal2.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,1500,1131,width*61/100,height*12/100,width*25/100,height*18*3/2/100);};
            break;
        case 21://cavebase1
            enemyImg.src="./imgs/enemyImgs/cave1.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,800,800,width*62/100,height*3/100,width*25/100,height*25*3/2/100);};
            break;
        case 22://cavebase2
            enemyImg.src="./imgs/enemyImgs/cave2.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,1574,1776,width*66/100,height*7/100,width*18/100,height*21*3/2/100);};
            break;
        case 23://cavespeed
            enemyImg.src="./imgs/enemyImgs/cave3.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,1584,1695,width*65/100,height*8/100,width*20/100,height*22*3/2/100);};
            break;
        case 24://cavedefend
            enemyImg.src="./imgs/enemyImgs/cave4.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,732,1839,width*70/100,height*6/100,width*10/100,height*23*3/2/100);};
            break;
        case 25://cavetank
            enemyImg.src="./imgs/enemyImgs/cave5.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,1791,1929,width*65/100,height*5/100,width*19/100,height*22*3/2/100);};
            break;
        case 26://caverare
            enemyImg.src="./imgs/enemyImgs/caveRare.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,2000,2000,width*62/100,height*4/100,width*25/100,height*25*3/2/100);};
            break;
        case 27://cavesuperrare
            enemyImg.src="./imgs/enemyImgs/caveSuperRare.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,3326,3714,width*65/100,height*5/100,width*21/100,height*24*3/2/100);};
            break;
        case 28://cavewater2
            enemyImg.src="./imgs/enemyImgs/waterSuperRare.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,1753,2000,width*64/100,height*3/100,width*20/100,height*26*3/2/100);};
            break;
        case 29://normal1
            enemyImg.src="./imgs/enemyImgs/normal1.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,800,800,width*63/100,height*3/100,width*25/100,height*25*3/2/100);};
            break;
        case 30://normal2
            enemyImg.src="./imgs/enemyImgs/remainsNormal2.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,1500,1131,width*61/100,height*12/100,width*25/100,height*18*3/2/100);};
            break;
        case 31://remainsbase1
            enemyImg.src="./imgs/enemyImgs/remains1.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,800,800,width*61/100,height*4/100,width*27/100,height*27*3/2/100);};
            break;
        case 32://remainsbase2
            enemyImg.src="./imgs/enemyImgs/remains2.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,800,800,width*60/100,height*6/100,width*27/100,height*27*3/2/100);};
            break;
        case 33://remainsspeed
            enemyImg.src="./imgs/enemyImgs/remains3.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,800,800,width*61/100,height*6/100,width*27/100,height*27*3/2/100);};
            break;
        case 34://remainsattack
            enemyImg.src="./imgs/enemyImgs/remains4.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,800,800,width*61/100,height*2/100,width*25/100,height*25*3/2/100);};
            break;
        case 35://remainstank
            enemyImg.src="./imgs/enemyImgs/remains5.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,696,1140,width*66/100,height*4/100,width*15/100,height*26*3/2/100);};
            break;
        case 36://remainsrare
            enemyImg.src="./imgs/enemyImgs/remainsRare.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,2000,2000,width*62/100,height*4/100,width*25/100,height*25*3/2/100);};
            break;
        case 37://remainssuperrare
            enemyImg.src="./imgs/enemyImgs/remainsSuperRare.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,1416,1867,width*64/100,height*2/100,width*21/100,height*27*3/2/100);};
            break;
        case 38://remainswater3
            enemyImg.src="./imgs/enemyImgs/waterSuperRare.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,1753,2000,width*64/100,height*3/100,width*20/100,height*26*3/2/100);};
            break;
        case 39://normal1
            enemyImg.src="./imgs/enemyImgs/normal1.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,800,800,width*63/100,height*3/100,width*25/100,height*25*3/2/100);};
            break;
        case 40://normal2
            enemyImg.src="./imgs/enemyImgs/desertNormal2.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,1500,1131,width*61/100,height*12/100,width*25/100,height*18*3/2/100);};
            break;
        case 41://desertbase1
            enemyImg.src="./imgs/enemyImgs/desert1.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,800,800,width*61/100,height*6/100,width*28/100,height*28*3/2/100);};
            break;
        case 42://desertbase2
            enemyImg.src="./imgs/enemyImgs/desert2.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,1500,1292,width*64/100,height*7/100,width*24/100,height*21*3/2/100);};
            break;
        case 43://desertspeed
            enemyImg.src="./imgs/enemyImgs/desert3.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,2292,2116,width*63/100,height*6/100,width*25/100,height*23*3/2/100);};
            break;
        case 44://desertdefend
            enemyImg.src="./imgs/enemyImgs/desert4.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,1030,806,width*60/100,height*10/100,width*28/100,height*21*3/2/100);};
            break;
        case 45://deserttank
            enemyImg.src="./imgs/enemyImgs/desert5.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,800,800,width*63/100,height*2/100,width*25/100,height*25*3/2/100);};
            break;
        case 46://desertrare
            enemyImg.src="./imgs/enemyImgs/desertRare.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,2000,2000,width*62/100,height*4/100,width*25/100,height*25*3/2/100);};
            break;
        case 47://desertsuperrare
            enemyImg.src="./imgs/enemyImgs/desertSuperRare.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,3591,4263,width*64/100,height*4/100,width*20/100,height*24*3/2/100);};
            break;
        case 48://desertwater4
            enemyImg.src="./imgs/enemyImgs/waterSuperRare.png";
            enemyImg.onload=function(){
                field2d.drawImage(enemyImg,0,0,1753,2000,width*64/100,height*3/100,width*20/100,height*26*3/2/100);};
            break;
    }
}