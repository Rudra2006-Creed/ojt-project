// Store all transactions in an array.
let transactions = [];

// Keep track of the totals shown on the dashboard.
let totalReceived = 0;
let totalPaid = 0;
let debitTotal = 0;
let creditTotal = 0;


// Format numbers as Indian currency.
function formatMoney(amount) {
    return amount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR"
    });
}


// Listen for the form submission.
document.getElementById("transactionForm")
    .addEventListener("submit", function(event) {

        // Stop the page from refreshing.
        event.preventDefault();

        // Get the values entered by the user.
        const description = document.getElementById("description").value.trim();
        const type = document.getElementById("type").value;
        const amount = Number(document.getElementById("amount").value);
        const date = document.getElementById("date").value;

        // Check that the entered details are valid.
        if (!description || !date || !Number.isFinite(amount) || amount <= 0) {
            alert("Please enter valid transaction details.");
            return;
        }

        let debitAccount;
        let creditAccount;

        // Apply the double-entry bookkeeping rule.
        if (type === "received") {
            debitAccount = "Bank";
            creditAccount = "Income";
            totalReceived += amount;
        } else {
            debitAccount = "Expense";
            creditAccount = "Bank";
            totalPaid += amount;
        }

        // Create an object for this transaction.
        const transaction = {
            description,
            type,
            amount,
            date,
            debitAccount,
            creditAccount
        };

        // Add the newest transaction to the beginning of the array.
        transactions.unshift(transaction);

        // Record the same amount on both sides.
        debitTotal += amount;
        creditTotal += amount;

        // Refresh the dashboard.
        updateDashboard();

        // Clear the form after adding the transaction.
        this.reset();
        document.getElementById("date").value = getLocalDate();

        alert("Transaction added successfully!");
    });


// Get today's date in YYYY-MM-DD format using local time.
function getLocalDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// Update the summary cards, balance check and transaction table.
function updateDashboard() {
    const balance = totalReceived - totalPaid;
    const difference = Math.abs(debitTotal - creditTotal);

    document.getElementById("balance").textContent = formatMoney(balance);
    document.getElementById("received").textContent = formatMoney(totalReceived);
    document.getElementById("paid").textContent = formatMoney(totalPaid);
    document.getElementById("count").textContent = transactions.length;

    document.getElementById("totalDebit").textContent = formatMoney(debitTotal);
    document.getElementById("totalCredit").textContent = formatMoney(creditTotal);

    // Show whether the books are balanced.
    if (difference < 0.001) {
        document.getElementById("check").textContent =
            "✓ Everything is balanced. Difference: ₹0";

        document.getElementById("bookStatus").textContent =
            "● Books balanced";
    } else {
        document.getElementById("check").textContent =
            "⚠ Books are not balanced. Difference: " + formatMoney(difference);

        document.getElementById("bookStatus").textContent =
            "● Check entries";
    }

    // Display the transaction history.
    const table = document.getElementById("transactionList");
    table.innerHTML = "";

    if (transactions.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    No transactions yet. Add your first transaction!
                </td>
            </tr>
        `;
        return;
    }

    transactions.forEach(function(item) {
        const row = document.createElement("tr");

        const values = [
            item.description,
            item.date,
            item.debitAccount,
            item.creditAccount,
            formatMoney(item.amount),
            item.type === "received" ? "Received" : "Paid"
        ];

        values.forEach(function(value, index) {
            const cell = document.createElement("td");
            cell.textContent = value;

            if (index === 5) {
                cell.className =
                    item.type === "received" ? "received" : "paid";
            }

            row.appendChild(cell);
        });

        table.appendChild(row);
    });
}


// Put today's date in the date field when the page opens.
document.getElementById("date").value = getLocalDate();
