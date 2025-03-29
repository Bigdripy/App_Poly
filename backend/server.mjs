import express from "express";
import cors from "cors";
import { google } from "googleapis";
import multer from "multer";
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import nodemailer from "nodemailer";
import { exec } from "child_process";

const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());

const SHEET_ID = "1QNuhfJkd9AvdPInnwqkI7pxIBoviOTNeWw5LWEVW1P0";
const SHEET_RANGE = "A:O";
const GOOGLE_CREDENTIALS = JSON.parse(fs.readFileSync("credentials.json", "utf-8"));
console.log("✅ Google Credentials chargées :", GOOGLE_CREDENTIALS);


const auth = new google.auth.GoogleAuth({
  credentials: GOOGLE_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

// Middleware de gestion des fichiers PDF
const upload = multer({ dest: "uploads/" });

app.post("/polys", async (req, res) => {
    console.log("📥 Données reçues du frontend :", req.body);

    const { horodateur, identifiant, filieres, document_name, enseignant, mail, begin_course, reusable, chamilo_link, semestre, partie_number, other_info, num_copies } = req.body;

    try {
        // Ajoute les données dans Google Sheets
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: "A:O", // Permet d'ajouter les données à la fin
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            requestBody: {
                values: [[horodateur, identifiant, filieres, document_name, enseignant, mail, begin_course, reusable, chamilo_link, semestre, partie_number, other_info, num_copies]],
            },
        });

        res.status(201).json({ message: "Données ajoutées à Google Sheets !" });
    } catch (error) {
        console.error("❌ Erreur Google Sheets :", error);
        res.status(500).json({ error: "Impossible d'ajouter dans Google Sheets" });
    }
});

  

app.get("/polys", async (req, res) => {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: SHEET_RANGE,
      });
      res.json(response.data.values);
    } catch (error) {
      console.error("❌ Erreur de récupération des données :", error); // <-- Affiche l'erreur exacte
      res.status(500).json({ error: "Erreur de récupération des données", details: error.message });
    }
  });
  
  


app.put("/polys/:id", async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: SHEET_RANGE,
    });
    let rows = response.data.values;
    if (id < 1 || id >= rows.length) return res.status(404).json({ error: "Commande non trouvée" });
    rows[id][1] = statut;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `A${id + 1}:O${id + 1}`,
      valueInputOption: "RAW",
      requestBody: { values: [rows[id]] },
    });
    res.json({ message: "Statut mis à jour" });
  } catch (error) {
    res.status(500).json({ error: "Erreur de mise à jour" });
  }
});

// Fusion PDF avec page de garde
app.post("/merge-pdf", upload.array("pdfs"), async (req, res) => {
  try {
    const { title, details } = req.body;
    const mergedPdf = await PDFDocument.create();
    const coverPage = await mergedPdf.addPage([600, 800]);
    coverPage.drawText(`${title}\n${details}`, { x: 50, y: 750, size: 20 });
    for (let file of req.files) {
      const pdfBytes = fs.readFileSync(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
      fs.unlinkSync(file.path);
    }
    const finalPdfBytes = await mergedPdf.save();
    const outputPath = `merged_pdfs/${Date.now()}.pdf`;
    fs.writeFileSync(outputPath, finalPdfBytes);
    res.json({ message: "PDF généré", url: outputPath });
  } catch (error) {
    res.status(500).json({ error: "Erreur de fusion PDF" });
  }
});

// Envoi sur Smash
app.post("/upload-smash", (req, res) => {
  const { filePath } = req.body;
  exec(`smash upload ${filePath} --json`, (error, stdout) => {
    if (error) return res.status(500).json({ error: "Erreur d'upload" });
    res.json(JSON.parse(stdout));
  });
});

// Envoi d'email
app.post("/send-email", async (req, res) => {
  const { recipient, subject, text } = req.body;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: "TON_EMAIL", pass: "TON_MDP" },
  });
  let info = await transporter.sendMail({ from: "TON_EMAIL", to: recipient, subject, text });
  res.json({ message: "Email envoyé", id: info.messageId });
});

app.get("/", (req, res) => {
    res.send("Serveur PolyManager est en ligne !");
  });
  

app.listen(PORT, () => console.log(`Serveur en écoute sur http://localhost:${PORT}`));
