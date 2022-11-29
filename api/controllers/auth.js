import User from '../models/user.js';
import UserVerification from '../models/user-verification.js';
import CryptoJS from 'crypto-js';
import nodemailer from 'nodemailer';

import { v4 } from 'uuid'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  }
})


export const postUser = async (req, res) => {

  const newUser = new User({
    username: req.body.username,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_PHRASE
    ).toString(), //encryt password
    email: req.body.email,
    isAdmin: req.body.isAdmin,
    verified: false
  });

  try {
    //check if email has already being used
    const user = await User.findOne({
      email: req.body.email,
    })
    if (user) {
      res.status(401).json({
        message: 'Email is already in use',
      })
    } else {
      /// save user
      const createdUser = await newUser.save();
      //handle verification
      sendVerificationEmail(createdUser, res);
    }
  } catch (err) {
    res.status(400).json(err);
  };
}



const sendVerificationEmail = async (createdUser, res) => {
  const { _id, email } = createdUser._doc;
  //url to be used in the email
  // const currentUrl = 'http://localhost:3000/'
  const currentUrl = 'https://don-remolo.netlify.app/';

  const uniqueString = v4() + _id;

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: 'Verifiy Your Email',
    html: `<p>Verify your email address to complete the signup and login into your account.</p><p>This link <b>expires in 6 hours</b>.</p> <p>Press <a href =${currentUrl + 'verify/' + _id + '/' + uniqueString}>here</a> to proceed.</p>`
  }

  //encryt uniquestring
  const encryptedUniqueString = CryptoJS.AES.encrypt(
    uniqueString,
    process.env.PASS_PHRASE
  ).toString()

  const userVerification = new UserVerification({
    userId: _id,
    uniqueString: encryptedUniqueString,
    createdAt: Date.now(),
    expiresAt: Date.now() + 21600000
  })

  try {
    await userVerification.save();

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        res.status(401).json({
          message: 'Email verification failed to send',
          err
        })
      } else
        res.status(200).json({
          message: 'Email verification message sent successfully', info
        });

    })


  } catch (err) {
    res.status(401).json({
      message: 'Email verification failed',
      err
    })
  }
}

export const verifyUser = async (req, res) => {
  const { userId, uniqueString } = req.params;

  try {
    const verifyObject = await UserVerification.findOne({
      userId: userId
    })

    

    if (verifyObject) {
      const { expiresAt } = verifyObject;
      //check if userVerification has expired

      if (expiresAt.getHours() > expiresAt.getHours() * 6) {
        //if true delete userVerification and user collection from database
        UserVerification.deleteOne({ userId })
        User.deleteOne({ _id: userId })
        res.status(401).json({
          msg: 'link has expired',
        })
      } else {
        //check if strings match
        const hashedString = CryptoJS.AES.decrypt(
          verifyObject.uniqueString,
          process.env.PASS_PHRASE
        );
        const decryptString = hashedString.toString(CryptoJS.enc.Utf8);

        if (decryptString !== uniqueString && res.status(401).json({msg:'uniqueString does not match the one stored in the database'})) return;

        const user = await User.findOneAndUpdate({ _id: userId }, { verified: true }, { new: true })
        if (!user) {
          res.status(401).json({
            msg: 'Unable to verify user',
          })
        } else {
         await UserVerification.deleteOne({ userId })
          // let { password, ...others } = user._doc;
          res.status(201).json(user._doc);
        }
      }

    }
  } catch (err) {
    res.status(401).json({
      msg: 'User verification failed',
      err
    })
  }
}

export const getUser = async (req, res) => {
  try {
    //find user
    //check if verified
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json({
        msg: 'user not found',
      });
    } else if (!user.verified) {
      res.status(401).json({
        msg: 'user is not verified',
      });

    } else {
      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_PHRASE
      );
      const decryptPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
      //evaluate password
      if (decryptPassword !== req.body.password) {
        res.status(401).json({msg:'password does not match the one stored in the database'});
      } else {
        const accessToken = jwt.sign(
          {
            id: user._id,
            isAdmin: user.isAdmin,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '5d' }
        );

        const { password, ...others } = user._doc; //because of mongodb
        res.status(200).json({ ...others, accessToken });
      }
    }

  } catch (err) {
    res.status(500).json(err)
  }
};


