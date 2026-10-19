const planetCards = [...document.querySelectorAll('.planet-card')];
const engine = document.getElementById('engine');
const fuel = document.getElementById('fuel');
const engineValue = document.getElementById('engineValue');
const fuelValue = document.getElementById('fuelValue');
const engineLabel = document.getElementById('engineLabel');
const rocket = document.getElementById('rocketPreview');
const buildBtn = document.getElementById('buildBtn');
const launchBtn = document.getElementById('launchBtn');
const returnBtn = document.getElementById('returnBtn');
const countdown = document.getElementById('countdown');
const progressBar = document.getElementById('progressBar');
const result = document.getElementById('result');
const missionTitle = document.getElementById('missionTitle');
const missionText = document.getElementById('missionText');
let destination = 'Moon';
let built = false;
let inFlight = false;
let timer = null;

planetCards.forEach(card => card.addEventListener('click', () => {
  if (inFlight) return;
  destination = card.dataset.planet;
  planetCards.forEach(item => {
    const selected = item === card;
    item.classList.toggle('selected', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  missionTitle.textContent = 'Ready for ' + destination + '?';
  missionText.textContent = 'Your rocket is waiting. Build your design, then start the countdown.';
  result.textContent = '';
  progressBar.style.width = '0%';
  built = false;
  launchBtn.disabled = false;
  launchBtn.textContent = '▶ START COUNTDOWN';
}));

function updateSliders() {
  engineValue.value = engine.value + '%';
  fuelValue.value = fuel.value + '%';
  engineLabel.textContent = Number(engine.value) >= 80 ? 'HIGH-POWER ENGINE' : Number(engine.value) <= 40 ? 'EFFICIENT ENGINE' : 'STANDARD ENGINE';
  rocket.style.filter = 'drop-shadow(0 0 ' + Math.round(Number(engine.value) / 8) + 'px #9a86ff66)';
}
engine.addEventListener('input', () => { updateSliders(); built = false; });
fuel.addEventListener('input', () => { updateSliders(); built = false; });
updateSliders();

buildBtn.addEventListener('click', () => {
  if (inFlight) return;
  built = true;
  result.textContent = 'Rocket assembled! Engine power: ' + engine.value + '%. Fuel capacity: ' + fuel.value + '%. Destination: ' + destination + '. Mission control is ready.';
  countdown.textContent = 'MISSION STATUS: ROCKET BUILT';
  missionTitle.textContent = destination + ' mission configured';
  missionText.textContent = 'Design saved for this session. Launch when you are ready, captain.';
  launchBtn.disabled = false;
});

launchBtn.addEventListener('click', () => {
  if (inFlight) return;
  if (!built) {
    countdown.textContent = 'MISSION STATUS: BUILD YOUR ROCKET FIRST';
    result.textContent = 'First, press “Build My Rocket” to confirm your design.';
    return;
  }
  inFlight = true;
  launchBtn.disabled = true;
  engine.disabled = true;
  fuel.disabled = true;
  planetCards.forEach(card => card.disabled = true);
  returnBtn.disabled = true;
  result.textContent = '';
  rocket.classList.remove('launched');
  void rocket.offsetWidth;
  rocket.classList.add('launched');
  const phases = ['COUNTDOWN: T MINUS 3', 'COUNTDOWN: T MINUS 2', 'COUNTDOWN: T MINUS 1', 'LIFTOFF!','CLIMBING THROUGH THE ATMOSPHERE…','CRUISING TOWARD ' + destination.toUpperCase() + '…'];
  let step = 0;
  countdown.textContent = phases[step];
  progressBar.style.width = '0%';
  timer = setInterval(() => {
    step++;
    progressBar.style.width = Math.min(100, Math.round(step / (phases.length - 1) * 100)) + '%';
    if (step < phases.length) {
      countdown.textContent = phases[step];
    } else {
      clearInterval(timer);
      timer = null;
      inFlight = false;
      returnBtn.disabled = false;
      countdown.textContent = 'MISSION STATUS: DESTINATION REACHED';
      missionTitle.textContent = 'Welcome to ' + destination + '!';
      missionText.textContent = 'Mission complete, explorer. Ready to head back to Earth?';
      const score = Math.min(100, Math.round((Number(engine.value) * .45) + (Number(fuel.value) * .35) + 20));
      result.textContent = '✦ MISSION COMPLETE — You reached ' + destination + '! Your mission score is ' + score + '/100. This score is for fun and does not represent real spacecraft performance.';
    }
  }, 850);
});

returnBtn.addEventListener('click', () => {
  if (inFlight) return;
  rocket.classList.remove('launched');
  engine.disabled = false;
  fuel.disabled = false;
  planetCards.forEach(card => card.disabled = false);
  returnBtn.disabled = true;
  launchBtn.disabled = false;
  countdown.textContent = 'MISSION STATUS: BACK ON EARTH';
  progressBar.style.width = '100%';
  missionTitle.textContent = 'Mission logged. Welcome home!';
  missionText.textContent = 'Pick another destination or redesign your rocket for a new adventure.';
  result.textContent = 'You completed your ' + destination + ' adventure and returned to Earth. Great exploring!';
  built = false;
});
