function battleMain() {
    
    ctx2d.fillStyle=skyblue;
    ctx2d.fillRect(0,0,width,height*25/40);

    ctx2d.fillStyle=black;
    ctx2d.fillRect(0,height*25/40,width,height*15/40);
    ctx2d.font="25px san-serif";
    ctx2d.fillText("Battle", 50,100);

    //character
    ctx2d.fillStyle=blue;
    ctx2d.fillRect(200,200,50,50);


    //enemy
    ctx2d.fillStyle=red;
    ctx2d.fillRect(600,200,50,50);
    



}