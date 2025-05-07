const User = require('../models/user.model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req,res) => {
    try {
        const {username,password,email,role} = req.body;
        const checkExistingUser = await User.findOne({
            $or : [{username},{email}]
        });

        if(checkExistingUser){
            res.status(400).json({
                success : false,
                message: "User already exists with the given usernmae or email"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role : role || "user"
        })

        newUser.save();
        if(newUser){
            res.status(201).json({
                success : true,
                message : "user registered successfully",
                data : newUser
            })
        }else{
            return res.status(400).json({
                success: false,
                message : "unable to register new user"
            })
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message : "internal server error"
        })
    }
}

const loginUser = async (req,res) => {
    try {
        console.log(req.body);
        const {username,password} = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        if(!username){
            res.status(400).json({
                message : "please provide a username"
            })
        }
        const user = await User.findOne({username});
        if(user){
            console.log(password,hashedPassword)
            const comparingPassword = await bcrypt.compare(password,hashedPassword);
            if(!comparingPassword){
                return res.status(400).json({
                    success: false,
                    message : "invalid authentication"
                })
            }
            const userId = user._id;
            const role = user.role;
            const jwtToken = jwt.sign({
                userId,
                username,
                role,
            },'secret',{
                expiresIn: '15m'
            });
            res.status(200).json({
                success: true,
                message : "logged in successfully,",
                loggedIn: user,
                token : jwtToken,
                userinfo : req.userInfo
            })
        }        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message : "internal server error"
        })
    }
}


const getUsers = async (req,res) => {
    try {
        const users = await User.find({}).select('-password'); 
        if(!users || users.length === 0){
            return res.status(400).json({
                success : false,
                message : "no user exists"
            })
        }
        res.status(200).json({
            success : true,
            message : 'fetched users',
            data : users
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message :"Internal server error"
        })
    }
}

const changePassword = async (req,res) => {
    try {
        if(!req.userInfo){
            return res.status(401).json({
                success : false,
                message : "Unauthenticated"
            })
        }
        const {password,newPassword} = req.body;
        const userId = req.userInfo.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
              success: false,
              message: "User not found",
            });
          }
          console.log(password);
          console.log(user.password)

        const checkPassword = await bcrypt.compare(password, user.password);
        console.log("Password comparison result:", checkPassword);
        if(!checkPassword){
            return res.status(400).json({
                success : false,
                message : "Please enter correct old password"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword,salt);

        user.password = newHashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message : "Password changed successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}

module.exports = {registerUser,loginUser,getUsers,changePassword}