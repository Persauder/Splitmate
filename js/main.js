// main.js
import { loadData, saveData } from "./storage.js";
import { computeBalances } from "./compute.js";
import { renderPeople, renderTable, renderBalances } from "./ui.js";

// ------- DOM refs -------
const form = document.getElementById("expense-form");
const payerSelect = document.getElementById("payer-select");
const participantsDiv = document.getElementById("participants");
const table = document.getElementById("table");
const balancesDiv = document.getElementById("balances");
const searchInput = document.getElementById("search");
const exportBtn = document.getElementById("export-btn");
const importInput = document.getElementById("import-input");

// ------- App state -------
const state = loadData();

// initial render
renderPeople(payerSelect, participantsDiv, state.people);
refresh();

// ------- Handlers -------

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const title = String(fd.get("title") || "").trim();
    const amount = Number(fd.get("amount"));
    const payer = String(fd.get("payer") || "");
    const date = String(fd.get("date") || "");

    const participants = [...participantsDiv.querySelectorAll('input[type="checkbox"]:checked')]
        .map((i) => i.value);

    if (!title) return alert("Please enter a description.");
    if (!Number.isFinite(amount) || amount <= 0) return alert("Please enter a valid amount.");
    if (!payer) return alert("Please select a payer.");
    if (participants.length === 0) return alert("Please select at least one participant.");

    const expense = {
        id: uuid(),
        title,
        amount,
        payer,
        participants,
        date
    };

    state.expenses.unshift(expense);
    saveData(state);

    form.reset();
    // re-render people to clear checkboxes after reset
    renderPeople(payerSelect, participantsDiv, state.people);
    refresh();
});

table.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-del");
    if (!btn) return;

    const id = btn.getAttribute("data-id");
    state.expenses = state.expenses.filter((x) => x.id !== id);
    saveData(state);
    refresh();
});

searchInput.addEventListener("input", refresh);

exportBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "splitmate-data.json";
    a.click();
});

importInput.addEventListener("change", async () => {
    const file = importInput.files?.[0];
    if (!file) return;

    try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (!data || !Array.isArray(data.people) || !Array.isArray(data.expenses)) {
            throw new Error("Invalid JSON shape.");
        }

        state.people = data.people;
        state.expenses = data.expenses;
        saveData(state);

        renderPeople(payerSelect, participantsDiv, state.people);
        refresh();
    } catch (err) {
        alert("Invalid JSON file.");
        console.error(err);
    } finally {
        importInput.value = "";
    }
});

// ------- Helpers -------

function refresh() {
    const q = (searchInput.value || "").toLowerCase().trim();
    const filtered = q
        ? state.expenses.filter((e) => String(e.title || "").toLowerCase().includes(q))
        : state.expenses;

    renderTable(table, filtered);

    const { transfers } = computeBalances(state.expenses);
    renderBalances(balancesDiv, transfers);
}

function uuid() {
    if (crypto?.randomUUID) return crypto.randomUUID();
    // fallback
    return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
