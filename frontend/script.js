const statusEl = document.getElementById("status");
const box = document.querySelector(".status-box");
const historyList = document.getElementById("historyList");
const micBtn = document.getElementById("micBtn");

// 📍 Fake location (demo purpose)
document.getElementById("location").innerText = "Noida, India";

function addToHistory(msg, severity) {
    const li = document.createElement("li");
    li.innerText = `${severity.toUpperCase()} - ${msg}`;
    historyList.prepend(li);
}

function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Speech Recognition not supported");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    statusEl.innerText = "Listening... 🎙️";
    micBtn.classList.add("listening");

    recognition.start();

    recognition.onresult = async function(event) {
        const speech = event.results[0][0].transcript;
        statusEl.innerText = "You said: " + speech;

        let severity = "normal";

        if (
            speech.toLowerCase().includes("danger") ||
            speech.toLowerCase().includes("help") ||
            speech.toLowerCase().includes("not safe")
        ) {
            severity = "high";
        }

        try {
            const res = await fetch("http://localhost:3000/alert", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ severity, message: speech })
            });

            const data = await res.json();

            statusEl.innerText = data.response;

            if (severity === "high") {
                box.style.background = "rgba(255,0,0,0.3)";
            } else {
                box.style.background = "rgba(0,255,0,0.2)";
            }

            addToHistory(speech, severity);

        } catch (err) {
            statusEl.innerText = "Error sending alert ❌";
        }

        micBtn.classList.remove("listening");
    };

    recognition.onerror = function() {
        statusEl.innerText = "Mic error ❌";
        micBtn.classList.remove("listening");
    };
}