import { google } from "googleapis";
import fs from "fs";

const SHEET_ID = "1QNuhfJkd9AvdPInnwqkI7pxIBoviOTNeWw5LWEVW1P0";
const GOOGLE_CREDENTIALS = JSON.parse(fs.readFileSync("credentials.json"));

const auth = new google.auth.GoogleAuth({
  credentials: GOOGLE_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export async function getPolys() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: "A:O",
  });
  return response.data.values;
}

export async function addPoly(nom, statut, url_pdf) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: "A:O",
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [[nom, statut, url_pdf]] },
  });
}

export async function updatePolyStatus(id, statut) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: "A:O",
  });

  let rows = response.data.values;
  if (id < 1 || id >= rows.length) throw new Error("Commande non trouvée");

  rows[id][1] = statut;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `A${id + 1}:0${id + 1}`,
    valueInputOption: "RAW",
    requestBody: { values: [rows[id]] },
  });
}
