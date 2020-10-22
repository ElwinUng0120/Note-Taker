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
});

app.delete("/api/notes/:id", function(req, res){
    const selectedNote = req.params.id;
    if(noteList.hasOwnProperty(selectedNote)){
        console.log("Note found");
        noteList[selectedNote] = "";
        res.send(`Note id: ${selectedNote} is deleted`);
    }
    else res.send(`Note id: ${selectedNote} not found in database`);

});

// Listener ==================================================
app.listen(PORT, function() {
    console.log(`Serving notes on PORT ${PORT}`)
})
