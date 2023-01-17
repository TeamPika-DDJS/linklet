const express = require('express');
const path = require('path')
const dotenv = require('dotenv')
const app = express();
dotenv.config();

const MODE = process.env.NODE_ENV || 'proudction';
const PORT = process.env.port || 3000;

app.use(express.json());

if (MODE === 'production') {
    // statically serve everything in the build folder on the route '/dist'
    app.use('/', express.static(path.resolve(__dirname,'../dist')))
}

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}...`);
    console.log(`Currently in ${MODE.toLowerCase()} mode`)
})