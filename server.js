const express = require('express');
const uuid = require('uuid');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;

// will share any static html files with the browser
app.use( express.static('public') );
// accept incoming POST requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dbFile = './app/db.json';

// let noteList = [{id: "0000-0000-0000-0000", title: 'note1', text: 'note1 text'}];
let noteList = JSON.parse(fs.readFileSync(dbFile));
console.log(noteList);

// Endpoints =================================================

// for app.post: newNote.id = uuid.v4() // use a random unique id.
app.get("/api/notes", function(req, res){
    res.json(noteList);
});

app.post("/api/notes", function(req, res){
    const newNote = {
        id: uuid.v4(),
        title: req.body.title,
        text: req.body.text
    }
    noteList.push(newNote);
    fs.appendFileSync(dbFile, newNote);
    res.send({message: "Note saved!"});
});

app.delete("/api/notes/:id", function(req, res){
    const selectedNoteID = req.params.id;
    if(noteList.findIndex(i => i.id == selectedNoteID) != -1){
        const index = noteList.findIndex(i => i.id == selectedNoteID);
        noteList.splice(index, 1);
        fs.writeFileSync(dbFile, noteList);
        res.send({message: `Note id: ${selectedNoteID} is deleted`});
    }
    else res.send({message: `Note id: ${selectedNoteID} not found in database`});

});

// Listener ==================================================
app.listen(PORT, function() {
    console.log(`Serving notes on PORT ${PORT}`)
})
