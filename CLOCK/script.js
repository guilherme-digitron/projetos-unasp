const clock = document.getElementById('clock');
const alarmSound = document.getElementById('alarmSound');
const status = document.getElementById('status');
const alarmTableBody = document.getElementById('alarmTableBody');
const stopAlarmBtn = document.getElementById('stopAlarmBtn');

const hourHand = document.getElementById('hour');
const minuteHand = document.getElementById('minute');
const secondHand = document.getElementById('second');

let alarms = [];

for (let i = 1; i <= 12; i++) {
  const angle = (i * 30) * (Math.PI / 180);
  const radius = 130;
  const x = 150 + radius * Math.sin(angle);
  const y = 150 - radius * Math.cos(angle);

  const numberEl = document.createElement('div');
  numberEl.className = 'number';
  numberEl.style.left = `${x}px`;
  numberEl.style.top = `${y}px`;
  numberEl.textContent = i;
  clock.appendChild(numberEl);
}

function updateClock() {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  secondHand.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
  minuteHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
  hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;

  checkAlarms(now);
}

function addAlarm() {
  const input = document.getElementById('alarmTime');
  if (!input.value) return;

  const description = prompt("Insira uma descrição para o alarme:");
  if (!description) {
    status.textContent = "A descrição é obrigatória.";
    return;
  }

  // Pré-carrega o som (não mostra mensagem e não toca se bloqueado)
  alarmSound.play().then(() => {
    alarmSound.pause();
    alarmSound.currentTime = 0;
  }).catch(() => {});

  const alarm = {
    time: input.value,
    description: description,
    triggered: false
  };

  alarms.push(alarm);
  input.value = '';
  status.textContent = 'Alarme adicionado!';
  renderAlarms();
}

function renderAlarms() {
  alarmTableBody.innerHTML = '';
  alarms.forEach((alarm, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${alarm.time}</td>
      <td>${alarm.triggered ? 'Disparado' : 'Ativo'}</td>
      <td>
        <button class="action-btn" onclick="alert('Descrição: ${alarm.description}')">Detalhes</button>
        <button class="action-btn" onclick="updateAlarm(${index})">Atualizar</button>
        <button class="delete-btn" onclick="deleteAlarm(${index})">Excluir</button>
      </td>
    `;
    alarmTableBody.appendChild(row);
  });
}

function deleteAlarm(index) {
  alarms.splice(index, 1);
  renderAlarms();
}

function updateAlarm(index) {
  const newTime = prompt("Novo horário (hh:mm):", alarms[index].time);
  const newDesc = prompt("Nova descrição:", alarms[index].description);

  if (newTime && /^\d{2}:\d{2}$/.test(newTime) && newDesc) {
    alarms[index].time = newTime;
    alarms[index].description = newDesc;
    alarms[index].triggered = false;
    renderAlarms();
  }
}

function checkAlarms(now) {
  const currentTime = now.toTimeString().slice(0, 5);
  alarms.forEach((alarm, index) => {
    if (!alarm.triggered && alarm.time === currentTime) {
      alarm.triggered = true;
      alarmSound.play().catch(() => {});
      document.body.classList.add('alert');
      stopAlarmBtn.style.display = 'inline-block';
      status.textContent = `ALARME (${alarm.time}) DISPARADO!`;
      renderAlarms();
    }
  });
}

function stopAlarm() {
  alarmSound.pause();
  alarmSound.currentTime = 0;
  document.body.classList.remove('alert');
  stopAlarmBtn.style.display = 'none';
  status.textContent = 'Alarme parado.';
}

setInterval(updateClock, 1000);
updateClock();