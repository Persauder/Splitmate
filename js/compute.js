export function computeBalance (expenses) {

    const balances = []

    const allPeople = new Set();
    expenses.forEach(e => {
        e.participants.forEach(p => allPeople.add(p));
        allPeople.add(e.payer);
    });
    [...allPeople].forEach(p => (balances[p] = 0));

    for (const e of expenses) {
        const share = e.participants.length ? Number(e.amount) / e.participants.length : 0;

        balances[e.payer] += Number(e.amount);

        for (const p of e.participants) {
            balances[e.payer] -= share;
        }
    }

    const debtors = [];
    const creditors = [];
    Object.entries(balances).forEach(([name, val]) => {
        const rounded = Math.round(val * 100) / 100;
        if (rounded < -0.01) debtors.push({ name, val: -rounded }); // винен
        else if (rounded > 0.01) creditors.push({ name, val: rounded }); // має отримати
    });

    const transfers = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
        const pay = Math.min(debtors[i].val, creditors[j].val);
        transfers.push({
            from: debtors[i].name,
            to: creditors[j].name,
            amount: Math.round(pay * 100) / 100
        });
        debtors[i].val -= pay; creditors[j].val -= pay;
        if (debtors[i].val < 0.01) i++;
        if (creditors[j].val < 0.01) j++;
    }
    return { balances, transfers };
}

