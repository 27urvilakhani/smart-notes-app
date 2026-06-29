const notesinput = document.getElementById("note")
const addbtn = document.getElementById("addbtn")
const display = document.getElementById("display")
const searchInput = document.getElementById("search")
const searchBtn = document.getElementById("searchBtn")
// const searchresult = document.getElementById("diplayresult")
let notesarr = []
let editingIndex = null
let editmode = false
// when website open run this to checkif there was any previous stored notes if not then make an empty array
let savedNotes = localStorage.getItem("notesarr")
if (savedNotes === null) {
    notesarr
}
else {
    notesarr = JSON.parse(savedNotes)
}
displayNotes(notesarr)

function addNote() {
    //read the input in console
    console.log(notesinput.value)
    //read the input 
    let text = notesinput.value
    //create note obj
    let note = {
        text: text
    }
    //add it to array
    notesarr.push(note)
    console.log(notesarr)
// add it to local storage
    localStorage.setItem("notesarr", JSON.stringify(notesarr))
    // diplay the notes
    displayNotes(notesarr)
    // clear the input
    notesinput.value = ""
}
// run function addbtn if editmode then if or else when editmode is off
addbtn.addEventListener("click", function () {
    if (editmode) {
        savenote()
    }
    else {
        addNote();
    }
})




function displayNotes(notes) {
  
    // Clear the notes
    display.innerHTML = ""
    // if there is no previous stored notes website is opened first time then run this
    if (notes.length === 0) {
        let emptystate = `
        <div class=empty-state><h2>No notes yet</h2>
        <p>Add your first note!</p></div>`
        display.innerHTML = emptystate;
    }
    // if there were notes previously then run this
    else {
        // loop through notes
        for (let i = 0; i < notes.length; i++) {

            // create note with delete button
          let html = `<div class="notescontainer">
          <p>${notes[i].text}</p>
          <button class="deleteBtn" onclick="deleteNote(${i})">Delete</button>
          <button class="editBtn" onclick="editNote(${i})">Edit</button>
          </div>`

            // add notes to the display
            display.innerHTML += html
        }
    }
}

function deleteNote(index) {
    // remove the object from array
    notesarr.splice(index, 1)
    // update the local storage
    localStorage.setItem("notesarr", JSON.stringify(notesarr))
    // call display function 
    displayNotes(notesarr)
}
function editNote(i) {
    // change edit mode to on 
    editmode = true;
    // change the add btn to save btn
    addbtn.textContent = "Save";
    // store index of the object being edited
    editingIndex = i;
    // diplay the text into input box
    notesinput.value = notesarr[editingIndex].text;
}

function savenote() {
    // save the changes made inside input box
    notesarr[editingIndex].text = notesinput.value
    // update local storage
    localStorage.setItem("notesarr", JSON.stringify(notesarr))
    // display updated array
    displayNotes(notesarr)
    // clear the input
    notesinput.value = ""
    // clear the index
    editingIndex = null
    // switch back to edit mode off
    editmode = false;
    // make save btn add btn
    addbtn.textContent = "Add";
}
function search() {
    let searchedQuery = searchInput.value.trim()
    
    // if search is empty, show all notes
    if (searchedQuery === "") {
        displayNotes(notesarr)
        return
    }
    
    let filterednotesArr = []
    for (let i = 0; i < notesarr.length; i++) {
        if (notesarr[i].text.toLowerCase().includes(searchedQuery.toLowerCase())) {
            filterednotesArr.push(notesarr[i])
        }
    }
    displayNotes(filterednotesArr)
}
searchBtn.addEventListener("click", search)
searchBtn.addEventListener("input",searchInput)