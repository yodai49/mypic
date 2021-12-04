function initiate_field(){
    /*　フィールド・キャラクターの初期化処理
    @param なし
    @return なし
    */
    var charaimg1=new Image(),charaimg2=new Image();
    charaimg1.src="./imgs/character_field1.png";
    charaimg2.src="./imgs/character_field2.png";
    characanvas=document.createElement("canvas");
    characanvas.width=64, characanvas.height=64
    characanvas=characanvas.getContext("2d"); //charaimg1は0,0、charaimg2は60,0の位置に描画
    charaimg1.onload=function(){characanvas.drawImage(charaimg1,0,0,60,60)}
    charaimg2.onload=function(){characanvas.drawImage(charaimg2,60,0,60,60)}
}
function fieldMain() {
    const charasize=30; //キャラクターのサイズ
    /*
    @param なし
    @return なし
    */
    ctx2d.drawImage(characanvas,0,0,60,60,(width-charasize)/2,(height-charasize)/2);
}