/*Function to create new element and append it to the given parent element*/
// elementParent is the html element or its id or class name
// elementType is the type of the element: e.g. div, input, button, etc.
// className is the class name to be set for the new element

export function createDElement(elementParent,elementType,className){
    const parentE = document.querySelector(elementParent);
    const newElem = document.createElement(elementType);
    newElem.setAttribute("class",className);
    parentE.appendChild(newElem);
}

/*Function to add text node to an element*/
export function addText(elementParent, string){
    const parentE = document.querySelector(elementParent);
    const t = document.createTextNode(string);
    parentE.appendChild(t);
}

/*Function to remove existing text in an element*/
export function removeText(e){
    document.querySelector(e).textContent = "";
}

/*Function to remove an existing element*/
export function removeDElement(e){
    document.querySelector(e).remove();
}

/*Function to change the css of an element*/
export function changeCSS(e, prop, val) {
    document.querySelector(e).style[prop] = val;
}

//Exchanges the position/relation of parent and its child elements
export function xchgReln(e){
    const parentE = document.querySelector(e);
    parentE.replaceWith(...parentE.childNodes);
}

//Function to initiate the timer
export function showTimer(e){
    const parentE = document.querySelector(e);
    addText(e,"00:00.00");
}

//To validate the presence of the second play/pause button that appears on confirming lyrics
export function checkBStatus(){
    if(document.querySelector(".buttons > :nth-child(1)")){
        return 1;
    }
    else{
        return 0;
    }
}

//To validate the presence of timer
export function checkTStatus(){
    if(document.querySelector(".timer")){
        return 1;
    }
    else{
        return 0;
    }
}

/*All about Timer*/

let min = 0, sec = 0, ms = 0;
let timeInterval = null;

function updateTimerDisplay() {
    const timerElement = document.querySelector(".timer");
    if(timerElement){
        document.querySelector(".timer").textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
    }
}

export function startTimer(e){
    const tStatus = checkTStatus();
    if(tStatus == 1){
        const parentE = document.querySelector(e);
        if (timeInterval) return; // Prevent multiple intervals
                timeInterval = setInterval(() => {
                    ms++;
                    if (ms === 100) {
                        ms = 0;
                        sec++;
                    }
                    if (sec === 60) {
                        sec = 0;
                        min++;
                    }
                    updateTimerDisplay();
                }, 10);
    }
}

export function pauseTimer(){
    const tStatus = checkTStatus();
    if(tStatus == 1){
        clearInterval(timeInterval);
        timeInterval = null;
    }
}

export function resetTimer(){
    pauseTimer();
    min = 0, sec = 0, ms = 0;
    updateTimerDisplay();
}

/* ***End of Timer*** */

let currentLineIndex = 0;
let lFileContent = "[ti:"+document.querySelector("#fileName").textContent+"]\n[re:libraakaja.github.io/Lyrics-File-Maker/]\n\n";
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
        console.log("\nCreating lyrical file");
        const fileBtn = document.querySelector(".buttons > :nth-child(4)");
        fileBtn.addEventListener("click",() => {
            const blob = new Blob([lFileContent], {type: "text/lrc"});
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

    lFileContent += "["+document.querySelector(".timer").textContent+"]"+sentence+"\n";
    
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

