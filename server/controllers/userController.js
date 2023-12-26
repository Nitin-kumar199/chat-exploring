const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) =>{
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.sign({_id}, jwtkey, {expiresIn: "3d"});
}

const registerUser = async (req, res) =>{
    const { name, email, password } = req.body;

    try{
    
    let user = await userModel.findOne({email});
    if(user) return res.status(400).json("User already exist");
    if(!name || !email || !password) return res.status(400).json("All fields must be filled");
    if(!validator.isEmail(email)) return res.status(400).json("email must be valid");
    if(!validator.isStrongPassword(password)) return res.status(400).json("password must be valid");

    user = new userModel({name, email, password});
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)
    await user.save()
    const token = createToken(user._id);
    res.status(200).json({_id: user._id, name, email, token})
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
    
}

const loginUser = async (req, res) =>{  
    try {
        const {email, password} = req.body;
    // console.log(req.body);
        const user = await userModel.findOne({email});
        //console.log(user);
        if(!user) return res.status(400).json("user not found");
        const isValidPassword = await bcrypt.compare(password, user.password);
        //console.log(isValidPassword);
        if(!isValidPassword) return res.status(400).json("user and password is not valid");
        const token = createToken(user._id);
        res.status(200).json({_id: user._id, name: user.name, email, token});
    } catch (error) {
        res.status(500).json(error);
    }
}

const findUser = async (req, res) =>{
    const userId = req.params.userId
    try {
        const user = await userModel.findById(userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
}
const getUser = async (req, res) =>{
    try{
        const users = await userModel.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err)
    }
}

module.exports = { registerUser, loginUser, findUser, getUser };