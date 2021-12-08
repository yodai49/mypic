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
var moneyUpFlg=false;//金運の知らせ使用
var bMemory=[0,0,0];//0:攻撃,1:防御,2:MaxHP
var unFightFlg=false;//戦闘不能
var gameoverFlg=false;//敗北

function battleMain() {
    //character
    ctx2d.fillStyle=blue;
    drawMypic(0,190,130+Math.max(0,Math.sin(globalTime/7)*20-17),180,180,1,0);
    //enemy
    ctx2d.fillStyle=red;
    ctx2d.fillRect(600,200,50,50);

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
                if(items[loopselect][0] == 11)battleMode=3, oneMoveFlg=true;
                else if(!itemdata[loopselect][2] || moneyUpFlg)BerrorFlg=true;
                else loopmode=4;
            } else if(loopmode==4){battleMode=3, oneMoveFlg=true;//誰に使用するか決める
            } else if(loopmode==3){//マイピク交代
                if(loopselect==0) BerrorFlg=true;
                else battleMode=4;
            }
        } else if(battleMode==2){Acheck=true;
            if(oneMoveFlg) battleMode=6;
            else if(unFightFlg) battleMode=7, chgCount=0, loopselect=0, unFightFlg=false;
            else if(gameoverFlg) battleMode=8, chgCount=0, gameoverFlg=false;
            else if(Acount==1)Acount++, attackMiss=false;
            else if(Acount==2)Acount=99, attackMiss=false;
        } else if(battleMode==3){
            if(unFightFlg) battleMode=7, chgCount=0, loopselect=0, unFightFlg=false;
            else if(gameoverFlg) battleMode=8, chgCount=0, gameoverFlg=false;
            else if(itemCount==0 || itemCount==1)itemCount++, oneMoveFlg=true;
            else if(itemCount==2)battleMode=1, itemCount=0, loopmode=0, loopselect=0, BtopItem=0;;
        } else if(battleMode==4){
            if(unFightFlg) battleMode=7, chgCount=0, loopselect=0, unFightFlg=false;
            else if(gameoverFlg) battleMode=8, chgCount=0, gameoverFlg=false;
            else if(chgCount==0 || chgCount==1)chgCount++, oneMoveFlg=true;
            else if (chgCount==2){
                battleMode=1, chgCount=0, loopmode=0, loopselect=0;
            }
        } else if(battleMode==5){
            if(!attackorder){//逃げれない
                battleMode=1, loopmode=0, loopselect=0;}
            else{//逃げてfieldに遷移
                modeAnimation=1, nextMode=1, battleMode=0, loopmode=0, loopselect=0, lstnum=0, in_lstnum=0;}
        } else if(battleMode==6){
            in_lstnum++;
        } else if(battleMode==7){
            if(chgCount==0 || chgCount==1)chgCount++;
        }
        zkey=false;
    }
    //////

    //xkey入力:キャンセルに使用
    if(xkey){
        if(battleMode==1 && (loopmode==1 || loopmode==2 || loopmode==3)) loopmode=0, BtopItem=0, loopselect=0;
        else if(battleMode==1 && loopmode==4) loopmode=2, BwhoUse=0;
        xkey=false;
    }
    //////


    if(battleMode==0){//敵データの保存
        baseEnemyData=[];
        for(var i = 0;i < enemyData[0].length;i++){
            baseEnemyData[i]=enemyData[0][i];
        }
        bMemory[0]=mypicstock[mypic[0]][6];
        bMemory[1]=mypicstock[mypic[0]][7];
        bMemory[2]=mypicstock[mypic[0]][3];
    } else if(battleMode==1){//行動選択(loop)
        if(downkey) {
            if (loopmode==2){
                loopselect=Math.min(items.length-1,loopselect+1);
                if(loopselect-BtopItem==5)BtopItem++;}
            else if(loopmode==3){loopselect=Math.min(mypic.length-1,loopselect+1);}
            else if(loopmode==4){BwhoUse=Math.min(mypic.length-1,BwhoUse+1);}
            else{loopselect=Math.min(3,loopselect+1);}
            downkey=false;}
        else if(upkey){
            if(loopmode==4)BwhoUse=Math.max(0,BwhoUse-1);
            else loopselect=Math.max(0,loopselect-1);
            if(loopmode==2 && loopselect<BtopItem)BtopItem--;
            upkey=false;}
        else if(rightkey){
            if(loopmode==3){loopselect=Math.min(mypic.length-1,loopselect+3);}
            else if(loopmode==4){BwhoUse=Math.min(mypic.length-1,BwhoUse+3);}
            rightkey=false;}
        else if(leftkey){
            if(loopmode==3){loopselect=Math.max(0,loopselect-3);}
            else if(loopmode==4){BwhoUse=Math.max(0,BwhoUse-3);}
            leftkey=false;}
    } else if(battleMode==2){//攻撃選択時の処理
        if(Acount==0 && Acheck){
            Acount++;
            hitorder();
            if(attackorder) firstSt=mypicstock[mypic[0]], secondSt=baseEnemyData;
            else firstSt=baseEnemyData, secondSt=mypicstock[mypic[0]];
            //先攻後攻のキャラデータが入った

            //先攻の攻撃
            //命中の判定
            firstSkill=skillData[firstSt[8][loopselect]];//技データのリストが取れる
            secondSkill=skillData[secondSt[8][loopselect]];//技データのリストが取れる
        }
        
        else if(Acount==1 && Acheck){
            Acheck=false;
        if(hitcheck(firstSkill[2], secondSt[9])){//MPの残り判定も追加しないと意見//
            //命中する　
            damage = calcDamage(firstSt[12], firstSkill[1], firstSt[6], secondSt[7], firstSkill[3], secondSt[15]);
            changeHPMP(0, (-1)*damage, attackorder, 0, 0);//HP変化
            changeHPMP(1, (-1)*firstSkill[4], !attackorder, 0, 0);//MP消費
            if(secondSt[2] == 0){//HP=0
                if(attackorder){//敵が死んだので勝利
                    oneMoveFlg=true;
                } else if(mypicstock[mypic[0]][2]==0&&mypicstock[mypic[1]][2]==0&&mypicstock[mypic[2]][2]==0&&mypicstock[mypic[3]][2]==0&&mypicstock[mypic[4]][2]==0&&mypicstock[mypic[5]][2]==0){
                    //味方6体全員死んだ場合
                    //"戦える手持ちのマイピクはいない!","は意識が遠のき倒れてしまった。"
                    //gameover,loopend
                    gameoverFlg=true;
                } else{ //生存残りマイピクがいる
                    //マイピクchangeを実行,後攻はない
                    unFightFlg=true;
                }
            }
        }
        else attackMiss=true;
        }
        //後攻の攻撃
        //命中の判定
        if(Acount==2 && Acheck){
            Acheck=false;
            lateEnemyAttack();
        }
        if(Acount==99)battleMode=1, Acount=0, loopmode=0,loopselect=0;//行動選択に戻る
    } else if(battleMode==3){//アイテム選択時
        //selectmode: 選択しているアイテムのitemでの番号
        //BwhoUse:使用するマイピクのmypicでの番号
        if(oneMoveFlg && itemCount==0){
            //HP,MP回復系
            if(items[loopselect][0] == 0){
                changeHPMP(0,mypicstock[mypic[BwhoUse]][3]*0.3,0,BwhoUse,0);}
            else if(items[loopselect][0] == 1){
                changeHPMP(0,mypicstock[mypic[BwhoUse]][3]*0.6,0,BwhoUse,0);}
            else if(items[loopselect][0] == 2){
                changeHPMP(0,mypicstock[mypic[BwhoUse]][3]*1,0,BwhoUse,0);}
            else if(items[loopselect][0] == 3){
                changeHPMP(0,50,0,BwhoUse,0);}
            else if(items[loopselect][0] == 4){
                changeHPMP(0,100,0,BwhoUse,0);}
            else if(items[loopselect][0] == 5){
                changeHPMP(0,150,0,BwhoUse,0);}
            else if(items[loopselect][0] == 8){
                changeHPMP(1,30,0,BwhoUse,0);}
            else if(items[loopselect][0] == 9){
                changeHPMP(1,60,0,BwhoUse,0);}
            //強化系
            else if(items[loopselect][0] == 10){
                mypicstock[mypic[BwhoUse]][6] = Math.floor(mypicstock[mypic[BwhoUse]][6]*1.4);}
            else if(items[loopselect][0] == 11){
                mypicstock[mypic[BwhoUse]][7] = Math.floor(mypicstock[mypic[BwhoUse]][7]*1.4);}
            else if(items[loopselect][0] == 12){
                var hpAmount = Math.floor(mypicstock[mypic[BwhoUse]][3]/5);
                mypicstock[mypic[BwhoUse]][3] = Math.floor(mypicstock[mypic[BwhoUse]][3]*1.4);
                mypicstock[mypic[BwhoUse]][2] += hpAmount;}
            //獲得金Up
            else if(items[loopselect][0] == 13) moneyUpFlg=true;
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
        if(!oneMoveFlg){//onemoveflgでwinmessageが読み込まれるのを待ってから実行
            if(in_lstnum == winMessage.length){ //勝利後、フィールドに戻る時の処理はここに追加
                nextMode=1, modeAnimation=1, battleMode=0, loopmode=0, loopselect=0, lstnum=0,in_lstnum=0;
                mypicstock[mypic[0]][6]=bMemory[0];
                mypicstock[mypic[0]][7]=bMemory[1];
                mypicstock[mypic[0]][3]=bMemory[2];
                fieldReDrawFlg=1;}}
    } else if(battleMode==7){//戦闘不能
        if(downkey && chgCount==1)loopselect=Math.min(mypic.length-1,loopselect+1), downkey=false;
        else if(upkey && chgCount==1)loopselect=Math.max(0,loopselect-1), upkey=false;
        else if(rightkey && chgCount==1)loopselect=Math.min(mypic.length-1,loopselect+3), rightkey=false;
        else if(leftkey && chgCount==1)loopselect=Math.max(0,loopselect-3), leftkey=false;
        if(chgCount==2){
            if(oneMoveFlg) {oneMoveFlg=false;
                mypicstock[mypic[0]][6]=bMemory[0];
                mypicstock[mypic[0]][7]=bMemory[1];
                mypicstock[mypic[0]][3]=bMemory[2];//バフを元に戻す
                mypic[0]=[mypic[loopselect], mypic[loopselect]=mypic[0]][0]//交換
                bMemory[0]=mypicstock[mypic[0]][6];
                bMemory[1]=mypicstock[mypic[0]][7];
                bMemory[2]=mypicstock[mypic[0]][3];
            }
        }
    } else if(battleMode==8){}//敗北
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

function hitcheck(my_hitrate, oppLucky){//命中判定: (技の命中率*((100-敵の運)/100))
    var hitodds = Math.floor(my_hitrate*((200-infToRange(oppLucky,0,100,30))/200));
    if(hitodds>=Math.floor(100*Math.random())) return true;
    else return false;
}

function calcDamage(myLevel, skillPower, myAttack, oppDefend, fskill, stype){//ダメージ計算: (((レベル∗2/4+2)∗技の威力∗自分の攻撃力/敵の防御力+2)∗タイプ相性∗(乱数0.9−1.1))
    return Math.floor(Math.floor(Math.floor(myLevel*2/6+2)* skillPower * myAttack/oppDefend+2) * typeMatch(fskill, stype) * (0.9+(1.1-0.9)*Math.random()));
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

function getEx(){//戦闘後獲得する経験値
    return Math.floor(Math.floor(50*enemylevel*(0.9+(1.1-0.9)*Math.random()))*itemBonus*BossBonus)
}

function lateEnemyAttack(){
    if(hitcheck(secondSkill[2], firstSt[9])){//MPの残り判定も追加しないと意見//
        //命中する
        damage = calcDamage(secondSt[12], secondSkill[1], secondSt[6], firstSt[7], secondSkill[3], firstSt[15]);
        changeHPMP(0, (-1)*damage, !attackorder, 0, 0);//HP変化
        changeHPMP(1, (-1)*secondSkill[4], attackorder, 0, 0);//MP消費
        if(firstSt[2] == 0){//HP=0
            if(!attackorder){//敵が死んだので勝利
                oneMoveFlg=true;
            } else if(mypicstock[mypic[0]][2]==0&&mypicstock[mypic[1]][2]==0&&mypicstock[mypic[2]][2]==0&&mypicstock[mypic[3]][2]==0&&mypicstock[mypic[4]][2]==0&&mypicstock[mypic[5]][2]==0){
                //味方6体全員死んだ場合
                //"戦える手持ちのマイピクはいない!","は意識が遠のき倒れてしまった。"
                //gameover,loopend
                gameoverFlg=true;
            } else{ //生存残りマイピクがいる
                //マイピクchangeを実行,後攻はない
                unFightFlg=true;
            }
        }
    }
    else{
        //攻撃が外れた
        attackMiss=true;
    }
}