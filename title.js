var selectTitleFlg=0,selectTitleNum=1,titleLoadingFlg=1;
const gameTitle="マイピクチャーズ";
const titleCol=[
    "rgba(235,150,150,1)",
    "rgba(150,235,150,1)",
    "rgba(150,150,235,1)",
    "rgba(240,240,150,1)",
    "rgba(230,150,230,1)",
    "rgba(235,150,150,1)",
    "rgba(150,235,150,1)",
    "rgba(150,150,235,1)",
]
function titleMain() {
    /*　タイトル画面の描画関数
    @param なし
    @return 
    */

   //ロードの確認処理//
   for(var i = 0; i < 50;i++){
       if(fielddata[i][0]!=-1){
            if(!fieldImgComplete[i] && fieldimg[i].complete == true){
                fieldImgComplete[i]=1;
                loadedimgCnt++;
                if(loadedimgCnt==imgCnt) playFieldBGM(-1);
            } 
       }
   }

   ctx2d.clearRect(0,0,width,height);
    if (fieldReDrawFlg){
        titleLoadingFlg=1;    
        const fieldimg=new Image();
        fieldimg.src="./imgs/titleimg.jpg";
        fieldimg.onload=function(){field2d.drawImage(fieldimg,0,0,width,height); titleLoadingFlg=0;}
        fieldReDrawFlg=0;
    }
    ctx2d.clearRect(0,0,width,height);
    ctx2d.fillStyle="rgba(255,255,255,1)";
    ctx2d.font="50pt " + mainfontName;
    for(var i = 0; i < gameTitle.length;i++){
       ctx2d.fillStyle=titleCol[i];
       var titleAniX=0,titleAniY=0;
       if (i % 4 == 0) titleAniX=1;
       if (i % 4 == 1) titleAniX=-1;
       if (i % 4 == 2) titleAniY=1;
       if (i % 4 == 3) titleAniY=-1;
       let param=30;/////
       let t=3*(titleAni-i*param)%1000;
       if ((titleAni*3)%1000 < 700){
       } else{
        t=3*(titleAni-param*(gameTitle.length+1.2))%1000;
       }
       titleAniY=-0.16*(Math.max(0,-t*t+t*param)+Math.max(0,(-(t-param)*(t-param)+(t-param)*param)/2)+Math.max(0,(-(t-2*param)*(t-2*param)+(t-2*param)*param)/4));
       let drawX=width/2+(i-gameTitle.length/2)*80,drawY=height/2+titleAniY;
        ctx2d.fillText(gameTitle.substr(i,1),drawX,drawY-20);
    }
    ctx2d.font="20pt " + mainfontName;
    if (!selectTitleNum){
        ctx2d.fillStyle="rgba(255,255,255,"+(Math.sin(globalTime/6)*0.3+0.7)+")";
        ctx2d.fillText("はじめから",(width-ctx2d.measureText("はじめから").width)/2,height/2+80);
        ctx2d.fillStyle="rgba(105,105,105,1)";
        ctx2d.fillText("つづきから",(width-ctx2d.measureText("つづきから").width)/2,height/2+120);
    } else{
        ctx2d.fillStyle="rgba(105,105,105,1)";
        ctx2d.fillText("はじめから",(width-ctx2d.measureText("はじめから").width)/2,height/2+80);
        ctx2d.fillStyle="rgba(255,255,255,"+(Math.sin(globalTime/6)*0.3+0.7)+")";
        ctx2d.fillText("つづきから",(width-ctx2d.measureText("つづきから").width)/2,height/2+120);
    }
    ctx2d.font="16pt " + mainfontName;
    ctx2d.fillStyle="rgba(255,255,255,1)";
    ctx2d.fillText("Zキーで決定",(width-ctx2d.measureText("Zキーで決定").width)/2,height/2+200);
    var titleMypicAni=globalTime%120;
    var titleMypicSin=Math.max(0,5*Math.sin(globalTime/5));//ピクピク
    drawMypicTempObj=titleMypicImg[Math.floor(globalTime/120)%4];
    if(Math.floor(globalTime/120)%4==0){
        drawMypic(0,50,titleMypicSin+Math.min(0,-200/1800*titleMypicAni*(titleMypicAni-120)-200),200,200,1,1,"rgba("+typeDataCol[1]+",1)");
    } else if(Math.floor(globalTime/120)%4==1){
        drawMypic(0,710,titleMypicSin+340-Math.min(0,-200/1800*titleMypicAni*(titleMypicAni-120)-200),200,200,1,1,"rgba("+typeDataCol[2]+",1)");
    }else if(Math.floor(globalTime/120)%4==2){
        drawMypic(0,710-Math.min(0,-200/1800*titleMypicAni*(titleMypicAni-120)-200),titleMypicSin,200,200,1,1,"rgba("+typeDataCol[5]+",1)");
    }else if(Math.floor(globalTime/120)%4==3){
        drawMypic(0,Math.min(0,-200/1800*titleMypicAni*(titleMypicAni-120)-200),titleMypicSin+290,200,200,1,1,"rgba("+typeDataCol[4]+",1)");
    }
    if(!titleLoadingFlg && imgCnt<=loadedimgCnt){
        if (upkey && !selectTitleFlg && selectTitleNum==1) selectTitleNum=0,selectTitleFlg=1,crosskeySE.play();
        if(downkey && !selectTitleFlg && selectTitleNum==0) selectTitleNum=1,selectTitleFlg=1,crosskeySE.play();
        if (isFirst) selectTitleNum=0;
        if (!upkey &&  !downkey && !zkey) selectTitleFlg=0;
        if (zkey && !selectTitleFlg  && !modeAnimation) { ///ゲームスタートの処理
            zkeySE.play();
            if (!selectTitleNum){//はじめから
                resetData();
            } else{ //つづきから
                loadData();
            }
            nextMode=1;
            modeAnimation=1;
            selectTitleFlg=1;
            menuWindow=0;
            playFieldBGM(myposworld);
        }
    } else{
        ctx2d.fillStyle="rgba(0,0,0,1)";
        ctx2d.fillRect(0,0,width,height);
        ctx2d.fillStyle="rgba(255,255,255,1)";
        ctx2d.font="26pt " + mainfontName;
        ctx2d.fillText("Loading" + ".".repeat(Math.floor(globalTime/10)%3),width/2-ctx2d.measureText("Loading..").width/2,180);
        ctx2d.fillText(loadedimgCnt + " / " +imgCnt,width/2-ctx2d.measureText(loadedimgCnt + " / " +imgCnt).width/2,220);
        ctx2d.fillRect(width/2-200,250,400,3);
        ctx2d.fillStyle="rgba(200,255,200,1)";
        ctx2d.fillRect(width/2-200,250,400*loadedimgCnt/imgCnt,3);
    }
   titleAni++;
}