import { addText } from "./dynamicComponents.js";

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

let min = 0, sec = 0, ms = 0;
let timeInterval = null;

function updateTimerDisplay() {
    const timerElement = document.querySelector(".askLyrics");
    if(timerElement){
        document.querySelector(".askLyrics").textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
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

//To validate the presence of timer
export function checkTStatus(){
    if(document.querySelector(".askLyrics")){
        return 1;
    }
    else{
        return 0;
    }
}