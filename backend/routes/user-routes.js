// jshint esversion:6
const express = require('express');
const User = require('../models/user');

const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


// function verifEmail that check  email 
function verifEmail(email) {
    const regExp = /^(([^<>()[\]\\ .,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regExp.test(String(email).toLowerCase());
}


//  B logic to login (search by email && Password)
router.post('/login', async (req, res) => {
    try {
        const { email, pwd } = req.body;
        console.log(email, pwd);
        console.log(req.cookies, 'req.cookies');
    
        // Validation
        if (!email || !pwd) {
          return res.status(400).json({
            errorMessage: " please enter all required fields ",
          });
        }
        const existingUser = await User.findOne({email});
        if (!existingUser) {
            return res.status(401).json({
                errorMessage: " please check email or pwd ",
              });
        }
        console.log( 'existingUser', existingUser);
        const pwdCorrect = await bcrypt.compare( pwd, existingUser.pwd);
        if (!pwdCorrect) {
            return res.status(401).json({
                errorMessage: " please check email or pwd ",
              });
        }
          // sign the token
    
          const token = jwt.sign(
            {
              user: existingUser._id,
            },
            process.env.JWT_SECRET
          );
          console.log("token = ", token);
          // send the token in a HTTP-only cookie
          res
            .cookie("token", token, {
              httpOnly: true,
            //   secure: true,
            //   sameSite: "none",
            })
            .send();
            console.log(req.cookies, 'req.cookies');
            
      } catch (error) {
        console.log(error);
        res.status(500).send();
      }
    // console.log('Here into login', req.body);
    // User.findOne({ email: req.body.email }).then(
    //     (result) => {
    //         if (!result) {
    //             res.status(200).json({
    //                 message: 'Please check Email'
    //             })
    //         } else {
    //             let pwdResult = bcrypt.compare(req.body.pwd, result.pwd);
    //             console.log('pwdResult', pwdResult);
    //             pwdResult.then(
    //                 (status)=> {
    //                     console.log('Here status',status);
    //                     if (status) {  
    //                         User.findOne({ email: req.body.email }).then(
    //                             (finalResult) => {
    //                                 let userToSend = {
    //                                     firstName: finalResult.firstName,
    //                                     lastName: finalResult.lastName,
    //                                     role: finalResult.role
    //                                 }
    //                                 res.status(200).json({
    //                                     message: 'Welcome',
    //                                     user: userToSend
    //                                 });
    //                             });
    //                     } else {
    //                         res.status(200).json({
    //                             message: 'Please check Pwd'
    //                         });
    //                     }
    //                 }
    //             )
    //         }
    //     }
    // )
});


//Business logic : Sign up 
router.post("/signup", async(req, res) => {
    try {
          const { firstName, lastName,email,pwd,role} = req.body;
     console.log(firstName, lastName,email,pwd,role);
        // // Validation
        if (!email || !pwd) {
          console.log(email);  
          return res.status(400).json({
            errorMessage: " please enter all required fields ",
          });
        }
        if (pwd.length < 6) {
          return res.status(400).json({
            errorMessage: " please enter a pwd of atleast 6 charcters",
          });
        }
        console.log(email, pwd);
        // if (pwd !== passwordVerify)
        //   return res.status(400).json({
        //     errorMessage: "Please enter the same password twice.",
        //   });
    
        const existingUser = await User.findOne({ email: email });
        console.log("An account with this email already exist", existingUser);
        if (existingUser) {
          return res.status(400).json({
            errorMessage: " An account with this email already exist",
          });
        }
    
        // hash the password
        // const salt = await bcrypt.genSalt();
        const cryptedPwd = await bcrypt.hash(req.body.pwd, 10);
        console.log(cryptedPwd);
    
        //    save a new user account
      
        const user = new User({
            // firstName:firstName,
            // lastName:lastName,
            // email:email,
            // pwd: cryptedPwd,
            // tel: req.body.tel,
            // role: role
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            pwd: cryptedPwd,
            tel: req.body.tel,
            role: req.body.role
        });

        console.log( 'secret : ', process.env.JWT_SECRET            );
    
        const savedUser = await user.save();
    
        // sign the token
    
        const token = jwt.sign(
          {
            user: savedUser._id,
          },
          process.env.JWT_SECRET
        );
        console.log("token = ", token);
        // send the token in a HTTP-only cookie
        res
          .cookie("token", token, {
            httpOnly: true,
            // secure: true,
            // sameSite: "none",
          
          })
          .send();
        
    
      } catch (error) {
        console.log(error);
        res.status(500).send();
      }

          

//     console.log("Here into Signup", req.body);
//  if(req.body.pwd.length>= 6 && verifEmail(req.body.email) ){

//     bcrypt.hash(req.body.pwd, 10).then(
//         (cryptedPwd) => {
//             console.log(`${req.body.pwd} # ${cryptedPwd}`);
//             const user = new User({
//                 firstName: req.body.firstName,
//                 lastName: req.body.lastName,
//                 email: req.body.email,
//                 pwd: cryptedPwd,
//                 tel: req.body.tel,
//                 role: req.body.role
//             });
//             user.save((err, result) => {
//                 if (err) {
//                     console.log("Error with DB", err.errors.email.properties.message);
//                     res.status(200).json({
//                         message: "email exist",
//                         user: err.errors
//                     });
//                 } else {
//                     res.status(200).json({
//                         message: "User added successfully",
//                         user: result
//                     });
//                 }
//             }
//             )
//         }
//     )
//  } //  end if
//  else{
   
//         res.status(200).json({
//             message: " please check email/pwd",
//       });
//     }
 
});


//  logout
router.get("/logoutt", (req, res) => {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    //   secure: true,
    //   sameSite: "none",
    }).send();
  });

//  loggedIn

  router.get("/loggedIn", (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.json(false);
  
      jwt.verify(token, process.env.JWT_SECRET);
  
      res.send(true);
    } catch (err) {
      res.json(false);
    }
  });

    module.exports = router;