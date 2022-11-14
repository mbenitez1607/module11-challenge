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
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err,data) => {
        if (err) {
            console.log(err);
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request to create a note`);
    const {title, text} = req.body;
    const newNote = {
        title,
        text,
        note_id: uuidv4()
    };
    //console.log(newNote);
    writeNote(newNote);
    const response = {
        status: 'Success',
        body: newNote,
    };
    res.status(201).json(response);
});

function writeNote (newNote){
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(newNote);
            fs.writeFile('./db/db.json', JSON.stringify(parsedData, null, 4), (err) =>
            err ? console.error(err) : console.info(`\nData written to db.json`)
          );
        }
    });
}

// Start server on port 3001
app.listen(PORT, () => 
    console.log(`Note Taker is listening on port ${PORT}`)
);