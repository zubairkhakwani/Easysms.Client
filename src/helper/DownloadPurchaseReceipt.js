export function DownloadPurchaseReceipt(response, showInfo) {
  const date = new Date().toISOString().split("T")[0];

  // Format 1: Header line above raw data
  const format1Rows = response.accounts.map((acc) => {
    const headers = acc.format.split("|").join("  |  ");
    return `  [${headers}]\n  ${acc.data}`;
  });

  // Format 2: Labeled key-value per field
  const format2Rows = response.accounts.map((acc) => {
    const keys = acc.format.split("|");
    const values = acc.data.split("|");
    return keys
      .map((key, i) => `    ${key.padEnd(14)}: ${values[i] ?? ""}`)
      .join("\n");
  });

  function buildSection(title, descEng, descUrdu, dataRows) {
    return [
      `${"=".repeat(60)}`,
      `  ${title}`,
      `${"=".repeat(60)}`,
      ``,
      `  [ English ]`,
      `  ${descEng}`,
      ``,
      `  [ Roman Urdu ]`,
      `  ${descUrdu}`,
      ``,
      `${"─".repeat(60)}`,
      ``,
      ...dataRows.flatMap((row) => [row, ``]),
    ].join("\n");
  }

  const header = showInfo
    ? [
        `${"=".repeat(60)}`,
        `           Easyotps — PURCHASE RECEIPT`,
        `${"=".repeat(60)}`,
        ``,
        `  Total Accounts  : ${response.totalCount}`,
        `  Total Cost      : $${response.totalCost.toFixed(2)}`,
        `  Date            : ${date}`,
        ``,
      ].join("\n")
    : "";

  const intro = [
    `${"╔"}${"═".repeat(58)}╗`,
    `║                ACCOUNT FORMATS GUIDE                  ║`,
    `${"╠"}${"═".repeat(58)}╣`,
    `║                                                        ║`,
    `║  [ English ]                                           ║`,
    `║  Below you will find your accounts listed in 2        ║`,
    `║  different formats. Both formats contain the exact    ║`,
    `║  same accounts. Use whichever is easier for you!      ║`,
    `║                                                        ║`,
    `║  [ Roman Urdu ]                                        ║`,
    `║  Neeche aapke accounts 2 alag formats mein diye       ║`,
    `║  gaye hain. Dono mein accounts bilkul same hain.      ║`,
    `║  Jo format aapko aasaan lage, woh use karein!         ║`,
    `║                                                        ║`,
    `${"╚"}${"═".repeat(58)}╝`,
    ``,
  ].join("\n");

  const format1Section = buildSection(
    "FORMAT 1 — Compact  (Header + Raw Data)",
    "All fields are displayed as a header label above the\n  data. The data remains on a single line separated\n  by ( | ). Best for quick copy-paste use.",
    "Is format mein fields ka naam ek header mein upar\n  dikhta hai aur data ek hi line mein hota hai jo\n  ( | ) se alag hota hai. Copy-paste ke liye best hai.",
    format1Rows,
  );

  const format2Section = buildSection(
    "FORMAT 2 — Detailed  (Labeled Key-Value)",
    "Each field is displayed on its own separate line\n  with a clear label next to it. Best for reading\n  and understanding each value individually.",
    "Is format mein har field apni alag line par hoti\n  hai aur uske saath uska naam bhi likha hota hai.\n  Padhne aur samajhne ke liye best hai.",
    format2Rows,
  );

  const footer = showInfo
    ? [
        `${"=".repeat(60)}`,
        `  Thank you for your purchase!`,
        `  Keep this file safe. Do not share it with anyone.`,
        `${"=".repeat(60)}`,
      ].join("\n")
    : "";

  const content = [
    header,
    intro,
    format1Section,
    ``,
    `${"═".repeat(60)}`,
    ``,
    format2Section,
    ``,
    footer,
  ]
    .filter(Boolean)
    .join("\n");

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `easyotps_accounts_${Date.now()}.txt`;
  a.click();

  URL.revokeObjectURL(url);
}
