function saveData(){
    //ローカルストレージにデータをセーブする関数　セーブするときに使う
    localStorage.setItem("myposx",myposx);
    localStorage.setItem("myposy",myposy);
    localStorage.setItem("myposworld",myposworld);
    let jsonOb;
    jsonOb=JSON.stringify(items,undefined,1);
    localStorage.setItem("items",jsonOb);
    jsonOb=JSON.stringify(mypic,undefined,1);
    localStorage.setItem("mypic",jsonOb);
    jsonOb=JSON.stringify(mypicstock,undefined,1);
    localStorage.setItem("mypicstock",jsonOb);
}

function loadData(){
    //ローカルストレージからデータを取ってくる関数　ロードするときに使う
    myposx=Number(localStorage.getItem("myposx"));
    myposy=Number(localStorage.getItem("myposy"));
    myposworld=Number(localStorage.getItem("myposworld"));
    items=JSON.parse(localStorage.getItem("items"));
    mypic=JSON.parse(localStorage.getItem("mypic"));
    mypicstock=JSON.parse(localStorage.getItem("mypicstock"));
}

function resetData(){
    //データをリセットする処理 変数に初期値をセットする　初プレイやはじめからを選択したときに使う
    localStorage.clear();
}