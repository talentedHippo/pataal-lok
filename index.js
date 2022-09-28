const express = require('express')
const app = express()
const path = require('path')

const port = process.env.PORT || 3003;

app.use(express.json());
app.use(cors());

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.listen(port, () => {
    console.log("Listening on port " + port);
});