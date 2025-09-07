export function computeBalances(expenses) {
    const balances = {};

    // Collect all unique people
    const allPeople = new Set();
    for (const e of expenses) {
        allPeople.add(e.payer);
        for (const p of e.participants) allPeople.add(p);
    }
    for (const p of allPeople) balances[p] = 0;

    // Apply each expense
    for (const e of expenses) {
        const amount = toNumber(e.amount);
        const participants = Array.isArray(e.participants) ? e.participants : [];
        const share = participants.length ? amount / participants.length : 0;

        // The payer pays the full amount
        balances[e.payer] += amount;

        // Every participant owes their share
        for (const p of participants) {
            balances[p] -= share;
        }
    }

    // Round balances to cents to avoid floating noise
    for (const k of Object.keys(balances)) {
        balances[k] = round2(balances[k]);
    }

    // Build debtor/creditor lists
    const debtors = [];
    const creditors = [];
    for (const [name, val] of Object.entries(balances)) {
        if (val < -0.01) debtors.push({ name, val: -val }); // owes (store as positive)
        else if (val > 0.01) creditors.push({ name, val }); // should receive
    }

    // Greedy matching: pay smallest of debtor/creditor and move pointers
    const transfers = [];
    let i = 0,
        j = 0;

    while (i < debtors.length && j < creditors.length) {
        const pay = round2(Math.min(debtors[i].val, creditors[j].val));
        if (pay <= 0) break;

        transfers.push({
            from: debtors[i].name,
            to: creditors[j].name,
            amount: pay,
        });

        debtors[i].val = round2(debtors[i].val - pay);
        creditors[j].val = round2(creditors[j].val - pay);

        if (debtors[i].val <= 0.01) i++;
        if (creditors[j].val <= 0.01) j++;
    }

    return { balances, transfers };
}

/** Safely coerce to number */
function toNumber(x) {
    const n = typeof x === "string" ? Number(x) : x;
    return Number.isFinite(n) ? n : 0;
}

/** Round to 2 decimals (banking-friendly) */
function round2(n) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
}