/*=======================================================*/
/*                                                       */
/*  Olisa Nweze (2024)                                   */
/*  github.com/nwezeolisa                                */
/*                                                       */
/*=======================================================*/

'use strict';

import { select, selectAll, listen, create } from './utils.js';
import words from '../data/words.js';

/*=======================================================*/
/*  Global Variables                                     */
/*=======================================================*/

const randomWords = select('.words');
const screen = select('main');
const userInput = select('.user');
const startButton = select('button');
const timer = select('.timer');
const wordCount = select('.word-count');
const title = select('.title');
const scoreResult = select('.score-board');
const modal = select('.modal-background');
const audio = new Audio ('./assets/audio/background-music.mp3');
audio.type = 'audio/mp3';
const ring = new Audio ('./assets/audio/arcade-mechanical.wav');
ring.type = 'audio/wav';
let typedWords = 0;
let currentIndex = 0;
let timeInGame = 15;
let countdownTimer;
let scores = getScores();
let score;
let date;
let percentage;
let resultsList;
let storedScores;

/*=======================================================*/
/*  Functions                                            */
/*=======================================================*/

function setScores() {
  score = typedWords;
  date = new Date().toDateString();
  percentage = ((score / words.length) * 100).toFixed(1) ;
  scores.push({
    'score': score,
    'percentage': `${percentage}%`,
    'date': date
  });
}

function sortArray(arr) {
  return arr.toSorted((a, b) => b.score - a.score).splice(0, 9);
}

function getScores() {
  let scores = localStorage.getItem('scores');
  return scores ? JSON.parse(scores) : [];
}

function storeScores() {
  let arrayOfScores = sortArray(scores);
  localStorage.setItem('scores', JSON.stringify(arrayOfScores));
}

function createParagraphs(obj, parag) {
  for (const prop in obj) {
    parag = create('p');
    parag.innerText = `${prop}: ${obj[prop]}`;
    scoreResult.appendChild(parag);
  }
}

function displayData() {
  setScores();
  storeScores();
  let obj = scores[scores.length - 1];
  let parag;
  resultsList = selectAll('.score-board p');
  createParagraphs(obj, parag);
  resultsList.forEach(parag => parag.remove());
}

function createHighScores(num) {
  storedScores.forEach(obj => {
    let parag1 = create('p');
    let parag2 = create('p');
    let parag3 = create('p');
    let parag4 = create('p');
    let box = create('div');
    parag1.innerText = `#${num}`;
    parag2.innerText = `${obj.score} words`;
    parag3.innerText = `${obj.percentage}`;
    parag4.innerText = `${obj.date}`;
    num++;
    [parag1, parag2, parag3, parag4].forEach(ele => {
      box.appendChild(ele);
      if (box.childElementCount == 3) scoreResult.appendChild(box);
    });
  });   
}

function appendScoresInfo() {
  storedScores = JSON.parse(localStorage.getItem('scores'));
  let count = 1;
  createHighScores(count);   
}

let noInfoIsAdded = false;

function noInfo() {
  if (!scores.length > 0 && !noInfoIsAdded) {
    let parag = create('p');
    parag.innerText =  'No games played';
    scoreResult.appendChild(parag);
    noInfoIsAdded = true;
  }
}

function clearDialog() {
  let pElements = scoreResult.querySelectorAll('.score-board p');
  if (pElements.length > 0) {
    pElements.forEach(ele => ele.remove());
  }
}

function scoreBoardInfo() {
  if (scores.length > 0) {
    clearDialog();
    appendScoresInfo();
  } else {
    noInfo();
  }
}

function disableInput() {
  userInput.setAttribute('disabled', 'disabled');
}

function playRing() {
  ring.play();
}

function enableInput() {
  userInput.removeAttribute('disabled');
  userInput.style.cursor = 'auto';
  userInput.focus();
  userInput.innerText = '';
}

function gameCountdown() {
  countdownTimer = setInterval(() => {
    timer.innerText = timeInGame;
    timeInGame--;

    if (timeInGame < 11) {
      timer.style.color= '#ff5252';
    }

    if (timeInGame < 0) {
      clearInterval(countdownTimer);
      timer.innerText = 'Time up!';
      stopMusic();
      disableInput();
      displayData();
      displayScores();
      scoreBoardInfo();
    }
  }, 1000) 
};

function displayScores() {
  scoreResult.classList.add('block');
  modal.classList.add('modal-bg-dark');

  setTimeout(function() {
    scoreResult.style.opacity = 1;
    modal.style.opacity = 1;
  }, 200);
}

function highlight(word, userInput) {
  let highlighted = '';
  for (let i = 0; i < word.length; i++) {
    if (userInput[i] && word[i].toLowerCase() === userInput[i].toLowerCase()) {
      highlighted += `<span class="red bigger">${word[i]}</span>`;
    } else {
      highlighted += word[i];
    }
  }
  return highlighted;
} 

//  Study this typing function further
function typing() {
  let userInputText = userInput.value.toLowerCase();
  let currentWord = words[currentIndex - 1]; 
  let highlightedWord = highlight(currentWord, userInputText);
  randomWords.innerHTML = highlightedWord;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function displayNextWord() {
  if (currentIndex < words.length) {
    randomWords.textContent = words[currentIndex];
    userInput.value = '';
    currentIndex ++;
  } else {
    randomWords.textContent = 'no more words';
    disableInput();
    stopMusic();
  }
}

function userTypedInput() {
  userInput.setAttribute('placeholder', '')
  const userInputText = userInput.value.toLowerCase();
  const currentWord = words[currentIndex - 1];

  if (userInputText === currentWord) {
    words.splice(currentIndex - 1, 1);
    displayNextWord();
    playerScore();
    playRing();
  }
}

function playerScore() {
  typedWords++;
  wordCount.textContent = typedWords;
}

function resetGame() {
  startButton.innerText = 'restart';
  startButton.style.backgroundColor = '#ff5252';
  timer.style.color= '#3ac0f0';
  clearInterval(countdownTimer);
  shuffleArray(words);
  currentIndex = 0;
  displayNextWord();
  userInput.focus();
  typedWords = 0;
  wordCount.textContent = 0;
  audio.pause();
  audio.currentTime = 0;
  playMusic();
  timeInGame = 15;
  gameCountdown();
  scoreResult.classList.remove('block');
  modal.classList.remove('modal-bg-dark');
}

function playMusic() {
  audio.play();
}

function stopMusic() {
  audio.pause();
  audio.currentTime = 0;
}

function genGameEnvironment() {
  screen.classList.add('game-start');
  userInput.setAttribute('placeholder', '');
  title.innerText = 'Can you beat the time?';
  enableInput();
  shuffleArray(words);
  currentIndex = 0;
  displayNextWord()
  userInput.focus();
  playMusic();
  resetGame();
}

/*=======================================================*/
/*  Event Listeners                                      */
/*=======================================================*/

listen('input', userInput, userTypedInput);
listen('input', userInput, typing);
listen('click', startButton, genGameEnvironment);