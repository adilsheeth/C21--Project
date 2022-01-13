//Don't die: The Game
//Ver 1.4

var ship, shipimg;
var bkgn, bkgnimg;
var obst, comtimg;
var coin, coinimg;
var uufo, uufoimg;
var powr, powrimg;
var lasr, lasrimg;
var alin, alinimg;
var alsr;

var lasrsfx;
var coinsfx;
var powrsfx;
var gmovsfx;
var bkgnsfx;

var state = 'start';
var score = 0;
var speed = 4;
var hscore = 0;
var diff = 80;
var k = 0;

var obstgrp;
var coingrp;
var powrgrp;
var powrcnt;
var alinlsr;

function preload() {
    shipimg = loadImage("aspaceship.png");
    bkgnimg = loadImage("abackground.jpg");
    comtimg = loadImage("acomet.png");
    coinimg = loadImage("acoin.png");
    uufoimg = loadImage("aufo.png");
    powrimg = loadImage("apowerup.png");
    lasrimg = loadImage("alaser.png");
    alinimg = loadImage("aalien.png");

    lasrsfx = loadSound("blaser.wav");
    coinsfx = loadSound("bcoin.wav");
    powrsfx = loadSound("bpowerup.wav");
    gmovsfx = loadSound("bgameover.wav");
    //bkgnsfx = loadSound("bbkgn.wav");
}

function setup() {
    bkgn = createSprite(300,300,600,600);
    bkgn.addImage(bkgnimg);
    bkgn.scale = 1.7;
    
    ship = createSprite(300,windowHeight - 300,20,20);
    ship.addImage(shipimg);
    ship.scale = 0.15;
    ship.visible = false;

    alin = createSprite(300,windowHeight - 100,20,20);
    alin.addImage(alinimg);
    alin.scale = 0.25;
    alin.visible = false;

    obstgrp = new Group();
    coingrp = new Group();
    powrgrp = new Group();
    alinlsr = new Group();
    powrcnt = [];

    //bkgnsfx.play();
    //bkgnsfx.loop();
}

function draw() {
    createCanvas(windowHeight, windowHeight);
    drawSprites();

    if(state == 'start'){
        textSize(45);
        text("Don't Die!", (windowHeight/2)-100,windowHeight/2 - 50);
        textSize(25);
        text("\t\t\tUse the mouse to move left and right. \n\t\t\t\t\t\t\t\t\t\tPress shift to go up.\n\t\t\t\t\t\t\t\t\tCollect coins for points. \nCollect powerups to shoot lasers using enter.\n\t\tDodge lasers from the alien ship below.\n\t\t\t\t\t\t\t\tAvoid comets and UFOs. \n\t\t\t\t\t\t\t\t\tDon't fall into the void.", windowHeight/2 -250, windowHeight/2);
        textSize(35);
        text("Press ENTER to begin.",windowHeight/2 -190 ,windowHeight/2 + 250);
        textSize(25);
        text("High Score: " + hscore ,windowHeight/2 - 80,windowHeight/2-120);
        if(keyDown("enter")){
            state = 'play';
            ship.visible = true;
            alin.visible = true;
        }
    }

    if(state == 'play'){
        if(bkgn.y > windowHeight){
            bkgn.y = 0;
        }
        if(keyDown("shift")){
            ship.velocityY = -3;
        }
        if(frameCount % diff == 0){
            spawn();
            speed+= 0.1;
            k++;
            if(diff != 30 && k == 2){
                diff--;
                k = 0
            }
        }
        if(frameCount % 20 == 0){
            score+= 1;
        }
        if(ship.isTouching(obstgrp) || ship.y > windowHeight + 10){
            state = 'end';
            gmovsfx.play();
        }
        if(ship.isTouching(coingrp)){
            score+= 5;
            coinsfx.play();
            coingrp.destroyEach();
        }
        if(ship.isTouching(powrgrp)){
            score+= 5;
            powrgrp.destroyEach();
            powrsfx.play();
            powrcnt.push(1);
        }
        if(ship.isTouching(alin)){
            state = 'end';
            gmovsfx.play();
        }
        if(powrcnt.length >= 1){
            if(keyDown("enter")){
                powrcnt.pop();
                lasrsfx.play();
                lasr = createSprite(ship.x, ship.y - 10, 20,20);
                lasr.addImage(lasrimg);
                lasr.scale = 0.1;
                lasr.velocityY = -speed;
                lasr.depth = ship.depth - 1;
                lasr.lifetime = 180;
            }
        }
        try{
            if(lasr.isTouching(obstgrp)){
                obstgrp.destroyEach();
                lasr.destroy();
                lasrcnt.pop();
            }
        }
        catch{}
        if(ship.isTouching(alinlsr)){
            state = 'end';
            console.log('ded');
            gmovsfx.play();
        }
        try{
            if(alsr.isTouching(obstgrp)){
                obstgrp.destroyEach();
            }
        }
        catch{}
        textSize(22);
        text("Score: " + score, windowHeight - 110, 50);
        textSize(22);
        text("Powerup: " + powrcnt.length, windowHeight - 130,80);
        ship.x = World.mouseX;
        ship.velocityY+= 0.2;
        bkgn.velocityY = speed;
        alin.x = ship.x;
        alin.velocityY = 0;
    }

    if(state == 'end'){
        try{
            lasr.destroy();
        }
        catch{}
        ship.visible = false;
        alin.visible = false;
        ship.velocityY = 0;
        bkgn.velocityY = 0;
        obstgrp.destroyEach();
        coingrp.destroyEach();
        powrgrp.destroyEach();
        alinlsr.destroyEach();
        if(score > hscore){
            hscore = score;
        }
        score = 0;
        speed = 4;
        diff = 0;
        powrcnt = [];
        lasrcnt = [];
        textSize(45);
        text("Game Over!", (windowHeight/2)-120,windowHeight/2);
        textSize(35);
        text("Press SHIFT to retry.",windowHeight/2 -170 ,windowHeight/2 + 60);
        if(keyDown("shift")){
            state = 'start';
            ship.x = 300;
            ship.y = windowHeight - 300;
            diff = 80;
        }
    }
}

function spawn() {
    var i = Math.round(random(30,windowHeight-30));
    var j = Math.round(random(1,5));
    switch (j){
        case(1):
            obst = createSprite(i,0,20,20);
            obst.addImage(comtimg);
            obst.scale = 0.3;
            obst.velocityY = speed;
            obst.lifetime = 200;
            obstgrp.add(obst);
            break;        
        case(2):
            coin = createSprite(i,0,20,20);
            coin.addImage(coinimg);
            coin.velocityY = speed;
            coin.scale = 0.02;
            coin.lifetime = 200;
            coingrp.add(coin);
            break;
        case(3):
            uufo = createSprite(i,0,20,20);
            uufo.addImage(uufoimg);
            uufo.velocityY = speed;
            uufo.scale = 0.2;
            uufo.lifetime = 200;
            obstgrp.add(uufo);
            break;
        case(4):
            powr = createSprite(i,0,20,20);
            powr.addImage(powrimg);
            powr.velocityY = speed;
            powr.scale = 0.2;
            powr.lifetime = 200;
            powrgrp.add(powr);
            break;
        case(5):
            alsr = createSprite(alin.x, alin.y-10,20,20);
            alsr.addImage(lasrimg);
            lasrsfx.play();
            alsr.scale = 0.1;
            alsr.velocityY = -5;
            alinlsr.add(alsr);
            break;
        default:
            break;  
    }
}
