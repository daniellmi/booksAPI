import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, minlength: 12 },
    password: { type: String, required: true, minlength: 6 },
    username: { type: String, required: true, minlength: 6 },
    telephone: { type: String, required: false, default: null }

})
const bookSchema = new mongoose.Schema({
    bookName: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: false }
})

let Book = mongoose.model('book', bookSchema);
let User = mongoose.model('user', UserSchema);

export default User;
export { Book }
