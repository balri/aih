function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const data = sheet.getDataRange().getValues();

  // First row contains the column headings
  const headers = data.shift();

  const nameCol = headers.indexOf("Your name");
  const ratingCol = headers.indexOf("Please rate our website");
  const feedbackCol = headers.indexOf("Your Feedback");
  const approvedCol = headers.indexOf("Approved");

  const testimonials = [];

  data.forEach(row => {
    if (String(row[approvedCol]).trim().toUpperCase() === "YES") {
      testimonials.push({
        name: row[nameCol],
        rating: row[ratingCol],
        testimonial: row[feedbackCol]
      });
    }
  });

  return ContentService
    .createTextOutput(JSON.stringify(testimonials))
    .setMimeType(ContentService.MimeType.JSON);
}
