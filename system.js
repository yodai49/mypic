const black="rgba(0,0,0,1.0)";
const skyblue="rgba(102,204,204,1.0)";
const blue="rgba(0,0,255,1.0)";
const red="rgba(255,0,0,1.0)";
const white="rgba(255,255,255,1.0)";
const white_trans1="rgba(255,255,255,0.7)";
const white_trans2="rgba(255,255,255,0.3)";
const darkgray="rgba(50,50,50,1.0)";
const darkgray2="rgba(105,105,105,1.0)";
const pastleGreen="rgba(100,200,100,1.0)"

function make_pointer(a,b,c,d,e,f){ //図形作成
    //描画コンテキストの取得
    var canvas = document.getElementById('mainCanvas');
    if (canvas.getContext) {
        ctx2d.strokeStyle=black;
        var context = canvas.getContext('2d');
        //新しいパスを開始する
        context.beginPath();
        //パスの開始座標を指定する
        context.moveTo(a,b);
        //座標を指定してラインを引いていく
        context.lineTo(c,d);
        context.lineTo(e,f);
        //パスを閉じる（最後の座標から開始座標に向けてラインを引く）
        context.closePath();
        //現在のパスを輪郭表示する
        context.stroke();
        ctx2d.fillStyle="rgba(173,255,173,1.0)";
        //ctx2d.fillStyle="rgba("+typeDataCol[mypicstock[mypic[0]][15]]+",1.0)";
        ctx2d.fill();
    }
}

function consumeItem(consumeNum){
    ////////アイテムを消費する関数　consumeNumに消費するアイテムの番号を指定(itemsでの番号)
    items[consumeNum][1]--;
    if(!items[consumeNum][1]){
        items.splice(consumeNum,1);
    }
    items.sort(function(a,b){return (a[0]-b[0]);});
}
function getItem(getNum){
    ////////アイテムをゲットする関数　getNumにゲットするアイテムの番号を指定(itemsでの番号)
    for(var i = 0;i < items.length;i++){
        if (items[i][0] == getNum){
            items[i][1]++;
            if(items[i][1]>=100) items[i][1]=99;
            return 0;
        }
    }
    items.push([getNum,1]);
    items.sort(function(a,b){return (a[0]-b[0]);});
}

function changeHPMP(chgStatus,chgAmount,isEnemy,Num,isSimulate){
    /* HPとかMPを増減させる関数
    @param  chgStatus - - - HPなら0、MPなら1を指定
            chgAmount - - - 増減する量を指定　減るならマイナス
            isEnemy - - - - 味方なら0、敵なら1を指定
            Num     - - - - 味方の場合、何番目に適用するかを指定
            isSimulate  - - 実際には増減を行わず、増減が可能かどうかだけ知りたい時は1を指定（技を放つ前の残りのMPチェックとかに使う)
    @return 0 - - - 通常に完了
            1 - - - HPが0以下になる（なった）、あるいはMPが0未満になる（なった）
            -1  - - その他の異常終了
    */
   chgAmount=Math.floor(chgAmount);
    if (!isEnemy){ //味方
        if (!isSimulate){ //実際にやるとき
            mypicstock[mypic[Num]][2+2*chgStatus]=Math.min(Math.max(0,mypicstock[mypic[Num]][2+2*chgStatus]+chgAmount),mypicstock[mypic[Num]][3+2*chgStatus]);
            if (!mypicstock[mypic[Num]][2+2*chgStatus]) return 1;
            return 0;
        } else{ //シミュレーションチェックの時
            var tmpSimulate=Math.max(0,mypicstock[mypic[Num]][2+2*chgStatus]+chgAmount+chgStatus);
            if (!tmpSimulate) return 1; //HPかMPが0以下、0未満になるなら
            return 0;
        }
    } else{ //敵
        if (!isSimulate){ //実際にやるとき
            baseEnemyData[2+2*chgStatus]=Math.min(Math.max(0,baseEnemyData[2+2*chgStatus]+chgAmount),baseEnemyData[3+2*chgStatus]);
            if (!baseEnemyData[2+2*chgStatus]) return 1;
            return 0;
        } else{ //シミュレーションチェックの時
            var tmpSimulate=Math.max(0,baseEnemyData[2+2*chgStatus]+chgAmount+chgStatus);
            if (!tmpSimulate) return 1; //HPかMPが0以下、0未満になるなら
            return 0;
        }
    }
}
function changeLevel(chgLev,Num){
    /* レベルを上げる関数　必ず1だけ上がる
    @param  chgLev - - - 上がった後のレベルを格納
            Num     - - - - 何番目に適用するかを指定
    @return 0 
    */
    mypicstock[mypic[Num]][12]=Math.min(chgLev,99);
    mypicstock[mypic[Num]][3]+=(1+(Math.pow(mypicstock[mypic[Num]][3],1.004)- mypicstock[mypic[Num]][3])+Math.floor(Math.random()*2.2));
    mypicstock[mypic[Num]][5]+=(1+(Math.pow(mypicstock[mypic[Num]][5],1.004)- mypicstock[mypic[Num]][5])+Math.floor(Math.random()*2.2));
    mypicstock[mypic[Num]][6]+=(1+(Math.pow(mypicstock[mypic[Num]][6],1.004)- mypicstock[mypic[Num]][6])+Math.floor(Math.random()*2.2));
    mypicstock[mypic[Num]][7]+=(1+(Math.pow(mypicstock[mypic[Num]][7],1.004)- mypicstock[mypic[Num]][7])+Math.floor(Math.random()*2.2));
    mypicstock[mypic[Num]][9]=Math.min(10,mypicstock[mypic[Num]][9]+Math.floor(Math.random()*1.08));
    mypicstock[mypic[Num]][10]=Math.min(200,mypicstock[mypic[Num]][10]+Math.floor(Math.random()*2)+1);
    mypicstock[mypic[Num]][3]=Math.floor(Math.min(999,mypicstock[mypic[Num]][3]));
    mypicstock[mypic[Num]][5]=Math.floor(Math.min(999,mypicstock[mypic[Num]][5]));
    mypicstock[mypic[Num]][6]=Math.floor(Math.min(999,mypicstock[mypic[Num]][6]));
    mypicstock[mypic[Num]][7]=Math.floor(Math.min(999,mypicstock[mypic[Num]][7]));
    mypicstock[mypic[Num]][9]=Math.floor(Math.min(999,mypicstock[mypic[Num]][9]));
    mypicstock[mypic[Num]][10]=Math.floor(Math.min(999,mypicstock[mypic[Num]][10]));
    const skillLv=[5,9,14,19,25,31,37,44,51,59];
    for(let i = 0;i < Math.min(skillLv.length,(mypicstock[mypic[Num]][8].length-4));i++){
        if (skillLv[i] == chgLev){ //スキルの習得時
            checkSkillConflict.push(Num);
            mypicstock[mypic[Num]][14].push(mypicstock[mypic[Num]][8][i+4]);
        }
    }
   //ステータスアップの処理をここに追加
   popupMsg.push([mypicstock[mypic[Num]][0] + "のレベルが" + mypicstock[mypic[Num]][12] +"になった！",120,0,0,mypic[Num]]);
   eventSE.play();
}

function changeEXP(chgAmount,Num){
    /* 経験値を入れる関数（減らすことはできない）
    @param  chgAmount - - - 入る経験値の量を指定
            Num     - - - - 何番目に適用するかを指定
    @return 0 - - - レベルアップなし
            1〜　- - レベルアップあり
    */
    let nextLevExp = Math.floor(Math.pow(mypicstock[mypic[Num]][12],2+((mypicstock[mypic[Num]][16])/6)));
    if (nextLevExp <= Math.min(99999,mypicstock[mypic[Num]][13]+chgAmount)){ //レベルアップありのとき
        let tmpExp=Math.min(99999,mypicstock[mypic[Num]][13]+chgAmount)-nextLevExp;
        mypicstock[mypic[Num]][13]=nextLevExp;
        if (mypicstock[mypic[Num]][12] != 99){
            changeLevel(mypicstock[mypic[Num]][12]+1,Num);
            changeEXP(tmpExp,Num);    
        }
    }else{
        mypicstock[mypic[Num]][13]=Math.min(99999,mypicstock[mypic[Num]][13]+chgAmount);
    }
    return 0;
}

function infToRange(x,min,max,param){
    return x;
    ///arcTanで0〜無限のパラメーターを指定された範囲に単調増加になるように移す関数 paramが大きいと緩やかになる
    return Math.atan(x/param)*200/Math.PI*(max-min)+min;
}

function changeColor(typenum, trans){//typenum:属性値(0~6)
    switch(typenum){
        case 0://無属性
            ctx2d.fillStyle="rgba("+typeDataCol[0]+","+trans+")";
            break;
        case 1://火属性
            ctx2d.fillStyle="rgba("+typeDataCol[1]+","+trans+")";
            break;
        case 2://水属性
            ctx2d.fillStyle="rgba("+typeDataCol[2]+","+trans+")";
            break;
        case 3://木属性
            ctx2d.fillStyle="rgba("+typeDataCol[3]+","+trans+")";
            break;
        case 4://風属性
            ctx2d.fillStyle="rgba("+typeDataCol[4]+","+trans+")";
            break;
        case 5://岩属性
            ctx2d.fillStyle="rgba("+typeDataCol[5]+","+trans+")";
            break;
        case 6://幻属性
            ctx2d.fillStyle="rgba("+typeDataCol[6]+","+trans+")";
            break;
    }
}