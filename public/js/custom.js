(function () {
    'use strict';
  
    $(window).scroll(function () {
      var top = $(document).scrollTop();
      if (top > 50) {
        $('#home > .navbar').removeClass('navbar-transparent');
      } else {
        $('#home > .navbar').addClass('navbar-transparent');
      }
    })
  
    $('a[href="#"]').click(function (event) {
      event.preventDefault();
    })
  
    $('.bs-component').each(function () {
      var $component = $(this);
      var $button = $('<button class="source-button btn btn-primary btn-xs" role="button" tabindex="0">&lt; &gt;</button>');
      $component.append($button);
  
      if ($component.find('[data-bs-toggle="tooltip"]').length > 0) {
        $component.attr('data-html', $component.html());
      }
    });
  
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl)
    })
  
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
  
    var sourceModalElem = document.getElementById('source-modal');
    if (sourceModalElem) {
      var sourceModal = new bootstrap.Modal(document.getElementById('source-modal'));
    }
  
    $('body').on('click', '.source-button', function (event) {
      event.preventDefault();
  
      var component = $(this).parent();
      var html = component.attr('data-html') ? component.attr('data-html') : component.html();
  
      html = cleanSource(html);
      html = Prism.highlight(html, Prism.languages.html, 'html');
      $('#source-modal code').html(html);
      sourceModal.show();
    })
  
    function cleanSource(html) {
      html = html.replace(/×/g, '&times;')
                 .replace(/«/g, '&laquo;')
                 .replace(/»/g, '&raquo;')
                 .replace(/←/g, '&larr;')
                 .replace(/→/g, '&rarr;')
  
      var lines = html.split(/\n/);
  
      lines.shift();
      lines.splice(-1, 1);
  
      var indentSize = lines[0].length - lines[0].trim().length;
      var re = new RegExp(' {' + indentSize + '}');
  
      lines = lines.map(function (line) {
        if (line.match(re)) {
          line = line.slice(Math.max(0, indentSize));
        }
  
        return line;
      });
  
      lines = lines.join('\n');
  
      return lines;

      
    }
  
})();

function apagarCurso(id){
  $.ajax({
    url:`/curso/${id}`,
    type:'DELETE',
  })
  .done(function (msg){
    console.log(msg);
    window.location.href = "/curso";
  })
  .fail(function (){
      console.log("Erro ao deletar curso.");
  })
  
}

(function skifree() {

  const FPS = 50;
  const TAMX = 300;
  const TAMY = 400;
  var PROB_ARVORE = 2;
  var gameLoop;
  var montanha;
  var skier;
  var painel;
  var pontuacao;
  var direcoes = ['para-esquerda','para-frente','para-direita']
  var arvores = [];
  var arbustos = [];
  var rochas = [];
  var toco_arvore = [];
  var arvore_grande = [];
  var cogumelos = [];
  var gameover;
  
  var velocidade_jogador = 1; //Variavel para alternar a velocidade do jogador ao pressionar a tecla 'f'
  var vidas_jogador = 3; //Começa com 3 vidas
   
  function init () {
    montanha = new Montanha();
    skier = new Skier();
    painel = new Painel();
    gameLoop = setInterval(run, 1000/FPS);
  }

  window.addEventListener('keydown', function (e) {
    if (e.key == 'a') skier.mudarDirecao(-1);
    else if (e.key == 'd') skier.mudarDirecao(1); 
  });

  window.addEventListener('keypress',function(e){//Quando o usuário ficar pressionando 'f' a velocidade do jogador aumenta.
    if(e.key == 'f') velocidade_jogador = 3;
  }); 
  
  window.addEventListener('keyup',function(e){ //Quando o usuário parar de pressionar 'f' a velocidade volta ao normal.
    if(e.key == 'f') velocidade_jogador = 1;
  });

  function Montanha () {
    this.element = document.getElementById("montanha");
    this.element.style.width = TAMX + "px";
    this.element.style.height = TAMY + "px";
  }
  
  function verifica_vidas(){
    if(skier.element.className == 'bateu'){ //Se o evento anterior foi uma batida
      if(vidas_jogador == 0){
        skier.element.className = 'morreu';
        parar();
        console.log("Game over");  
      }else{
        vidas_jogador--;
      }
    }
  }

  function Skier() {
    this.element = document.getElementById("skier");
    this.direcao = 1; //0-esquerda;1-frente;2-direita
    this.element.className = 'para-frente';
    this.element.style.top = '50px'; 
    this.element.style.left = parseInt(TAMX/2)-7 + 'px';

    this.mudarDirecao = function (giro) {
      if (this.direcao + giro >=0 && this.direcao + giro <=2) {
        this.direcao += giro;
        this.element.className = direcoes[this.direcao];
      }
    }

    this.andar = function () {
      if (this.direcao == 0) {
        var verifica = parseInt(this.element.style.left)-velocidade_jogador; //Para não acontecer ultrapasse das bordas
        if(verifica >= 0){ //limite 0 px 
          this.element.style.left = (parseInt(this.element.style.left)-velocidade_jogador) + "px"; 
        }
      }

      if (this.direcao == 2) {
        var verifica = parseInt(this.element.style.left)+velocidade_jogador; //Para não acontecer ultrapasse das bordas
        if(verifica <= 280){ //limite 284 px 
          this.element.style.left = (parseInt(this.element.style.left)+velocidade_jogador) + "px"; 
        }
      }
    }
  }

  function colisao(a){ //Funcao para a colisao do obstaculo arvore
    var limite = 20;
    var esquerda_skier = parseInt(skier.element.style.left); 
    var esquerda_obstaculo = parseInt(a.element.style.left); //Pego os valores inteiros do left do skier e do left da arvore   
    if(skier.element.className != 'bateu'){//Se o jogador não estiver caído
      if(esquerda_skier-limite <= esquerda_obstaculo && esquerda_obstaculo <= esquerda_skier + limite){ //Se a posicao de ambos tiverem no intervalo 
        var topo_obstaculo = parseInt(a.element.style.top); 
        var topo_skier = parseInt(skier.element.style.top); //verifico o topo 
        if(topo_skier-limite <= topo_obstaculo && topo_obstaculo <= topo_skier+limite){ //Se tbm tiver no intervalo
          a.element.style.top = '-10px';
          skier.element.className = 'bateu'; //Aqui eu devo mudar para o bonequinho caído
           console.log("Colisão de Skier com arvore", skier.element.style.left, a.element.style.left, a.element.style.top);
           verifica_vidas();
        }
      }
    }  
  }

  function Comeu_cogumelo(a){ //Funcao para a colisao do obstaculo arvore
    var limite = 10;
    var esquerda_skier = parseInt(skier.element.style.left); 
    var esquerda_obstaculo = parseInt(a.element.style.left); //Pego os valores inteiros do left do skier e do left da arvore   
    if(skier.element.className != 'bateu'){//Se o jogador não estiver caído
      if(esquerda_skier-limite <= esquerda_obstaculo && esquerda_obstaculo <= esquerda_skier + limite){ //Se a posicao de ambos tiverem no intervalo 
        var topo_obstaculo = parseInt(a.element.style.top); 
        var topo_skier = parseInt(skier.element.style.top); //verifico o topo 
        if(topo_skier-limite <= topo_obstaculo && topo_obstaculo <= topo_skier+limite){ //Se tbm tiver no intervalo
          a.element.style.top = '-10px';
          a.element.style.left = '-100px';
          vidas_jogador++;
        }
      }
    }  
  }
  var intervalo;
  var s = 0; //valor inicial
  function Painel(){ //Distancia percorrida
    function tempo() {
      intervalo = window.setInterval(function() {
        if (s < 10) document.getElementById("metros").innerHTML = "0" + s + "m/s"; 
        else document.getElementById("metros").innerHTML = s + "m/s";
        document.getElementById("vidas").innerHTML = vidas_jogador + " vidas restantes";
        if(velocidade_jogador == 1){
          s+=20;//20 metros por segundo
        }else if(velocidade_jogador == 3){
          s+=30; //30 metros por segundo
        }
          
      },1000);
    }
      window.onload = tempo;
  }

  function parar() {
    window.clearInterval(intervalo);
    window.clearInterval(gameLoop);
  }
    
  function Arvore() {
    this.element = document.createElement('div');
    montanha.element.appendChild(this.element);
    this.element.className = 'arvore';
    this.element.style.top = TAMY + "px";
    this.element.style.left = Math.floor(Math.random() * TAMX) + "px";
  // console.log("Arvore left e top", this.element.style.left,this.element.style.top);
  }

  function Cogumelo() {
    this.element = document.createElement('div');
    montanha.element.appendChild(this.element);
    this.element.className = 'cogumelo';
    this.element.style.top = TAMY + "px";
    this.element.style.left = Math.floor(Math.random() * TAMX) + "px";
    }

  function Arbusto() {
  this.element = document.createElement('div');
  montanha.element.appendChild(this.element);
  this.element.className = 'arbusto';
  this.element.style.top = TAMY + "px";
  this.element.style.left = Math.floor(Math.random() * TAMX) + "px";
  }

  function Rocha() {
    this.element = document.createElement('div');
    montanha.element.appendChild(this.element);
    this.element.className = 'rocha';
    this.element.style.top = TAMY + "px";
    this.element.style.left = Math.floor(Math.random() * TAMX) + "px";
  }

  function Toco() {
    this.element = document.createElement('div');
    montanha.element.appendChild(this.element);
    this.element.className = 'toco';
    this.element.style.top = TAMY + "px";
    this.element.style.left = Math.floor(Math.random() * TAMX) + "px";
  }

  function BigArvore() {
    this.element = document.createElement('div');
    montanha.element.appendChild(this.element);
    this.element.className = 'big';
    this.element.style.top = TAMY + "px";
    this.element.style.left = Math.floor(Math.random() * TAMX) + "px";
  }

  function run () { 
    var random = Math.floor(Math.random() * 1000);
    if (random <= PROB_ARVORE*10) {
        var arvore = new Arvore();    
        arvores.push(arvore);
    }
    arvores.forEach(function (a) {
      a.element.style.top = (parseInt(a.element.style.top)-1) + "px";
      colisao(a); //Chamar funcao para verificar a colisao
    });
      
    random = Math.floor(Math.random() * 1000);
    if(random <= PROB_ARVORE){
      var arbusto = new Arbusto();    
        arbustos.push(arbusto);
    }
    arbustos.forEach(function (a) {
      a.element.style.top = (parseInt(a.element.style.top)-1) + "px";
      colisao(a);
    });
    
    random = Math.floor(Math.random() * 1000);
    if(random <= PROB_ARVORE){
      var rocha = new Rocha();    
        rochas.push(rocha);
    }
    rochas.forEach(function (a) {
      a.element.style.top = (parseInt(a.element.style.top)-1) + "px";
      colisao(a); 
    });

    random = Math.floor(Math.random() * 1000);
    if(random <= PROB_ARVORE){
      var toco = new Toco();    
        toco_arvore.push(toco);
    }
    toco_arvore.forEach(function (a) {
      a.element.style.top = (parseInt(a.element.style.top)-1) + "px";
      colisao(a); 
    }); 

    random = Math.floor(Math.random() * 1000);
    if(random <= PROB_ARVORE){
      var big = new BigArvore();    
        arvore_grande.push(big);
    }
    arvore_grande.forEach(function (a) {
      a.element.style.top = (parseInt(a.element.style.top)-1) + "px";
      colisao(a);
    }); 

    random = Math.floor(Math.random() * 1000);
    if(random <= PROB_ARVORE){
      var cogumelo = new Cogumelo();    
        cogumelos.push(cogumelo);
    }
    cogumelos.forEach(function (a) {
      a.element.style.top = (parseInt(a.element.style.top)-1) + "px";
      Comeu_cogumelo(a);
    }); 

    skier.andar();         
  }
  init();
})();
  