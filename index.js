let myLeads = JSON.parse(localStorage.getItem("myLeads")) || [];
const inputBtn = document.getElementById("input-btn");
const inputEl = document.getElementById("input-el");
const ulEl = document.getElementById("ul-el");
const clearAllBtn = document.getElementById("clear-all-btn");
const exportBtn = document.getElementById("export-btn");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const tabBtn = document.getElementById("tab-btn"); 
const toast = document.getElementById("toast");

renderLeads();

inputBtn.addEventListener("click", function () {
    let lead = inputEl.value.trim();
    if (lead) {
        myLeads.push(lead);
        inputEl.value = "";
        saveLeadsToLocalStorage();
        renderLeads();
        showToast("Lead added!");
    }
});

tabBtn.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        myLeads.push(tabs[0].url);
        saveLeadsToLocalStorage();
        renderLeads();
        showToast("Tab saved!");
    });
});

clearAllBtn.addEventListener("click", function () {
    myLeads = [];
    saveLeadsToLocalStorage();
    renderLeads();
    showToast("All leads cleared!");
});

exportBtn.addEventListener("click", function () {
    exportToCSV(myLeads);
    showToast("Leads exported!");
});

darkModeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        darkModeToggle.innerHTML = "<i class='fas fa-sun'></i> Light Mode";
    } else {
        darkModeToggle.innerHTML = "<i class='fas fa-moon'></i> Dark Mode";
    }
});

function renderLeads(searchTerm = "") {
    ulEl.innerHTML = "";
    myLeads.forEach((lead, index) => {
        if (lead.toLowerCase().includes(searchTerm)) {
            const li = document.createElement("li");
            li.className = "lead-item";

          
            const a = document.createElement("a");
            a.href = lead;
            a.textContent = lead;
            a.target = "_blank";
            li.appendChild(a);

            
            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = "<i class='fas fa-trash-alt'></i>"; 
            deleteBtn.className = "delete-btn";
            deleteBtn.addEventListener("click", function () {
                deleteLead(index);
            });
            li.appendChild(deleteBtn);

            ulEl.appendChild(li);
        }
    });
}

function deleteLead(index) {
    myLeads.splice(index, 1);
    saveLeadsToLocalStorage();
    renderLeads();
    showToast("Lead deleted!");
}

function saveLeadsToLocalStorage() {
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
}

function showToast(message) {
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

function exportToCSV(leads) {
    let csvContent = "data:text/csv;charset=utf-8," + leads.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
