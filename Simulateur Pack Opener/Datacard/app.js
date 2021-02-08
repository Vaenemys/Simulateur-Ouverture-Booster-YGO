const express = require('express')
const app = express()
app.get('/', function(req, res) {​​​​​​​res.send("bonjour bienvenue") }​​​​​​​)
app.listen(3000)