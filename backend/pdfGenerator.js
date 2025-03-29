import { PDFDocument } from "pdf-lib";
import fs from "fs";

export async function generatePDF(title, details, pdfPath) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([600, 800]);
  page.drawText(`${title}\n${details}`, { x: 50, y: 750, size: 20 });

  const originalPDF = await PDFDocument.load(fs.readFileSync(pdfPath));
  const copiedPages = await doc.copyPages(originalPDF, originalPDF.getPageIndices());
  copiedPages.forEach((p) => doc.addPage(p));

  const outputPath = `merged_pdfs/${Date.now()}.pdf`;
  fs.writeFileSync(outputPath, await doc.save());
  return outputPath;
}
