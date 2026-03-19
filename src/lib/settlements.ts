import type { Expense, Member, MemberBalance, Settlement } from '@/types';

export function calculateBalances(
  expenses: Expense[],
  members: Member[],
  currency: string
): MemberBalance[] {
  const currencyExpenses = expenses.filter(e => e.currency === currency);
  const totalSpent = currencyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const fairShare = members.length > 0 ? totalSpent / members.length : 0;

  return members.map(member => {
    const paid = currencyExpenses
      .filter(e => e.paid_by === member.id)
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      member,
      totalPaid: paid,
      fairShare,
      balance: paid - fairShare,
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
