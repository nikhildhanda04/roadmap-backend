const asyncHandler = require("express-async-handler");
const User = require("../models/userModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc register new user
//@route /api/user/register
//@access public
const registerUser = asyncHandler (async(req, res)=> {
    const {username, email, password} = req.body;

    if(!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const userAvailable = await User.findOne({email});
    if (userAvailable){
        res.status(400);
        throw new Error("User is already registerd!")
    }
    
    // console.log("hasing for password", password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);
    
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    console.log(`User Created Successfully!! ${newUser}`);

    if (newUser){
        return res.status(201).json({_id: newUser.id, email: newUser.email})
    } else {
        res.status(400);
        throw new Error("User Data Invaild!!")
    }
    
});

//@desc login user
//@route /api/user/login
//@access public
const loginUser = asyncHandler (async(req, res)=> {
    const {email, password} = req.body;
    if(!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user = await User.findOne({email});
    if (user && (await bcrypt.compare(password, user.password))) {
       const accessToken = jwt.sign({ 
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            }
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1d"});

        return res.status(200).json({accessToken});
    }else{
        res.status(401);
        throw new Error("Email or Password is not valid");
    }
})

//@desc check current user
//@route /api/user/check
//@access public
const currentUser = asyncHandler (async(req, res)=> {
    res.json(req.user);
})

// //@desc delete a user
// //@route /api/user/delete
// //@access public
// const deleteUser = asyncHandler (async(req, res)=> {
//     const user = await User.findByIdAndDelete(req.user.id);
//     if (user) {
//         res.status(200).json({message: "User deleted successfully"});
//     } else {
//         res.status(404);
//         throw new Error("User not found");
//     }
// })

module.exports = {registerUser, loginUser, currentUser};