const express = require('express')
const cors = require('cors')
const mariadb = require('mariadb');
const app = express()
require('dotenv').config();

const port = process.env.port || 3000
const pool = mariadb.createPool({host: process.env.host || 'mydb.com', user: process.env.user || 'myUser', connectionLimit: 5});

app.use(cors())

app.get('/', (req, res) => {

})

app.post('/', (req, res) => {

})

app.delete('/', (req, res) => {

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
