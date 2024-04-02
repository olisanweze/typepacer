/*=======================================================*/
/*                                                       */
/*  Olisa Nweze (2024)                                   */
/*  github.com/nwezeolisa                                */
/*                                                       */
/*=======================================================*/

'use strict';

import { select, listen } from './utils.js';
import words from './words.js';

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
const audio = new Audio ('../assets/audio/silver-sparkles.mp3');
audio.type = 'audio/mp3';
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
      timer.style.color= '#d80000';
    }

    if (timeInGame < 0) {
      clearInterval(countdownTimer);
      timer.innerText = 'Time up!'
      stopMusic();
      disableInput();
    }
  }, 1000) 
};

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
    randomWords.textContent = 'No more words';
    disableInput();
    stopMusic();
  }
}

function userTypedInput() {
  const userInputText = userInput.value.toLowerCase();
  const currentWord = words[currentIndex - 1];

  if (userInputText === currentWord) {
    words.splice(currentIndex - 1, 1);
    displayNextWord();
    playerScore();
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
  startButton.value = 'Restart';
  startButton.innerText = 'Restart';
  startButton.style.backgroundColor = '#ff5252';
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
  userInput.setAttribute('placeholder', 'type here...');
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
listen('click', startButton, genGameEnvironment);