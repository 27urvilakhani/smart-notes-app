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
// write this once, call it everywhere
function saveToStorage() {
    localStorage.setItem("notesarr", JSON.stringify(notesarr))
}
function changeColor(id, color) {
    let note = notesarr.find(note => note.id === id)
    note.color = color
    saveToStorage()
    displayNotes(notesarr)
}
notesinput.addEventListener("keydown", function(e) {
    // Ctrl+Enter or Cmd+Enter (Mac) triggers add/save
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        addbtn.click()
    }
})
function addNote() {
    // .trim() removes accidental spaces — "   " won't be saved as a note
    let text = notesinput.value.trim()

    // guard clause — don't add empty notes
    if (text === "") return

    let note = {
        id: Date.now(),
        text: text,
        pinned: false,
        color: "purple",
        createdAt: new Date().toLocaleString()
    }

    notesarr.push(note)
    saveToStorage()   // we'll make this a reusable function (explained below)
    displayNotes(notesarr)
    notesinput.value = ""
    updateCharCount() // resets counter after adding
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
    display.innerHTML = ""

    if (notes.length === 0) {
        display.innerHTML = `
            <div class="empty-state">
                <h2>No notes yet</h2>
                <p>Add your first note above!</p>
            </div>`
        return
    }

    // pinned notes always appear first
    let sorted = [...notes].sort((a, b) => b.pinned - a.pinned)

    sorted.forEach(note => {
        let div = document.createElement("div")
        div.className = `notescontainer color-${note.color}`

        // animation — each card fades in smoothly
        div.style.animation = "fadeIn 0.25s ease"

        div.innerHTML = `
            <div class="note-top">
                <span class="timestamp">${note.createdAt}</span>
                <button class="pinBtn" onclick="togglePin(${note.id})" title="Pin note">
                    ${note.pinned ? "📌" : "☆"}
                </button>
            </div>
            <p class="note-text">${note.text}</p>
            <div class="color-picker">
                <span onclick="changeColor(${note.id}, 'purple')" class="dot dot-purple"></span>
                <span onclick="changeColor(${note.id}, 'teal')"   class="dot dot-teal"></span>
                <span onclick="changeColor(${note.id}, 'coral')"  class="dot dot-coral"></span>
            </div>
            <div class="note-actions">
                <button class="deleteBtn" onclick="deleteNote(${note.id})">Delete</button>
                <button class="editBtn"   onclick="editNote(${note.id})">Edit</button>
            </div>
        `
        display.appendChild(div)
    })
}

function deleteNote(id) {
    // filter KEEPS every note whose id does NOT match
    // the one note whose id matches gets removed
    notesarr = notesarr.filter(note => note.id !== id)
    saveToStorage()
    displayNotes(notesarr)
}

function editNote(id) {
    editmode = true
    addbtn.textContent = "Save"
    // find the exact note object by id
    editingIndex = notesarr.findIndex(note => note.id === id)
    notesinput.value = notesarr[editingIndex].text
    notesinput.focus() // moves cursor to input automatically — small but smooth
}

function savenote() {
    let text = notesinput.value.trim()
    if (text === "") return  // don't save empty edits

    notesarr[editingIndex].text = text
    saveToStorage()
    displayNotes(notesarr)
    notesinput.value = ""
    editingIndex = null
    editmode = false
    addbtn.textContent = "Add"
}
function togglePin(id) {
    // find the note and flip its pinned value — true becomes false, false becomes true
    let note = notesarr.find(note => note.id === id)
    note.pinned = !note.pinned
    saveToStorage()
    displayNotes(notesarr)
}
function updateCharCount() {
    let count = notesinput.value.length
    charCount.textContent = `${count} / 200`
    // warn user when getting close to limit
    charCount.style.color = count > 180 ? "#D85A30" : "#888780"
}

notesinput.addEventListener("input", updateCharCount)
notesinput.setAttribute("maxlength", "200") // hard limit in the input itself
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