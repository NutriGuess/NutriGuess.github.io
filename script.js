const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const buttons = [];
let correctAnswers = 0;
let total = 0;
let trivia = '';
let scoreFeedback = '';
let showNextButton = false;
let answered = false;

const font = '32px "Times New Roman"';
const pointerColor = '#000';
const blackText = '#000';
const nutrientIndexMap = [3, 4, 5, 6, 7];
const nutrientNameMap = ["Calories", "Protein", "Sat Fat", "Fiber", "Carbs"];

function drawGradient() {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#00ff00");
  gradient.addColorStop(0.7, "#ffffff");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function onscreenWords(text, posx, posy) {
  ctx.fillStyle = blackText;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.fillText(text, posx, posy);
}

function getRandomEntry() {
  const entries = [
    ["Banana", "89", "1.1", "0.1", "2.6", "22.8"],
    ["Apple", "52", "0.3", "0", "2.4", "13.8"],
    ["Broccoli", "55", "3.7", "0.1", "2.6", "11.2"],
    ["Carrot", "41", "0.9", "0.1", "2.8", "9.6"],
    ["Cheddar", "402", "25", "19", "0", "1.3"],
  ];
  return entries[Math.floor(Math.random() * entries.length)];
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

function Button(text, x, y, w, h, callback) {
  return { text, x, y, w, h, callback, pressed: false };
}

function drawButton(btn) {
  ctx.beginPath();
  ctx.fillStyle = btn.pressed ? "#b40000" : "#ff0000";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = blackText;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(btn.text, btn.x + btn.w / 2, btn.y + btn.h / 2);
}

function clearButtons() {
  buttons.length = 0;
}

function markAnswer(correct) {
  clearButtons();
  answered = true;
  showNextButton = true;
  total += 1;
  if (correct) {
    correctAnswers += 1;
    scoreFeedback = "Correct";
  } else {
    scoreFeedback = "Incorrect";
  }
}

function nextQuestion() {
  trivia = question();
  showNextButton = false;
  answered = false;
}

function question() {
  clearButtons();
  const nutrient = getRandomNutrient();
  const unit = getUnit(nutrient[1]);

  let entry1 = getRandomEntry();
  let entry2 = getRandomEntry();
  while (entry1[0] === entry2[0]) {
    entry2 = getRandomEntry();
  }

  const amount1 = parseAmount(entry1[nutrient[0]]);
  const amount2 = parseAmount(entry2[nutrient[0]]);

  const centerX = width / 2;
  const width1 = 20 + entry1[0].length * 14;
  const width2 = 20 + entry2[0].length * 14;

  buttons.push(Button(
    entry1[0].toLowerCase(),
    centerX - (width2 + width1) / 4 - 20,
    125,
    width1,
    60,
    () => markAnswer(amount1 > amount2)
  ));

  buttons.push(Button(
    entry2[0].toLowerCase(),
    centerX + (width2 + width1) / 4 + 20,
    125,
    width2,
    60,
    () => markAnswer(amount2 > amount1)
  ));

  return `Which has more ${nutrient[1]}?`;
}

canvas.addEventListener('click', (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  buttons.forEach(btn => {
    if (mouseX >= btn.x && mouseX <= btn.x + btn.w &&
        mouseY >= btn.y && mouseY <= btn.y + btn.h) {
      btn.pressed = true;
    }
  });
  if (showNextButton && 
      mouseX >= nextBtn.x && mouseX <= nextBtn.x + nextBtn.w &&
      mouseY >= nextBtn.y && mouseY <= nextBtn.y + nextBtn.h) {
    nextQuestion();
  }
});

let nextBtn = Button("Next", width / 2 - 50, 120, 100, 50, nextQuestion);
trivia = question();

function loop() {
  drawGradient();
  buttons.forEach(drawButton);
  onscreenWords(answered ? scoreFeedback : trivia, width / 2, 50);
  const score = `Score: ${correctAnswers}/${total}`;
  onscreenWords(score, width - score.length * 9, 50);
  if (showNextButton) drawButton(nextBtn);
  requestAnimationFrame(loop);
}

loop();
