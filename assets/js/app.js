/*=======================================================*/
/*                                                       */
/*  Olisa Nweze (2024)                                   */
/*  github.com/nwezeolisa                                */
/*                                                       */
/*=======================================================*/

'use strict';

import { select, listen } from './utils.js';
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
const title = select('.title')
const audio = new Audio ('../assets/audio/background-music.mp3');
audio.type = 'audio/mp3';
const ring = new Audio ('../assets/audio/arcade-mechanical.wav');
ring.type = 'audio/wav';
let typedWords = 0;
let currentIndex = 0;
let timeInGame = 99;
let countdownTimer;

function createUserStats(hits, totalWords) {
  return {
    hits: hits,
    percentage: calcAccuracy(hits, totalWords),
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric', 
      year: 'numeric'
    }),
  };
}

function disableInput() {
  userInput.setAttribute('disabled', 'disabled');
};

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

    if (timeInGame <= 0) {
      clearInterval(countdownTimer);
      timer.innerText = 'Time up!'
      stopMusic();
      disableInput();
    }
  }, 1000) 
};


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

function calcAccuracy(typedWords, totalWords) {
  if (totalWords === 0 ) {
    return 0;
  }
  return ((typedWords / totalWords) * 100).toFixed(1);
}

function resetGame() {
  startButton.innerText = 'restart';
  startButton.style.color = '#ff5252';
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

  timeInGame = 99;
  gameCountdown();
};

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
  title.innerText = 'Can you win this race?';
  enableInput();
  shuffleArray(words);
  currentIndex = 0;
  displayNextWord()
  userInput.focus();
  playMusic();
  resetGame();
}

listen('input', userInput, userTypedInput);
listen('input', userInput, typing);
listen('click', startButton, genGameEnvironment);