export interface Transaction {
  id: string;
  no?: number; // Nomor urut otomatis
  type: "Pemasukan" | "Pengeluaran";
  description: string;
  amount: number;
  date: string;
}

const STORAGE_KEY = "keuangan_transactions";
let isDownloading = false;

export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    // Check if we're in browser environment
    if (typeof window === "undefined") {
      return [];
    }

    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }

    let transactions;
    try {
      transactions = JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse transactions:", e);
      return [];
    }

    // Validate and sanitize the transactions
    if (!Array.isArray(transactions)) return [];

    return transactions.filter((t): t is Transaction => {
      if (!t || typeof t !== "object") return false;

      // Validate required fields and types
      if (typeof t.id !== "string") return false;
      if (t.type !== "Pemasukan" && t.type !== "Pengeluaran") return false;
      if (typeof t.description !== "string") return false;
      if (typeof t.amount !== "number" || isNaN(t.amount)) return false;
      if (typeof t.date !== "string" || isNaN(Date.parse(t.date))) return false;

      return true;
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

export async function saveTransactions(
  transactions: Transaction[]
): Promise<boolean> {
  try {
    // Check if we're in browser environment
    if (typeof window === "undefined") {
      return false;
    }

    // Validate transactions before saving
    const validTransactions = transactions.filter((t) => {
      if (!t || typeof t !== "object") return false;
      return (
        typeof t.id === "string" &&
        (t.type === "Pemasukan" || t.type === "Pengeluaran") &&
        typeof t.description === "string" &&
        typeof t.amount === "number" &&
        !isNaN(t.amount) &&
        typeof t.date === "string" &&
        !isNaN(Date.parse(t.date))
      );
    });

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validTransactions));

    // Auto-download after saving
    downloadTransactionsAsJSON(validTransactions);

    return true;
  } catch (error) {
    console.error("Error saving transactions:", error);
    return false;
  }
}

/**
 * Download transactions as JSON file with folder structure
 * Browser will save to: Downloads/Keuangan/YYYY-MM-DD/HH-mm-ss.json
 */
export function downloadTransactionsAsJSON(transactions: Transaction[]): void {
  try {
    // Prevent double download from React Strict Mode
    if (isDownloading) {
      console.log("Download already in progress");
      return;
    }

    // Validate transactions
    if (!Array.isArray(transactions)) {
      console.error("Invalid transactions data");
      return;
    }

    isDownloading = true;

    // Add nomor urut (number) to each transaction
    const transactionsWithNumbers = transactions.map((transaction, index) => ({
      ...transaction,
      no: index + 1, // Nomor urut dimulai dari 1
    }));

    const jsonData = JSON.stringify(transactionsWithNumbers, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create filename with date and time
    const filename = `${generateFilename()}.json`;
    const folderDate = getFolderNameByDate();

    // Create a temporary link element for downloading
    const link = document.createElement("a");
    link.href = url;
    // Browser will use this as the download path
    link.download = `Keuangan/${folderDate}/${filename}`;
    
    // Append to body and trigger click
    document.body.appendChild(link);
    link.click();

    // Cleanup after download
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      isDownloading = false;
    }, 100);

  } catch (error) {
    console.error("Error downloading transactions:", error);
    isDownloading = false;
  }
}

/**
 * Generate filename with date and time
 * Format: YYYY-MM-DD_HH-mm-ss
 */
function generateFilename(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

/**
 * Get folder name by date (YYYY-MM-DD format)
 * This groups files by date
 */
function getFolderNameByDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
