import { createDElement, addText, removeDElement, changeHeight } from "./dynamicComponents.js";

const a = document.querySelector("#aud");
const icon = document.querySelector("#pIcon");

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

//Function to change DOM 
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
                    conditionalRender2();
                }, 1000);
            },{once:true});
        }, 1000);
    }, {once:true});
}

function conditionalRender2(){
    changeHeight(".lyricsInput","250px");
    createDElement(".mainContainer","div","buttons");
    createDElement(".buttons","div","button");
    createDElement(".buttons","div","button");
    createDElement(".buttons","div","button");
    createDElement(".buttons","div","button");
}

//To trigger changes in the tickbox
function tickEvents(event){
    event.target.style.background = `url(Assets/tick.svg) no-repeat center`;
    event.target.style.backgroundSize = `100%`;
    event.target.style.cursor = "not-allowed";
}

//Plays audio when play icon is clicked and performs other necessary actions
document.querySelector("#ppIcon").addEventListener("click",function(){
    if(icon.src.includes("play.svg") && document.querySelector("#fileName").textContent != "No File Chosen"){
        icon.src = "Assets/pause.svg";
        a.play().catch((error) => {
            console.error("Error playing audio: ",error);
        });
    }
    else{
        icon.src = "Assets/play.svg";
        a.pause();
    }
});

//Reverts the icon back to the play icon once the audio finishes playing once
a.addEventListener("ended",()=>{
    icon.src = "Assets/play.svg";
});

