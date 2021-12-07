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

function hpmpChg(chgStatus,chgAmount,isEnemy,Num){
    /* HPとかMPを増減させる関数
    @param  chgStatus - - - HPなら0、MPなら1を指定
            chgAmount - - - 増減する量を指定　減るならマイナス
            isEnemy - - - - 味方なら0、敵なら1を指定
            Num     - - - - 味方の場合、何番目に適用するかを指定
    @return 0 - - - 通常に完了
            1 - - - HPの減少によって死んだ
            -1  - - その他の異常終了
    */
    if (!isEnemy){ //味方
        enemyData[]
    } else{ //敵

    }
}
