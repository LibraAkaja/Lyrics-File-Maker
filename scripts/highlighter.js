import { changeCSS } from "./dynamicComponents.js";
import { pauseTimer } from "./timer.js";

let currentLineIndex = 0;
let lFileContent = "[re:libraakaja.github.io/Lyrics-File-Maker/]\n\n";
let lineOccurrences = {}; // Track occurrences of each sentence

export function highlightNextLine() {
    const tArea = document.querySelector(".lyricsInput");
    const lyrics = tArea.value;
    const btn = document.querySelector(".buttons > :nth-child(3)");

    const sentences = lyrics.split(/\s{2,}|\n+/).filter(s => s.trim() !== ""); // Split lyrics

    if (sentences.length === 0) {
        console.log("No text found in the lyrics!");
        return;
    }

    if(currentLineIndex >= sentences.length){
        btn.disabled = true;
        pauseTimer();
        document.querySelector("#aud").pause();
        changeCSS(".buttons > :nth-child(1)", "backgroundImage", "url(Assets/play.svg)");
        changeCSS("#ppIcon", "backgroundImage", "url(Assets/play.svg)");
        console.log("\nCreating lyrical file");
    
        const fileBtn = document.querySelector(".buttons > :nth-child(4)");
    
        // Remove any previously attached event listener
        fileBtn.replaceWith(fileBtn.cloneNode(true));
        const newFileBtn = document.querySelector(".buttons > :nth-child(4)");
    
        // Add event listener to the new button
        newFileBtn.addEventListener("click", () => {
            const blob = new Blob([lFileContent], { type: "application/octet-stream" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = document.querySelector("#fileName").textContent.replace(".mp3", "") + ".lrc";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    
        return;
    }       

    const sentence = sentences[currentLineIndex].trim(); // Get the current sentence
    lFileContent += "[" + document.querySelector(".askLyrics").textContent + "]" + sentence + "\n";

    // Initialize occurrences tracker
    if (!lineOccurrences[sentence]) {
        lineOccurrences[sentence] = 0;
    }

    // Find the nth occurrence of the sentence
    const regEx = new RegExp(`(^|\\s{2,}|\\n)(${sentence.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "g");
    let match;
    let occurrenceCount = 0;
    let foundIndex = -1;

    while ((match = regEx.exec(lyrics)) !== null) {
        if (occurrenceCount === lineOccurrences[sentence]) {
            foundIndex = match.index + match[1].length;
            break;
        }
        occurrenceCount++;
    }

    if (foundIndex === -1) {
        console.error("Line not found in the Lyrics!");
        return;
    }

    const endIndex = foundIndex + sentence.length;

    // Highlight the nth occurrence of the sentence
    tArea.focus();
    tArea.setSelectionRange(foundIndex, endIndex);

    // Keep the highlighted text within view without resetting to the top
    setTimeout(() => {
        const selectionStart = tArea.selectionStart;
        const selectionEnd = tArea.selectionEnd;

        // Create a temporary span to measure the position of the text
        const tempSpan = document.createElement("span");
        tempSpan.style.position = "absolute";
        tempSpan.style.whiteSpace = "pre-wrap";
        tempSpan.style.visibility = "hidden";
        tempSpan.style.font = window.getComputedStyle(tArea).font;
        tempSpan.textContent = lyrics.substring(0, selectionStart);

        document.body.appendChild(tempSpan);
        const textPosition = tempSpan.offsetHeight;
        document.body.removeChild(tempSpan);

        // Only scroll if the selected text is out of the visible area
        const scrollMargin = 20; // Small margin to prevent over-scrolling
        if (textPosition < tArea.scrollTop || textPosition > tArea.scrollTop + tArea.clientHeight - scrollMargin) {
            tArea.scrollTo({
                top: textPosition - tArea.clientHeight / 2, // Centering effect
                behavior: "smooth"
            });
        }
    }, 100);

    // Move to the next sentence for the next call
    lineOccurrences[sentence]++;
    currentLineIndex++;
}

export function resetHighlight(){
    document.querySelector(".buttons > :nth-child(2)").disabled = false;
    currentLineIndex = 0;
    lineOccurrences = {};
    lFileContent = "[re:libraakaja.github.io/Lyrics-File-Maker/]\n\n";
}