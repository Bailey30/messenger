export function scrollToBottom() {
    var objDiv = document.getElementById("messagesContainer");
    console.log(objDiv);
    if (objDiv) {
        console.log(objDiv.scrollTop);
        objDiv.scrollTop = objDiv.scrollHeight;
    }
}
