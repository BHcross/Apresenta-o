var JOGAR = 1;
var ENCERRAR = 0;
var estados = JOGAR;
var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;
var imagemnuvem;
var obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;
var pontuacao;
var grupoobstaculos, gruponuvens;
var fimdejogo, reiniciar, gameover, restart;
var somSalto, somMorte, checkPoint;

function preload(){
  trex_correndo =loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_colidiu = loadImage("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemnuvem = loadImage("cloud2.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  
  gameover = loadImage("gameOver.png");
  restart = loadImage("restart.png");
  
  checkPoint = loadSound("checkpoint.mp3");
  somSalto = loadSound("jump.mp3");
  somMorte = loadSound("die.mp3");
  

}

function setup() {

  createCanvas(windowWidth,windowHeight);
  
  //criar texto da pontuação
  
  
  //criar um sprite do trex
  var ytrex = height*5/100
  trex = createSprite(50,height-ytrex,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided", trex_colidiu);
  trex.scale = 0.5;
  
  //criar um sprite do solo
  var ysolo = height*3/100
  solo = createSprite(width/2,height-ysolo,width,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
  
  //cria um solo invisível
  var yinvisivel = height*2/100
  soloinvisivel = createSprite(width/2,height-yinvisivel,width,10);
  soloinvisivel.visible = false;
  
  grupoobstaculos = new Group();
  gruponuvens = new Group();
  
  pontuacao = 0;
  
  
  trex.setCollider("circle", 0, 0, 40);
  
  fimdejogo = createSprite(width/2,height/2);
  fimdejogo.addImage(gameover);
  fimdejogo.visible = false;
  
  yreiniciar = height/100*10
  reiniciar = createSprite(width/2,height/2 + yreiniciar);
  reiniciar.addImage(restart);
  reiniciar.visible = false;
  
  fimdejogo.scale = 0.5;
  reiniciar.scale = 0.5;
  
 
}

function draw() {
  
  //definir cor de fundo
  background(240);
  
  //mostra a pontuação na tela
  var ypontuacao = height*80/100;
   text("Pontuacao: "+ pontuacao, width/2 -50,height-ypontuacao);
  
    if(pontuacao > 0 && pontuacao%100 == 0){

      checkPoint.play();
    }
  
   //impedir o trex de cair 
  trex.collide(soloinvisivel);
  
  
  if(estados == JOGAR){
    //faz o solo de mover
    solo.velocityX = -(4+3*pontuacao/100);
    
    //atualiza a pontuação
    pontuacao = pontuacao + Math.round((frameRate()/60));
    
   
    
     //pular quando a tecla espaço é acionada
    if(keyDown("space")&& trex.y > height -60) {
      trex.velocityY = -10;
      somSalto.play();
   }

    trex.velocityY = trex.velocityY + 0.5

    if (solo.x < 0){
      solo.x = solo.width/2;
    }
  
      //gerador de nuvens e obstáculos 
      GerarNuvens();
      GerarObstaculos();
    
      if(grupoobstaculos.isTouching(trex)){
        somMorte.play();
        estados = ENCERRAR;
       // somSalto.play();
       // trex.velocityY = -12;
      }
    
  }
  else if(estados == ENCERRAR){
    solo.velocityX = 0;
    grupoobstaculos.setVelocityXEach(0);
    gruponuvens.setVelocityXEach(0);
    
    trex.changeAnimation("collided");
    trex.velocityY = 0;
    
    //define o tempo de vida dos objetos do jogo após o fim
    grupoobstaculos.setLifetimeEach(-1);
    gruponuvens.setLifetimeEach(-1);
    
    fimdejogo.visible = true;
    reiniciar.visible = true;
    if(mousePressedOver(reiniciar)){
      reset();

    }
   
    
  }
  
 
  
  drawSprites();
  
}

function GerarNuvens(){
  
  if(frameCount % 60 == 0){
  var nuvem = createSprite(600,100,40,10);
  nuvem.velocityX = -3;
  nuvem.addImage(imagemnuvem);
  nuvem.scale = 0.6;
  ynuvem = height/100*20;
  var y2nuvem = height/100*50
  nuvem.y = Math.round(random(height-ynuvem,height-y2nuvem));
    
  nuvem.depth = trex.depth;
  trex.depth = trex.depth+1;
    
  nuvem.lifetime = 200;
    
    gruponuvens.add(nuvem);
  }
  
}

function GerarObstaculos(){
  
  if(frameCount %60 == 0){
    
    var yobstaculo = height/100*5
    var obstaculo = createSprite(width,height-yobstaculo,10,40);
    obstaculo.velocityX = -(6+ pontuacao/100);
    
    var rand = Math.round(random(1,6));
    
    switch(rand){
        case 1: obstaculo.addImage(obstaculo1);
                break;
        case 2: obstaculo.addImage(obstaculo2);
                break;
        case 3: obstaculo.addImage(obstaculo3);
                break;
        case 4: obstaculo.addImage(obstaculo4);
                break;
        case 5: obstaculo.addImage(obstaculo5);
                break;
        case 6: obstaculo.addImage(obstaculo6);
                break;
                default: break;
    }
    
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
    
    grupoobstaculos.add(obstaculo);
  }
  
}
function reset(){
  
  estados = JOGAR;
  reiniciar.visible = false;
  fimdejogo.visible = false;
  grupoobstaculos.destroyEach();
  gruponuvens.destroyEach();
  trex.changeAnimation("running", trex_correndo);
  pontuacao =  0;
  console.log("sei lá");
}


