export function renderPeople(payerSelect, participantsDiv, people) {
    payerSelect.innerHTML = people
        .map((p) => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`)
        .join("");

    participantsDiv.innerHTML = people
        .map(
            (p) => `
    <label class="chip">
      <input type="checkbox" value="${escapeHtml(p)}" />
      ${escapeHtml(p)}
    </label>`
        )
        .join("");
}

/**
 * Render expenses table (read-only list with delete button per row).
 * @param {HTMLTableElement} table
 * @param {Array} expenses
 */
export function renderTable(table, expenses) {
    if (!Array.isArray(expenses) || expenses.length === 0) {
        table.innerHTML = `
      <thead>
        <tr><th>Date</th><th>Description</th><th>Amount</th><th>Payer</th><th>Participants</th><th></th></tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="6" class="muted">No expenses yet.</td>
        </tr>
      </tbody>`;
        return;
    }

    table.innerHTML = `
    <thead>
      <tr>
        <th>Date</th>
        <th>Description</th>
        <th>Amount</th>
        <th>Payer</th>
        <th>Participants</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      ${expenses
        .map(
            (e) => `
        <tr>
          <td>${e.date ? escapeHtml(e.date) : "-"}</td>
          <td>${escapeHtml(e.title || "")}</td>
          <td>${Number(e.amount).toFixed(2)}</td>
          <td>${escapeHtml(e.payer)}</td>
          <td>${(e.participants || []).map(escapeHtml).join(", ")}</td>
          <td>
            <button data-id="${escapeAttr(e.id)}" class="btn-outline btn-del" aria-label="Delete expense">×</button>
          </td>
        </tr>`
        )
        .join("")}
    </tbody>`;
}

/**
 * Render suggested transfers ("who owes whom").
 * @param {HTMLElement} container
 * @param {Array<{from:string,to:string,amount:number}>} transfers
 */
export function renderBalances(container, transfers) {
    if (!Array.isArray(transfers) || transfers.length === 0) {
        container.innerHTML = `<div class="muted">No transfers needed — everyone is settled.</div>`;
        return;
    }

    container.innerHTML = transfers
        .map(
            (t) => `
      <div class="balance-line">
        <strong>${escapeHtml(t.from)}</strong>
        →
        <strong>${escapeHtml(t.to)}</strong>:
        ${Number(t.amount).toFixed(2)} zł
      </div>`
        )
        .join("");
}

/* --------------------------------
   Small helpers
--------------------------------- */

function escapeHtml(s) {
    s = String(s ?? "");
    return s.replace(/[&<>"']/g, (m) => ESC_MAP[m]);
}

function escapeAttr(s) {
    // For attribute values; reuse escapeHtml for safety.
    return escapeHtml(s);
}

const ESC_MAP = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
};
