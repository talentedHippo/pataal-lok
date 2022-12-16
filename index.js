const express = require('express')
const app = express()
const path = require('path')

const port = process.env.PORT || 3003;

app.use(express.json());
app.use(express.static(path.join(__dirname, './dist')));

app.get('*', (req, res) => {
	console.log(__dirname)
    res.sendFile(path.join(__dirname, './dist/index.html'))
})

app.listen(port, () => {
    console.log("Listening on port " + port);
});