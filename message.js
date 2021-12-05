const questionMess = ["おはよう", "Q: 今日は冒険する？　　　はい　　　いいえ", ["冒険に出かけるぞ"], ["今日は家でゆっくりしよう", "おやすみなさい"], "一日が終了した。"];
const talkMess = ["こんにちは","あなたの名前を入力してください。","設定が完了しました。","ゲームをお楽しみください!!"]
const Message=[questionMess, talkMess];
var topmypic = "ディアルガ";
const introMess = ["野生のモンスターAが現れた！", "勝負だ! マイピクX!"];
const endMess1 = [topmypic+"は勝負に勝った",topmypic+"は経験値500と1000マイルを獲得した。"];
const endMess2 = [topmypic+"は逃げた。"];
const BattleMessage = [introMess, endMess1, endMess2];

const InBattleMessage = ["こっちの攻撃１", "敵に１５のダメージ！", "敵の攻撃Z", "自分に３０のダメージ"];

var onMessage=true;
var Messagenum=1;//0:field, 1:battle
var BMloop=false;//battlemessage
var loopnum=0;//battleloopの状態遷移大
var loopmode=0;//battleloopの状態遷移中　0:No選択,1:戦闘,2:アイテム,3:マイピク
var loopselect=0;
var lstnum=0;//Messageリスト内の扱うリストを指定
var in_lstnum=0;//各リスト内の出力位置を管理

var messChoice=0;//選択肢シーンでの分岐判定
var messCheck=false;
var Choicenum=0;

function messageMain(){
    if(onMessage){
        if(Messagenum==0){
        ctx2d.fillStyle=white;
        ctx2d.font="28px san-serif";
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

        //zkey入力時に次のメッセージに進む
        if(zkey){
            if(messCheck){
                if(Choicenum+1==Message[lstnum][in_lstnum].length){
                    messCheck=false;
                    in_lstnum+=(2-messChoice);
                    messChoice=0;}
                else{Choicenum++;}
            }//選択後の文章処理
            else{in_lstnum += 1 + messChoice;}//選択肢がなければ自動的に+1になる。
            if(Message[lstnum][in_lstnum-(1+messChoice)][0]=="Q"){messCheck=true;}
            zkey=false;
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
        if(Messagenum==1){
            battlemessMain();
        }
    }
}

function battleloop(){
    if(downkey) {
        loopselect=Math.min(3,loopselect+1),downkey=false;}
    else if(upkey) loopselect=Math.max(0,loopselect-1), upkey=false;


    ctx2d.fillStyle=white;
    ctx2d.font="28px san-serif";
    if(loopnum==0){
        ctx2d.fillText("戦闘", width*15/100,height*73/100);
        ctx2d.fillText("アイテム", width*15/100,height*80/100);
        ctx2d.fillText("マイピク", width*15/100,height*87/100);
        ctx2d.fillText("逃げる", width*15/100,height*94/100);

        if(loopmode==0){
            make_shape(width*12/100,height*(71+7*loopselect)/100,width*10/100,height*(69+7*loopselect)/100,width*10/100,height*(73+7*loopselect)/100);
        }

        if(loopmode==1){
            ctx2d.fillText("体当たり", width*45/100,height*73/100);
            ctx2d.fillText("叩きつける", width*45/100,height*80/100);
            ctx2d.fillText("火炎放射", width*45/100,height*87/100);
            ctx2d.fillText("爆炎竜", width*45/100,height*94/100);
            make_shape(width*42/100,height*(71+7*loopselect)/100,width*40/100,height*(69+7*loopselect)/100,width*40/100,height*(73+7*loopselect)/100);}
            
        else if(loopmode==2){
            //バッグの表示
        }
        else if(loopmode==3){
            //マイピク情報
        }
    }
    
    if(loopnum==1){//戦闘選択時の挙動
        //if(compspeed())判定
        //attackcount()で先攻の回数判定
        ctx2d.fillText(InBattleMessage[lstnum], width*45/100,height*73/100);
        //戦闘終了か判定
        //false->選択画面に
    }
}

function battlemessMain(){
    if(!BMloop){//intro,end
        ctx2d.fillStyle=white;
        ctx2d.font="28px san-serif";
        ctx2d.fillText(BattleMessage[lstnum][in_lstnum], 100,500);}
    else{
        battleloop();
    }

    //zkey入力時に次のメッセージに進む
    if(zkey){
        if(BMloop){
            if(loopnum==1/*&& !judge*/){
                lstnum++;
                if(lstnum == InBattleMessage.length){
                lstnum=0, loopnum=0, loopmode=0, loopselect=0;}
            }
            else if(loopmode==0) {//戦闘手法選択
                if(loopselect==3){
                    //if(compspeed())の判定をしてtrueかどうか
                    lstnum=2, loopnum=0;
                    BMloop=false;//battleloop終わり
                }
                else loopmode=loopselect+1, loopselect=0;
            }
            else if(loopmode==1) {
                if(loopselect==0){}
                if(loopselect==1){}
                if(loopselect==2){}
                if(loopselect==3){}
                loopnum=1;
            }
        }
        else in_lstnum += 1;
        zkey=false;
    }
    //////

    //xkey入力:キャンセルに使用
    if(xkey){
        if(BMloop && loopmode==1) loopmode=0, loopselect=0;
    }
    //////

    //一連のメッセージ終了時イベント
    if(!BMloop){
    if(in_lstnum == BattleMessage[lstnum].length && lstnum==0){
        BMloop=true, in_lstnum=0;}//BMloop
    else if(in_lstnum == BattleMessage[lstnum].length && (lstnum==1 || lstnum==2)){
        onMessage=false, mode=1;}//最終メッセージを完了したらmode変更
    }
    //////
}