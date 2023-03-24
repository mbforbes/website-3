for (let supEl of document.getElementsByClassName("footnote-ref")) {
    // populate and add the sidenote & sidenote number
    let linkEl = supEl.children[0];
    let fnID = linkEl.getAttribute("href").slice(1);
    let fnLi = document.getElementById(fnID);  // fnXX
    let fnP = fnLi.children[0];
    // copy all children except the ↩︎ markers
    let contentsNodes = []
    for (let child of fnP.childNodes) {
        if (child.className != "footnote-backref") {
            contentsNodes.push(child.cloneNode(true));
        }
    }
    let sidenote = document.createElement("span");
    sidenote.className = "sidenote";

    let sidenoteText = document.createElement("span");
    sidenoteText.className = "sidenote-text";
    sidenoteText.append(...contentsNodes);
    sidenote.insertAdjacentElement("afterbegin", sidenoteText);

    let sidenoteNum = document.createElement("span");
    sidenoteNum.className = "sidenote-number";
    sidenoteNum.innerText = fnID.slice(2).padStart(2, '0');;
    sidenote.insertAdjacentElement("afterbegin", sidenoteNum);

    supEl.insertAdjacentElement("afterend", sidenote);

    // make link highlight sidenote if visible (WIP)
    linkEl.onclick = () => {
        sidenote.classList.add("flash");
        setTimeout(() => {
            sidenote.classList.remove("flash");
        }, 1000);
    };


    // restyle footnote marker element for when sidenotes visible
    supEl.classList.add("plain-sv");
}

// hide normal footnotes if sidenotes visible
for (let el of document.getElementsByClassName("footnotes")) {
    el.classList.add("dn-sv");
}
