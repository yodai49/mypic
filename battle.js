var battleMode=0;//バトル状態の状態, 0:intro
var loopmode=0;//battlelMode=1の状態遷移中　0:No選択,1:戦闘,2:アイテム,3:マイピク↓
var loopselect=0;//loop内での現在選択値(0-3)
var lstnum=0;//Messageリスト内の扱うリストを指定
var in_lstnum=0;//各リスト内の出力位置を管理
var encount=false;//敵出現ポインタ
var attackorder;//攻撃の順番
var firstSt, secondSt;
var damage;//攻撃のダメージ量(HP基準)
var Acount=0, Acheck=true;//attackcount, 攻撃時のカウンタ, attackcheck,zkey入力に１回だけ作動するように
var attackMiss=false;
var baseEnemyData;

function battleMain() {
    //character
    ctx2d.fillStyle=blue;
    drawMypic(0,190,130+Math.max(0,Math.sin(globalTime/7)*20-17),180,180,1,0);
    //enemy
    ctx2d.fillStyle=red;
    ctx2d.fillRect(600,200,50,50);

    if(battleMode==0){//敵データの保存
        baseEnemyData=enemyData[0];
    }
    
    if(battleMode==1){//行動選択(loop)
        if(downkey) {
            loopselect=Math.min(3,loopselect+1),downkey=false;}
        else if(upkey) loopselect=Math.max(0,loopselect-1), upkey=false;
    }

    if(battleMode==2){//攻撃選択時の処理
        console.log("Acount:"+Acount+"Acheck:"+Acheck);
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
            changeHPMP(1, firstSkill[4], !attackorder, 0, 0);//MP消費
            if(secondSt[2] == 0){//HP=0
                if(attackorder){//敵が死んだので勝利
                    battleMode=6;
                }
                else if(mypicstock[mypic[0]][2]==0&&mypicstock[mypic[1]][2]==0&&mypicstock[mypic[2]][2]==0&&mypicstock[mypic[3]][2]==0&&mypicstock[mypic[4]][2]==0&&mypicstock[mypic[5]][2]==0){
                    //味方6体全員死んだ場合
                    //"戦える手持ちのマイピクはいない!","は意識が遠のき倒れてしまった。"
                    //gameover,loopend
                }
                else{ //生存残りマイピクがいる
                    //マイピクchangeを実行,後攻はない
                }
            }
        }
        else attackMiss=true;
        }

        //後攻の攻撃
        //命中の判定
        if(Acount==2 && Acheck){
            Acheck=false;
        if(hitcheck(secondSkill[2], firstSt[9])){//MPの残り判定も追加しないと意見//
            //命中する
            if(Acount>0){
            damage = calcDamage(secondSt[12], secondSkill[1], secondSt[6], firstSt[7], secondSkill[3], firstSt[15]);
            changeHPMP(0, (-1)*damage, !attackorder, 0, 0);//HP変化
            changeHPMP(1, secondSkill[4], attackorder, 0, 0);//MP消費
            if(firstSt[2] == 0){//HP=0
                if(!attackorder){//敵が死んだので勝利
                    battleMode=6;
                }
                else if(mypicstock[mypic[0]][2]==0&&mypicstock[mypic[1]][2]==0&&mypicstock[mypic[2]][2]==0&&mypicstock[mypic[3]][2]==0&&mypicstock[mypic[4]][2]==0&&mypicstock[mypic[5]][2]==0){
                    //味方6体全員死んだ場合
                    //"戦える手持ちのマイピクはいない!","は意識が遠のき倒れてしまった。"
                    //gameover,loopend
                }
                else{ //生存残りマイピクがいる
                    //マイピクchangeを実行,後攻はない
                }
            }}
            else{}
        }
        else{
            //攻撃が外れた
            console.log("miss");
            attackMiss=true;
        }}
        if(Acount==99)battleMode=1, Acount=0, loopmode=0,loopselect=0;//行動選択に戻る
    }

    if(battleMode==3);//アイテム選択時
    if(battleMode==4);//マイピク交代
    if(battleMode==5);{//逃げる選択
        hitorder();
        if(attackorder){//逃げれる
            if(Acheck){Acheck=false;
                
            }
        }
        else{
            
        }
    }
    if(battleMode==6);{//勝利
        if(in_lstnum == winMessage.length){
            mode=1, battleMode=0, lstnum=0,in_lstnum=0;}
    }
    if(battleMode==7);//敗北


    //zkey入力時に次のメッセージに進む
    if(zkey){
        if(battleMode==0){
            in_lstnum++;
            if(in_lstnum == BattleMessage[lstnum].length && lstnum==0){
                console.log("sss");
                battleMode=1, in_lstnum=0;}//loopに行く
        }
        else if(battleMode==1){
            if(loopmode==0) {//No選択
                if(loopselect==0)loopmode=1;//戦う技選択
                else if(loopselect==3)battleMode=5;//逃げる
                else loopmode=loopselect+1, loopselect=0;
            }
            else if(loopmode==1) {//技実行
                battleMode=2, Acount=0, Acheck=true;;}
            else if(loopmode==2);//アイテム選択
            else if(loopmode==3);//マイピク
        }
        else if(battleMode==2){Acheck=true;
            if(Acount==1)Acount++, attackMiss=false;
            else if(Acount==2)Acount=99, attackMiss=false;
        }
        else if(battleMode==6){
            in_lstnum++;
        }
        zkey=false;
    }
    //////

    //xkey入力:キャンセルに使用
    if(xkey){
        if(battleMode==1 && loopmode==1) loopmode=0, loopselect=0;
    }
    //////
}

function encount_check(){//敵との遭遇率encount=6*((200−運)/200)
    var encountRate = Math.floor(6*((200 - mypicstock[mypic[0]][9])/200));
    if(encountRate>=Math.floor(100*Math.random())) encount=true;
    else encount=false;
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
    var hitodds = Math.floor(my_hitrate*((200-oppLucky)/200));
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