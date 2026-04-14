export function DownloadPurchaseReceipt(response) {
  const date = new Date().toISOString().split("T")[0];

  // Build header columns dynamically based on what data exists
  const hassTwoFactor = response.accounts.some((a) => a.twoFactorKey);
  const hasCookie = response.accounts.some((a) => a.cookie);
  const hasRegData = response.accounts.some((a) => a.registrationData);

  const headers = ["Username", "Password"];
  if (hassTwoFactor) headers.push("2FA");
  if (hasCookie) headers.push("Cookie");
  if (hasRegData) headers.push("Reg Data");

  const headerRow = headers.join("|");
  const separator = headers.map(() => "─".repeat(20)).join("|");

  const dataRows = response.accounts.map((acc) => {
    const cols = [acc.userName, acc.password];
    if (hassTwoFactor) cols.push(acc.twoFactorKey ?? "");
    if (hasCookie) cols.push(acc.cookie ?? "");
    if (hasRegData) cols.push(acc.registrationData ?? "");
    return cols.join("|");
  });

  const content = [
    `${"=".repeat(60)}`,
    `           Easyotps — PURCHASE RECEIPT`,
    `${"=".repeat(60)}`,
    ``,
    ``,
    `  Total Accounts  : ${response.totalCount}`,
    `  Total Cost      : $${response.totalCost.toFixed(2)}`,
    `  Date            : ${date}`,
    ``,
    `${"=".repeat(60)}`,
    `  ACCOUNT DETAILS`,
    `${"=".repeat(60)}`,
    ``,
    headerRow,
    separator,
    ...dataRows,
    ``,
    `${"=".repeat(60)}`,
    `  Thank you for your purchase!`,
    `  Keep this file safe. Do not share it with anyone.`,
    `${"=".repeat(60)}`,
  ].join("\n");

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `easyotps_account_receipt_${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
