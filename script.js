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

function hasOrHave(word) {
  return word.endsWith('s') ? 'have' : 'has';
}

feedbackEl.innerHTML = `
  <span class="${isCorrect ? 'correct' : 'incorrect'}">
    ${isCorrect ? "Correct!" : "Incorrect!"}
  </span><br><br>
  ${entry1[0]} ${hasOrHave(entry1[0])} ${amount1}${unit} of ${nutrientName}<br>
  ${entry2[0]} ${hasOrHave(entry2[0])} ${amount2}${unit} of ${nutrientName}
`;


  nextBtn.classList.remove('hidden');
}

function generateQuestion() {
  buttonsEl.innerHTML = '';
  const nutrient = getRandomNutrient();
  const [colIndex, nutrientName] = nutrient;

  let entry1 = getRandomEntry();
  let entry2 = getRandomEntry();
  while (entry1[0] === entry2[0] || entry1[colIndex] == entry2[colIndex]) {
    entry2 = getRandomEntry();
  }

  currentQuestion = {
    nutrient: nutrient,
    entries: [entry1, entry2]
  };

  const amount1 = parseAmount(entry1[colIndex]);
  const amount2 = parseAmount(entry2[colIndex]);
  const unit = getUnit(nutrientName);


function capitalize(text) {
  return text
    .split(" ")
    .map(word => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

  
questionEl.innerHTML = `
  <span style="display: block; text-align: center; font-size: 72px; font-weight: bold; color: black;">
    Which has more ${nutrientName}?
  </span>
  <br>
  <span style="display: block; text-align: center; font-size: 32px; font-weight: bold; color: black;">
    ${capitalize(entry1[0])} (Quantity: ${entry1[1]})
  </span>
  <span style="display: block; text-align: center; font-size: 32px; font-weight: bold; color: black;">
    ${capitalize(entry2[0])} (Quantity: ${entry2[1]})
  </span>
`;

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

window.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('background-audio');
  const playBtn = document.createElement('img');

  playBtn.style.position = 'fixed';
  playBtn.style.top = '10px';      // a little padding from top
  playBtn.style.left = '10px';     // a little padding from left
  playBtn.style.width = '40px';
  playBtn.style.height = '40px';
  playBtn.style.cursor = 'pointer';
  playBtn.style.zIndex = '9999';   // make sure it's on top
  playBtn.draggable = false;

  const svgPlay = `data:image/svg+xml,%3csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='12' cy='12' r='10' stroke='%231C274C' stroke-width='1.5'/%3e%3cpath d='M15.4137 10.941C16.1954 11.4026 16.1954 12.5974 15.4137 13.059L10.6935 15.8458C9.93371 16.2944 9 15.7105 9 14.7868L9 9.21316C9 8.28947 9.93371 7.70561 10.6935 8.15419L15.4137 10.941Z' stroke='%231C274C' stroke-width='1.5'/%3e%3c/svg%3e`;
  const svgPause = `data:image/svg+xml,%3csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='12' cy='12' r='10' stroke='%231C274C' stroke-width='1.5'/%3e%3cpath d='M8 9.5C8 9.03406 8 8.80109 8.07612 8.61732C8.17761 8.37229 8.37229 8.17761 8.61732 8.07612C8.80109 8 9.03406 8 9.5 8C9.96594 8 10.1989 8 10.3827 8.07612C10.6277 8.17761 10.8224 8.37229 10.9239 8.61732C11 8.80109 11 9.03406 11 9.5V14.5C11 14.9659 11 15.1989 10.9239 15.3827C10.8224 15.6277 10.6277 15.8224 10.3827 15.9239C10.1989 16 9.96594 16 9.5 16C9.03406 16 8.80109 16 8.61732 15.9239C8.37229 15.8224 8.17761 15.6277 8.07612 15.3827C8 15.1989 8 14.9659 8 14.5V9.5Z' stroke='%231C274C' stroke-width='1.5'/%3e%3cpath d='M13 9.5C13 9.03406 13 8.80109 13.0761 8.61732C13.1776 8.37229 13.3723 8.17761 13.6173 8.07612C13.8011 8 14.0341 8 14.5 8C14.9659 8 15.1989 8 15.3827 8.07612C15.6277 8.17761 15.8224 8.37229 15.9239 8.61732C16 8.80109 16 9.03406 16 9.5V14.5C16 14.9659 16 15.1989 15.9239 15.3827C15.8224 15.6277 15.6277 15.8224 15.3827 15.9239C15.1989 16 14.9659 16 14.5 16C14.0341 16 13.8011 16 13.6173 15.9239C13.3723 15.8224 13.1776 15.6277 13.0761 15.3827C13 15.1989 13 14.9659 13 14.5V9.5Z' stroke='%231C274C' stroke-width='1.5'/%3e%3c/svg%3e`;

  let isPlaying = false;
  playBtn.src = svgPlay;

  playBtn.addEventListener('click', () => {
    if (!isPlaying) {
      audio.loop = true;
      audio.play().then(() => {
        playBtn.src = svgPause;
        isPlaying = true;
      }).catch(error => console.error('Playback failed:', error));
    } else {
      audio.pause();
      audio.currentTime = 0;
      playBtn.src = svgPlay;
      isPlaying = false;
    }
  });

  const sliderContainer = document.createElement('div');
  sliderContainer.style.position = 'fixed';
  sliderContainer.style.top = '18px'; //aaaaaaaaaaaaaaaaaaaaa
  sliderContainer.style.left = '60px';
  sliderContainer.style.width = '100px';
  sliderContainer.style.height = '24px';
  sliderContainer.style.cursor = 'pointer';
  sliderContainer.style.zIndex = '9999';
  sliderContainer.style.userSelect = 'none';

  sliderContainer.innerHTML = `
    <svg width="100" height="24" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
      <line x1="12" y1="12" x2="88" y2="12" stroke="#1c274c" stroke-width="4" stroke-linecap="round"/>
      <g id="thumb" cursor="pointer" transform="translate(12, 12)">
        <svg fill="#4faeca" width="26px" height="26px" viewBox="-2 -2 24 24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" class="jam jam-volume-circle"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-2.664-4.759a2 2 0 0 1-2-2v-2.5a2 2 0 0 1 2-2H8.34l1.823-1.709a2 2 0 0 1 1.368-.54h.205a1.6 1.6 0 0 1 1.6 1.6v7.8a1.6 1.6 0 0 1-1.6 1.6h-.205a2 2 0 0 1-1.368-.542L8.34 13.241H7.336zm1.795-4.5H7.336v2.5H9.13l2.205 2.067V6.674L9.13 8.741z"></path></g></svg>
      </g>
    </svg>
  `;

  document.body.appendChild(playBtn);
  document.body.appendChild(sliderContainer);

  const svg = sliderContainer.querySelector('svg');
  const thumb = sliderContainer.querySelector('#thumb');

  // Slider track boundaries
  const trackStart = 0;
  const trackEnd = 74;
  const trackLength = trackEnd - trackStart;

  let isDragging = false;

  function setThumbPosition(volume) {
    // volume: 0 to 1
    const x = trackStart + volume * trackLength;
    thumb.setAttribute('transform', `translate(${x}, -1)`);
  }

  // Initialize thumb position from current volume
  setThumbPosition(audio.volume);

  function updateVolumeFromPosition(x) {
    if (x < trackStart) x = trackStart;
    if (x > trackEnd) x = trackEnd;
    const volume = (x - trackStart) / trackLength;
    audio.volume = volume;
    setThumbPosition(volume);
  }

  // Mouse and touch events for dragging
  function onPointerDown(e) {
    isDragging = true;
    moveThumb(e);
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    moveThumb(e);
  }

  function onPointerUp(e) {
    isDragging = false;
  }

  function moveThumb(e) {
    const rect = svg.getBoundingClientRect();
    let clientX;
    if (e.touches) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    const x = clientX - rect.left;
    updateVolumeFromPosition(x);
  }

  svg.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  svg.addEventListener('touchstart', onPointerDown);
  window.addEventListener('touchmove', onPointerMove);
  window.addEventListener('touchend', onPointerUp);
});
