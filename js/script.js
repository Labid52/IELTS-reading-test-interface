
const textPanels = document.querySelectorAll("#text-panel, #question-panel");
const contextMenu = document.getElementById("context-menu");
const noteBox = document.getElementById("noteBox");
let selectedText = "";

// Timer variables
let timerInterval;
let elapsedSeconds = 0;

// Start the timer
function startTimer() {
    const timerElement = document.querySelector(".timer");
    timerInterval = setInterval(() => {
        elapsedSeconds++;
        timerElement.textContent = `Time Elapsed: ${formatTime(elapsedSeconds)}`;
    }, 1000);
}

// Format seconds into MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

// Reset the timer
function resetTimer() {
    clearInterval(timerInterval); // Stop the timer
    elapsedSeconds = 0; // Reset elapsed time
    document.querySelector(".timer").textContent = "Time Elapsed: 00:00";
    startTimer(); // Restart the timer
}

// Prevent the default context menu for all panels
textPanels.forEach((panel) => {
    panel.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        const selection = window.getSelection();
        selectedText = selection.toString().trim();
        if (selectedText) {
            contextMenu.style.display = "block";
            contextMenu.style.top = `${e.pageY}px`;
            contextMenu.style.left = `${e.pageX}px`;
        } else {
            contextMenu.style.display = "none";
        }
    });
});

// Hide context menu on any click outside
document.addEventListener("click", (e) => {
    if (!contextMenu.contains(e.target)) {
        contextMenu.style.display = "none";
    }
});

// Open note box for a new highlight
function openNoteBoxForNewHighlight() {
    document.getElementById("noteContent").value = ""; // Clear any existing content
    noteBox.style.display = "block";
}

// Save the note and attach it to the highlighted text
function saveNote() {
    const noteContent = document.getElementById("noteContent").value;
    const noteSpans = document.querySelectorAll(".note");

    noteSpans.forEach((span) => {
        if (span.textContent === selectedText.trim()) {
            span.title = noteContent; // Assign note as a tooltip
        }
    });

    document.getElementById("noteContent").value = "";
    noteBox.style.display = "none";
}

// Edit note logic
function editNote() {
    const noteContent = document.getElementById("noteContent").value;
    const noteSpans = document.querySelectorAll(".note");

    noteSpans.forEach((span) => {
        if (span.textContent === selectedText.trim()) {
            span.title = noteContent; // Update the note tooltip
        }
    });

    document.getElementById("noteContent").value = "";
    noteBox.style.display = "none";
}

// Open note box for editing an existing note
function openNoteBoxForExistingHighlight(span) {
    selectedText = span.textContent;
    const currentNote = span.title || "";
    document.getElementById("noteContent").value = currentNote;
    noteBox.style.display = "block";
}

// Close the note box without saving
function closeNoteBox() {
    document.getElementById("noteContent").value = "";
    noteBox.style.display = "none";
}

// Create a highlight span
function createHighlightSpan(text, className, backgroundColor) {
    const span = document.createElement("span");
    span.className = className;
    span.style.backgroundColor = backgroundColor;
    span.textContent = text;

    if (className === "note") {
        span.title = "Click to edit note";
        span.onclick = () => openNoteBoxForExistingHighlight(span);
    }

    return span;
}

// Wrap the content of an element node with spans
function wrapElementContent(elementNode, className, backgroundColor) {
    const clonedElement = elementNode.cloneNode(false); // Clone only the element, not its children

    elementNode.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
            clonedElement.appendChild(createHighlightSpan(child.textContent, className, backgroundColor));
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            clonedElement.appendChild(wrapElementContent(child, className, backgroundColor));
        }
    });

    return clonedElement;
}

// Ensure footer navigation toggles options for specific questions
function showQuestion(number) {
    toggleOptions(number);
    scrollToQuestion(number);
}

// Reset highlights, notes, and options visibility
document.getElementById("reset-button").addEventListener("click", () => {
    const highlightsAndNotes = document.querySelectorAll(".highlighted, .note");
    highlightsAndNotes.forEach((span) => {
        const parent = span.parentNode;
        parent.replaceChild(document.createTextNode(span.textContent), span);
    });

    // Reset options visibility
    const allOptions = document.querySelectorAll(".options");
    allOptions.forEach((opt) => (opt.style.display = "none"));

    resetTimer(); // Reset the timer when the reset button is clicked
});


// Function to toggle visibility of question options
function toggleOptions(questionNumber) {
    const options = document.getElementById(`options-${questionNumber}`);
    if (options) {
        const isVisible = options.style.display === "block";
        options.style.display = isVisible ? "none" : "block";
    }
}





const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
            const textPanel = document.getElementById("text-panel");
            const questionPanel = document.getElementById("question-panel");

            if (textPanel && questionPanel) {
                console.log("Panels detected in DOM.");
                loadPanel("text-panel", "html/left-panel.html", () => showPageContent("text", currentPage));
                loadPanel("question-panel", "html/right-panel.html", () => showPageContent("question", currentPage));
                observer.disconnect(); // Stop observing once panels are found
                return;
            }
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });


observer.observe(document.getElementById("question-panel"), {
    childList: true, // Watch for child node changes
    subtree: true,   // Watch for changes in descendants
});

// Updated applyHighlightOrNote function remains the same
function applyHighlightOrNote(className, backgroundColor) {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.toString().trim() === "") return;

    const range = selection.getRangeAt(0);
    const startNode = range.startContainer;
    const endNode = range.endContainer;

    // Step 1: Handle a single-node selection (intra-paragraph or single-word highlight)
    if (startNode === endNode && startNode.nodeType === Node.TEXT_NODE) {
        const span = createHighlightSpan(range.toString(), className, backgroundColor);

        // Replace the selected text with the span
        range.deleteContents();
        range.insertNode(span);
        selection.removeAllRanges(); // Clear the selection
        return;
    }

    // Step 2: Handle multi-node (multi-paragraph) selections
    const walker = document.createTreeWalker(
        range.commonAncestorContainer,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                const nodeRange = document.createRange();
                nodeRange.selectNodeContents(node);
                return range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            },
        }
    );

    const fragments = [];
    let currentNode;

    while ((currentNode = walker.nextNode())) {
        const nodeRange = document.createRange();
        nodeRange.selectNodeContents(currentNode);

        if (currentNode === startNode) nodeRange.setStart(currentNode, range.startOffset);
        if (currentNode === endNode) nodeRange.setEnd(currentNode, range.endOffset);

        const span = createHighlightSpan(nodeRange.toString(), className, backgroundColor);
        fragments.push({ nodeRange, span });
    }

    // Replace each node content with its corresponding span
    fragments.forEach(({ nodeRange, span }) => {
        nodeRange.deleteContents();
        nodeRange.insertNode(span);
    });

    selection.removeAllRanges(); // Clear the selection
}

// Updated highlightText function
function highlightText() {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.toString().trim() === "") return;

    applyHighlightOrNote("highlighted", "yellow");

    // Hide the context menu after highlighting
    contextMenu.style.display = "none";
}

// Updated addNote function
function addNote() {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.toString().trim() === "") return;

    applyHighlightOrNote("note", "lightblue");

    // Open the note box for user input
    openNoteBoxForNewHighlight();

    // Hide the context menu after adding a note
    contextMenu.style.display = "none";
}

// Unified Panel Loader
let currentPage = 1;

// Unified Panel Loader
function loadPanel(panelId, url, callback) {
    const panel = document.getElementById(panelId);
    if (!panel) {
        console.error(`Error: Panel with ID ${panelId} not found.`);
        return;
    }

    fetch(`${url}?cache_bust=${Date.now()}`)
        .then((response) => {
            if (!response.ok) throw new Error(`Failed to load content for ${panelId}`);
            return response.text();
        })
        .then((html) => {
            panel.innerHTML = html;
            console.log(`${panelId} content loaded.`);

            // Log the dynamically loaded content
            const questions = panel.querySelectorAll(".question");
            console.log(`Questions found in ${panelId}:`, questions.length);

            if (typeof callback === "function") callback();
        })
        .catch((error) => {
            console.error(error);
            panel.innerHTML = `<p>Error loading content. Please try again later.</p>`;
        });
}

// Show Specific Page Content
function showPageContent(panelType, pageNumber) {
    if (panelType !== "text" && panelType !== "question") {
        console.error(`Invalid panelType passed: ${panelType}`);
        return;
    }

    const panelId = panelType === "text" ? "text-panel" : "question-panel";
    const panel = document.getElementById(panelId);

    if (!panel) {
        console.error(`Panel with ID ${panelId} not found.`);
        return;
    }

    const pages = panel.querySelectorAll(".page");
    if (!pages.length) {
        console.error(`No pages found in ${panelId}.`);
        return;
    }

    pages.forEach((page) => {
        page.style.display = parseInt(page.dataset.page, 10) === pageNumber ? "block" : "none";
    });

    console.log(`Displayed content for ${panelId}, page ${pageNumber}`);
}

// Navigate Between Pages
function navigatePage(direction) {
    const textPages = document.querySelectorAll("#text-panel .page");
    const questionPages = document.querySelectorAll("#question-panel .page");

    const totalPages = Math.min(textPages.length, questionPages.length);

    console.log(`Navigating: direction=${direction}, currentPage=${currentPage}, totalPages=${totalPages}`);

    if (direction === "next" && currentPage < totalPages) {
        currentPage++;
    } else if (direction === "previous" && currentPage > 1) {
        currentPage--;
    }

    console.log(`New currentPage: ${currentPage}`);

    showPageContent("text", currentPage);
    showPageContent("question", currentPage);
}

// Initialize Panels After DOM Load
document.addEventListener("DOMContentLoaded", () => {
    console.log("Panels detected in DOM.");

    loadPanel("text-panel", "html/left-panel.html", () => showPageContent("text", 1));
    loadPanel("question-panel", "html/right-panel.html", () => {
        showPageContent("question", 1);
        initializeDynamicEventListeners(); // Initialize after content is loaded
    });

    document.getElementById("next-button").onclick = () => navigatePage("next");
    document.getElementById("prev-button").onclick = () => navigatePage("previous");
    startTimer();
});;





// Dynamic Event Listeners for Panels
function initializeDynamicEventListeners() {
    const questionPanel = document.getElementById("question-panel");

    if (questionPanel) {
        console.log("Adding event listener to #question-panel");

        // Delegate click events for questions
        questionPanel.addEventListener("click", (event) => {
            const questionElement = event.target.closest(".question");
            if (questionElement) {
                const questionId = questionElement.id.split("-")[1];
                console.log(`Question clicked: ${questionId}`);
                toggleOptions(questionId);
            } else {
                console.log("Clicked element is not part of a question.");
            }
        });
    }

    // Close the context menu on any click outside
    document.addEventListener("click", (e) => {
        if (!contextMenu.contains(e.target)) {
            contextMenu.style.display = "none";
        }
    });
}


// Ensure Footer Navigation Toggles Options for Questions
function showQuestion(number) {
    toggleOptions(number);
    scrollToQuestion(number);
}

// Scroll to Specific Question
function scrollToQuestion(questionNumber) {
    const questionElement = document.getElementById(`question-${questionNumber}`);
    if (questionElement) {
        questionElement.scrollIntoView({ behavior: "smooth" });
    }
}

document.getElementById("submit-button").addEventListener("click", () => {
    const answers = {};
    document.querySelectorAll(".question").forEach((question) => {
        const questionId = question.id;
        const selectedOption = question.querySelector("input[type='radio']:checked");
        const textInput = question.querySelector("input[type='text']");

        if (selectedOption) {
            answers[questionId] = selectedOption.value;
        } else if (textInput && textInput.value.trim()) {
            answers[questionId] = textInput.value;
        } else {
            answers[questionId] = null;
        }
    });

    console.log("Saving Answers:", answers);
    localStorage.setItem("submittedAnswers", JSON.stringify(answers));
    alert("Answers saved locally!");
});
document.getElementById("load-answers-button").addEventListener("click", () => {
        // Step 1: Retrieve data from localStorage
        const savedAnswers = localStorage.getItem("submittedAnswers");

        if (!savedAnswers) {
            alert("No data found in localStorage to save.");
            return;
        }
    
        // Step 2: Generate a dynamic file name based on date and time
        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        const formattedTime = `${String(now.getHours()).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}-${String(now.getSeconds()).padStart(2, "0")}`;
        const fileName = `answers-${formattedDate}_${formattedTime}.json`;
    
        // Step 3: Create a downloadable file
        const blob = new Blob([savedAnswers], { type: "application/json" });
        const url = URL.createObjectURL(blob);
    
        // Step 4: Create a temporary <a> element for download
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName; // Dynamic file name
        document.body.appendChild(a);
    
        // Step 5: Trigger the download
        a.click();
    
        // Step 6: Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    
        alert(`Data saved to file: ${fileName}`);
});



