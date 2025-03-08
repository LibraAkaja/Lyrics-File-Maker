import { createDElement, addText, removeText ,removeDElement } from "./dynamicComponents.js";
import { changeCSS } from "./dynamicComponents.js";
import { showTimer, startTimer, pauseTimer, resetTimer, xchgReln } from "./timer.js";
import { checkBStatus } from "./dynamicComponents.js";
import { highlightNextLine, resetHighlight } from "./highlighter.js";

const a = document.querySelector("#aud");
const ppIcon = document.querySelector("#ppIcon");

//Clicking attach icon changes state of the hidden input field
document.querySelector("#iconContainer2").addEventListener("click", function() {
    document.querySelector("#a").click();
});

//Detects change in state of hidden input field and loads audio file
document.querySelector("#a").addEventListener("change", function() {
    if(this.files.length > 0){
        let file = this.files[0];
        let fileURL = URL.createObjectURL(file);
        document.querySelector("#fileName").textContent = file.name;
        let audioElement = document.querySelector("#aud");
        audioElement.src = fileURL;
        audioElement.load();        //Load the audio
        if(document.querySelector(".confirmAudio")){
            removeDElement(".confirmAudio");
        }
        conditionalRender1();
    }
});

//Functions to change DOM

function conditionalRender1(){
    createDElement("body","div","confirmAudio");
    addText(".confirmAudio","Use this audio?");
    createDElement(".confirmAudio","div","tick");
    document.querySelector(".tick").addEventListener("click",(event) => {
        tickEvents(event);
        setTimeout(() => {
            removeDElement(".inputContainer");
            removeDElement(".confirmAudio");
            createDElement("body","div","askLyrics");
            addText(".askLyrics","Paste the lyrics below");
            createDElement("body","div","mainContainer");
            createDElement(".mainContainer","textarea","lyricsInput");
            document.querySelector(".lyricsInput").placeholder = "Song Lyrics Here";
            document.querySelector(".lyricsInput").addEventListener("input",()=>{
                if(document.querySelector(".lyricsInput").value.trim() !== ""){
                    removeText(".askLyrics");
                    addText(".askLyrics","Confirm the Lyrics?");
                    document.querySelector(".askLyrics").innerHTML += "&nbsp;&nbsp;"; 
                    createDElement(".askLyrics","div","tick");
                    document.querySelector(".tick").addEventListener("click",(event) => {
                        tickEvents(event);
                        setTimeout(() => {
                            removeDElement(".tick");
                            removeText(".askLyrics");
                            showTimer(".askLyrics");
                            changeLIcss();
                            conditionalRender2();
                        }, 1000);
                    },{once:true});
                }
                else{
                    if(document.querySelector(".tick")){
                        removeDElement(".tick");
                    }
                    removeText(".askLyrics");
                    addText(".askLyrics","Paste the lyrics below");
                }
            });
        }, 1000);
    }, {once:true});
}

function conditionalRender2(){
    if(window.innerWidth > 425){
        changeCSS(".lyricsInput","height","66%");
    }
    else{
        changeCSS(".lyricsInput","height","75%");
    }
    createDElement(".mainContainer","div","buttons");
    createDElement(".buttons","div","button");
    createDElement(".buttons","div","button");
    createDElement(".buttons","div","button");
    createDElement(".buttons","div","button");
    conditionalRender3();
}

function conditionalRender3(){
    document.querySelector(".buttons > :nth-child(1)").addEventListener("click", () => {
        ppAudio();
        if(document.querySelector(".buttons > :nth-child(1)").style.backgroundImage == "url(Assets/pause.svg)"){
            startTimer(".askLyrics");
        }
    });
    document.querySelector(".buttons > :nth-child(2)").addEventListener("click", () => {
        resetPPIcons();
        resetAudio();
        resetTimer();
        resetHighlight();
    });
    document.querySelector(".buttons > :nth-child(3)").addEventListener("click",highlightNextLine);
}

// Change the play/pause icon to Play icon 
function resetPPIcons(){
    const bStats = checkBStatus();
    changeCSS("#ppIcon","backgroundImage","url(Assets/play.svg)");
    if(bStats === 1){
        changeCSS(".buttons > :nth-child(1)","backgroundImage","url(Assets/play.svg)");
    }
}

//Change the play/pause icon to Pause icon
function setPPIcons(){
    const bStats = checkBStatus();
    if(bStats === 1){
        changeCSS(".buttons > :nth-child(1)","backgroundImage","url(Assets/pause.svg)");
    }
    changeCSS("#ppIcon","backgroundImage","url(Assets/pause.svg)");
}

//Changes css of lyricsInput textarea
function changeLIcss(){
    const li = document.querySelector(".lyricsInput");
    li.setAttribute("readOnly","true");
    changeCSS(".lyricsInput","cursor","default");
}

//To trigger changes in the tickbox
function tickEvents(event){
    event.target.style.background = `url(Assets/tick.svg) no-repeat center`;
    event.target.style.backgroundSize = `100%`;
    event.target.style.cursor = "not-allowed";
}

//Plays audio when play icon is clicked and performs other necessary actions
document.querySelector("#ppIcon").addEventListener("click", ()=>{
    if(document.querySelector("#fileName").textContent != "No File Chosen"){
        ppAudio();
    }
});

//Function to play/pause audio
function ppAudio() {
    const computedStyle = window.getComputedStyle(ppIcon);
    const bgImage = computedStyle.backgroundImage;
    if(bgImage.includes("play.svg")){
        setPPIcons();
        a.play().catch((error) => {
            console.error("Error playing audio: ", error);
        }); 
        startTimer();
    }
    else{
        resetPPIcons();
        a.pause();
        pauseTimer();
    }
}

//Function to reset audio
function resetAudio(){
    a.pause();
    a.currentTime = 0;
}

//Reverts the icon back to the play icon once the audio finishes playing once
a.addEventListener("ended",()=>{
    const stats = checkBStatus();
    if(stats === 1){
        changeCSS(".buttons > :nth-child(1)","backgroundImage","url(Assets/play.svg)");
    }
    changeCSS("#ppIcon","backgroundImage","url(Assets/play.svg)");
    pauseTimer();
});
