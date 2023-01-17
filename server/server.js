const express = require('express');
const path = require('path')
const dotenv = require('dotenv')
const app = express();
dotenv.config();

const MODE = process.env.NODE_ENV || 'production';
const PORT = process.env.port || 3000;

app.use(express.json());
// app.use('/*', express.static(path.resolve(__dirname,'../dist')));

if (MODE === 'production') {
    // statically serve everything in the build folder on the route '/dist'
    app.use('/', express.static(path.resolve(__dirname,'../dist')));
}

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}...`);
    console.log(`Currently in ${MODE.toLowerCase()} mode`)
})