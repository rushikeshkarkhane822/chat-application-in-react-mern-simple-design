const express = require('express');
const router = express.Router();
const multer = require('multer');
const cors = require('cors');
const bodyparser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieparser = require('cookie-parser')
//scheamas
const checkauth = require('../middleware/verifylogin');
const Users = require('../scheama/register')
const Chat = require('../scheama/messages')
//scheamas
router.use(cookieparser())
router.use(cors({ origin: 'http://localhost:5173', credentials: true }));
router.options("*", cors({ origin: 'http://localhost:5173', credentials: true }));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        const generatedname = `${Date.now()}` + file.originalname
        cb(null, generatedname)
        req.uploadedfilename = generatedname
    }

})
function handlemultererror(err, req, res, next) {
    if (multer.MulterError) {
        res.status(500).json('file uplaoding error' + err.message)
    }
    else {
        next()
    }
}
const upload = multer({
    storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true)
        } else if (file.size > 10 * 1024 * 1024) {
            cb(new Error('file should be less than 10 mb'), false)

        } else {
            cb(null, true)
        }
    }
})

router.post('/register', upload.single('photo'), handlemultererror, async (req, res, next) => {
    const { name, photo, email, phone, password, cpassword } = req.body
    if (!req.file) {
        res.status(400).send('no profile photo provided')
    }
    else {
        if (password !== cpassword) {
            return res.status(400).send("Passwords do not match");
        } else {
            try {
                const checkuserexist = await Users.findOne({ email })
                const checkuserephonexist = await Users.findOne({ phone })
                if (checkuserexist) {
                    res.status(200).send("user with this email already exists")
                } else if (checkuserephonexist) {
                    res.status(200).send("user with this phone already exists")
                }
                else {
                    const userregister = new Users({ name, filename: req.uploadedfilename, email, phone, password })
                    const registeruser = await userregister.save()
                    if (registeruser) {
                        res.status(200).send("user Registered Sucessfully")
                    } else {
                        res.status(200).send("user Registration failed due to unexpected error")
                    }
                }
            } catch (error) {
                res.send(error)
                console.log(error)
            }
        }
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const userexist = await Users.findOne({ email: email })
    if (userexist) {
        const verifypassword = await bcrypt.compare(password, userexist.password)
        if (verifypassword) {
            const jwttoken = await jwt.sign({ _id: userexist._id }, process.env.JWT_SECRET)
            res.cookie('jwt', jwttoken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            })
            if (userexist) {
                res.status(200).send({ message: 'login sucess', user: userexist })
            } else {
                res.status(400).send('something went wrong')
            }

        } else {
            res.status(200).send('password wrong')

        }
    } else {
        res.status(200).send('email not registered please signup')
    }
});
router.post('/checklogin', checkauth, (req, res) => {
    res.status(200).send(req.user)
})
router.post('/addchat', checkauth, async (req, res) => {
    const { phone } = req.body
    const user = await Users.findOne({ phone })
    if (user) {
        res.send(user)
    }
    else {
        res.send('user with this number not registered')
    }
})
router.post('/publishmessage', checkauth, async (req, res) => {
    const { message, usermail } = req.body
      console.log(message + usermail)
        const time = new Date().toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
        const date = `${new Date().getDate().toString().padStart(2, '0')}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${new Date().getFullYear()}`;
        const mssave = new Chat({ message, sender: req.user.email, reciever: usermail, time, date })
        const publishmessage = await mssave.save()
        if(publishmessage){
            console.log('message sent')
            res.send('message sended')
        }
        else{
            console.log('message not sent')
            res.send('message sending failed try again later')

        }
})

router.post('/getmessages', checkauth, async (req, res) => {
    const { usermail } = req.body;
    try {
        const messages = await Chat.find({
            $or: [
                { sender: req.user.email, reciever: usermail },
                { sender: usermail, reciever: req.user.email }
            ]
        }).sort({ createdAt: 1 }); 
        res.status(200).send(messages);
    } catch (error) {
        res.status(500).send('Error retrieving messages');
    }
});
router.post('/getchats', checkauth, async (req, res) => {
    console.log('Request to get chats received');
    try {
        const messages = await Chat.aggregate([
            {
                $match: {
                    $or: [
                        { sender: req.user.email },
                        { reciever: req.user.email }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users',   
                    localField: 'sender',  
                    foreignField: 'email',  
                    as: 'senderDetails'   
                }
            },
            {
                $lookup: {
                    from: 'users',   
                    localField: 'reciever',  
                    foreignField: 'email',  
                    as: 'recieverDetails'   
                }
            },
            {
                $unwind: {
                    path: '$senderDetails',
                    preserveNullAndEmptyArrays: true 
                }
            },
            {
                $sort: { createdAt: 1 } 
            }
        ]);

        res.status(200).send(messages);
        console.log('Messages sent successfully', messages);
        
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).send('Error retrieving messages');
    }
});




module.exports = router;
