let correctAnswers = 0;
let total = 0;
let answered = false;
let currentQuestion = '';
let currentEntries = [];
let currentNutrient = [];
const nutrientNames = ["Calories", "Protein", "Sat Fat", "Fiber", "Carbs"];
const nutrientUnits = { "Calories": "", "Protein": "g", "Sat Fat": "g", "Fiber": "g", "Carbs": "g" };
const triviaEl = document.getElementById("question");
const buttonsEl = document.getElementById("buttons");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");

fetch("https://raw.githubusercontent.com/openai/gpt-4-trivia/main/nutrients.csv")
  .then(res => res.text())
  .then(csv => {
    const lines = csv.split("\n").map(l => l.split(","));
    window.data = lines;
    nextQuestion();
  });

function getRandomEntry() {
  const idx = Math.floor(Math.random() * window.data.length);
  return window.data[idx];
}

function parseAmount(value) {
  const val = parseFloat(value);
  return isNaN(val) ? 0 : val;
}

function pickNutrient() {
  const i = Math.floor(Math.random() * nutrientNames.length);
  return [i + 3, nutrientNames[i]];
}

function nextQuestion() {
  answered = false;
  feedbackEl.textContent = '';
  nextBtn.classList.add("hidden");
  buttonsEl.innerHTML = '';

  currentNutrient = pickNutrient();
  const nutrientIndex = currentNutrient[0];
  const nutrientName = currentNutrient[1];
  const unit = nutrientUnits[nutrientName];

  let entry1 = getRandomEntry(), entry2 = getRandomEntry();
  while (entry1[0] === entry2[0]) entry2 = getRandomEntry();

  const amount1 = parseAmount(entry1[nutrientIndex]);
  const amount2 = parseAmount(entry2[nutrientIndex]);

  currentQuestion = `Which has more ${nutrientName}?`;
  triviaEl.textContent = currentQuestion;

  const makeBtn = (text, correct) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.className = "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg";
    btn.onclick = () => markAnswer(correct);
    return btn;
  };

  const btn1 = makeBtn(entry1[0], amount1 > amount2);
  const btn2 = makeBtn(entry2[0], amount2 > amount1);
  buttonsEl.appendChild(btn1);
  buttonsEl.appendChild(btn2);
}

function markAnswer(correct) {
  if (answered) return;
  answered = true;
  total++;
  if (correct) {
    correctAnswers++;
    feedbackEl.textContent = "Correct!";
    feedbackEl.className = "text-green-700 font-bold";
  } else {
    feedbackEl.textContent = "Incorrect!";
    feedbackEl.className = "text-red-700 font-bold";
  }
  nextBtn.classList.remove("hidden");
  scoreEl.textContent = `Score: ${correctAnswers}/${total}`;
}

nextBtn.onclick = nextQuestion;
