# ⚡ Arduino UNO Online Test Tizimi (Google Sheets Integratsiyasi)

Ushbu loyiha 10-15 yoshli o'quvchilar uchun Arduino UNO bo'yicha onlayn test o'tkazish, test natijalarini va noto'g'ri javoblarni hisoblash hamda real vaqt rejimida **Google Sheets** jadvaliga avtomatik saqlash uchun mo'ljallangan.

---

## 📁 Loyiha tarkibi

- `index.html` — Asosiy veb-sayt sahifasi (Ro'yxatdan o'tish -> Test -> Natija).
- `style.css` — Zamonaviy va moslashuvchan CSS dizayn.
- `questions.json` — 20 ta Arduino UNO test savollari (JSON formatda).
- `app.js` — Taymer, javoblarni hisoblash, noto'g'ri savollar tahlili va Google Sheets API'ga yuborish logikasi.
- `google-apps-script.gs` — Google Sheets menyusidagi Apps Script uchun backend kodi.

---

## 🚀 Ishga tushirish va sozlash yo'riqnomasi

### 1-bosqich: Google Sheets va Apps Script sozlash

1. **Google Sheets** (https://sheets.google.com) ga kiring va yangi jadval yarating (masalan: `Arduino Test Natijalari`).
2. Jadvalning birinchi qatoriga (A1 dan M1 gacha) sarlavhalarni yozing:
   - `A1: Sana` | `B1: Ism` | `C1: Familiya` | `D1: Yosh` | `E1: Telefon` | `F1: Guruh` | `G1: Jami Savol` | `H1: To'g'ri` | `I1: Noto'g'ri` | `J1: Natija (%)` | `K1: Test Vaqti` | `L1: Noto'g'ri Savollar` | `M1: Noto'g'ri Savollar (Batafsil)`
3. Yuqori menyudan **Kengaytmalar (Extensions)** -> **Apps Script** bo'limiga kiring.
4. U yerda hosil bo'lgan kod redaktoriga `google-apps-script.gs` faylidagi barcha kodni nusxalab qo'ying va **Saqlash (Ctrl + S)** tugmasini bosing.
5. Yuqori o'ng burchakdagi **Deploy (O'rnatish)** -> **New deployment (Yangi o'rnatish)** tugmasini bosing.
6. Sozlamalarda:
   - **Select type (Turini tanlash)**: ⚙️ `Web app (Veb-dastur)`
   - **Execute as (Kimi nomidan)**: `Me (Mening nomimdan)`
   - **Who has access (Kimlar kirishi mumkin)**: `Anyone (Hamma / Anonymous)`
7. **Deploy** tugmasini bosing, ruxsat so'ralsa barcha ruxsatlarni tasdiqlang.
8. Hosil bo'lgan **Web App URL** manzilini nusxalab oling (masalan: `https://script.google.com/macros/s/.../exec`).

### 2-bosqich: Veb-saytga API URL bog'lash

- Saytni ochganingizda tepada **Google Sheets API** maydoni mavjud. Nusxalab olingan Apps Script URL manzilini o'sha yerga qo'yib **"Saqlash"** tugmasini bosing.
- URL brauzer xotirasida (`localStorage`) saqlanib qoladi va keyingi safar avtomatik ishlaydi.
- Yoki `app.js` faylidagi `defaultApiUrl` o'zgaruvchisiga to'g'ridan-to'g'ri yozib qo'yishingiz mumkin.

---

## 📊 Natijalar ko'rinishi (Google Sheets)

O'quvchi testni tugatgach, Google Sheets jadvalingizga quyidagicha qator avtomatik qo'shiladi:

| Sana | Ism | Familiya | Yosh | Telefon | Guruh | Jami Savol | To'g'ri | Noto'g'ri | Natija (%) | Test Vaqti | Noto'g'ri Savollar | Noto'g'ri Savollar (Batafsil) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 25.09.2026 | Ali | Karimov | 12 | +998901234567 | Arduino-1 | 20 | 17 | 3 | 85% | 08:42 | 3, 7, 14 | 3-savol: noto'g'ri; 7-savol: noto'g'ri... |

---

## ❓ Yangi savollar qo'shish yoki o'zgartirish

Savollar `questions.json` faylida quyidagi struktura bo'yicha saqlanadi:

```json
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
}
```
*(Eslatma: `"answer": 1` indeks 0 dan boshlanadi. Ya'ni 0=A, 1=B, 2=C, 3=D)*
