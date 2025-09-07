const KEY = "splitmate:data";

export function loadData() {
    try {return JSON.parse(localStorage.getItem(KEY)) ?? defaultData(); }
    catch {return defaultData();}
}

export function saveData(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}

export function defaultData() {
    return {
        people: ["Maksym","Vadym","Kyryl","Artem"],
        expenses: [] // {id,title,amount,payer,participants,date}
    };
}
