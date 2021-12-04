const questionMess = ["おはよう", "Q: 今日は冒険する？　　　はい　　　いいえ", ["冒険に出かけるぞ"], ["今日は家でゆっくりしよう", "おやすみなさい"], "一日が終了した。"];
const battleMess = ["野生のモンスターAが現れた！", "勝負だ! キャラクターB!", "行動を選択してください。","Bの物理攻撃!","Aは倒れた。"];
const talkMess = ["こんにちは","あなたの名前を入力してください。","設定が完了しました。","ゲームをお楽しみください!!"]
const Message=[questionMess, battleMess, talkMess];

var onMessage=true;

var lstnum=0;//Messageリスト内の扱うリストを指定
var in_lstnum=0;//各リスト内の出力位置を管理
var messChoice=0;//選択肢シーンでの分岐判定
var messCheck=false;
var Choicenum=0;

function messageMain(){
    if(onMessage){
    ctx2d.fillStyle=black;
    ctx2d.font="20px san-serif";
    //textの表示
    if(messCheck){
        ctx2d.fillText(Message[lstnum][in_lstnum][Choicenum], 300,500);
    }
    else{ctx2d.fillText(Message[lstnum][in_lstnum], 300,500);}
    //////

    //選択肢シーン
    if(Message[lstnum][in_lstnum][0]=="Q"){
        if(messChoice==0){
            make_shape(550,490,520,465,520,515);}
        else if(messChoice==1){
            make_shape(650,490,620,465,620,515);}
        //選択肢が２つの場合のみ想定
        if(rightkey && messChoice<1){
            messChoice+=1;
            rightkey=false;}
        else if(leftkey && messChoice>0){
            messChoice-=1;
            leftkey=false;}
    }
    //////

    //spacekey入力時に次のメッセージに進む
    if(spacekey){
        if(messCheck){
            if(Choicenum+1==Message[lstnum][in_lstnum].length){
                messCheck=false;
                in_lstnum+=(2-messChoice);
                messChoice=0;}
            else{Choicenum++;}
        }//選択後の文章処理
        else{in_lstnum += 1 + messChoice;}//選択肢がなければ自動的に+1になる。
        if(Message[lstnum][in_lstnum-(1+messChoice)][0]=="Q"){messCheck=true;}
        spacekey=false;
    }
    //////

    if(in_lstnum == Message[lstnum].length){//一連のメッセージ終了時イベント
        lstnum++;
        in_lstnum=0;
    }

    if(lstnum == Message.length){//全てのメッセージ終了
        onMessage=false;
    }

    }
}

function make_shape(a,b,c,d,e,f){ //図形作成
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