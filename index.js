import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import router from './routes/routes.js';
import { fileURLToPath } from 'url';
import cors from 'cors'
import privateRouter from './routes/privateRoutes.js';
import cookieParser from 'cookie-parser';
const app = express();

const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = mongoose.connection;

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(router);
app.use("/", privateRouter, express.static(path.join(__dirname, "build")));

for (let x = 0; x < 3; ++x) {
    try {
        await mongoose.connect('mongodb://localhost:27017/books', {
            serverSelectionTimeoutMS: 5000,
        }).then(() => {
            console.log('database is running')
        }).catch(error => console.log(error));

        break;
    }
    catch (err) {
        console.log("connection failed", err);
    }
}

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
})

app.listen(PORT, console.log("server running on port", PORT));




