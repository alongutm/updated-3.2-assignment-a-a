const express = require("express");
const router = express.Router();
const DBUtils =  require("./utils/DBUtils");
const bcrypt= require("bcrypt");



router.post("/login", async (req, res, next)=>{
    try{
        const users = await DBUtils.execQuery("SELECT username FROM users");
        if(! users.find((x)=> x.username === req.body.username)){
            throw { status: 401, massage: "wrong username or password"};
        }
        // get user from the DB
        const user= (await DBUtils.execQuery(`SELECT * FROM users WHERE username='${req.body.username}'`))[0];
        
        // compare the user's password to the given one
        if(!bcrypt.compare(req.body.password, user.password)){
            throw { status: 401, massage: "wrong username or password"};
        }
        // set user's cookie
        req.session.user_id= user.user_id;
    
        // return coockie
        res.status(200).send({ message: "login succeeded", success: true});
    
    }catch(error){
        next(error);
    }
    });


//Authenticate all incoming requests
router.use((req,res,next)=> {
    if(req.session && req.session.id){
        const id= req.session.id;
        const user= checkIdOnDb(id);

        if(user){
            req.user=user;
            next();
        }
    }
    res.sendStatus(401);
});

router.post("/register", async (req, res, next)=>{
    try{
        // check- paramerters exits
        if(!(req.body.username 
            && req.body.password && req.body.country 
            && req.body.firstName && req.body.lastname && req.body.email)){
                throw { status: 422, massage: "Params are missing"};
            }

        // check if username exists in our DB
        const users = await DBUtils.execQuery("SELECT username FROM users");
        if( users.find((x)=> x.username === req.body.username)){
            throw { status: 409, massage: "username already exists"};
        }

        // encrypt password
        let hash_pass= bcrypt.hashSync(req.body.password, parseInt(process.env.bcrypt_saltRounds));

        // add the new user to our DB
        await DButils.execQuery(
            `INSERT INTO users VALUES 
            (default, '
            ${req.body.username}', '
            ${hash_pass}', ' 
            ${req.body.firstName}','
            ${req.body.lastname}','
            ${req.body.country}', '
            ${req.body.email}')` );

        res.status(201).send({ 
            message: "successful registration, a new user has been added to the system", 
            success: true});

    }catch(error){
        next(error);
    }
});




router.post("/logout",function(req, res){
    req.session.reset(); 
    res.send({ success: true, message: "logout succeeded"});
});

module.exports = router;