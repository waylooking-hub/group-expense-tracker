import type { Expense, Member, MemberBalance, Settlement } from '@/types';

export function calculateBalances(
  expenses: Expense[],
  members: Member[],
  currency: string
): MemberBalance[] {
  const currencyExpenses = expenses.filter(e => e.currency === currency);

  const paid = new Map<string, number>();
  const owes = new Map<string, number>();

  for (const m of members) {
    paid.set(m.id, 0);
    owes.set(m.id, 0);
  }

  for (const expense of currencyExpenses) {
    paid.set(expense.paid_by, (paid.get(expense.paid_by) ?? 0) + expense.amount);

    // split_between: array of member IDs, or null = everyone
    const splitIds = expense.split_between && expense.split_between.length > 0
      ? expense.split_between
      : members.map(m => m.id);

    const share = expense.amount / splitIds.length;
    for (const id of splitIds) {
      owes.set(id, (owes.get(id) ?? 0) + share);
    }
  }

  return members.map(member => {
    const totalPaid = paid.get(member.id) ?? 0;
    const totalOwed = owes.get(member.id) ?? 0;

    return {
      member,
      totalPaid,
      fairShare: totalOwed,
      balance: totalPaid - totalOwed,
    };
  });
}

export function calculateSettlements(
  expenses: Expense[],
  members: Member[]
): Settlement[] {
  const currencies = [...new Set(expenses.map(e => e.currency))];
  const settlements: Settlement[] = [];

  for (const currency of currencies) {
    const balances = calculateBalances(expenses, members, currency);

    const debtors = balances
      .filter(b => b.balance < -0.01)
      .map(b => ({ member: b.member, amount: -b.balance }))
      .sort((a, b) => b.amount - a.amount);

    const creditors = balances
      .filter(b => b.balance > 0.01)
      .map(b => ({ member: b.member, amount: b.balance }))
      .sort((a, b) => b.amount - a.amount);

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const amount = Math.min(debtors[i].amount, creditors[j].amount);

      if (amount > 0.01) {
        settlements.push({
          from: debtors[i].member,
          to: creditors[j].member,
          amount: Math.round(amount * 100) / 100,
          currency,
        });
      }

      debtors[i].amount -= amount;
      creditors[j].amount -= amount;

      if (debtors[i].amount < 0.01) i++;
      if (creditors[j].amount < 0.01) j++;
    }
  }

  return settlements;
}
