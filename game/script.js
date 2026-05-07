'use strict';
(function() {
    var gameGrid = document.getElementById('gameGrid');
    if (!gameGrid) return;
    var gameMoves = document.getElementById('gameMoves');
    var gameScore = document.getElementById('gameScore');
    var gameTimer = document.getElementById('gameTimer');
    var gameBestScore = document.getElementById('gameBestScore');
    var gameScoresBody = document.getElementById('gameScoresBody');
    var gameRestartBtn = document.getElementById('gameRestartBtn');
    var gameVictory = document.getElementById('gameVictory');
    var gameVictoryPlayAgain = document.getElementById('gameVictoryPlayAgain');
    var gameVictoryClose = document.getElementById('gameVictoryClose');
    var EMOJIS = ['🌟','🎮','🎯','🎨','🎵','🚀','💡','🔥'];
    var TOTAL_PAIRS = 8;
    var cards = [], flippedCards = [], matchedPairs = 0, moves = 0, currentScore = 0;
    var gameStarted = false, timerInterval = null, seconds = 0, locked = false;
    function shuffle(a){var r=a.slice();for(var i=r.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=r[i];r[i]=r[j];r[j]=t}return r}
    function fmt(s){return Math.floor(s/60).toString().padStart(2,'0')+':'+(s%60).toString().padStart(2,'0')}
    function calcScore(m,t){return Math.max(0,TOTAL_PAIRS*1000-Math.max(0,m-TOTAL_PAIRS)*50-t*2)}
    function loadScores(){try{return JSON.parse(localStorage.getItem('memoryGameScores')||'[]')}catch(e){return[]}}
    function saveScore(sc,mv,tm){var s=loadScores();s.push({score:sc,moves:mv,time:tm,date:Date.now()});s.sort(function(a,b){return b.score-a.score});s=s.slice(0,10);try{localStorage.setItem('memoryGameScores',JSON.stringify(s))}catch(e){}return s}
    function renderScores(){if(!gameScoresBody)return;var sc=loadScores();if(gameBestScore)gameBestScore.textContent=sc[0]?sc[0].score:'—';if(sc.length===0){gameScoresBody.innerHTML='<div class="game-scores-empty">Henüz skor yok. İlk oyunu sen kazan! 🏆</div>';return}gameScoresBody.innerHTML=sc.map(function(s,i){return'<div class="game-scores-row"><span>'+(i+1)+'</span><span>'+s.score+'</span><span>'+s.moves+'</span><span>'+fmt(s.time)+'</span></div>'}).join('')}
    function updateStats(){if(gameMoves)gameMoves.textContent=moves;currentScore=calcScore(moves,seconds);if(gameScore)gameScore.textContent=currentScore}
    function checkVictory(){if(matchedPairs===TOTAL_PAIRS){if(timerInterval)clearInterval(timerInterval);updateStats();saveScore(currentScore,moves,seconds);renderScores();showVictory()}}
    function showVictory(){if(!gameVictory)return;var se=gameVictory.querySelector('.game-victory-stat-value.highlight');var me=gameVictory.querySelectorAll('.game-victory-stat-value')[1];var te=gameVictory.querySelectorAll('.game-victory-stat-value')[2];var be=gameVictory.querySelector('.game-victory-best');if(se)se.textContent=currentScore;if(me)me.textContent=moves;if(te)te.textContent=fmt(seconds);if(be){var sc=loadScores();var isB=sc[0]&&sc[0].score===currentScore&&sc[0].moves===moves&&sc[0].time===seconds;be.style.display=isB?'inline-block':'none'}gameVictory.classList.add('open')}
    function hideVictory(){if(gameVictory)gameVictory.classList.remove('open')}
    function startTimer(){if(timerInterval)clearInterval(timerInterval);seconds=0;gameStarted=false;if(gameTimer)gameTimer.textContent='00:00'}
    function tickTimer(){seconds++;if(gameTimer)gameTimer.textContent=fmt(seconds)}
    function flipCard(card){if(locked)return;if(card.classList.contains('flipped')||card.classList.contains('matched'))return;if(!gameStarted){gameStarted=true;timerInterval=setInterval(tickTimer,1000)}card.classList.add('flipped');flippedCards.push(card);if(flippedCards.length===2){moves++;updateStats();checkMatch()}}
    function checkMatch(){var c1=flippedCards[0],c2=flippedCards[1];if(c1.getAttribute('data-emoji')===c2.getAttribute('data-emoji')){c1.classList.add('matched');c2.classList.add('matched');matchedPairs++;flippedCards=[];updateStats();checkVictory()}else{locked=true;setTimeout(function(){c1.classList.remove('flipped');c2.classList.remove('flipped');flippedCards=[];locked=false},700)}}
    function buildGrid(){var pairs=shuffle(EMOJIS).slice(0,TOTAL_PAIRS);cards=shuffle(pairs.concat(pairs));gameGrid.innerHTML='';cards.forEach(function(emoji,index){var card=document.createElement('div');card.className='game-card';card.setAttribute('data-index',index);card.setAttribute('data-emoji',emoji);card.setAttribute('role','gridcell');card.setAttribute('aria-label','Kart '+(index+1));card.setAttribute('tabindex','0');card.innerHTML='<div class="game-card-inner"><div class="game-card-front">?</div><div class="game-card-back"><span class="card-emoji" aria-hidden="true">'+emoji+'</span></div></div>';card.addEventListener('click',function(){flipCard(card)});card.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();flipCard(card)}});gameGrid.appendChild(card)})}
    function resetGame(){hideVictory();if(timerInterval)clearInterval(timerInterval);flippedCards=[];matchedPairs=0;moves=0;currentScore=0;locked=false;startTimer();if(gameMoves)gameMoves.textContent='0';if(gameScore)gameScore.textContent='0';buildGrid();renderScores()}
    if(gameRestartBtn)gameRestartBtn.addEventListener('click',resetGame);
    if(gameVictoryPlayAgain)gameVictoryPlayAgain.addEventListener('click',resetGame);
    if(gameVictoryClose)gameVictoryClose.addEventListener('click',hideVictory);
    if(gameVictory){gameVictory.addEventListener('click',function(e){if(e.target===gameVictory||e.target.classList.contains('game-victory-backdrop'))hideVictory()})}
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&gameVictory&&gameVictory.classList.contains('open'))hideVictory()});
    resetGame();
})();