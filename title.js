var selectTitleFlg=0,selectTitleNum=1;
const gameTitle="マイピクチャーズ";
function titleMain() {
    /*　タイトル画面の描画関数
    @param なし
    @return 
    */
   ctx2d.clearRect(0,0,width,height);
   ctx2d.fillStyle="rgba(255,255,255,1)";
   ctx2d.font="26pt " + mainfontName;
    ctx2d.fillText("Loading" + ".".repeat(Math.floor(globalTime/3)%3),width/2-ctx2d.measureText("Loading" + ".".repeat(Math.floor(globalTime/3)%3)).width/2,height/2-20);
    if (fieldReDrawFlg){
        const fieldimg=new Image();
        fieldimg.src="./imgs/titleimg.png";
        fieldimg.onload=function(){field2d.drawImage(fieldimg,0,0,width,height);}
        fieldReDrawFlg=0;
    }
    ctx2d.clearRect(0,0,width,height);
   ctx2d.fillStyle="rgba(255,255,255,1)";
   ctx2d.font="50pt " + mainfontName;
   for(var i = 0; i < gameTitle.length;i++){
       if(i ==0 || i == 1){
            ctx2d.fillStyle="rgba(255,200,200,1)";
       } else{
            ctx2d.fillStyle="rgba(255,255,255,1)";           
       }
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
   if (upkey && !selectTitleFlg && selectTitleNum==1) selectTitleNum=0,selectTitleFlg=1,crosskeySE.play();
   if(downkey && !selectTitleFlg && selectTitleNum==0) selectTitleNum=1,selectTitleFlg=1,crosskeySE.play();
   if (isFirst) selectTitleNum=0;
   if (!upkey &&  !downkey && !zkey) selectTitleFlg=0;
   if (zkey && !selectTitleFlg) { ///ゲームスタートの処理
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
   titleAni++;
}