export function DownloadPurchaseReceipt(response, showInfo) {
  const date = new Date().toISOString().split("T")[0];

  const dataRows = response.accounts.map((acc) => acc.data);

  let content;

  if (showInfo) {
    // Full receipt
    content = [
      `${"=".repeat(60)}`,
      `           Easyotps — PURCHASE RECEIPT`,
      `${"=".repeat(60)}`,
      ``,
      `  Total Accounts  : ${response.totalCount}`,
      `  Total Cost      : $${response.totalCost.toFixed(2)}`,
      `  Date            : ${date}`,
      ``,
      `${"=".repeat(60)}`,
      `  ACCOUNT DETAILS`,
      `${"=".repeat(60)}`,
      ``,
      ...dataRows,
      ``,
      `${"=".repeat(60)}`,
      `  Thank you for your purchase!`,
      `  Keep this file safe. Do not share it with anyone.`,
      `${"=".repeat(60)}`,
    ].join("\n");
  } else {
    // Only account details
    content = dataRows.join("\n");
  }

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `easyotps_accounts_${Date.now()}.txt`;
  a.click();

  URL.revokeObjectURL(url);
}
