const questionMess = ["おはよう", "Q: 今日は冒険する？　　　はい　　　いいえ", ["冒険に出かけるぞ"], ["今日は家でゆっくりしよう", "おやすみなさい"], "一日が終了した。"];
const talkMess = ["こんにちは","あなたの名前を入力してください。","設定が完了しました。","ゲームをお楽しみください!!"]
const Message=[questionMess, talkMess];
var topmypic = "ディアルガ";
var introMessage = ["", ""];
var endMess2 = [""];
var BattleMessage = [introMessage, endMess2];
var winMessage;

var InBattleMessage = ["敵に１５のダメージ！", "敵の攻撃Z", "自分に３０のダメージ"];
var onMessage=true;
var Messagenum=1;//0:field, 1:battle
var Bsetcheck=true;
var messChoice=0;//選択肢シーンでの分岐判定
var messCheck=false;
var Choicenum=0;
var battleLaunchFlg=0;
const popupWindowAniSpeed=15;

function messageMain(){
    if(onMessage){
        if(mode==1){
        /*
        ctx2d.fillStyle=white;
        ctx2d.font="26px san-serif";
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
        ctx2d.font="26px "+mainfontName;
        if(Bsetcheck){
            introMessage[0]="野生の "+enemyData[0][0]+" があらわれた！";
            introMessage[1]="勝負だ、 "+mypicstock[mypic[0]][0]+" !";
            endMess2[0]=mypicstock[mypic[0]][0]+"はにげた。";}
        if(!modeAnimation) ctx2d.fillText(introMessage[in_lstnum], width*25/100,height*75/100);
        if (battleLaunchFlg){ /////バトル開始時の処理　ここにまとめる
            fieldReDrawFlg=1,battleLaunchFlg=0;
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
    ctx2d.font="26px "+mainfontName;
    //味方ステータス表示
    ctx2d.fillStyle=darkgray;
    ctx2d.fillRect(width*4/100,height*68/100,35,35);
    drawMypic(0,width*4/100,height*68/100,35,35,1,0);
    ctx2d.fillStyle=white;
    ctx2d.font="18px "+mainfontName;
    ctx2d.fillText(mypicstock[mypic[0]][0], width*8/100,height*71/100);
    ctx2d.fillText("Lv."+mypicstock[mypic[0]][12], width*8/100,height*75/100);
    ctx2d.font="16px "+mainfontName;
    ctx2d.fillText("HP: "+mypicstock[mypic[0]][2]+"/"+mypicstock[mypic[0]][3], width*3/100,height*82/100);
    ctx2d.fillText("DP: "+mypicstock[mypic[0]][4]+"/"+mypicstock[mypic[0]][5], width*3/100,height*85/100);
    ctx2d.fillText("こうげき: "+mypicstock[mypic[0]][6], width*3/100,height*88/100);
    ctx2d.fillText("ぼうぎょ: "+mypicstock[mypic[0]][7], width*3/100,height*91/100);
    ctx2d.fillText("すばやさ: "+mypicstock[mypic[0]][10], width*3/100,height*94/100);
    /////////////////
    //敵ステータス表示
    ctx2d.fillRect(width*82/100,height*68/100,35,35);
    ctx2d.font="18px "+mainfontName;
    ctx2d.fillText(baseEnemyData[0], width*88/100,height*71/100);
    ctx2d.fillText("Lv."+baseEnemyData[12], width*88/100,height*74/100);
    ctx2d.font="18px "+mainfontName;
    ctx2d.fillText("HP: "+baseEnemyData[2]+"/"+baseEnemyData[3], width*82/100,height*79/100);
    ctx2d.fillText("DP: "+baseEnemyData[4]+"/"+baseEnemyData[5], width*82/100,height*83/100);
    /////////////////

    if (fieldReDrawFlg){ /////背景の再描画処理　戦闘開始時にこのフラグが立つ
        field2d.clearRect(0,0,width,height);
        field2d.fillStyle=skyblue;
        field2d.fillRect(0,0,width,height);
        field2d.fillStyle=black;
        field2d.fillRect(0,height*65/100,width,height*35/100);
        const messageImg=new Image();//メッセージウィンドウ
        messageImg.src="./imgs/messageWindow.png";
        messageImg.onload=function(){
            field2d.drawImage(messageImg,0,0,800,200,width*21/100,height*62/100,width*58/100,height*38/100);
        }; 
        fieldReDrawFlg=0;
    }


    if(battleMode==1){
        ctx2d.font="25px "+mainfontName;
        ctx2d.fillText("たたかう", width*28.5/100,height*75/100);
        ctx2d.fillText("アイテム", width*28.5/100,height*81/100);
        ctx2d.fillText("マイピク", width*28.5/100,height*87/100);
        ctx2d.fillText("にげる", width*28.5/100,height*93/100);

        if(loopmode==0){
            make_pointer(width*27/100,height*(73+6*loopselect)/100,width*25/100,height*(71+6*loopselect)/100,width*25/100,height*(75+6*loopselect)/100);
        }

        if(loopmode==1){
            for(let i=0; i<4; i++){
                ctx2d.font="25px "+mainfontName;
                ctx2d.fillText(skillData[mypicstock[mypic[0]][8][i]][0], width*47/100,height*(75+6*i)/100);
                ctx2d.font="17px "+mainfontName;
                ctx2d.fillText("MP:"+skillData[mypicstock[mypic[0]][8][i]][4], width*70/100,height*(74+6*i)/100);
            }
            make_pointer(width*45/100,height*(73+6*loopselect)/100,width*43/100,height*(71+6*loopselect)/100,width*43/100,height*(75+6*loopselect)/100);}
            
        else if(loopmode==2){//バッグの表示
            //loopselect: ポインタが指すアイテムの要素番号
            //BtopItem: 表示するアイテムの一番上の要素番号
            if(BerrorFlg){//errorメッセージ表示
                popupMsg.push(["ここでは使えないよ!",120,0,0,-1]);
                BerrorFlg=false;}
            ctx2d.font="18px "+mainfontName;
            for (let i=0; i < 5; i++){
                if(!itemdata[items[BtopItem+i][0]][2]) ctx2d.fillStyle=darkgray2;
                else if(items[BtopItem+i][0] == 14 && moneyUpFlg) ctx2d.fillStyle=darkgray2;
                else if(items[BtopItem+i][0] == 15 && experienceUpFlg) ctx2d.fillStyle=darkgray2;
                else ctx2d.fillStyle=white;
                ctx2d.fillText(itemdata[items[BtopItem+i][0]][0], width*46/100,height*(73+(i*5))/100);
                ctx2d.fillText("×"+items[BtopItem+i][1], width*71/100,height*(73+(i*5))/100);}
            make_pointer(width*45/100,height*(72+5*(loopselect-BtopItem))/100,width*43/100,height*(70+5*(loopselect-BtopItem))/100,width*43/100,height*(74+5*(loopselect-BtopItem))/100);
            }
            
        else if(loopmode==3){
            //マイピク情報
            if(BerrorFlg){//errorメッセージ表示
                popupMsg.push(["ひんしなので選べない!",120,0,0,-1]);
                BerrorFlg=false;}
            ctx2d.font="20px "+mainfontName;
            ctx2d.fillText("どのマイピクと交代する？", width*48/100,height*74/100);
            for (let i=0; i < mypic.length; i++){
                if(mypicstock[mypic[i]][2]==0)ctx2d.fillStyle=darkgray2;
                else ctx2d.fillStyle=white;
                ctx2d.fillText(mypicstock[mypic[i]][0], width*(47+17*Math.max(0,Math.ceil((i-2)/3)))/100,height*(81+6*(i%3))/100);}
                make_pointer(width*(46+17*Math.max(0,Math.ceil((loopselect-2)/3)))/100,height*(79.5+6*(loopselect%3))/100,width*(44+17*Math.max(0,Math.ceil((loopselect-2)/3)))/100,height*(77.5+6*(loopselect%3))/100,width*(44+17*Math.max(0,Math.ceil((loopselect-2)/3)))/100,height*(81.5+6*(loopselect%3))/100);
        }
        else if(loopmode==4){
            if(BerrorFlg){//errorメッセージ表示
                popupMsg.push(["ここでは使えないよ!",120,0,0,-1]);
                BerrorFlg=false;}
            ctx2d.font="20px "+mainfontName;
            ctx2d.fillText("だれに使用する？", width*53/100,height*74/100);
            for (let i=0; i < mypic.length; i++){
                if(items[loopselect][0]==6 || items[loopselect][0]==7){
                    if(mypicstock[mypic[i]][2]!=0)ctx2d.fillStyle=darkgray2;
                    else ctx2d.fillStyle=white;}
                else if(mypicstock[mypic[i]][2]==0)ctx2d.fillStyle=darkgray2;
                else ctx2d.fillStyle=white;
                ctx2d.fillText(mypicstock[mypic[i]][0], width*(47+17*Math.max(0,Math.ceil((i-2)/3)))/100,height*(81+6*(i%3))/100);}
                make_pointer(width*(46+17*Math.max(0,Math.ceil((BwhoUse-2)/3)))/100,height*(79.5+6*(BwhoUse%3))/100,width*(44+17*Math.max(0,Math.ceil((BwhoUse-2)/3)))/100,height*(77.5+6*(BwhoUse%3))/100,width*(44+17*Math.max(0,Math.ceil((BwhoUse-2)/3)))/100,height*(81.5+6*(BwhoUse%3))/100);
        }
    }
    
    else if(battleMode==2){//戦闘選択時の挙動
        ctx2d.font="26px "+mainfontName;
        if(attackMiss){
            ctx2d.fillText(firstSkill[0]+"は当たらなかった...", width*25/100,height*75/100);
        }
        else{
        switch (Acount){
            case 1:
                ctx2d.fillText(firstSt[0]+" の "+firstSkill[0]+"!", width*25/100,height*75/100);
                break;
            case 2:
                ctx2d.fillText(secondSt[0]+" の "+secondSkill[0]+"!", width*25/100,height*75/100);
                break;
        }
        }
        //if(compspeed())判定
        //attackcount()で先攻の回数判定
        //ctx2d.fillText(InBattleMessage[lstnum], width*45/100,height*75/100);
        //戦闘終了か判定
        //false->選択画面に
    }
    else if(battleMode==3){//アイテム
        ctx2d.font="26px "+mainfontName;
        switch (itemCount){
            case 0:
                ctx2d.fillText(itemdata[items[loopselect][0]][0]+"をつかった!", width*25/100,height*75/100);
                break;
            case 1:
                ctx2d.fillText(baseEnemyData[0]+"の"+skillData[baseEnemyData[8][2]][0]+"!", width*25/100,height*75/100);
                break;
            case 2:
                if(attackMiss){
                    ctx2d.fillText(secondSkill[0]+"は当たらなかった...", width*25/100,height*75/100);}
                else ctx2d.fillText(firstSt[0]+"に"+damage+"のダメージ!", width*25/100,height*75/100);
                break;
            }
    }
    else if(battleMode==4){//マイピク交代
        ctx2d.font="26px "+mainfontName;
        switch (chgCount){
            case 0:
                ctx2d.fillText(mypicstock[mypic[0]][0]+"交代だ!",width*25/100,height*75/100);
                ctx2d.fillText("ゆけ "+mypicstock[mypic[loopselect]][0]+"!!", width*25/100,height*83/100);
                break;
            case 1:
                ctx2d.fillText(baseEnemyData[0]+"の"+skillData[baseEnemyData[8][2]][0]+"!", width*25/100,height*75/100);
                break;
            case 2:
                if(attackMiss){
                    ctx2d.fillText(secondSkill[0]+" は当たらなかった...", width*25/100,height*75/100);}
                else ctx2d.fillText(firstSt[0]+"に"+damage+"のダメージ!", width*25/100,height*75/100);
                break;
        }
    }

    else if(battleMode==5){//逃げるメッセージ
        if(!attackorder){
            ctx2d.font="26px "+mainfontName;
            ctx2d.fillText("敵が速くて逃げられない!",25/100,height*75/100);}
        else{
            ctx2d.font="26px "+mainfontName;
            ctx2d.fillText(mypicstock[mypic[0]][0]+" はにげた", width*25/100,height*75/100);}
    }

    else if(battleMode==6){//勝利message
        if(oneMoveFlg){
            winMessage = [enemyData[0][0]+" は倒れた。",mypicstock[mypic[0]][0]+" は勝負に勝った!","経験値500と1000マイルを手にいれた。"];
            oneMoveFlg=false;
        }
        ctx2d.fillStyle=white;
        ctx2d.font="26px "+mainfontName;
        ctx2d.fillText(winMessage[in_lstnum], width*25/100,height*75/100);
    }

    else if(battleMode==7){//戦闘不能後の次のマイピク選択
        ctx2d.font="26px "+mainfontName;
        switch (chgCount){
            case 0:
                ctx2d.fillText(mypicstock[mypic[0]][0]+" は倒れた。",width*25/100,height*75/100);
                break;
            case 1:
                if(BerrorFlg){//errorメッセージ表示
                    popupMsg.push(["ひんしなので選べない!",120,0,0,-1]);
                    BerrorFlg=false;}
                ctx2d.fillText("交代するマイピクを選択してください。", width*25/100,height*75/100);
                for (let i=0; i < mypic.length; i++){
                    if(mypicstock[mypic[i]][2]==0)ctx2d.fillStyle=darkgray2;
                    else ctx2d.fillStyle=white;
                    ctx2d.fillText(mypicstock[mypic[i]][0], width*(40+17*Math.max(0,Math.ceil((i-2)/3)))/100,height*(81+6*(i%3))/100);}
                    make_pointer(width*(38+17*Math.max(0,Math.ceil((loopselect-2)/3)))/100,height*(79.5+6*(loopselect%3))/100,width*(36+17*Math.max(0,Math.ceil((loopselect-2)/3)))/100,height*(77.5+6*(loopselect%3))/100,width*(36+17*Math.max(0,Math.ceil((loopselect-2)/3)))/100,height*(81.5+6*(loopselect%3))/100);
                break;
            case 2:
                ctx2d.fillText(mypicstock[mypic[0]][0]+" 交代だ!",width*25/100,height*75/100);
                ctx2d.fillText("たのんだ "+mypicstock[mypic[loopselect]][0]+"!!", width*25/100,height*83/100);
                break;
        }
    }

    else if(battleMode==8){//敗北message

    }
}

function drawPopupMsg(){
    for (var i = 0; i < Math.min(8,popupMsg.length);i++){
        popupMsg[i][1]--;
        if (popupMsg[i][1]<=0){
            popupMsg.splice(i,1);
        } else{
            popupMsg[i][2]++;
            ctx2d.font="10pt " + mainfontName;
            ctx2d.fillStyle="rgba(0,0,0," + Math.min(1,popupMsg[i][1]/popupWindowAniSpeed,popupMsg[i][2]/popupWindowAniSpeed)*0.8 +")";
            ctx2d.fillRect(-20+Math.min(1,popupMsg[i][1]/popupWindowAniSpeed,popupMsg[i][2]/popupWindowAniSpeed)*40,20+40*i,Math.max(250,ctx2d.measureText(popupMsg[i][0]).width+50),35);
            if (popupMsg[i][4]!=-1){
                ctx2d.fillStyle="rgba(0,0,0," + Math.min(1,popupMsg[i][1]/popupWindowAniSpeed,popupMsg[i][2]/popupWindowAniSpeed) +")";
                ctx2d.fillRect(-20+Math.min(1,popupMsg[i][1]/popupWindowAniSpeed,popupMsg[i][2]/popupWindowAniSpeed)*40+3,20+40*i+3,29,29);
                drawMypic(popupMsg[i][4],-20+Math.min(1,popupMsg[i][1]/popupWindowAniSpeed,popupMsg[i][2]/popupWindowAniSpeed)*40+3,20+40*i+3,29,29,Math.min(1,popupMsg[i][1]/popupWindowAniSpeed,popupMsg[i][2]/popupWindowAniSpeed),0);
            } else{
                ctx2d.fillStyle="rgba(255,255,255," + Math.min(1,popupMsg[i][1]/popupWindowAniSpeed,popupMsg[i][2]/popupWindowAniSpeed) +")";
                ctx2d.fillRect(-20+Math.min(1,popupMsg[i][1]/popupWindowAniSpeed,popupMsg[i][2]/popupWindowAniSpeed)*40+3+13,20+40*i+3+13,3,3);
            }
            ctx2d.font="10pt " + mainfontName;
            ctx2d.fillStyle="rgba(255,255,255," + Math.min(1,popupMsg[i][1]/popupWindowAniSpeed,popupMsg[i][2]/popupWindowAniSpeed) +")";
            ctx2d.fillText(popupMsg[i][0],42-20+Math.min(1,popupMsg[i][1]/popupWindowAniSpeed,popupMsg[i][2]/popupWindowAniSpeed)*40,43+40*i);
        }
    }
}