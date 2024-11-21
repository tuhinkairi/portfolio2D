import kaboom from "kaboom";

// use kaboom via k
export const k = kaboom({
    global:false,
    touchToMouse:true,
    canvas: document.getElementById("game")
})