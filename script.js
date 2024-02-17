const formContainer = document.getElementsByClassName('form-container')[0]; 
const  saveButton = document.getElementById('save');

let inputElements = []; // for keeping track of each elements

// handle click event for adding input elements
function handleClick(element,name,extra){
    let obj ={
        id :generateUUID(),
        type:element,
        label:name,
       }
    if(element==='select'){
        // extra will be an array
     obj.options = [...extra]
    }
    else{
        // extra will be a string
      obj.placeholder = extra;
    }

       inputElements.push(obj);
       appendElement(obj);
}


// function to render all elements in an array to ui
function renderElements(){
    inputElements.forEach((item)=>{
        appendElement(item);
    })
}



// function to create a unique uuid
function generateUUID() {
    // Get the current time in milliseconds
    const Time = new Date().getTime();

    // Convert the current time to a hexadecimal string
    const hexTimestamp = Time.toString(16);

    return hexTimestamp;
}


// function to handle drag event
function handleDrag(e){
    e.dataTransfer.setData('dragid',e.target.id);
}

// handle dragover event
function handleDragOver(e){
    e.preventDefault();
}


// function to handle drop event
function handleDrop(e){
    e.preventDefault();
    let dragId = e.dataTransfer.getData('dragid');
    let draggedElement = document.getElementById(dragId);
    // get the closest ancestor
    let dropElement = e.target.closest('.item');

    let dropId = dropElement.id;
   
   // check the drop element and dragg element are correct
    if(draggedElement && dropElement && dropElement.parentNode===formContainer){
       dragAndDropNode(dragId,dropId);
    }
}


// function to change the elements order in the array 
function dragAndDropNode(dragId,dropId){
   let dropIndex = inputElements.findIndex(item=>item.id===dropId);
   let dragIndex = inputElements.findIndex(item=>item.id===dragId);
   
   
    let tmpObj = inputElements[dragIndex];
    
    // delete dragging element from inputElements
    inputElements.splice(dragIndex,1);
    
    // add dragging element to another index
    inputElements.splice(dropIndex,0,tmpObj);

   //make it render again
   formContainer.innerHTML = "";
   renderElements();
}

 




// function to  create  and add element to the form container
function appendElement(obj){
 // create input element dynamicaly
  let div = document.createElement("div");
  div.className="item";
  div.id = obj.id;
  div.draggable = true;
  div.ondragstart = handleDrag; 
  div.ondrop = handleDrop;
  div.ondragover = handleDragOver;

 let innerHtml = `<div> 
 <p>${obj.label}</p>
  <p onClick="handleDelete('${obj.id}')" style="cursor: pointer;"><i class="fa-solid fa-trash"></i></p>
</div>`
// check the element is select or not, and create element accordingly
if(obj.type==='select'){
    innerHtml+=` <${obj.type}>`;
    obj.options.forEach((item)=>{
     innerHtml+=`<option value="${item}">${item}</option>`;
   })
   innerHtml+= `</${obj.type}>`;
  }
  else{
    innerHtml+=`<${obj.type} placeholder=${obj.placeholder} rows='5'></${obj.type}>`;
  }

 div.innerHTML = innerHtml;
 formContainer.appendChild(div);
}


// function for handling delete 
function handleDelete(id){
  let tmpArr = inputElements.filter((item)=>{return item.id!==id});
  inputElements = [...tmpArr];

   formContainer.innerHTML = "";
   renderElements();
}




// handle save functionality
saveButton.addEventListener('click',()=>{
    //convert inputElements array to json and print on console
    let jsonData = JSON.stringify(inputElements);
    console.log(jsonData);
});






