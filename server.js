const express = require('express');
const path = require('path');
const noteData = require('./db/db.json');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

// Set up Express app to handle data parsing 
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Serve static files in /public dir
app.use(express.static('public'));
// Serve landing page (index.html)
app.get('/', (req,res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));
app.get('/api/notes', (req, res) => res.json(noteData));

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request to create a note`);
    const {title, text} = req.body;
    const newNote = {
        title,
        text,
        note_id: uuidv4()
    };
    console.log(newNote);
    // Convert the data to a string
    const noteString = JSON.stringify(newNote, null, '\t\t');
    console.log("noteString: " + noteString )
    writeNote(newNote, noteString);
});

function writeNote (newNote, noteString){
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }
        // Remove last two lines up to '}'
        let linesExceptLast = data.split('\n').slice(0,-3).join('\n');
        // Add '},' to append new json element
        let newLines = linesExceptLast + '\n\t},\n\t' ;
        console.log("New lines \n" + newLines);
        fs.writeFile('./db/db.json', newLines + noteString + '\n]\n',(err) =>
            err ? 
            console.error(err) : 
            console.log(`New note ${newNote.title} has been saved`)
        );
        //fs.appendFile(noteString);
        //fs.appendFile(newNote + '\n]\n');
    });
}

// Start server on port 3001
app.listen(PORT, () => 
    console.log(`Note Taker is listening on port ${PORT}`)
);