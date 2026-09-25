// Arduino Test Application Core Logic

let questions = [];
let currentQuestionIndex = 0;
let userAnswers = {};
let studentInfo = {};
let timerInterval = null;
let secondsElapsed = 0;
let defaultApiUrl = localStorage.getItem("arduino_apps_script_url") || "https://script.google.com/macros/s/AKfycbwD6OzvgYpIF0atUIENcpjHbhZavDibwCMaapcpiufKvHAw3_4YDpU3_SoD2ambeb97/exec";

// Embedded fallback questions in case of local file:// CORS restrictions
const fallbackQuestions = [
  {
    "id": 1,
    "question": "Arduino UNO nima?",
    "options": [
      "Operatsion tizim",
      "Mikrokontrollerli elektron plata",
      "Kompyuter ekrani",
      "Internet brauzer"
    ],
    "answer": 1
  },
  {
    "id": 2,
    "question": "Arduino UNO platasida nechta raqamli (Digital) pin bor?",
    "options": [
      "8 ta",
      "14 ta (0 dan 13 gacha)",
      "20 ta",
      "32 ta"
    ],
    "answer": 1
  },
  {
    "id": 3,
    "question": "Arduino UNO platasida nechta analog kirish (Analog In) pinlari mavjud?",
    "options": [
      "6 ta (A0 dan A5 gacha)",
      "10 ta",
      "4 ta",
      "12 ta"
    ],
    "answer": 0
  },
  {
    "id": 4,
    "question": "pinMode() funksiyasi kodingizda qanday vazifani bajaradi?",
    "options": [
      "Pindan qiymat o'qiydi",
      "Pin rejimini (INPUT yoki OUTPUT) belgilaydi",
      "Dasturni to'xtatadi",
      "Pinga kuchlanish o'lchaydi"
    ],
    "answer": 1
  },
  {
    "id": 5,
    "question": "digitalWrite(13, HIGH); kodi nima qiladi?",
    "options": [
      "13-pinga 0V beradi (o'chiradi)",
      "13-pinga 5V beradi (yoqadi)",
      "13-pinni kirish rejimiga o'tkazadi",
      "13-pinni 13 sekundga to'xtatadi"
    ],
    "answer": 1
  },
  {
    "id": 6,
    "question": "digitalWrite(13, LOW); buyrug'ining vazifasi nima?",
    "options": [
      "13-pin dagi kuchlanishni o'chiradi (0V)",
      "13-pin dagi signalni maksimal qiladi (5V)",
      "Arduino platasini qayta yuklaydi",
      "LED chiroqni miltillatadi"
    ],
    "answer": 0
  },
  {
    "id": 7,
    "question": "delay(1000); kodi nimani bildiradi?",
    "options": [
      "Dasturni 1 minutga to'xtatadi",
      "Dasturni 1000 sekundga to'xtatadi",
      "Dasturni 1 sekundga (1000 millisekund) to'xtatib turadi",
      "1000 ta LED yoqadi"
    ],
    "answer": 2
  },
  {
    "id": 8,
    "question": "LED nurning manfiy oyog'i (Katod - qisqa oyog'i) Arduino platasining qaysi piniga ulanadi?",
    "options": [
      "5V piniga",
      "GND (Ground) piniga",
      "RESET piniga",
      "A0 piniga"
    ],
    "answer": 1
  },
  {
    "id": 9,
    "question": "LED chiroq ketidan rezistor ulashning asosiy sababi nima?",
    "options": [
      "LED yorqinligini oshirish uchun",
      "LED kuyib qolmasligi va tokni cheklash uchun",
      "Arduinoni sekinlashtirish uchun",
      "Rangini o'zgartirish uchun"
    ],
    "answer": 1
  },
  {
    "id": 10,
    "question": "digitalRead() funksiyasi nima uchun ishlatiladi?",
    "options": [
      "Raqamli pindagi signal holatini (HIGH yoki LOW) o'qish uchun",
      "Pinga signal yuborish uchun",
      "Plataga dastur yuklash uchun",
      "Vaqtni o'lchash uchun"
    ],
    "answer": 0
  },
  {
    "id": 11,
    "question": "Arduino UNO ning ishchi mantiqiy kuchlanishi (logic voltage) necha Volt?",
    "options": [
      "12V",
      "3.3V",
      "5V",
      "220V"
    ],
    "answer": 2
  },
  {
    "id": 12,
    "question": "Arduino platasidagi GND qisqartmasi nimani anglatadi?",
    "options": [
      "General Network Data",
      "Ground (Yer / Manfiy qutb - 0V)",
      "Global Next Driver",
      "Generator Power Node"
    ],
    "answer": 1
  },
  {
    "id": 13,
    "question": "Arduino UNO platasini kompyuterga ulash va kod yuklash uchun qaysi kabel ishlatiladi?",
    "options": [
      "HDMI kabel",
      "USB Type-A / Type-B kabel",
      "AUX kabel",
      "Ethernet kabel"
    ],
    "answer": 1
  },
  {
    "id": 14,
    "question": "Arduino kodi (sketch) nechta majburiy asosiy funksiyadan iborat?",
    "options": [
      "Faqat start()",
      "setup() va loop()",
      "main() va exit()",
      "run() va stop()"
    ],
    "answer": 1
  },
  {
    "id": 15,
    "question": "void setup() funksiyasi qachon ishlaydi?",
    "options": [
      "Arduino yoqilganda yoki restart berilganda faqat 1 marta",
      "Har 1 sekundda takrorlanadi",
      "Tugma bosilgandagina",
      "Hech qachon ishlamaydi"
    ],
    "answer": 0
  },
  {
    "id": 16,
    "question": "void loop() funksiyasi qanday tartibda bajariladi?",
    "options": [
      "Faqat bir marta ishlaydi",
      "Arduino quvvatdan uzilguncha to'xtovsiz cheksiz qaytariladi",
      "Faqat 10 marta ishlaydi",
      "Faqat kompyuter ulangan bo'lsa ishlaydi"
    ],
    "answer": 1
  },
  {
    "id": 17,
    "question": "Rezistor qarshiligi qaysi o'lchov birligida o'lchanadi?",
    "options": [
      "Volt (V)",
      "Amper (A)",
      "Om (Ohm / Ω)",
      "Vatt (W)"
    ],
    "answer": 2
  },
  {
    "id": 18,
    "question": "Tugma (Push button) bosilganda o'qiladigan raqamli signal qanday bo'lishi mumkin?",
    "options": [
      "Faqat 100 Volt",
      "HIGH (1) yoki LOW (0)",
      "Faqat matnli xabar",
      "Har doim analoq signal"
    ],
    "answer": 1
  },
  {
    "id": 19,
    "question": "Arduino UNO platasidagi 5V pinining vazifasi nima?",
    "options": [
      "Tashqi datchik va modullarga +5V stabil quvvat berish",
      "Kompyuterni zaryadlash",
      "Yuqori kuchlanishni o'chirish",
      "Faqat LED miltillatish"
    ],
    "answer": 0
  },
  {
    "id": 20,
    "question": "Arduino UNO platasida qaysi pinlar PWM (Puls Kengligi Modulyatsiyasi) qo'llab-quvvatlaydi (~ belgisi bor)?",
    "options": [
      "3, 5, 6, 9, 10, 11 pinlar",
      "Hamma pinlar",
      "Faqat A0 va A1 pinlar",
      "Faqat 0 va 1 pinlar"
    ],
    "answer": 0
  }
];

// DOM Elements
const screenRegistration = document.getElementById("screenRegistration");
const screenQuiz = document.getElementById("screenQuiz");
const screenResults = document.getElementById("screenResults");

const studentForm = document.getElementById("studentForm");
const displayStudentName = document.getElementById("displayStudentName");
const displayGroup = document.getElementById("displayGroup");
const timerText = document.getElementById("timerText");

const progressFill = document.getElementById("progressFill");
const questionNumberText = document.getElementById("questionNumberText");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const scoreCircle = document.getElementById("scoreCircle");
const scorePctText = document.getElementById("scorePctText");
const statCorrect = document.getElementById("statCorrect");
const statWrong = document.getElementById("statWrong");
const statTime = document.getElementById("statTime");
const wrongQuestionsBox = document.getElementById("wrongQuestionsBox");
const wrongQuestionsList = document.getElementById("wrongQuestionsList");
const sheetsSyncStatus = document.getElementById("sheetsSyncStatus");
const restartBtn = document.getElementById("restartBtn");
const progressPctText = document.getElementById("progressPctText");

// Initialize Application
document.addEventListener("DOMContentLoaded", async () => {
  // Load questions
  try {
    const res = await fetch("questions.json");
    if (res.ok) {
      questions = await res.json();
    } else {
      questions = fallbackQuestions;
    }
  } catch (err) {
    console.log("questions.json o'qishda fallback qo'llanildi.");
    questions = fallbackQuestions;
  }

  // Form Submit -> Start Test
  studentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    studentInfo = {
      ism: document.getElementById("firstName").value.trim(),
      familiya: document.getElementById("lastName").value.trim(),
      yosh: document.getElementById("age").value.trim(),
      telefon: document.getElementById("phone").value.trim(),
      guruh: document.getElementById("group").value.trim(),
    };

    displayStudentName.textContent = `${studentInfo.ism} ${studentInfo.familiya}`;
    displayGroup.textContent = studentInfo.guruh;

    startQuiz();
  });

  // Quiz Navigation Events
  prevBtn.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderQuestion();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      renderQuestion();
    } else {
      finishQuiz();
    }
  });

  restartBtn.addEventListener("click", () => {
    currentQuestionIndex = 0;
    userAnswers = {};
    secondsElapsed = 0;
    switchScreen(screenRegistration);
  });
});

function switchScreen(activeScreen) {
  [screenRegistration, screenQuiz, screenResults].forEach(s => s.classList.remove("active"));
  activeScreen.classList.add("active");
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startQuiz() {
  currentQuestionIndex = 0;
  userAnswers = {};
  secondsElapsed = 0;
  switchScreen(screenQuiz);
  renderQuestion();
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  timerText.textContent = "00:00";
  timerInterval = setInterval(() => {
    secondsElapsed++;
    const mins = String(Math.floor(secondsElapsed / 60)).padStart(2, "0");
    const secs = String(secondsElapsed % 60).padStart(2, "0");
    timerText.textContent = `${mins}:${secs}`;
  }, 1000);
}

function renderQuestion() {
  const q = questions[currentQuestionIndex];
  const total = questions.length;

  questionNumberText.textContent = `SAVOL ${currentQuestionIndex + 1} / ${total}`;
  if (progressPctText) {
    progressPctText.textContent = `${Math.round(((currentQuestionIndex + 1) / total) * 100)}%`;
  }
  questionText.textContent = q.question;

  // Update progress bar
  const pct = ((currentQuestionIndex + 1) / total) * 100;
  progressFill.style.width = `${pct}%`;

  // Render options A, B, C, D
  const letters = ["A", "B", "C", "D"];
  optionsContainer.innerHTML = "";

  q.options.forEach((optText, optIdx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    if (userAnswers[currentQuestionIndex] === optIdx) {
      btn.classList.add("selected");
    }

    btn.innerHTML = `
      <span class="option-letter">${letters[optIdx]}</span>
      <span>${optText}</span>
    `;

    btn.addEventListener("click", () => {
      userAnswers[currentQuestionIndex] = optIdx;
      renderQuestion();
    });

    optionsContainer.appendChild(btn);
  });

  // Prev / Next button state
  prevBtn.disabled = (currentQuestionIndex === 0);
  if (currentQuestionIndex === total - 1) {
    nextBtn.innerHTML = "🏁 Testni yakunlash";
  } else {
    nextBtn.innerHTML = 'Keyingisi <span>➡️</span>';
  }
}

function finishQuiz() {
  clearInterval(timerInterval);

  let correctCount = 0;
  let wrongCount = 0;
  let wrongListNumbers = [];
  let wrongDetailedArr = [];

  const letters = ["A", "B", "C", "D"];

  questions.forEach((q, idx) => {
    const userSelected = userAnswers[idx];
    if (userSelected === q.answer) {
      correctCount++;
    } else {
      wrongCount++;
      const qNum = idx + 1;
      wrongListNumbers.push(qNum);

      const userAnsStr = userSelected !== undefined ? `${letters[userSelected]}) ${q.options[userSelected]}` : "Javob berilmagan";
      const correctAnsStr = `${letters[q.answer]}) ${q.options[q.answer]}`;

      wrongDetailedArr.push({
        qNum: qNum,
        question: q.question,
        userAns: userAnsStr,
        correctAns: correctAnsStr
      });
    }
  });

  const totalQuestions = questions.length;
  const percentageVal = Math.round((correctCount / totalQuestions) * 100);
  const formattedTime = timerText.textContent;

  // Render Results Screen UI
  scorePctText.textContent = `${percentageVal}%`;
  scoreCircle.style.setProperty("--score-pct", percentageVal);
  statCorrect.textContent = correctCount;
  statWrong.textContent = wrongCount;
  statTime.textContent = formattedTime;

  // Render Wrong Questions List
  if (wrongCount > 0) {
    wrongQuestionsBox.style.display = "block";
    wrongQuestionsList.innerHTML = wrongDetailedArr.map(item => `
      <div class="wrong-item">
        <div class="wrong-item-num">${item.qNum}-savol</div>
        <div class="wrong-item-q">${item.question}</div>
        <div class="wrong-item-ans">
          Sizning javob: <span class="user-badge">${item.userAns}</span><br>
          To'g'ri javob: <span class="correct-badge">${item.correctAns}</span>
        </div>
      </div>
    `).join("");
  } else {
    wrongQuestionsBox.style.display = "none";
  }

  switchScreen(screenResults);

  // Send data to Google Sheets
  sendDataToGoogleSheets({
    sana: formatDate(new Date()),
    ism: studentInfo.ism,
    familiya: studentInfo.familiya,
    yosh: studentInfo.yosh,
    telefon: studentInfo.telefon,
    guruh: studentInfo.guruh,
    totalQuestions: totalQuestions,
    correctCount: correctCount,
    wrongCount: wrongCount,
    percentage: `${percentageVal}%`,
    duration: formattedTime,
    wrongQuestionsList: wrongListNumbers.length > 0 ? wrongListNumbers.join(", ") : "Yo'q",
    wrongQuestionsDetailed: wrongDetailedArr.map(w => `${w.qNum}-savol: noto'g'ri`).join("; ") || "Barchasi to'g'ri"
  });
}

async function sendDataToGoogleSheets(payload) {
  const apiUrl = defaultApiUrl;

  if (!apiUrl) {
    sheetsSyncStatus.style.background = "#fef3c7";
    sheetsSyncStatus.style.color = "#92400e";
    sheetsSyncStatus.innerHTML = "⚠️ API manzili sozlanmagan.";
    return;
  }

  sheetsSyncStatus.style.background = "#e0f2fe";
  sheetsSyncStatus.style.color = "#0369a1";
  sheetsSyncStatus.innerHTML = "⏳ Natija saqlanmoqda...";

  try {
    await fetch(apiUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    sheetsSyncStatus.style.background = "#ecfdf5";
    sheetsSyncStatus.style.color = "#065f46";
    sheetsSyncStatus.innerHTML = "✅ Natija saqlandi!";
  } catch (error) {
    console.error("Yuborishda xatolik:", error);
    sheetsSyncStatus.style.background = "#fef2f2";
    sheetsSyncStatus.style.color = "#991b1b";
    sheetsSyncStatus.innerHTML = "❌ Natijani saqlashda xatolik yuz berdi.";
  }
}

function formatDate(date) {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
}

