function battleMain() {
    
    ctx2d.fillStyle=skyblue;
    ctx2d.fillRect(0,0,width,height*25/40);

    ctx2d.fillStyle=black;
    ctx2d.fillRect(0,height*25/40,width,height*15/40);
    ctx2d.font="25px san-serif";
    ctx2d.fillText("Battle", 50,100);

    //character
    ctx2d.fillStyle=blue;
    ctx2d.fillRect(200,200,50,50);

    //enemy
    ctx2d.fillStyle=red;
    ctx2d.fillRect(600,200,50,50);
    
}
var attackorder;//攻撃の順番

function hitorder(){//先攻後攻決め: floor(素早さ*(乱数0.95-1.05))
    var A_speed = Math.floor(mySpeed*(0.95*(1.05-0.95)*Math.random()));
    var B_speed = Math.floor(enemySpeed*(0.95*(1.05-0.95)*Math.random()));
    if(A_speed>=B_speed) attackorder=true;//味方の方が速い
    else attackorder=false;
}

function hitcount(){//攻撃回数: Hitcount=((自分の素早さ)/(敵の素早さ)*16/10)
    if(attackorder) return Math.floor(mySpeed/enemySpeed*16/10);
    else return Math.floor(enemySpeed/mySpeed*16/10);
}

function hitodds(){//命中確率: (技の命中率*((100-敵の運)/100))
    return (hitrate*((100-enemyLucky)/100))
}

function calcDamage(){//ダメージ計算: (((レベル∗2/4+2)∗技の威力∗自分の攻撃力/敵の防御力+2)∗タイプ相性∗(乱数0.9−1.1))∗
    return Math.floor(Math.floor(Math.floor(level*2/4+2)* power * mypicstock[mypic[0]][10]/enemydefend+2) * typeMatch * (0.9*(1.1-0.9)*Math.random()));
}

function needEx(level){//(レベル)^2.5
    return Math.floor(Math.pow(level, 2.5))
}

function getEx(){//戦闘後獲得する経験値
    return Math.floor(Math.floor(50*enemylevel*(0.9*(1.1-0.9)*Math.random()))*itemBonus*BossBonus)
}