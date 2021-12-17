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
    jsonOb=JSON.stringify(materialVisible,undefined,1);
    localStorage.setItem("materialVisible",jsonOb);
    isFirst=0;
}

function loadData(){
    //ローカルストレージからデータを取ってくる関数　ロードするときに使う
    myposx=Number(localStorage.getItem("myposx"));
    myposy=Number(localStorage.getItem("myposy"));
    myposworld=Number(localStorage.getItem("myposworld"));
    warpAni=11;
    money=Number(localStorage.getItem("money"));
    nextEventNum=Number(localStorage.getItem("nextEventNum"));
    items=JSON.parse(localStorage.getItem("items"));
    mypic=JSON.parse(localStorage.getItem("mypic"));
    mypicstock=JSON.parse(localStorage.getItem("mypicstock"));
    fieldItemStatus=JSON.parse(localStorage.getItem("fieldItemStatus"));
    materialVisible=JSON.parse(localStorage.getItem("materialVisible"));
    eventMessageWindow=0,eventMessageWindowMsg="",eventMessageSelectNum=0,procreateMsg="",eventMessageWindowMsgStack=[],eventMessageWindowAni=0;
    if(debugMode){
        getItem(101);
        getItem(102);
        getItem(103);
        for(var i = 0; i <13;i++){
            getItem(51+i);
        }
        getItem(201);
    }
    if(materialVisible==null){
        materialVisible=[];
        for(var i = 0;i<101;i++)materialVisible[i]=0;
    }
}

function resetData(){
    //データをリセットする処理 変数に初期値をセットする　初プレイやはじめからを選択したときに使う
    //localStorage.clear();
    items=[];
    if(debugMode) for(var i = 0;i < itemdata.length;i++) items.push([i,50]);
    items.sort(function(a,b){return (a[0]-b[0]);});
    mypic=[];
    mypicstock=[];
    for(var i = 0;i < 100;i++) materialVisible[i]=0;
    myposx=homposx,myposy=homposy,myposworld=homposworld,money=100;
    fieldItemStatus=[];
    for(var i = 0;i < itemobj.length;i++){
        fieldItemStatus[i] = itemobj[i];
    }
    isFromFirst=1;
    nextEventNum=0;
    eventMessageWindow=0,eventMessageWindowMsg="",eventMessageSelectNum=0,procreateMsg="",eventMessageWindowMsgStack=[],eventMessageWindowAni=0;
}