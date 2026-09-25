// Arduino Test Application Core Logic with Randomization & Instant Feedback

let questions = [];
let activeQuizQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = {};
let studentInfo = {};
let timerInterval = null;
let secondsElapsed = 0;
let defaultApiUrl = localStorage.getItem("arduino_apps_script_url") || "https://script.google.com/macros/s/AKfycbwD6OzvgYpIF0atUIENcpjHbhZavDibwCMaapcpiufKvHAw3_4YDpU3_SoD2ambeb97/exec";

// Embedded fallback questions in case of file:// or fetch errors
const fallbackQuestions = [
  {
    "id": 1,
    "question": "Arduino UNO nima?",
    "options": ["Operatsion tizim", "Mikrokontrollerli elektron plata", "Kompyuter ekrani", "Internet brauzer"],
    "answer": 1,
    "explanation": "Arduino UNO — bu ATmega328P mikrokontrolleriga asoslangan elektron plata bo'lib, datchik va ijro etuvchi qurilmalarni boshqarish uchun ishlatiladi."
  },
  {
    "id": 2,
    "question": "Arduino UNO platasida nechta raqamli (Digital) pin bor?",
    "options": ["8 ta", "14 ta (0 dan 13 gacha)", "20 ta", "32 ta"],
    "answer": 1,
    "explanation": "Arduino UNO platasida 0 dan 13 gacha raqamlangan 14 ta raqamli (digital) kirish/chiqish pinlari mavjud."
  },
  {
    "id": 3,
    "question": "Arduino UNO platasida nechta analog kirish (Analog In) pinlari mavjud?",
    "options": ["6 ta (A0 dan A5 gacha)", "10 ta", "4 ta", "12 ta"],
    "answer": 0,
    "explanation": "Arduino UNO platasida A0, A1, A2, A3, A4 va A5 deb nomlangan 6 ta analog kirish pini bor."
  },
  {
    "id": 4,
    "question": "pinMode() funksiyasi kodingizda qanday vazifani bajaradi?",
    "options": ["Pindan qiymat o'qiydi", "Pin rejimini (INPUT yoki OUTPUT) belgilaydi", "Dasturni to'xtatadi", "Pinga kuchlanish o'lchaydi"],
    "answer": 1,
    "explanation": "pinMode(pin, mode) funksiyasi ko'rsatilgan pin signal qabul qiluvchi (INPUT) yoki signal chiqaruvchi (OUTPUT) ekanini belgilaydi."
  },
  {
    "id": 5,
    "question": "digitalWrite(13, HIGH); kodi nima qiladi?",
    "options": ["13-pinga 0V beradi (o'chiradi)", "13-pinga 5V beradi (yoqadi)", "13-pinni kirish rejimiga o'tkazadi", "13-pinni 13 sekundga to'xtatadi"],
    "answer": 1,
    "explanation": "digitalWrite() funksiyasiga HIGH (yuqori) qiymati berilganda pinda 5 Volt kuchlanish hosil bo'ladi va ulangan LED yoqiladi."
  },
  {
    "id": 6,
    "question": "digitalWrite(13, LOW); buyrug'ining vazifasi nima?",
    "options": ["13-pin dagi kuchlanishni o'chiradi (0V)", "13-pin dagi signalni maksimal qiladi (5V)", "Arduino platasini qayta yuklaydi", "LED chiroqni miltillatadi"],
    "answer": 0,
    "explanation": "LOW (quyi) qiymati pindagi kuchlanishni 0 Voltga tushiradi va 13-pinga ulangan qurilmani o'chiradi."
  },
  {
    "id": 7,
    "question": "delay(1000); kodi nimani bildiradi?",
    "options": ["Dasturni 1 minutga to'xtatadi", "Dasturni 1000 sekundga to'xtatadi", "Dasturni 1 sekundga (1000 millisekund) to'xtatib turadi", "1000 ta LED yoqadi"],
    "answer": 2,
    "explanation": "delay() funksiyasi vaqtni millisekundlarda qabul qiladi. 1000 millisekund = 1 sekundga teng."
  },
  {
    "id": 8,
    "question": "LED nurning manfiy oyog'i (Katod - qisqa oyog'i) Arduino platasining qaysi piniga ulanadi?",
    "options": ["5V piniga", "GND (Ground) piniga", "RESET piniga", "A0 piniga"],
    "answer": 1,
    "explanation": "LED katodi (manfiy/qisqa oyog'i) har doim zanjirning manfiy qutbi bo'lgan GND (Yer/Ground) piniga ulanishi shart."
  },
  {
    "id": 9,
    "question": "LED chiroq ketidan rezistor ulashning asosiy sababi nima?",
    "options": ["LED yorqinligini oshirish uchun", "LED kuyib qolmasligi va tokni cheklash uchun", "Arduinoni sekinlashtirish uchun", "Rangini o'zgartirish uchun"],
    "answer": 1,
    "explanation": "Rezistor zanjirdan o'tayotgan elektr tokini cheklab, LED chiroq hamda Arduinoni kuydirib qo'yishdan himoya qiladi."
  },
  {
    "id": 10,
    "question": "digitalRead() funksiyasi nima uchun ishlatiladi?",
    "options": ["Raqamli pindagi signal holatini (HIGH yoki LOW) o'qish uchun", "Pinga signal yuborish uchun", "Plataga dastur yuklash uchun", "Vaqtni o'lchash uchun"],
    "answer": 0,
    "explanation": "digitalRead(pin) raqamli pinda 5V (HIGH) yoki 0V (LOW) signal borligini o'qiydi (masalan tugma bosilganini aniqlaydi)."
  },
  {
    "id": 11,
    "question": "Arduino UNO ning ishchi mantiqiy kuchlanishi (logic voltage) necha Volt?",
    "options": ["12V", "3.3V", "5V", "220V"],
    "answer": 2,
    "explanation": "Arduino UNO platasi 5 Voltli mantiqiy kuchlanish (TTL 5V) bilan ishlaydi."
  },
  {
    "id": 12,
    "question": "Arduino platasidagi GND qisqartmasi nimani anglatadi?",
    "options": ["General Network Data", "Ground (Yer / Manfiy qutb - 0V)", "Global Next Driver", "Generator Power Node"],
    "answer": 1,
    "explanation": "GND — inglizcha 'Ground' (Yer) so'zidan olingan bo'lib, elektr zanjirining 0V manfiy qutbini bildiradi."
  },
  {
    "id": 13,
    "question": "Arduino UNO platasini kompyuterga ulash va kod yuklash uchun qaysi kabel ishlatiladi?",
    "options": ["HDMI kabel", "USB Type-A / Type-B kabel", "AUX kabel", "Ethernet kabel"],
    "answer": 1,
    "explanation": "Arduino UNO kompyuter bilan aloqa qilish va quvvat olish uchun standart USB Type-A to Type-B kabelidan foydalanadi."
  },
  {
    "id": 14,
    "question": "Arduino kodi (sketch) nechta majburiy asosiy funksiyadan iborat?",
    "options": ["Faqat start()", "setup() va loop()", "main() va exit()", "run() va stop()"],
    "answer": 1,
    "explanation": "Har bir Arduino kodi kamida ikkita majburiy funksiyadan iborat bo'lishi shart: void setup() va void loop()."
  },
  {
    "id": 15,
    "question": "void setup() funksiyasi qachon ishlaydi?",
    "options": ["Arduino yoqilganda yoki restart berilganda faqat 1 marta", "Har 1 sekundda takrorlanadi", "Tugma bosilgandagina", "Hech qachon ishlamaydi"],
    "answer": 0,
    "explanation": "void setup() plataga quvvat berilganda faqat bir marta ishga tushib, boshlang'ich sozlamalarni yuklaydi."
  },
  {
    "id": 16,
    "question": "void loop() funksiyasi qanday tartibda bajariladi?",
    "options": ["Faqat bir marta ishlaydi", "Arduino quvvatdan uzilguncha to'xtovsiz cheksiz qaytariladi", "Faqat 10 marta ishlaydi", "Faqat kompyuter ulangan bo'lsa ishlaydi"],
    "answer": 1,
    "explanation": "void loop() ichidagi kodlar to Arduino o'chirilmaguncha yuqoridan pastga to'xtovsiz cheksiz takrorlanib ishlaydi."
  },
  {
    "id": 17,
    "question": "Rezistor qarshiligi qaysi o'lchov birligida o'lchanadi?",
    "options": ["Volt (V)", "Amper (A)", "Om (Ohm / Ω)", "Vatt (W)"],
    "answer": 2,
    "explanation": "Elektr qarshiligi nemis fizigi Georg Om sharafiga Om (Ohm / Ω) birligida o'lchanadi."
  },
  {
    "id": 18,
    "question": "Tugma (Push button) bosilganda o'qiladigan raqamli signal qanday bo'lishi mumkin?",
    "options": ["Faqat 100 Volt", "HIGH (1) yoki LOW (0)", "Faqat matnli xabar", "Har doim analoq signal"],
    "answer": 1,
    "explanation": "Raqamli (Digital) pinlar faqat 2 xil mantiqiy holatni ajrata oladi: HIGH (1 - 5V) yoki LOW (0 - 0V)."
  },
  {
    "id": 19,
    "question": "Arduino UNO platasidagi 5V pinining vazifasi nima?",
    "options": ["Tashqi datchik va modullarga +5V stabil quvvat berish", "Kompyuterni zaryadlash", "Yuqori kuchlanishni o'chirish", "Faqat LED miltillatish"],
    "answer": 0,
    "explanation": "5V pini tashqi datchiklar, ekranlar hamda modullarni 5 Voltli stabil elektr quvvati bilan ta'minlaydi."
  },
  {
    "id": 20,
    "question": "Arduino UNO platasida qaysi pinlar PWM (Puls Kengligi Modulyatsiyasi) qo'llab-quvvatlaydi (~ belgisi bor)?",
    "options": ["3, 5, 6, 9, 10, 11 pinlar", "Hamma pinlar", "Faqat A0 va A1 pinlar", "Faqat 0 va 1 pinlar"],
    "answer": 0,
    "explanation": "Arduino UNO platasida 3, 5, 6, 9, 10 va 11-raqamli pinlar yonida '~' belgisi bor va ular PWM analog-simulyatsiya signalini hosil qila oladi."
  }
];

// Fisher-Yates Random Shuffle Algorithm
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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
const feedbackContainer = document.getElementById("feedbackContainer");
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
    if (userAnswers[currentQuestionIndex] === undefined) {
      alert("Iltimos, avval javoblardan birini tanlang!");
      return;
    }

    if (currentQuestionIndex < activeQuizQuestions.length - 1) {
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

  // 1. Shuffle Questions order
  const shuffledRawQuestions = shuffleArray(questions);

  // 2. Shuffle Options order for each question
  activeQuizQuestions = shuffledRawQuestions.map(q => {
    const mappedOptions = q.options.map((optText, origIdx) => ({
      text: optText,
      isCorrect: origIdx === q.answer
    }));
    return {
      ...q,
      shuffledOptions: shuffleArray(mappedOptions)
    };
  });

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
  const q = activeQuizQuestions[currentQuestionIndex];
  const total = activeQuizQuestions.length;

  questionNumberText.textContent = `SAVOL ${currentQuestionIndex + 1} / ${total}`;
  if (progressPctText) {
    progressPctText.textContent = `${Math.round(((currentQuestionIndex + 1) / total) * 100)}%`;
  }
  questionText.textContent = q.question;

  // Update progress fill
  const pct = ((currentQuestionIndex + 1) / total) * 100;
  progressFill.style.width = `${pct}%`;

  const letters = ["A", "B", "C", "D"];
  optionsContainer.innerHTML = "";
  feedbackContainer.innerHTML = "";

  const savedAnswer = userAnswers[currentQuestionIndex];

  q.shuffledOptions.forEach((optObj, optIdx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";

    // If student already answered this question
    if (savedAnswer !== undefined) {
      btn.classList.add("disabled-btn");
      btn.disabled = true;

      // If this option is correct
      if (optObj.isCorrect) {
        btn.classList.add("correct-choice");
      }
      // If student selected this option and it was wrong
      if (savedAnswer.selectedIdx === optIdx && !savedAnswer.isCorrect) {
        btn.classList.add("wrong-choice");
      }
    } else {
      // Not answered yet
      btn.addEventListener("click", () => handleOptionClick(optIdx));
    }

    btn.innerHTML = `
      <span class="option-letter">${letters[optIdx]}</span>
      <span>${optObj.text}</span>
    `;

    optionsContainer.appendChild(btn);
  });

  // Render Immediate Feedback if answered
  if (savedAnswer !== undefined) {
    const correctOpt = q.shuffledOptions.find(o => o.isCorrect);
    
    if (savedAnswer.isCorrect) {
      feedbackContainer.innerHTML = `
        <div class="feedback-card feedback-success">
          <div class="feedback-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            <span>Barakalla! To'g'ri javob</span>
          </div>
          <div class="feedback-explanation">
            💡 <strong>Tushuntirish:</strong> ${q.explanation || "To'g'ri javob berdingiz!"}
          </div>
        </div>
      `;
    } else {
      feedbackContainer.innerHTML = `
        <div class="feedback-card feedback-danger">
          <div class="feedback-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
            <span>Noto'g'ri javob!</span>
          </div>
          <div class="feedback-detail">
            ✅ To'g'ri javob: <strong>${correctOpt ? correctOpt.text : ""}</strong>
          </div>
          <div class="feedback-explanation">
            💡 <strong>Tushuntirish:</strong> ${q.explanation || ""}
          </div>
        </div>
      `;
    }
  }

  // Prev / Next button states
  prevBtn.disabled = (currentQuestionIndex === 0);
  
  if (currentQuestionIndex === total - 1) {
    nextBtn.innerHTML = '<span>Testni yakunlash</span> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>';
  } else {
    nextBtn.innerHTML = '<span>Keyingisi</span> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
  }
}

function handleOptionClick(optIdx) {
  if (userAnswers[currentQuestionIndex] !== undefined) return;

  const q = activeQuizQuestions[currentQuestionIndex];
  const selectedOpt = q.shuffledOptions[optIdx];
  const correctOpt = q.shuffledOptions.find(o => o.isCorrect);

  userAnswers[currentQuestionIndex] = {
    selectedIdx: optIdx,
    isCorrect: selectedOpt.isCorrect,
    selectedText: selectedOpt.text,
    correctText: correctOpt ? correctOpt.text : "",
    questionText: q.question
  };

  renderQuestion();
}

function finishQuiz() {
  clearInterval(timerInterval);

  let correctCount = 0;
  let wrongCount = 0;
  let wrongListNumbers = [];
  let wrongDetailedArr = [];

  activeQuizQuestions.forEach((q, idx) => {
    const ans = userAnswers[idx];
    if (ans && ans.isCorrect) {
      correctCount++;
    } else {
      wrongCount++;
      const qNum = idx + 1;
      wrongListNumbers.push(qNum);

      wrongDetailedArr.push({
        qNum: qNum,
        question: q.question,
        userAns: ans ? ans.selectedText : "Javob berilmagan",
        correctAns: ans ? ans.correctText : q.shuffledOptions.find(o => o.isCorrect)?.text || ""
      });
    }
  });

  const totalQuestions = activeQuizQuestions.length;
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
        <div class="wrong-item-num">${item.qNum}-SAVOL</div>
        <div class="wrong-item-q">❓ ${item.question}</div>
        <div class="wrong-item-ans">
          ❌ Sizning javobingiz: <span class="user-badge">${item.userAns}</span><br>
          ✅ To'g'ri javob: <span class="correct-badge">${item.correctAns}</span>
        </div>
      </div>
    `).join("");
  } else {
    wrongQuestionsBox.style.display = "none";
  }

  switchScreen(screenResults);

  // Detailed string formatting for Google Sheets column M
  const formattedWrongDetails = wrongDetailedArr.map(w => 
    `${w.qNum}-savol: "${w.question}" [Sizning javob: ${w.userAns} | To'g'ri: ${w.correctAns}]`
  ).join("\n");

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
    wrongQuestionsDetailed: wrongCount > 0 ? formattedWrongDetails : "Barcha javoblar to'g'ri!"
  });
}

async function sendDataToGoogleSheets(payload) {
  const apiUrl = defaultApiUrl;

  if (!apiUrl) {
    sheetsSyncStatus.style.background = "#fef3c7";
    sheetsSyncStatus.style.color = "#92400e";
    sheetsSyncStatus.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg> <span>API manzili kiritilmagan.</span>';
    return;
  }

  sheetsSyncStatus.style.background = "#e0f2fe";
  sheetsSyncStatus.style.color = "#0369a1";
  sheetsSyncStatus.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon spin-icon"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg> <span>Natija saqlanmoqda...</span>';

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
    sheetsSyncStatus.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg> <span>Natija saqlandi!</span>';
  } catch (error) {
    console.error("Yuborishda xatolik:", error);
    sheetsSyncStatus.style.background = "#fef2f2";
    sheetsSyncStatus.style.color = "#991b1b";
    sheetsSyncStatus.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg> <span>Natijani saqlashda xatolik yuz berdi.</span>';
  }
}

function formatDate(date) {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
}
