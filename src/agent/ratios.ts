export function computeBankRatios(transactions, opening, closing) {
  const income = transactions.filter(tx => tx.amount > 0);
  const expenses = transactions.filter(tx => tx.amount < 0);

  const sum = arr => arr.reduce((a, b) => a + b, 0);

  const totalIncome = sum(income.map(i => i.amount));
  const totalExpense = Math.abs(sum(expenses.map(e => e.amount)));

  return {
    inflow_outflow_ratio: totalIncome / (totalExpense || 1),
    average_monthly_income: totalIncome,
    average_monthly_expense: totalExpense,
    net_position: totalIncome - totalExpense,
    income_volatility: 0,
    largest_income_share: Math.max(...income.map(i => i.amount)) / (totalIncome || 1),
    largest_expense_share: Math.max(...expenses.map(e => Math.abs(e.amount))) / (totalExpense || 1)
  };
}

export function computeFinancialStatementRatios(fs) {
  const is_ = fs.income_statement;
  const bs = fs.balance_sheet;
  const cf = fs.cash_flow_statement;

  return {
    profitability: {
      net_profit_margin: is_.net_profit / (is_.revenue || 1),
      operating_margin: is_.operating_profit / (is_.revenue || 1),
      gross_margin: is_.gross_profit / (is_.revenue || 1),
      roa: is_.net_profit / (bs.total_assets || 1),
      roe: is_.net_profit / (bs.equity || 1)
    },
    liquidity: {
      current_ratio: bs.current_assets / (bs.current_liabilities || 1),
      quick_ratio: (bs.current_assets - 0) / (bs.current_liabilities || 1),
      cash_ratio: cf.cash_at_end / (bs.current_liabilities || 1)
    },
    leverage: {
      debt_to_equity: bs.total_liabilities / (bs.equity || 1),
      interest_coverage: is_.operating_profit / 1,
      dscr: cf.operating_cash_flow / 1
    },
    cash_flow: {
      operating_cf_ratio: cf.operating_cash_flow / (is_.net_profit || 1),
      free_cash_flow: cf.operating_cash_flow - 0,
      cash_conversion_cycle: 0
    }
  };
}
