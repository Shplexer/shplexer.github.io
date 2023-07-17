function on() {
  document.getElementById("overlay").style.display = "block";

  el = document.querySelector('.mapPicture');
  cont = document.querySelector('.mapContainer');
  let newPosX = 0, newPosY = 0, startPosX = 0, startPosY = 0;

  const mousePosText = document.getElementById('mouse-pos');
  let mousePos = { x: undefined, y: undefined };
  window.addEventListener('mousemove', (event) => {
    mousePos = { x: event.clientX - cont.getBoundingClientRect().left + el.offsetLeft * (-1), y: event.clientY - cont.getBoundingClientRect().top + el.offsetTop * (-1)};
    if(Math.round(mousePos.x) >= 0 && Math.round(mousePos.y) >= 0){
      mousePosText.textContent = `(${Math.round(mousePos.x)}, ${Math.round(mousePos.y)})`;
    }
  });
  // when the user clicks down on the element
  el.addEventListener('mousedown', function(e){
    e.preventDefault();
    
    // get the starting position of the cursor
    startPosX = e.clientX;
    startPosY = e.clientY;
    
    document.addEventListener('mousemove', mouseMove);
    
    document.addEventListener('mouseup', function(){
        document.removeEventListener('mousemove', mouseMove);
    });
  });
  
  
  function mouseMove(e) {
    // calculate the new position
    newPosX = startPosX - e.clientX;
    newPosY = startPosY - e.clientY;

    // with each move we also want to update the start X and Y
    startPosX = e.clientX;
    startPosY = e.clientY;
    let offset = el.offsetTop - newPosY;

    // set the element's new position:
    if(offset > 0){
      offset = 0;
    }
    else if(offset < (el.offsetHeight - cont.getBoundingClientRect().height) * (-1)){
      offset = (el.offsetHeight - cont.getBoundingClientRect().height) * (-1);
    }
    else{ 
      offset = el.offsetTop - newPosY;
    }
    el.style.top = offset + "px";
  }
}

function off() {
  document.getElementById("overlay").style.display = "none";
} 



