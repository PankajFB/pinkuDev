const express = require('express');
const app = express();
const user = require('./user.json');
const port = 3000;
const {connectToMongoDB} = require('./DB/dbConfig');
const User = require('./Models/User');


// connecting the db
connectToMongoDB()

app.use(express.json());



app.post("/user", async (req,res)=> {

    try {
        console.log(req.body);

    const {name, email, password} = req.body;


    // chck if the name email and the password are in the body
    if(!name || !email || !password) {
        return res.json({
            msg : "Please enter all the fields"
        })
    }

    // check if the email already exist in the db
    const user = await User.findOne({ email: email})

    if (user) {
        return res.json({
            msg : "This email already exists in the db"
        })
    }

    // make a new user in the DB
    const newUser = new User({
        name: name,
        email: email,
        password: password
    });

    // save the new user in the DB
    await newUser.save();

    res.json({
        msg : "new user created successfully"
    })
    } catch (error) {
        res.status(404).send({
            msg : "Internal server error"
        })
    }
});


app.post("/login", async (req, res) => {
    try {

        const {email, password} = req.body;

        // check if u are getiting the email and passord from the client or not
        if(!email || !password) {
            return res.json({
                msg : "Please enter all the fields"
            })
        }

        // check if the email is in the db or not
        const user = await User.findOne({ email: email});

        // check if there is user or not
        if(!user) {
            return res.json({
                msg : "User not found"
            })
        }

        // check if the password is correct or not
        const isMatch = await user.comparePassword(password)

        if(!isMatch) {
            return res.json({
                msg : "Wrong password"
            })
        }

        res.json({
            data : user,
            msg : "User logged in successfully"
        })

    } catch (error) {
        
    }
})



// to get all the users in the db
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();

        // of users are there or not
        if(!users) {
            return res.json({
                msg : "No users found"
            })
        }

        res.json({
            data : users,
            msg : "All users fetched successfully"
        })
    } catch (error) {
        res.json({
            msg : "Internal server error",
            error : error
        })
    }
})

app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`);
})