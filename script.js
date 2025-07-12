let nutrientData = [];
let correctAnswers = 0;
let total = 0;
let answered = false;

const nutrientIndexMap = [3, 4, 5, 6, 7];
const nutrientNameMap = ["Calories", "Protein", "Sat Fat", "Fiber", "Carbs"];

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
  return { "Calories": "", "Protein": "g", "Sat Fat": "g", "Fiber": "g", "Carbs": "g" }[name] || "";
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

  // Hide question and buttons
  questionEl.style.display = 'none';
  buttonsEl.style.display = 'none';

  // Show feedback with format:
  // Correct / Incorrect
  // Item1 has amount of nutrient
  // Item2 has amount of nutrient
  // Next button

  const [colIndex, nutrientName] = currentQuestion.nutrient;
  const unit = getUnit(nutrientName);
  const [entry1, entry2] = currentQuestion.entries;

  const amount1 = parseAmount(entry1[colIndex]);
  const amount2 = parseAmount(entry2[colIndex]);

  feedbackEl.innerHTML = `
    <strong>${isCorrect ? "Correct!" : "Incorrect!"}</strong><br>
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

  questionEl.textContent = `Which has more ${nutrientName}: ${entry1[0]} (${amount1}${unit}) or ${entry2[0]} (${amount2}${unit})?`;

  const btn1 = document.createElement('button');
  btn1.textContent = entry1[0];
  btn1.onclick = () => { if (!answered) markAnswer(amount1 > amount2); };

  const btn2 = document.createElement('button');
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
