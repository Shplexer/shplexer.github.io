function mapOverlayOn() {
  off('tasksOverlay');
  off('cameraOverlay');
  off('phoneOverlay');
  document.getElementById("mapOverlay").style.display = "block";

  el = document.querySelector('.mapPicture');
  cont = document.querySelector('.mapContainer');
  let newPosX = 0, newPosY = 0, startPosX = 0, startPosY = 0;

  const mousePosText = document.getElementById('mouse-pos');
  let mousePos = { x: undefined, y: undefined };
  window.addEventListener('mousemove', (event) => {
    mousePos = { x: event.clientX - cont.getBoundingClientRect().left + el.offsetLeft * (-1), y: event.clientY - cont.getBoundingClientRect().top + el.offsetTop * (-1)};
    if(Math.round(mousePos.x) >= 0 && event.clientX - cont.getBoundingClientRect().right <=0 && event.clientY - cont.getBoundingClientRect().bottom <=0 && Math.round(mousePos.y) >= 0){
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

function tasksOverlayOn(){
  off('mapOverlay');
  off('cameraOverlay');
  off('phoneOverlay');
  document.getElementById("tasksOverlay").style.display = "block";

  el = document.querySelector('.mapPicture2');
  cont = document.querySelector('.mapContainer2');
  let newPosX = 0, newPosY = 0, startPosX = 0, startPosY = 0;
  const mousePosText = document.getElementById('mouse-pos2');
  let mousePos = { x: undefined, y: undefined };
  window.addEventListener('mousemove', (event) => {
    mousePos = { x: event.clientX - cont.getBoundingClientRect().left + el.offsetLeft * (-1), y: event.clientY - cont.getBoundingClientRect().top + el.offsetTop * (-1)};
    if(Math.round(mousePos.x) >= 0 && event.clientX - cont.getBoundingClientRect().right <=0 && event.clientY - cont.getBoundingClientRect().bottom <=0 && Math.round(mousePos.y) >= 0){
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

function phoneOverlayOn(){
  off('mapOverlay');
  off('tasksOverlay');
  off('cameraOverlay');
  document.getElementById("phoneOverlay").style.display = "block";
}

function cameraOverlayOn(){
  off('mapOverlay');
  off('tasksOverlay');
  off('phoneOverlay');
  document.getElementById("cameraOverlay").style.display = "block";
}

function off(name) {
  console.log(name, "OFF");
  document.getElementById(name).style.display = "none";
} 

function checkmarkPress(name, checkboxName){
  let elem = document.getElementById(checkboxName);
  let cont = document.getElementById(name);
  str = elem.textContent
  switch (str) {
    case "✓" || "&#10003":
      elem.innerHTML ="&#10006";
      cont.classList.add("failed");
      cont.classList.remove("complete");
      cont.classList.remove("pending");
      break;
    case "✖" || "&#10006":
      elem.innerHTML = "?";
      cont.classList.add("pending");
      cont.classList.remove("failed");
      cont.classList.remove("complete");
      break;
    case "?":
      elem.innerHTML = "&#10003";
      cont.classList.add("complete");
      cont.classList.remove("failed");
      cont.classList.remove("pending");
      break;
    default:
      break;
  }
  if(document.getElementById("checkButton4").textContent == "✖" ||document.getElementById("checkButton4").textContent =="&#10006"|| document.getElementById("checkButton4").textContent == "✓" || document.getElementById("checkButton4").textContent == "&#10003"){
    document.getElementById("check5").style.opacity = 1;
    console.log("SWITCH", str);
  }
  else{
    document.getElementById("check5").style.opacity = 0;
  }
}