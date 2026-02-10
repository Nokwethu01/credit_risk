document.getElementById("creditForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    const numericFields = [
        "person_age","person_income","person_emp_length",
        "loan_amnt","loan_int_rate","loan_status",
        "loan_percent_income","cb_person_cred_hist_length"
    ];
    numericFields.forEach(f => { if(data[f]) data[f] = parseFloat(data[f]); });

    try {
        const response = await fetch("http://127.0.0.1:8001/predict", {  // <- port 8001
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        const result = await response.json();

        const riskMap = {
            0: { text: "Low Risk – Likely to pay back the loan", icon: "✅", class: "low-risk", barColor: "#155724" },
            1: { text: "High Risk – Unlikely to pay back the loan", icon: "⚠️", class: "high-risk", barColor: "#721c24" }
        };

        const card = document.getElementById("result");
        const text = document.getElementById("risk-text");
        const icon = document.getElementById("risk-icon");
        const bar = document.getElementById("probability-bar");

        // Safe check for prediction
        let mapped = null;
        let probability = 0;

        if(result && typeof result.prediction !== "undefined") {
            mapped = riskMap[result.prediction];
            probability = (result.probability ?? 0) * 100;
        } else {
            mapped = { text: "Error: Invalid response from server", icon: "❌", class: "high-risk", barColor: "#721c24" };
            probability = 0;
        }

        // Update text and icon
        text.innerText = mapped.text + (probability ? ` (${probability.toFixed(1)}%)` : "");
        icon.innerText = mapped.icon;

        // Update card class
        card.className = `risk-card ${mapped.class}`;
        card.classList.remove("hidden");

        // Animate probability bar
        bar.style.backgroundColor = mapped.barColor;
        bar.style.width = "0%";
        setTimeout(() => { bar.style.width = `${probability.toFixed(1)}%`; }, 50);

    } catch (err) {
        // Handle fetch errors
        const card = document.getElementById("result");
        const text = document.getElementById("risk-text");
        const icon = document.getElementById("risk-icon");
        const bar = document.getElementById("probability-bar");

        text.innerText = "Error: " + err;
        icon.innerText = "❌";
        bar.style.width = "0%";
        card.className = "risk-card high-risk";
        card.classList.remove("hidden");
    }
});

// Hide result card when user changes any input
document.querySelectorAll("#creditForm input, #creditForm select").forEach(el => {
    el.addEventListener("input", () => {
        const card = document.getElementById("result");
        card.classList.add("hidden");
        document.getElementById("probability-bar").style.width = "0%";
    });
});



