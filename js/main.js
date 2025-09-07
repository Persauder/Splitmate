import {saveData, loadData} from "./storage.js";
import {computeBalance} from "./compute.js";
import {renderPeople, renderTable, renderBalances} from "./ui.js";

const state = loadData();

const form = document.getElementById("expense-form");
const payerSelect = document.getElementById("payer-select");
const participantsDiv = document.getElementById("participants");
const table = document.getElementById("table");
const balancesDiv = document.getElementById("balances");
const searchInput = document.getElementById("search");
const exportBtn = document.getElementById("export-btn");
const importInput = document.getElementById("import-input");

renderPeople(payerSelect, participantsDiv, state.people);
refresh();

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const participants = [...participantsDiv.querySelectorAll('input[type="checkbox"]:checked')].map(i => i.value);
    if (!participants.length) return alert("Оберіть хоча б одного учасника");
    const newExp = {
        id: crypto.randomUUID(),
        title: fd.get("title").toString().trim(),
        amount: Number(fd.get("amount")),
        payer: fd.get("payer").toString(),
        participants,
        date: fd.get("date")?.toString() || ""
    };
    state.expenses.unshift(newExp);
    saveData(state);
    form.reset();
    renderPeople(payerSelect, participantsDiv, state.people); // щоб скинути чекбокси
    refresh();
});

table.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-del");
    if (!btn) return;
    state.expenses = state.expenses.filter(x => x.id !== btn.dataset.id);
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
    const text = await file.text();
    try {
        const data = JSON.parse(text);
        if (!Array.isArray(data.people) || !Array.isArray(data.expenses)) throw new Error("Invalid file");
        state.people = data.people;
        state.expenses = data.expenses;
        saveData(state);
        renderPeople(payerSelect, participantsDiv, state.people);
        refresh();
    } catch {
        alert("Wrong JSON file");
    } finally {
        importInput.value = "";
    }
});

function refresh() {
    const q = searchInput.value?.toLowerCase().trim();
    const filtered = q ? state.expenses.filter(e => e.title.toLowerCase().includes(q)) : state.expenses;
    renderTable(table, filtered);
    const { transfers } = computeBalances(state.expenses);
    renderBalances(balancesDiv, transfers);
}


