/**
 * Google Apps Script - Arduino UNO Test Natijalarini Yozish Tizimi
 * 
 * Qanday sozlanadi:
 * 1. Google Sheets (https://sheets.google.com) da yangi jadval oching.
 * 2. Birinchi qatarga quyidagi ustun nomlarini yozing:
 *    A1: Sana | B1: Ism | C1: Familiya | D1: Yosh | E1: Telefon | F1: Guruh | G1: Jami Savol | H1: To'g'ri | I1: Noto'g'ri | J1: Natija (%) | K1: Test Vaqti | L1: Noto'g'ri Savollar | M1: Noto'g'ri Savollar (Batafsil)
 * 3. Menyu: Extensions -> Apps Script (Kengaytmalar -> Apps Script) ga kiring.
 * 4. Ushbu kodni u yerga nusxalab qo'ying va saqlang (Ctrl + S).
 * 5. Deploy -> New deployment -> Select type: Web app (Veb-dastur) tanlang.
 * 6. Execute as: Me (O'zingiz) va Who has access: Anyone (Hamma) qiling!
 * 7. Deploy tugmasini bosing va olingan Web App URL manzilini nusxalab, app.js fayliga qo'ying.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Agar sarlavhalar yo'q bo'lsa, avtomatik qo'shish
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Sana",
        "Ism",
        "Familiya",
        "Yosh",
        "Telefon",
        "Guruh",
        "Jami Savol",
        "To'g'ri",
        "Noto'g'ri",
        "Natija (%)",
        "Test Vaqti",
        "Noto'g'ri Savollar",
        "Noto'g'ri Savollar (Batafsil)"
      ]);
      
      // Sarlavha stilini chiroyli qilish
      var headerRange = sheet.getRange(1, 1, 1, 13);
      headerRange.setBackground("#4F46E5");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
    }

    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    var now = new Date();
    var sana = data.sana || formatDate(now);
    var ism = data.ism || "";
    var familiya = data.familiya || "";
    var yosh = data.yosh || "";
    var telefon = data.telefon || "";
    var guruh = data.guruh || "";
    var totalQuestions = data.totalQuestions || 20;
    var correctCount = data.correctCount || 0;
    var wrongCount = data.wrongCount || 0;
    var percentage = data.percentage || "0%";
    var duration = data.duration || "00:00";
    var wrongQuestionsList = data.wrongQuestionsList || "Yo'q";
    var wrongQuestionsDetailed = data.wrongQuestionsDetailed || "Barcha javoblar to'g'ri!";

    // Yangi qator qo'shish
    sheet.appendRow([
      sana,
      ism,
      familiya,
      yosh,
      telefon,
      guruh,
      totalQuestions,
      correctCount,
      wrongCount,
      percentage,
      duration,
      wrongQuestionsList,
      wrongQuestionsDetailed
    ]);

    // Formatlash
    var lastRow = sheet.getLastRow();
    var rowRange = sheet.getRange(lastRow, 1, 1, 13);
    rowRange.setHorizontalAlignment("left");

    return ContentService.createTextOutput(JSON.stringify({
      "result": "success",
      "row": lastRow,
      "message": "Natija muvaffaqiyatli saqlandi!"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "result": "error",
      "message": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    "status": "online",
    "message": "Arduino Test API ishlamoqda"
  })).setMimeType(ContentService.MimeType.JSON);
}

function formatDate(date) {
  var d = date.getDate();
  var m = date.getMonth() + 1;
  var y = date.getFullYear();
  return (d < 10 ? '0' + d : d) + '.' + (m < 10 ? '0' + m : m) + '.' + y;
}
