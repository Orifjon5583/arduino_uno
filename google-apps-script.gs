/**
 * Google Apps Script - Arduino UNO Test Natijalarini Yozish Tizimi
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
      
      // Sarlavha stilini binafsha rang va oq yozuv qilish
      var headerRange = sheet.getRange(1, 1, 1, 13);
      headerRange.setBackground("#4F46E5");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      headerRange.setVerticalAlignment("middle");
      sheet.setRowHeight(1, 40);
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

    // Formatlash (Text Wrap va Tekislash)
    var lastRow = sheet.getLastRow();
    var rowRange = sheet.getRange(lastRow, 1, 1, 13);
    rowRange.setVerticalAlignment("middle");
    rowRange.setWrap(true); // Matnlarni chiroyli avto-o'rash

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
