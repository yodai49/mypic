var battleMode=0;//バトル状態の状態, 0:
var encount=false;//敵出現ポインタ
var attackorder;//攻撃の順番
var firstSt, secondSt;

function battleMain() {
    ctx2d.fillStyle=skyblue;
    ctx2d.fillRect(0,0,width,height*25/40);

    //character
    ctx2d.fillStyle=blue;
    ctx2d.fillRect(200,200,50,50);
    //enemy
    ctx2d.fillStyle=red;
    ctx2d.fillRect(600,200,50,50);
    
    if(battleMode==0){//行動選択(loop)
    }
    if(battleMode==1){//攻撃選択時の処理
        hitorder();
        if(attackorder) firstSt=mypicstock[mypic[0]], secondSt=enemyData[0];
        else firstSt=enemyData[0], secondSt=mypicstock[mypic[0]];
        //先攻後攻のキャラデータが入った
        //命中の判定
        firstskill=skillData[firstSt[8][loopselect]];//技データのリストが取れる
        if(hitcheck(firstskill[2], secondSt[9])){
            //命中する

        }
        else{
            //外れた
            //messageで外れた
            //後攻に行く
        }
    }
}

function encount_check(){//敵との遭遇率encount=6*((200−運)/200)
    var encountRate = Math.floor(6*((200 - mypicstock[mypic[0]][9])/200));
    if(encountRate>=Math.floor(100*Math.random())) encount=true;
    else encount=false;
}

function hitorder(){//先攻後攻決め: floor(素早さ*(乱数0.95-1.05))
    var mypicSpeed = Math.floor(mypicstock[mypic[0]][10]*(0.95*(1.05-0.95)*Math.random()));
    var enemySpeed = Math.floor(enemyData[0][10]*(0.95*(1.05-0.95)*Math.random()));
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

function calcDamage(myLevel, myPower, myAttack, oppDefend){//ダメージ計算: (((レベル∗2/4+2)∗技の威力∗自分の攻撃力/敵の防御力+2)∗タイプ相性∗(乱数0.9−1.1))
    return Math.floor(Math.floor(Math.floor(myLevel*2/4+2)* myPower * myAttack/oppDefend+2) * typeMatch(firstskill[3], secondSt[15]) * (0.9*(1.1-0.9)*Math.random()));
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
    return Math.floor(Math.floor(50*enemylevel*(0.9*(1.1-0.9)*Math.random()))*itemBonus*BossBonus)
}