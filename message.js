const questionMess = ["おはよう", "Q: 今日は冒険する？　　　はい　　　いいえ", ["冒険に出かけるぞ"], ["今日は家でゆっくりしよう", "おやすみなさい"], "一日が終了した。"];
const talkMess = ["こんにちは","あなたの名前を入力してください。","設定が完了しました。","ゲームをお楽しみください!!"]
const Message=[questionMess, talkMess];
var topmypic = "ディアルガ";
const introMessage = ["野生のモンスターAが現れた！", "勝負だ! マイピクX!"];
const winMessage = [topmypic+"は勝負に勝った",topmypic+"は経験値500と1000マイルを獲得した。"];
const endMess2 = [topmypic+"は逃げた。"];
const BattleMessage = [introMessage, winMessage, endMess2];

var InBattleMessage = ["敵に１５のダメージ！", "敵の攻撃Z", "自分に３０のダメージ"];

var onMessage=true;
var Messagenum=1;//0:field, 1:battle

var messChoice=0;//選択肢シーンでの分岐判定
var messCheck=false;
var Choicenum=0;

function messageMain(){
    if(onMessage){
        if(mode==1){
        /*
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
                make_pointer(550,490,520,465,520,515);}
            else if(messChoice==1){
                make_pointer(650,490,620,465,620,515);}
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
        }*/
        }
        if(mode==2){
            battlemessMain();
        }
    }
}
function battlemessMain(){
    if(battleMode==0){//intro,end
        ctx2d.fillStyle=white;
        ctx2d.font="28px san-serif";
        ctx2d.fillText(introMessage[in_lstnum], width*25/100,height*74/100);
        if (Acheck){ /////バトル開始時の処理　ここにまとめる
            
            fieldReDrawFlg=1,Acheck=0;
        }
    }
    battleloop();
    

    //一連のメッセージ終了時イベント
    if(battleMode==0){
        if(in_lstnum == introMessage.length){
            battleMode=1, in_lstnum=0;}}//loopに行く
        
    //////
}

function battleloop(){
    ctx2d.font="28px san-serif";
    //味方ステータス表示
    ctx2d.fillStyle=darkgray;
    ctx2d.fillRect(width*4/100,height*68/100,35,35);
    drawMypic(0,width*4/100,height*68/100,35,35,1,0);
    ctx2d.fillStyle=white;
    ctx2d.font="17px "+mainfontName;
    ctx2d.fillText(mypicstock[mypic[0]][0], width*9/100,height*71/100);
    ctx2d.fillText("Lv."+mypicstock[mypic[0]][12], width*9/100,height*74/100);
    ctx2d.font="18px "+mainfontName;
    ctx2d.fillText("HP: "+mypicstock[mypic[0]][2]+"/"+mypicstock[mypic[0]][3], width*4/100,height*79/100);
    ctx2d.fillText("DP: "+mypicstock[mypic[0]][4]+"/"+mypicstock[mypic[0]][5], width*4/100,height*83/100);
    ctx2d.fillText("こうげき: "+mypicstock[mypic[0]][6], width*4/100,height*87/100);
    ctx2d.fillText("ぼうぎょ: "+mypicstock[mypic[0]][7], width*4/100,height*91/100);
    ctx2d.fillText("すばやさ: "+mypicstock[mypic[0]][10], width*4/100,height*95/100);
    /////////////////
    //敵ステータス表示
    ctx2d.fillRect(width*82/100,height*68/100,35,35);
    ctx2d.font="18px "+mainfontName;
    ctx2d.fillText(enemyData[0][0], width*88/100,height*71/100);
    ctx2d.fillText("Lv."+enemyData[0][12], width*88/100,height*74/100);
    ctx2d.font="18px "+mainfontName;
    ctx2d.fillText("HP: "+enemyData[0][2]+"/"+enemyData[0][3], width*82/100,height*79/100);
    ctx2d.fillText("DP: "+enemyData[0][4]+"/"+enemyData[0][5], width*82/100,height*83/100);

    /////////////////

    if (fieldReDrawFlg){ /////背景の再描画処理　戦闘開始時にこのフラグが立つ
        field2d.clearRect(0,0,width,height);
        field2d.fillStyle=skyblue;
        field2d.fillRect(0,0,width,height);
        field2d.fillStyle=black;
        field2d.fillRect(0,height*65/100,width,height*35/100);
        const messageImg=new Image();//メッセージウィンドウ
        messageImg.src="./imgs/messageWindow.png";
        console.log("bbb");
        messageImg.onload=function(){
            console.log("aaa");
            field2d.drawImage(messageImg,0,0,800,200,width*20/100,height*62/100,width*60/100,height*37/100)
        }; 
        fieldReDrawFlg=0;
    }

    if(battleMode==1){
        ctx2d.font="28px "+mainfontName;
        ctx2d.fillText("たたかう", width*29/100,height*73/100);
        ctx2d.fillText("アイテム", width*29/100,height*80/100);
        ctx2d.fillText("マイピク", width*29/100,height*87/100);
        ctx2d.fillText("にげる", width*29/100,height*94/100);

        if(loopmode==0){
            make_pointer(width*27/100,height*(71+7*loopselect)/100,width*25/100,height*(69+7*loopselect)/100,width*25/100,height*(73+7*loopselect)/100);
        }

        if(loopmode==1){
            ctx2d.fillText(skillData[mypicstock[mypic[0]][8][0]][0], width*55/100,height*73/100);
            ctx2d.fillText(skillData[mypicstock[mypic[0]][8][1]][0], width*55/100,height*80/100);
            ctx2d.fillText(skillData[mypicstock[mypic[0]][8][2]][0], width*55/100,height*87/100);
            ctx2d.fillText(skillData[mypicstock[mypic[0]][8][3]][0], width*55/100,height*94/100);
            make_pointer(width*52/100,height*(71+7*loopselect)/100,width*50/100,height*(69+7*loopselect)/100,width*50/100,height*(73+7*loopselect)/100);}
            
        else if(loopmode==2){
            //バッグの表示
        }
        else if(loopmode==3){
            //マイピク情報
        }
    }
    
    else if(battleMode==2){//戦闘選択時の挙動
        ctx2d.font="28px "+mainfontName;
        if(attackMiss){
            ctx2d.fillText(firstSkill[0]+"は当たらなかった...", width*30/100,height*73/100);
        }
        else{
        switch (Acount){
            case 1:
                ctx2d.fillText(firstSt[0]+"の"+firstSkill[0]+"!", width*30/100,height*73/100);
                break;
            case 2:
                ctx2d.fillText(secondSt[0]+"の"+secondSkill[0]+"!", width*30/100,height*73/100);
                break;
        }
        }
        //if(compspeed())判定
        //attackcount()で先攻の回数判定
        //ctx2d.fillText(InBattleMessage[lstnum], width*45/100,height*73/100);
        //戦闘終了か判定
        //false->選択画面に
    }

    else if(battleMode==6){//勝利message
        ctx2d.fillStyle=white;
        ctx2d.font="28px san-serif";
        ctx2d.fillText(winMessage[in_lstnum], width*25/100,height*74/100);
    }
}
