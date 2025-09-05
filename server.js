const express = require("express");
const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib"); // Add pdf-lib

const app = express();
const PORT = process.env.PORT || 8009;

// Route to serve PDF and log visitor
app.get("sbi/payment_receipt/download", async (req, res) => {
  const ip =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown";
  const userAgent = req.headers["user-agent"] || "Unknown";
  const time = new Date().toISOString();

  // Log visitor info
  const logEntry = `IP: ${ip} | User-Agent: ${userAgent} | Time: ${time}\n`;
  fs.appendFileSync("visitors.log", logEntry);

  // Path to your PDF
  const pdfPath = path.join(__dirname, "payment_receipt.pdf");

  try {
    // Load PDF
    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // ✅ Set the PDF metadata title
    pdfDoc.setTitle("Payment Receipt");

    // Save updated PDF in memory
    const pdfBytes = await pdfDoc.save();

    // Send PDF with inline display
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=payment_receipt.pdf");
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).send("Error loading PDF");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
