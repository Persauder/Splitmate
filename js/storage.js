// storage.js

const KEY = "splitmate:data";

/** Load app state from localStorage or return defaults */
export function loadData() {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : defaultData();
    } catch {
        return defaultData();
    }
}

/** Persist app state to localStorage */
export function saveData(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}

/** Initial dataset */
export function defaultData() {
    return {
        people: ["Kyrylo", "Vadym", "Maksym", "Artem"],
        // expense shape: {id,title,amount,payer,participants,date}
        expenses: []
    };
}
