const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3001;

// Set up Express app to handle data parsing 
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Serve static files in /public dir
app.use(express.static('public'));

// Serve landing page (index.html)
app.get('/', (req,res) => res.sendFile(path.join(__dirname, 'index.html')));

// Serve notes page (notes.html)
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// Read db.json and return all saved notes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err,data) => {
        if (err) {
            console.log(err);
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Receive a new note to add to db.json
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request to create a note`);
    const {title, text} = req.body;
    const newNote = {
        title,
        text,
        id: uuidv4()
    };
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
    const response = {
        status: 'Success',
        body: newNote,
    };
    res.status(201).json(response);
});

// Receive the 'id' of a note to delete
app.delete('/api/notes/:id',(req, res) => {
    console.info(`${req.method} request to delete a note`);
    //console.log(JSON.stringify(req.params));
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const parsedData = JSON.parse(data);
            // Look for the element in parsedData with the requested 'id'
            for (let [i, note] of parsedData.entries()) {
                if (note.id === req.params.id){
                    // Delete current element from parsedData
                    parsedData.splice(i,1);
                }
            }
            fs.writeFile('./db/db.json', JSON.stringify(parsedData, null, 4), (err) =>
            err ? console.error(err) : console.info(`\nData deleted from db.json`)
          );
        }
    });
    const response = {
        status: 'Success',
    };
    res.status(201).json(response);
});

// Start server on port 3001
app.listen(port, () => 
    console.log(`Note Taker is listening on port ${port}`)
);