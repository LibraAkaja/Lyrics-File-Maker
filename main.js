const a = document.querySelector("#aud");
const icon = document.querySelector("#pIcon");

document.querySelector("#iconContainer").addEventListener("click", function() {
    document.querySelector("#a").click();
});

document.querySelector("#a").addEventListener("change", function() {
    if(this.files.length > 0){
        let file = this.files[0];
        let fileURL = URL.createObjectURL(file);
        document.querySelector("#fileName").textContent = file.name;
        let audioElement = document.querySelector("#aud");
        audioElement.src = fileURL;
        audioElement.load();
    }
});

function playAudio(){
    if(icon.src.includes("play.svg")){
        icon.src = "Assets/pause.svg";
        a.play().catch((error) => {
            console.error("Error playing audio: ",error);
        });
    }
    else{
        icon.src = "Assets/play.svg";
        a.pause();
    }
}

a.addEventListener("ended",()=>{
    icon.src = "Assets/play.svg";
});

