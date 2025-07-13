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
  btn1.textContent = entry1[0].toUpperCase();
  btn1.onclick = () => { if (!answered) markAnswer(amount1 > amount2); };

  const btn2 = document.createElement('button').toUpperCase();
  btn2.textContent = entry2[0];
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

  playBtn.addEventListener('click', () => {
    // Set audio to loop in JS
    audio.loop = true;

    // Play audio
    audio.play()
      .then(() => {
        playBtn.style.display = 'none';
      })
      .catch((error) => {
        console.error('Audio playback failed:', error);
      });
  });
});

