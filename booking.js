const calendar = document.getElementById("calendar");
const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

const dateInput = document.getElementById("booking-date");
const timeSlotsDiv = document.getElementById("time-slots");
const teamSlotsDiv = document.getElementById("team-slots");

const summaryDate = document.getElementById("summary-date");
const summaryTime = document.getElementById("summary-time");
const summaryTeam = document.getElementById("summary-team");
const confirmBtn = document.getElementById("confirmBooking");

const team = ["Nina", "Venus", "Asiah", "Michelle"];

const hours = {
  0: null,
  1: [9.5, 15.75],
  2: [9.25, 18],
  3: [9.25, 18.5],
  4: [9.5, 18],
  5: [9.5, 15.75],
  6: [10, 12]
};

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

months.forEach((m,i) => {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = m;
  monthSelect.appendChild(opt);
});

for (let y = currentYear; y <= currentYear + 1; y++) {
  const opt = document.createElement("option");
  opt.value = y;
  opt.textContent = y;
  yearSelect.appendChild(opt);
}

monthSelect.value = currentMonth;
yearSelect.value = currentYear;

function formatTime(t) {
  const h = Math.floor(t);
  const m = Math.round((t - h) * 60);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12 + 1);
  return `${h12}:${m.toString().padStart(2, "0")} ${suffix}`;
}

function generateTimes(open, close) {
  const slots = [];
  let t = open;
  while (t < close) {
    slots.push(t);
    t += 0.25;
  }
  return slots;
}

function renderCalendar() {
  calendar.innerHTML = "";

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement("div");
    cell.textContent = d;

    cell.onclick = () => {
      document.querySelectorAll(".calendar .selected").forEach(el => el.classList.remove("selected"));
      cell.classList.add("selected");

      const dateStr = `${currentYear}-${String(currentMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      dateInput.value = dateStr;
      summaryDate.textContent = dateStr;
      dateInput.dispatchEvent(new Event("change"));
    };

    calendar.appendChild(cell);
  }
}

function sync() {
  monthSelect.value = currentMonth;
  yearSelect.value = currentYear;
  renderCalendar();
}

prevBtn.onclick = () => {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  sync();
};

nextBtn.onclick = () => {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  sync();
};

monthSelect.onchange = () => {
  currentMonth = parseInt(monthSelect.value);
  sync();
};

yearSelect.onchange = () => {
  currentYear = parseInt(yearSelect.value);
  sync();
};

dateInput.addEventListener("change", () => {
  timeSlotsDiv.innerHTML = "";
  teamSlotsDiv.innerHTML = "";
  summaryTime.textContent = "—";
  summaryTeam.textContent = "—";
  confirmBtn.disabled = true;

  const [y,m,d] = dateInput.value.split("-").map(Number);
  const day = new Date(y, m-1, d).getDay();
  const dayHours = hours[day];

  if (!dayHours) {
    timeSlotsDiv.innerHTML = "<p>Closed this day</p>";
    return;
  }

  generateTimes(dayHours[0], dayHours[1]).forEach(t => {
    const btn = document.createElement("button");
    btn.textContent = formatTime(t);
    btn.onclick = () => selectTime(formatTime(t));
    timeSlotsDiv.appendChild(btn);
  });
});

function selectTime(time) {
  summaryTime.textContent = time;
  teamSlotsDiv.innerHTML = "";

  team.forEach(name => {
    const btn = document.createElement("button");
    btn.textContent = name;
    btn.onclick = () => {
      summaryTeam.textContent = name;
      confirmBtn.disabled = false;
    };
    teamSlotsDiv.appendChild(btn);
  });
}

sync();

function updatePricing(serviceString) {
  // serviceString format: "Service Name|$75|60min"
  const parts = serviceString.split("|");
  const priceText = parts[1].replace("$", "").trim();
  const price = parseFloat(priceText);

  const deposit = 30;
  const due = Math.max(price - deposit, 0);

  document.getElementById("summary-service-price").textContent = price.toFixed(2);
  document.getElementById("summary-due").textContent = due.toFixed(2);
}

// deposit and payment amounts
const params = new URLSearchParams(window.location.search);
const service = params.get("service");

if (service) {
  document.getElementById("summary-service-price").textContent = "...";
  updatePricing(service);
}
