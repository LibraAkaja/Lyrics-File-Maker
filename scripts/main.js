import { createDElement, addText, removeDElement, changeHeight } from "./dynamicComponents.js";

const a = document.querySelector("#aud");
const ppIcon = document.querySelector("#ppIcon");

//Clicking attach icon changes state of the hidden input field
document.querySelector("#iconContainer").addEventListener("click", function() {
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
            removeDElement(".confirmAudio");
            createDElement("body","div","askLyrics");
            addText(".askLyrics","Paste the lyrics below");
            createDElement("body","div","mainContainer");
            createDElement(".mainContainer","textarea","lyricsInput");
            document.querySelector(".lyricsInput").placeholder = "Song Lyrics Here";
            createDElement("body","div","confirmLyrics");
            addText(".confirmLyrics","Confirm the Lyrics?");
            createDElement(".confirmLyrics","div","tick");
            document.querySelector(".tick").addEventListener("click",(event) => {
                tickEvents(event);
                setTimeout(() => {
                    // let lyrics = getLyrics();
                    removeDElement(".confirmLyrics");
                    changeLIcss();
                    conditionalRender2();
                }, 1000);
            },{once:true});
        }, 1000);
    }, {once:true});
}

//Changes css of lyricsInput textarea
function changeLIcss(){
    const li = document.querySelector(".lyricsInput");
    li.setAttribute("readOnly","true");
    li.style.cursor = "default";
}

function conditionalRender2(){
    changeHeight(".lyricsInput","250px");
    createDElement(".mainContainer","div","buttons");
    createDElement(".buttons","div","button");
    createDElement(".buttons","div","button");
    createDElement(".buttons","div","button");
    createDElement(".buttons","div","button");
    conditionalRender3();
}

function conditionalRender3(){
    document.querySelector(".buttons > :nth-child(1)").addEventListener("click", () => {
        ppAudio(ppIcon);
    });
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
        ppAudio(ppIcon);
    }
});

//To validate the presence of the second play/pause button that appears on confirming lyrics
function checkStatus(){
    if(document.querySelector(".buttons > :nth-child(1)")){
        return 1;
    }
    else{
        return 0;
    }
}

function ppAudio(e) {
    const stats = checkStatus();
    const computedStyle = window.getComputedStyle(e);
    const bgImage = computedStyle.backgroundImage;
    if(bgImage.includes("play.svg")){
        if(stats === 1){
            document.querySelector(".buttons > :nth-child(1)").style.backgroundImage = "url(Assets/pause.svg)";
        }
        e.style.backgroundImage = "url(Assets/pause.svg)";
        a.play().catch((error) => {
            console.error("Error playing audio: ", error);
        }); 
    }
    else{
        e.style.backgroundImage = "url(Assets/play.svg)";
        if(stats === 1){
            document.querySelector(".buttons > :nth-child(1)").style.backgroundImage = "url(Assets/play.svg)";
        }
        a.pause();
    }
}

//Reverts the icon back to the play icon once the audio finishes playing once
a.addEventListener("ended",()=>{
    const stats = checkStatus();
    if(stats === 1){
        document.querySelector(".buttons > :nth-child(1)").style.backgroundImage = "url(Assets/play.svg)";
    }
    ppIcon.style.backgroundImage = "url(Assets/play.svg)";
});

