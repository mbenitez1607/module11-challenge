const express = require('express');

const app = express();
const PORT = 3001;
const path = require('path');

app.get('/', (req,res) => res.sendFile(path.join(__dirname, '/public/')));

app.listen(PORT, () => 
    console.log(`Note take app serving static asset routes on port ${PORT}`)
);