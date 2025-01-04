import express from 'express';
import jwt from 'jsonwebtoken'
import { Book } from '../controllers/controllers.js';

const privateRouter = express.Router();

const auth = (req, res, next) => {
    //o cookie no header é retornando com seu valor + nome (authorization-token), 
    // por isso precisa ser removido, sobrando o valor do token
    const HEADER_TOKEN = req.headers.cookie?.replace("authorization-token=", "");

    if (!HEADER_TOKEN) {
        return res.status(401).send("unathourized");
    }
    try {
        const token = jwt.verify(HEADER_TOKEN, process.env.SECRET_TOKEN);
        req.user = token;
        if (token) {
            return res.status(200).send("authorized")
        }
        next();

    } catch (error) {
        console.log(error);
    }
    return res.status(401).send("unathourized");

}

privateRouter.get('/home', auth);

privateRouter.post('/book', async (req, res) => {
    const { bookName, description, image } = req.body;

    if (bookName && description) {
        try {
            let book = new Book({
                bookName: bookName,
                description: description,
                image: image
            })

            await book.save();
            return res.status(201).json({ message: "book saved succesfully" })

        }
        catch (error) {
            console.log(error)

        }
    }

})
privateRouter.get('/allBooks', async (req, res) => {

    try {
        const allBooks = await Book.find();

        return res.status(200).send(allBooks);

    } catch (error) {
        return res.status(500).send(error);
    }

})

privateRouter.delete('/deletebook/:bookName', async (req, res) => {
    const bookname = req.params.bookName;

    try {
        const deletebook = await Book.findOneAndDelete({ bookName: bookname });

        if (deletebook) {
            return res.status(201).json({ message: "book deleted succesfully" })
        }
        else {
            return res.status(400).json({ message: "something went wrong" })
        }

    } catch (error) {
        console.log(error);

    }
})

privateRouter.put('/updatebooks/:bookName', async (req, res) => {
    const bookName = req.params.bookName;

    const { newName, newDescription } = req.body;

    try {

        const foundBookByNameAndUpdate = await Book.findOneAndUpdate({ bookName: bookName },
            { bookName: newName, description: newDescription })

        if (foundBookByNameAndUpdate) {

            return res.status(201).send("book updated!");

        }
        else {
            return res.status(404).send("book not found");
        }

    }

    catch (error) {
        console.log(error);
        return res.status(500).send(error);

    }



})

privateRouter.patch('/updatemany/:id', async (req, res) => {

    const id = req.params.id;

    try {
        if (id) {
            await Book.deleteMany({})
            return res.status(200).json({ message: "all books deleted" })
        }
        else {
            return res.status(404).json({ message: "id is necessary" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }


})

export default privateRouter;