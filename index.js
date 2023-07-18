function on(color){
    document.getElementById("b").style.backgroundColor = color;
    const boxes = document.querySelectorAll('.txt');
    boxes.forEach(box => {
    box.style.backgroundColor = color;
});

}