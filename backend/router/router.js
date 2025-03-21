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
const Chat = require('../scheama/messages');
const Messages = require('../scheama/messages');
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
    const { email } = req.body
    const regexPattern = new RegExp(email, 'i');

    const similarUsers = await Users.find({
        $or: [
            { email: { $regex: regexPattern } },
            { phone: { $regex: regexPattern } }
        ]
    });
    res.status(200).send(similarUsers)
})

router.get('/getmessages/users/:user', checkauth, async (req, res) => {
    const { user } = req.params;
    const recievermail = user;
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); 
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Content-Encoding', 'none');
    const sendMessages = async () => {
        try {
            const messages = await Messages.find({
                $or: [
                    { sender: req.user.email, receiver: recievermail },
                    { sender: recievermail, receiver: req.user.email }
                ]
            }).sort({ createdAt: 1 }); 
            messages.forEach((message) => {
                res.write(`data: ${JSON.stringify(message)}\n\n`);
            });
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };
    setInterval(sendMessages,1000)
});
router.get('/getchats', checkauth, async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); 
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Content-Encoding', 'none');
    const getchats = async () => {
        try {
            const chats = await Users.findOne({
                email:req.user.email
            })
            // res.write(`data: ${JSON.stringify(chats)}\n\n`);
            chats.chats.forEach( async(wmessage) => {
                try {
                    const getcd = await Users.findOne({email:wmessage}).select('-chats')
                    if(getcd){
                        res.write(`data: ${JSON.stringify(getcd)}\n\n`);

                    }
                    else{
                        console.log()
                res.write(`data: ${JSON.stringify('something went wrong')}\n\n`);

                    }
                } catch (error) {
                    console.log(error)
                }
            });
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };
    setInterval(getchats,2000)
});
// router.get('/getmessages/users/:user', checkauth, async (req, res) => {
//     const { user } = req.params;
//     const recievermail = user;

//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); 
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');
//     res.setHeader('Content-Encoding', 'none');

//     const changeStream = Messages.watch([
//         { 
//             $match: {
//                 $or: [
//                     { sender: req.user.email, receiver: recievermail },
//                     { sender: recievermail, receiver: req.user.email }
//                 ]
//             }
//         }
//     ]);

//     changeStream.on('change', (change) => {
//         if (change.operationType === 'insert') {
//             res.write(`data: ${JSON.stringify(change.fullDocument)}\n\n`);
//         }
//     });

//     req.on('close', () => {
//         changeStream.close();
//         console.log('Client disconnected, change stream closed.');
//     });
// });


router.post('/publishmessage', checkauth, async (req, res) => {
    const { message, usermail } = req.body
    console.log('request')
    const recievermail = usermail
    const isvalidreciever = await Users.findOne({ email: recievermail })
    if (isvalidreciever) {

        try {
            const user = await Users.findOne({ email: req.user.email })
            if (user) {
                const isInsChats = user.chats.includes(recievermail);
                const isInrchats = isvalidreciever.chats.includes(req.user.email)
                if (isInsChats) {
                }
                else {
                    user.chats.push(recievermail);
                    await user.save()
                }
                if (isInrchats) {
                }
                else {
                    isvalidreciever.chats.push(req.user.email);
                    await isvalidreciever.save()
                }
                const now = new Date();
                const date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear().toString().slice(-2)}`;
                const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                const publishmessage = new Messages({ message, sender: req.user.email, receiver: isvalidreciever.email,date,time})
                const savemessage = await publishmessage.save()
                if(savemessage){
                    res.status(200).send('message sent')
                }
                else{
                    res.status(204).send('something went wrong')
                }
            }

        } catch (error) {
            console.log(error)
        }
    } else {
        res.status(400).send('no valid reciever')
    }
})












module.exports = router;
