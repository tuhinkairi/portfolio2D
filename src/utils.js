export function displayDialogue(text, onDisplayEnd) {
  const dialogUI = document.getElementById("textbox-container");
  const dialogue = document.getElementById("dialogue");
  
  dialogUI.style.display = "block";
  let index = 0;
  let currentText = "";
  const intervalRef = setInterval(() => {
    if (index < text.length) {
      currentText += text[index];
      dialogue.innerHTML = currentText;
      index++;
      return;
    }
    
    clearInterval(intervalRef);
  }, 5);
const closeBtn = document.getElementById("close");

function onCloseBtnClick() {
    onDisplayEnd();
    dialogUI.style.display = "none";
    dialogue.innerHTML = "";
    clearInterval(intervalRef);
    closeBtn.removeEventListener("click", onCloseBtnClick);
  }
  closeBtn.addEventListener("click", onCloseBtnClick);
}

// set camram
export function setCamScale(k) {
  const factor = k.width() / k.height();
  factor < 1 ? k.camScale(k.vec2(1)) : k.camScale(k.vec2(1.5));
}

export function closeBtnClick(){
  document.getElementById("close").click()
}
