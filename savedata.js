function saveData(){
    //ローカルストレージにデータをセーブする関数　セーブするときに使う
    localStorage.setItem("myposx",myposx);
    localStorage.setItem("myposy",myposy);
    localStorage.setItem("myposworld",myposworld);
    localStorage.setItem("money",money);
    localStorage.setItem("nextEventNum",nextEventNum);
    let jsonOb;
    jsonOb=JSON.stringify(items,undefined,1);
    localStorage.setItem("items",jsonOb);
    jsonOb=JSON.stringify(mypic,undefined,1);
    localStorage.setItem("mypic",jsonOb);
    jsonOb=JSON.stringify(mypicstock,undefined,1);
    localStorage.setItem("mypicstock",jsonOb);
    jsonOb=JSON.stringify(fieldItemStatus,undefined,1);
    localStorage.setItem("fieldItemStatus",jsonOb);
}

function loadData(){
    //ローカルストレージからデータを取ってくる関数　ロードするときに使う
    myposx=Number(localStorage.getItem("myposx"));
    myposy=Number(localStorage.getItem("myposy"));
    myposworld=Number(localStorage.getItem("myposworld"));
    money=Number(localStorage.getItem("money"));
    nextEventNum=Number(localStorage.getItem("nextEventNum"));
    items=JSON.parse(localStorage.getItem("items"));
    mypic=JSON.parse(localStorage.getItem("mypic"));
    mypicstock=JSON.parse(localStorage.getItem("mypicstock"));
    fieldItemStatus=JSON.parse(localStorage.getItem("fieldItemStatus"));
}

function resetData(){
    //データをリセットする処理 変数に初期値をセットする　初プレイやはじめからを選択したときに使う
    //localStorage.clear();
    items=[];
    if(debugMode) for(var i = 0;i < itemdata.length;i++) items.push([i,50]);
    items.sort(function(a,b){return (a[0]-b[0]);});
    mypic=[];
    mypicstock=[
    ]
    myposx=homposx,myposy=homposy,myposworld=homposworld,money=10000;
    fieldItemStatus=[];
    for(var i = 0;i < itemobj.length;i++){
        fieldItemStatus[i] = itemobj[i];
    }
    isFromFirst=1;
    nextEventNum=0;
}