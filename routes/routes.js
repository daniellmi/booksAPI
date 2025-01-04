import express from 'express';
import User from '../controllers/controllers.js';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config();
const router = express.Router();

router.post('/user', async (req, res) => {
    const { email, password, username, telephone } = req.body;

    if (email && password && username) {

        try {
            let userExists = await User.findOne({ email: email });

            if (!userExists) {
                let user = new User({
                    email: email,
                    password: bcrypt.hashSync(password, 10),
                    username: username,
                    telephone: telephone
                })

                await user.save();
                res.status(201).json({ message: "ok" });

            }
            else {
                res.status(409).json({ message: "this user already exists" });
            }
        }
        catch (err) {
            throw err;
        }
    }
})

router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    try {
        const userWasFound = await User.findOne({ email: email })
        const passwordWasFound = bcrypt.compareSync(password, userWasFound.password);

        if (!userWasFound) return res.status(404).send("user not found")

        if (!passwordWasFound) return res.status(404).send("password doesn't match")

        let token = jwt.sign({ email: userWasFound.email }, process.env.SECRET_TOKEN, { expiresIn: '2h' })

        res.cookie('authorization-token', token, {
            httpOnly: true,
            maxAge: 3600000,
            // sameSite: 'none'
        })

        return res.status(200).send("user logged succesfully");

    }
    catch (error) {
        console.log(error);
    }

})

export default router;