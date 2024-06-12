document.addEventListener("DOMContentLoaded", () => {
  const logForm = document.getElementById("log-form");
  const logEntries = document.getElementById("log-entries");
  const exportLogsButton = document.getElementById("export-logs");
  const clearLogsButton = document.getElementById("clear-logs");

  // Load existing logs from localStorage
  loadLogs();

  logForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const date = document.getElementById("date").value;
    const breakfast = document.getElementById("breakfast").value;
    const lunch = document.getElementById("lunch").value;
    const dinner = document.getElementById("dinner").value;
    const supplement = document.getElementById("supplement").value;
    const medication = document.getElementById("medication").value;
    const ozempic = document.getElementById("ozempic").value;

    const log = {
      date,
      breakfast,
      lunch,
      dinner,
      supplement,
      medication,
      ozempic,
    };
    addLog(log);
    saveLog(log);

    logForm.reset();
  });

  exportLogsButton.addEventListener("click", () => {
    const logs = localStorage.getItem("logs");
    if (logs) {
      const blob = new Blob([logs], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "health_logs.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert("No logs to export.");
    }
  });

  clearLogsButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all logs?")) {
      localStorage.removeItem("logs");
      logEntries.innerHTML = "";
    }
  });

  function addLog(log) {
    const logEntry = document.createElement("div");
    logEntry.classList.add("log-entry");
    logEntry.innerHTML = `
            <p><strong>Date:</strong> ${log.date}</p>
            <p><strong>Breakfast:</strong> ${log.breakfast}</p>
            <p><strong>Lunch:</strong> ${log.lunch}</p>
            <p><strong>Dinner:</strong> ${log.dinner}</p>
            <p><strong>Supplement:</strong> ${log.supplement}</p>
            <p><strong>Medication:</strong> ${log.medication}</p>
            <p><strong>Ozempic Shot:</strong> ${log.ozempic}</p>
        `;
    logEntries.appendChild(logEntry);
  }

  function saveLog(log) {
    try {
      let logs = JSON.parse(localStorage.getItem("logs")) || [];
      logs.push(log);
      localStorage.setItem("logs", JSON.stringify(logs));
    } catch (e) {
      if (e.code === 22 || e.name === "QuotaExceededError") {
        // QuotaExceededError
        // Try to make room by removing the oldest log
        alert(
          "Local storage limit exceeded. Removing the oldest log to make room for new entries."
        );
        removeOldestLog();
        saveLog(log); // Retry saving the log after removing the oldest one
      } else {
        console.error(e);
      }
    }
  }

  function removeOldestLog() {
    let logs = JSON.parse(localStorage.getItem("logs")) || [];
    if (logs.length > 0) {
      logs.shift(); // Remove the oldest log (first element in the array)
      localStorage.setItem("logs", JSON.stringify(logs));
      // Remove the oldest log entry from the displayed logs
      if (logEntries.firstChild) {
        logEntries.removeChild(logEntries.firstChild);
      }
    }
  }

  function loadLogs() {
    let logs = JSON.parse(localStorage.getItem("logs")) || [];
    logs.forEach((log) => addLog(log));
  }
});
