export function classifyTransactions(transactions) {
  const categories = {
    income: [],
    expenses: [],
    flags: []
  };

  for (const tx of transactions) {
    const desc = tx.description.toLowerCase();

    if (desc.includes("salary") || desc.includes("payroll"))
      categories.income.push({ ...tx, category: "salary" });

    else if (desc.includes("div") || desc.includes("dividend"))
      categories.income.push({ ...tx, category: "dividends" });

    else if (desc.includes("loan"))
      categories.income.push({ ...tx, category: "loan_proceeds" });

    else if (desc.includes("rent"))
      categories.expenses.push({ ...tx, category: "rent" });

    else if (desc.includes("fuel") || desc.includes("garage"))
      categories.expenses.push({ ...tx, category: "fuel" });

    else if (desc.includes("google") || desc.includes("subscription"))
      categories.expenses.push({ ...tx, category: "subscriptions" });

    else
      categories.expenses.push({ ...tx, category: "general_expense" });

    if (tx.amount > 50000)
      categories.flags.push({ type: "large_unusual_transaction", tx });
  }

  return categories;
}
