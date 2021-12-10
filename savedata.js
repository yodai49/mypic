function saveData(){
    //ローカルストレージにデータをセーブする関数　セーブするときに使う
    localStorage.setItem("myposx",myposx);
    localStorage.setItem("myposy",myposy);
    localStorage.setItem("myposworld",myposworld);
    localStorage.setItem("money",money);
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
    items=JSON.parse(localStorage.getItem("items"));
    mypic=JSON.parse(localStorage.getItem("mypic"));
    mypicstock=JSON.parse(localStorage.getItem("mypicstock"));
    fieldItemStatus=JSON.parse(localStorage.getItem("fieldItemStatus"));
}

function resetData(){
    //データをリセットする処理 変数に初期値をセットする　初プレイやはじめからを選択したときに使う
    //localStorage.clear();
    items=[];
    for(var i = 0;i < itemdata.length;i++) items.push([i,99]);
    items.sort(function(a,b){return (a[0]-b[0]);});
    mypic=[0];
    mypicstock=[
        ["ああああああ",[[0,10,30,25,15],[0,25,15,40,30],[0,60,30,75,15],[0,75,15,90,30],[0,30,70,50,90],[0,50,90,70,70]],250,300,50,50,100,100,[4,20,30,9,20,26,31,48,10,5,50],5,100,3,2,120,[],0,0]
    ]
    myposx=homposx,myposy=homposy,myposworld=homposworld,money=10000;
    fieldItemStatus=[];
    for(var i = 0;i < itemobj.length;i++){
        fieldItemStatus[i] = itemobj[i];
    }
}