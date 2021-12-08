var selectTitleFlg=0,selectTitleNum=1;
function titleMain() {
    /*　タイトル画面の描画関数
    @param なし
    @return 
    */
    if (fieldReDrawFlg){
        const fieldimg=new Image();
        fieldimg.src="./imgs/titleimg.png";
        fieldimg.onload=function(){field2d.drawImage(fieldimg,0,0,width,height);}
        fieldReDrawFlg=0;
    }
    ctx2d.clearRect(0,0,width,height);
   ctx2d.fillStyle="rgba(255,255,255,1)";
   ctx2d.font="50pt " + mainfontName;
   ctx2d.fillText("マイピク",(width-ctx2d.measureText("マイピク").width)/2,height/2);
   ctx2d.font="20pt " + mainfontName;
   if (!selectTitleNum){
    ctx2d.fillStyle="rgba(255,255,255,"+(Math.sin(globalTime/6)*0.3+0.7)+")";
    ctx2d.fillText("はじめから",(width-ctx2d.measureText("はじめから").width)/2,height/2+100);
    ctx2d.fillStyle="rgba(105,105,105,1)";
    ctx2d.fillText("つづきから",(width-ctx2d.measureText("つづきから").width)/2,height/2+140);
} else{
    ctx2d.fillStyle="rgba(105,105,105,1)";
    ctx2d.fillText("はじめから",(width-ctx2d.measureText("はじめから").width)/2,height/2+100);
    ctx2d.fillStyle="rgba(255,255,255,"+(Math.sin(globalTime/6)*0.3+0.7)+")";
    ctx2d.fillText("つづきから",(width-ctx2d.measureText("つづきから").width)/2,height/2+140);
   }
   if (upkey && !selectTitleFlg) selectTitleNum=0,selectTitleFlg=1;
   if(downkey && !selectTitleFlg) selectTitleNum=1,selectTitleFlg=1;
   if (isFirst) selectTitleNum=0;
   if (!upkey &&  !downkey && !zkey) selectTitleFlg=0;
   if (zkey && !selectTitleFlg) { ///ゲームスタートの処理
       if (!selectTitleNum){//はじめから
            resetData();
       } else{ //つづきから
            loadData();
       }
       nextMode=1;
       modeAnimation=1;
       selectTitleFlg=1;
       menuWindow=0;
   }
}