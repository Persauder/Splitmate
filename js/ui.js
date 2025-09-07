export function renderPeople(payerSelect, participantsDiv, people) {
    payerSelect.innerHTML = people.map(p => `<option value="${p}">${p}</option>`).join("");
    participantsDiv.innerHTML = people.map(p => `
    <label class="chip">
      <input type="checkbox" value="${p}" /> ${p}
    </label>
  `).join("");
}

export function renderTable(table, expenses) {
    table.innerHTML = `
    <thead>
      <tr><th>Date</th><th>Description</th><th>Sum</th><th>Payer</th><th>Participants</th><th></th></tr>
    </thead>
    <tbody>
      ${expenses.map(e => `
        <tr>
          <td>${e.date || "-"}</td>
          <td>${escapeHtml(e.title)}</td>
          <td>${Number(e.amount).toFixed(2)}</td>
          <td>${e.payer}</td>
          <td>${e.participants.join(", ")}</td>
          <td><button data-id="${e.id}" class="btn-outline btn-del">×</button></td>
        </tr>
      `).join("")}
    </tbody>`;
}

export function renderBalances(container, transfers) {
    container.innerHTML = transfers.length
        ? transfers.map(t => `<div class="balance-line"><strong>${t.from}</strong> → <strong>${t.to}</strong>: ${t.amount.toFixed(2)} zł</div>`).join("")
        : `<div class="muted">No transfers needed — all equal.</div>`;
}
