let nutrientData = [];
let correctAnswers = 0;
let total = 0;
let answered = false;

const nutrientIndexMap = [3, 4, 5, 6, 7];
const nutrientNameMap = ["CALORIES", "PROTEIN", "SATURATED FAT", "FIBER", "CARBS"];

const questionEl = document.getElementById('question');
const buttonsEl = document.getElementById('buttons');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const nextBtn = document.getElementById('nextBtn');

let currentQuestion = null;

nextBtn.addEventListener('click', () => {
  feedbackEl.innerHTML = '';
  nextBtn.classList.add('hidden');
  questionEl.style.display = 'block';
  buttonsEl.style.display = 'flex';
  answered = false;
  generateQuestion();
});

function parseCSV(data) {
  return data
    .trim()
    .split("\n")
    .map(row => row.split(","));
}

function getRandomEntry() {
  return nutrientData[Math.floor(Math.random() * nutrientData.length)];
}

function getRandomNutrient() {
  const index = Math.floor(Math.random() * 5);
  return [nutrientIndexMap[index], nutrientNameMap[index]];
}

function getUnit(name) {
  return { "CALORIES": "", "PROTEIN": "g", "SATURATED FAT": "g", "FIBER": "g", "CARBS": "g" }[name] || "";
}

function parseAmount(value) {
  const n = parseFloat(value);
  return isNaN(n) ? 0 : n;
}

function updateScore() {
  scoreEl.textContent = `Score: ${correctAnswers}/${total}`;
}

function markAnswer(isCorrect) {
  if (answered) return;
  answered = true;
  total++;
  if (isCorrect) correctAnswers++;
  updateScore();
  
  questionEl.style.display = 'none';
  buttonsEl.style.display = 'none';

  const [colIndex, nutrientName] = currentQuestion.nutrient;
  const unit = getUnit(nutrientName);
  const [entry1, entry2] = currentQuestion.entries;

  const amount1 = parseAmount(entry1[colIndex]);
  const amount2 = parseAmount(entry2[colIndex]);

feedbackEl.innerHTML = `
  <span class="${isCorrect ? 'correct' : 'incorrect'}">
    ${isCorrect ? "Correct!" : "Incorrect!"}
  </span><br><br>
  ${entry1[0]} has ${amount1}${unit} of ${nutrientName}<br>
  ${entry2[0]} has ${amount2}${unit} of ${nutrientName}
`;


  nextBtn.classList.remove('hidden');
}

function generateQuestion() {
  buttonsEl.innerHTML = '';
  const nutrient = getRandomNutrient();
  const [colIndex, nutrientName] = nutrient;

  let entry1 = getRandomEntry();
  let entry2 = getRandomEntry();
  while (entry1[0] === entry2[0]) {
    entry2 = getRandomEntry();
  }

  currentQuestion = {
    nutrient: nutrient,
    entries: [entry1, entry2]
  };

  const amount1 = parseAmount(entry1[colIndex]);
  const amount2 = parseAmount(entry2[colIndex]);
  const unit = getUnit(nutrientName);

questionEl.innerHTML = `
  <span style="display: block; text-align: center; font-size: 72px; font-weight: bold; color: black; white-space: nowrap;">
    Which has more ${nutrientName}?
  </span>
  <br>
  <span style="display: block; text-align: center; font-size: 32px; font-weight: bold; color: black; white-space: nowrap;">
    ${entry1[0]} (Quantity: ${entry1[1]})
  </span>
  <br>
  <span style="display: block; text-align: center; font-size: 32px; font-weight: bold; color: black; white-space: nowrap;">
    ${entry2[0]} (Quantity: ${entry2[1]})
  </span>
`;






  const btn1 = document.createElement('button');
  btn1.textContent = entry1[0];
  btn1.onclick = () => { if (!answered) markAnswer(amount1 > amount2); };

  const btn2 = document.createElement('button');
  btn2.textContent = entry2[0];.
  btn2.onclick = () => { if (!answered) markAnswer(amount2 > amount1); };

  buttonsEl.appendChild(btn1);
  buttonsEl.appendChild(btn2);

  questionEl.style.display = 'block';
  buttonsEl.style.display = 'flex';
  feedbackEl.innerHTML = '';
  nextBtn.classList.add('hidden');
}

fetch('nutrients.csv')
  .then(res => res.text())
  .then(csv => {
    nutrientData = parseCSV(csv);
    generateQuestion();
  });


window.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('background-audio');
  const playBtn = document.getElementById('playMusicBtn');

  const svgPlay = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#1C274C" stroke-width="1.5"></circle>
      <path d="M15.4137 10.941C16.1954 11.4026 16.1954 12.5974 15.4137 13.059L10.6935 15.8458C9.93371 16.2944 9 15.7105 9 14.7868L9 9.21316C9 8.28947 9.93371 7.70561 10.6935 8.15419L15.4137 10.941Z" stroke="#1C274C" stroke-width="1.5"></path>
    </svg>
  `;

  const svgPause = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#1C274C" stroke-width="1.5"></circle>
      <path d="M8 9.5C8 9.03406 8 8.80109 8.07612 8.61732C8.17761 8.37229 8.37229 8.17761 8.61732 8.07612C8.80109 8 9.03406 8 9.5 8C9.96594 8 10.1989 8 10.3827 8.07612C10.6277 8.17761 10.8224 8.37229 10.9239 8.61732C11 8.80109 11 9.03406 11 9.5V14.5C11 14.9659 11 15.1989 10.9239 15.3827C10.8224 15.6277 10.6277 15.8224 10.3827 15.9239C10.1989 16 9.96594 16 9.5 16C9.03406 16 8.80109 16 8.61732 15.9239C8.37229 15.8224 8.17761 15.6277 8.07612 15.3827C8 15.1989 8 14.9659 8 14.5V9.5Z" stroke="#1C274C" stroke-width="1.5"></path>
      <path d="M13 9.5C13 9.03406 13 8.80109 13.0761 8.61732C13.1776 8.37229 13.3723 8.17761 13.6173 8.07612C13.8011 8 14.0341 8 14.5 8C14.9659 8 15.1989 8 15.3827 8.07612C15.6277 8.17761 15.8224 8.37229 15.9239 8.61732C16 8.80109 16 9.03406 16 9.5V14.5C16 14.9659 16 15.1989 15.9239 15.3827C15.8224 15.6277 15.6277 15.8224 15.3827 15.9239C15.1989 16 14.9659 16 14.5 16C14.0341 16 13.8011 16 13.6173 15.9239C13.3723 15.8224 13.1776 15.6277 13.0761 15.3827C13 15.1989 13 14.9659 13 14.5V9.5Z" stroke="#1C274C" stroke-width="1.5"></path>
    </svg>
  `;

  let isPlaying = false;
  playBtn.innerHTML = svgPlay;

  playBtn.addEventListener('click', () => {
    if (!isPlaying) {
      audio.loop = true;
      audio.play().then(() => {
        playBtn.innerHTML = svgPause;
        isPlaying = true;
      }).catch(error => console.error('Playback failed:', error));
    } else {
      audio.pause();
      audio.currentTime = 0;
      playBtn.innerHTML = svgPlay;
      isPlaying = false;
    }
  });
});


