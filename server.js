require('dotenv').config();

const app = require("./src/app");

const PORT = 3030
const server = app.listen( PORT, () => {
    console.log(`Start blog website with port ${PORT}`);
})

// process.on('SIGINT', () => {
//     server.close(() => console.log(`Close server done`))
// })