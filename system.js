const black="rgba(0,0,0,1.0)";
const skyblue="rgba(102,204,204,1.0)";
const blue="rgba(0,0,255,1.0)";
const red="rgba(255,0,0,1.0)";
const white="rgba(255,255,255,1.0)";
const darkgray="rgba(50,50,50,1.0)";

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
        var pastle_green1="rgba(173,255,173,1.0)";
        ctx2d.fillStyle=pastle_green1;
        ctx2d.fill();
    }
}

function consumeItem(consumeNum){
    ////////アイテムを消費する関数　consumeNumに消費するアイテムの番号を指定(itemsでの番号)
    items[consumeNum][1]--;
    if(!items[consumeNum][1]){
        items.splice(consumeNum,1);
    }
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
   mypicstock[mypic[Num]][12]+=1;
   //ステータスアップの処理をここに追加
   popupMsg.push([mypicstock[mypic[Num]][0] + "のレベルが" + mypicstock[mypic[Num]][12] +"になった！",120,0,0,Num]);
}

function changeEXP(chgAmount,Num){
    /* 経験値を入れる関数（減らすことはできない）
    @param  chgAmount - - - 入る経験値の量を指定
            Num     - - - - 何番目に適用するかを指定
    @return 0 - - - レベルアップなし
            1〜　- - レベルアップあり
    */
    let nextLevExp = Math.floor(Math.pow(mypicstock[mypic[Num]][12]+1,2.5));
    if (nextLevExp <= Math.min(99999,mypicstock[mypic[Num]][13]+chgAmount)){ //レベルアップありのとき
        changeLevel(mypicstock[mypic[Num]][12]+1,Num);
        changeEXP(Math.min(99999,mypicstock[mypic[Num]][13]+chgAmount)-nextLevExp,Num);
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