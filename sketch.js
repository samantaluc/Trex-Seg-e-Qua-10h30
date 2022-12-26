var ground, groundImage, invisibleGround; //variavel do chão 28/11 (var nova 30/11)

var trex, trex_running; //variavel do trex 28/11

var cloud, cloudImage; //variavel da nuvem 05/12

var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6; 
//variavel para carregar as imagens dos obstaculos 07/12

var trex_collided; //variavel para o trex surpreso 12/12

var score; //variavel para a pontuação 12/12

var PLAY = 1; //variavel do jogo no estado de Jogar com valor para troca (switch) 12/12

var END = 0; //variavel do jogo no estado de Final com valor para troca (switch) 12/12

var gamestate = PLAY; //variavel de Estado de Jogo, sendo a inicial de Jogar 12/12

var obstacles; //variavel para obstaculos (grupo) 12/12

var clouds; //variavel para nuvens (grupo) 12/12

var gameOver, restart; //variavel para Fim de Jogo e Reiniciar 14/12

var gameOverImg, restartImg; //variavel para imagem de Game Over e Reiniciar 14/12

var jumpSound, dieSound, checkPointSound; //variavel para os sons 19/12
//---------------------------------------
function preload(){
  //Preload vai carregar arquivos de imagem (.PNG) e som (.MP3)
  trex_running = loadAnimation ("trex1.png" , "trex3.png" , "trex4.png");//28/11
  groundImage = loadImage("ground2.png"); //carrega a img do chão 30/11
  cloudImage = loadImage("cloud.png"); //05/12
  //imagens para os obstáculos 07/12
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  trex_collided = loadImage("trex_collided.png"); //trex surpreso pela colisão 12/12

//imagens para reiniciar e game over 14/12
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
//sons para o jogo 19/12
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkpoint.mp3");
}
//---------------------------------------
function setup(){
  //Setup vai definir as configurações
  //cria a tela 28/11
  createCanvas(600,200); 
  //criar o sprite trex 28/11
  trex = createSprite(50, 180, 20, 50);
  //adiciona a animação criada no preload 28/11
  trex.addAnimation("running", trex_running);
  //definir a escala 28/11
  trex.scale = 0.5;
  //definir a posição inicial no eixo horizontal 28/11
  trex.x = 50;
  //criar o chão (ground) 30/11
  ground = createSprite(200,180,400,20);
  //adiciona imagem ao chão 30/11
  ground.addImage("ground",groundImage);
  //posição do chão em x sempre vai ser metade da sua largura, ou seja, 400/2=200. 30/11
  ground.x = ground.width /2;
  //velocidade de movimento do chão em x. 30/11
  ground.velocityX = -4;
  //chão invisivel para o trex colidir e não flutuar 30/11
  invisibleGround = createSprite(200,190,400,10);
  //sprite.visible escolhe a visibilidade. True = aparece. False = desaparece 30/11
  invisibleGround.visible = false;
  score = 0; //valor inicial da pontuação 12/12

  //cria os grupos de obstaculos e nuvens 14/12
  clouds = new Group();
  obstacles = new Group();

  //cria o sprite de Fim de Jogo 14/12
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;

  //cria o sprite de Reiniciar 14/12
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale = 0.5;

//verifica se o trex encostou no obstaculo 14/12
  trex.setCollider("circle",0,0,40); 
  
  trex.debug = false;
  //se False, não exibe o modelo de distancia de colisao 14/12
  //se True, exibe o modelo de distancia de colisao 14/12
}
//------------------------------------------
function draw(){
  //Draw vai desenhar na nossa tela
  background("white");
  //----------ESTADO DE JOGO JOGAR(PLAY)-----------
  if (gamestate === PLAY){ //estado de JOGAR 12/12
    //velocidade do chão aumenta conforme a pontuação 21/12
      ground.velocityX = -(4 + 3 * score/100);
    //exibe o texto de pontuação 12/12
      text("Pontuação" + score, 500, 50);
    //calcula a pontuação dividindo o total de frames gerados por 60 12/12
      score = score + Math.round(frameCount/60);
    //se a pontuação for maior que 0 e for multiplo de 100 (100,200,300,...) 19/12
      if(score>0 && score%100 === 0){
        checkPointSound.play(); //toca o som a cada 100 pts
      }
    //pular quando a tecla espaço for pressionada e somente quando estiver acima do eixo y=100
    //30/11
      if(keyDown("space") && trex.y >= 100) {
       trex.velocityY = -10;
       jumpSound.play(); //toca o som do pulo 19/12
      }
    //trex voltar ao chão depois do pulo 30/11
      trex.velocityY = trex.velocityY + 0.8
    //impedir que o trex caia 30/11
      trex.collide(invisibleGround);
    //chão volta a posição original quando passa da posição x = 0 (-1,-2,-3...) 30/11
      if (ground.x < 0){
        ground.x = ground.width/2;
      }
      spawnClouds(); //chama a função de gerar nuvens 05/12
      spawnObstacles();//chama a função para gerar os obstáculos 07/12

      //se os obstaculos tocarem o trex, o jogo acaba 14/12
    if(obstacles.isTouching(trex))
        { 
          dieSound.play(); // toca o som dele morrendo 19/12
          gamestate = END; // mudar o estado de jogo para Final
        }
    gameOver.visible = false; //não tem visibilidade da imagem de GameOver 14/12
    restart.visible = false; //não tem visibilidade da imagem de Restart 14/12
  }
  //----------ESTADO DE JOGO FINAL(END)-----------
  else if (gamestate === END) { //estado de FINAL 12/12
      ground.velocityX=0; //movimento do chão parado 12/12
      trex.velocityY = 0;//MOVIMENTO DO TREX PARADO 12/12

    //mudar a animação do trex para colidiu 12/12
      trex.changeAnimation("collide", trex_collided);

      gameOver.visible = true; //visibilidade da imagem de GameOver 14/12
      restart.visible = true; //visibilidade da imagem de Restart 14/12

      //definir tempo de vida aos objetos do jogo para que nunca sejam destruídos 14/12
       obstacles.setLifetimeEach(-1);
       clouds.setLifetimeEach(-1);

     //definir velocidade aos objetos do jogo para que nunca se movam 14/12
       obstacles.setVelocityXEach(0);
       clouds.setVelocityXEach(0);
  }
  drawSprites(); //desenha os sprites na tela 28/11

}
//função de gerar nuvens 05/12
function spawnClouds(){
  if(frameCount % 60 === 0){ //gera nuvens nos intervalos 0, 60, 120, 180,...
    //simbolo de % e === indicam o que sobra da divisão
      cloud = createSprite(600,100,40,10);
      cloud.velocityX =-3; 
      cloud.addImage(cloudImage); //adiciona a imagem ao sprite
      cloud.scale = 0.4; 
      cloud.y = Math.round(random(10,60)); 
      //Math.round arredonda os valores
      //random vai gerar em intervalos aleatorios (a,b) 
      //a = intervalo inicial
      //b = intervalo final
      cloud.lifetime = 200;//posição x dividida pela velocidade 600/3 = 200 segundos
      //tempo de vida das nuvens na memória 07/12
      cloud.depth = trex.depth;
      //depth = profundidade 07/12
      trex.depth = trex.depth + 1;
      //trex fica a frente dos sprites de nuvem 07/12
      clouds.add(cloud); //adiciona ao grupo 14/12
  }
}
//função de gerar obstáculos 07/12
function spawnObstacles(){
  if (frameCount % 60 === 0){
    var obstacle = createSprite(400,165,10,40);
    obstacle.velocityX = -(6 + score/100);//aumentar a velocidade dos obstáculos conforme pontuaçao 21/12
     //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
     switch(rand) {
       case 1: obstacle.addImage(obstacle1);
               break;//reinicia a escolha
       case 2: obstacle.addImage(obstacle2);
               break;//reinicia a escolha
       case 3: obstacle.addImage(obstacle3);
               break;//reinicia a escolha
       case 4: obstacle.addImage(obstacle4);
               break;//reinicia a escolha
       case 5: obstacle.addImage(obstacle5);
               break;//reinicia a escolha
       case 6: obstacle.addImage(obstacle6);
               break;//reinicia a escolha
       default: break;
     }
    obstacles.add(obstacle); //adiciona ao grupo 14/12
     //atribua dimensão e tempo de vida aos obstáculos              
     obstacle.scale = 0.5;
     obstacle.lifetime = 300;
  }
 }