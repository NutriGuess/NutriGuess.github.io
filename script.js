let nutrientData = [];
let correctAnswers = 0;
let total = 0;
let trivia = '';
let showNextButton = false;
let answered = false;

const nutrientIndexMap = [3, 4, 5, 6, 7];
const nutrientNameMap = ["Calories", "Protein", "Sat Fat", "Fiber", "Carbs"];

const questionEl = document.getElementById('question');
const buttonsEl = document.getElementById('buttons');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const nextBtn = document.getElementById('nextBtn');

nextBtn.addEventListener('click', nextQuestion);

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

function getUnit(nutrientName) {
  const unitMap = { "Calories": "", "Protein": "g", "Sat Fat": "g", "Fiber": "g", "Carbs": "g" };
  return unitMap[nutrientName] || "";
}

function parseAmount(str) {
  const n = parseFloat(str);
  return isNaN(n) ? 0 : n;
}

function markAnswer(correct) {
  answered = true;
  showNextButton = true;
  nextBtn.classList.remove('hidden');
  total++;
  if (correct) {
    correctAnswers++;
    feedbackEl.textContent = "Correct!";
  } else {
    feedbackEl.textContent = "Incorrect!";
  }
  updateScore();
}

function updateScore() {
  scoreEl.textContent = `Score: ${correctAnswers}/${total}`;
}

function nextQuestion() {
  feedbackEl.textContent = '';
  nextBtn.classList.add('hidden');
  showNextButton = false;
  answered = false;
  generateQuestion();
}

function generateQuestion() {
  buttonsEl.innerHTML = '';
  const nutrient = getRandomNutrient();
  const unit = getUnit(nutrient[1]);

  let entry1 = getRandomEntry();
  let entry2 = getRandomEntry();
  while (entry1[0] === entry2[0]) {
    entry2 = getRandomEntry();
  }

  const amount1 = parseAmount(entry1[nutrient[0]]);
  const amount2 = parseAmount(entry2[nutrient[0]]);

  const questionStr = `Which has more ${nutrient[1]}: ${entry1[0]} (${amount1}${unit}) or ${entry2[0]} (${amount2}${unit})?`;
  questionEl.textContent = questionStr;

  const btn1 = document.createElement('button');
  btn1.textContent = entry1[0];
  btn1.onclick = () => {
    if (!answered) markAnswer(amount1 > amount2);
  };

  const btn2 = document.createElement('button');
  btn2.textContent = entry2[0];
  btn2.onclick = () => {
    if (!answered) markAnswer(amount2 > amount1);
  };

  buttonsEl.appendChild(btn1);
  buttonsEl.appendChild(btn2);
}

fetch('nutrients.csv')
  .then(res => res.text())
  .then(text => {
    nutrientData = parseCSV(text);
    generateQuestion();
  });
