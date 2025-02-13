import { changeCSS } from "./dynamicComponents.js";
import { pauseTimer } from "./timer.js";

let currentLineIndex = 0;
let lFileContent = "[re:libraakaja.github.io/Lyrics-File-Maker/]\n\n";
export function highlightNextLine(){
    const tArea = document.querySelector(".lyricsInput");
    const lyrics = tArea.value;
    const btn = document.querySelector(".buttons > :nth-child(3)");

    const sentences = lyrics.split(/\s{2,}|\n+/).filter(s => s.trim() !== "");  //Divide lyrics into sentences based on large whitespaces
    
    if(sentences.length === 0){
        console.log("No text found in the lyrics!");
        return;
    }

    if(currentLineIndex >= sentences.length){
        btn.disabled = true;
        pauseTimer();
        document.querySelector("#aud").pause();
        changeCSS(".buttons > :nth-child(1)","backgroundImage","url(Assets/play.svg)");
        changeCSS("#ppIcon","backgroundImage","url(Assets/play.svg)");
        console.log("\nCreating lyrical file");
        const fileBtn = document.querySelector(".buttons > :nth-child(4)");
        fileBtn.addEventListener("click",() => {
            const blob = new Blob([lFileContent], {type: "application/octet-stream"});
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = document.querySelector("#fileName").textContent.replace(".mp3","") + ".lrc";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
        return;
    }

    const sentence = sentences[currentLineIndex].trim();    //Taking just a line from the whole lyrics

    lFileContent += "["+document.querySelector(".askLyrics").textContent+"]"+sentence+"\n";
    
    //To find the actual position of a line in the lyrics
    const regEx = new RegExp(`(^|\\s{2,}|\\n)(${sentence.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "g");
    let match;
    let startIndex = -1;
    while((match = regEx.exec(lyrics)) !== null){
        startIndex = match.index + match[1].length;
        break;
    }
    if(startIndex === -1){
        console.error("Line not found in the Lyrics!");
        return;
    }
    
    const endIndex = startIndex + sentence.length;
    
    //To highlight the found line of the lyrics
    tArea.focus();
    tArea.setSelectionRange(startIndex, endIndex);

    //To scroll to the highlighted sentence
    setTimeout(() => {
        const lineheight = parseFloat(window.getComputedStyle(tArea).lineHeight);
        const scrolltop = Math.floor(startIndex / tArea.cols) * lineheight;
        tArea.scrollTop = scrolltop;
    }, 100);

    currentLineIndex++;
}

export function resetHighlight(){
    document.querySelector(".buttons > :nth-child(2)").disabled = false;
    currentLineIndex = 0;
}