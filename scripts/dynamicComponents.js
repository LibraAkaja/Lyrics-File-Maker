export function createDElement(elementParent,elementType,className){
    const parentE = document.querySelector(elementParent);
    const newElem = document.createElement(elementType);
    newElem.setAttribute("class",className);
    parentE.appendChild(newElem);
}

export function addText(elementParent, string){
    const parentE = document.querySelector(elementParent);
    const t = document.createTextNode(string);
    parentE.appendChild(t);
}

export function removeDElement(e){
    document.querySelector(e).remove();
}

export function changeHeight(e, high){
    document.querySelector(e).style.height = high;
}


// export function getLyrics(){
//     return document.querySelector(".lyricsInput").textContent;
//}