var userService = require("../services/services");
var bcrypt = require('bcrypt');
var mysql = require("mysql");
var db = require("../configuration/sequelize")
const { response } = require("express");
const logger = require("../logger");
const SDC = require('statsd-client');
const sdc = new SDC({
    host: "localhost",
    port: 8125
});



// Validate Name
const validateName = (name) => {
    const namepattern = /^[a-zA-Z\s]+$/;
    if (name.match(namepattern)) {
        return (true)
    }

    return (false)
}

// Validate Email
const validateEmail = (email) => {
    const emailpattern = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$/;
    if (email.match(emailpattern)) {
        return (true)
    }

    return (false)
}

// Validate Password
const validatePassword = (password) => {
    const passpattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;;
    if (password.match(passpattern)) {
        return true;
    } else {
        return false;
    }
}

exports.createUser = async function (req, res) {
    sdc.increment('create/user');
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var username = req.body.username;
    var password = req.body.password;
    if(!first_name || !last_name || !username || !password)
    {

        logger.error("data is incomplete please provide value for first_name,last_name,password and username");
        return res.status(206).send({message: "data is incomplete please provide value for first_name,last_name,password and username"})

    }
    var hashedPassword = await bcrypt.hash(req.body.password, 10);
    try {
        // console.log("under try function");
        let valfirst_Name = false;
        let vallast_Name = false;
        let val_Username = false;
        let val_Password = false;
        if (validateName(first_name) && validateName(last_name)) {
            valfirst_Name = true;
            vallast_Name = true;
        }
        else {
            valfirst_Name = false;
            vallast_Name = false;
            logger.error("Enter Valid first_Name or last_name");
            return res.status(400).send({ message: "Enter Valid first_Name or last_name" });
        }

        if (validateEmail(username)) {
            val_Username = true;
        }
        else {
            val_Username = false;
            logger.error("Enter Valid UserName");
            return res.status(400).send({ message: "Enter Valid UserName" });
        }

        if (validatePassword(password)) {
            val_Password = true;
        }
        else {
            val_Password = false;
            logger.error("Enter Valid Password(Minimum 6 chars along with 1 special char).");
            return res.status(400).send({ message: "Enter Valid Password(Minimum 6 chars along with 1 special char)." });
        }
        if (valfirst_Name && vallast_Name && val_Username && val_Password) {
            console.log("before query");
            const p1 = await db.user.findOne({ where: { username: req.body.username } });
            if (p1 === null) {
                //var hashedPassword = await bcrypt.hash(req.body.password, 10);
            if(Object.keys(req.body).length>4)
            {
                logger.error("Extra field value provided ,please provide value for first_name,last_name,password and username");
                return res.status(403).json("Extra field value provided ,please provide value for first_name,last_name,password and username");
            }
            const user1 = await db.user.build(
                {
                    first_name: first_name,
                    last_name: last_name,
                    password: hashedPassword,
                    username: username,
                });
                await user1.save();
                const jsonvalue1=user1.toJSON();
                delete jsonvalue1.password;
                logger.info(jsonvalue1);
                return res.status(200).json(jsonvalue1);
            }
            else {
                return res.status(400).json("already present its a bad request");
            }
        }
    }
    catch (e) {
        console.log("reachedhere in error");
        logger.error(e);
        return res.status(400).json({ status: 400, message: e.message });
    }



};

exports.getUser = async function (req, res) {
    sdc.increment('get/user');
    const auth = req.headers.authorization;
    if (!auth || auth.indexOf('Basic ') === -1) return res.status(403).json("Forbidden Request")
    const base64Credentials = auth.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [usernamegetting, passwordgetting] = credentials.split(':');
    if (!usernamegetting || !passwordgetting) {
        logger.error("Invalid Authentication Details");
        return res.status(403).json("Invalid Authentication Details");
    }


    const usr= await db.user.findOne({ where: { username: usernamegetting} })
   // console.log(usr);
    if(usr===null)
    {
        logger.error("Invalid Authentication Details");
        return res.status(401).json('Invalid Authentication Details');
    }
    else
   {
        let passcheck = false;
        const passwordstoreduser=usr.password;
       // var hashedPassword = await bcrypt.hash(passwordstoreduser, 10);
        if (await bcrypt.compare(passwordgetting,passwordstoreduser)) {
            passcheck = true;
        }
        if(req.params.userid != usr.id)
        {
            logger.error("Invalid ID Details");
            return res.status(401).json("Invalid ID Details");
        }
        if (passcheck == false) {
            logger.error("Invalid ID Details");
            return res.status(401).json('Invalid Credentials');
        }
        else {
            
            const jsonvalue=usr.toJSON();
            delete jsonvalue.password;
            logger.info(jsonvalue);
            return res.status(200).json(jsonvalue);
        }

   }
};



exports.editUser = async function (req, res) {
    sdc.increment('edit/user');
    const auth = req.headers.authorization;
    if (!auth || auth.indexOf('Basic ') === -1) return res.status(403).json("Forbidden Request")
    const base64Credentials = auth.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [usernamegetting, passwordgetting] = credentials.split(':');
    if (!usernamegetting || !passwordgetting) {
        logger.error("Invalid Authentication Details");
        return res.status(403).json("Invalid Authentication Details");
    }
    const usr= await db.user.findOne({ where: { username: usernamegetting} })
    if(usr===null)
    {
        logger.error("Invalid Authentication Details");
        return res.status(401).json('Invalid Authentication Details');
    }
    else
   {
        let passcheck = false;
        const passwordstoreduser=usr.password;
       // var hashedPassword = await bcrypt.hash(passwordstoreduser, 10);
      
        if (await bcrypt.compare(passwordgetting,passwordstoreduser)) {
            passcheck = true;
        }
        if(req.params.userid != usr.id)
        {
            logger.error("Invalid ID Details");
            return res.status(401).json("Invalid ID Details");
        }
        if (passcheck == false) {
            logger.error("Invalid Credentials");
            return res.status(401).json('Invalid Credentials');
        }

        let updated_first_Name = req.body.first_name;
        let updated_last_Name = req.body.last_name;
        let updated_password = req.body.password;
        let updated_username = req.body.username;
        if (!updated_first_Name || !updated_last_Name || !updated_password || !updated_username) {
            logger.error("partial content provided ,please provide value for first_name,last_name,password and username");
            return res.status(206).json("partial content provided ,please provide value for first_name,last_name,password and username");
        }


        //console.log(await bcrypt.compare(password, pass));
       
        if(Object.keys(req.body).length>4)
        {
            logger.error("Extra field value provided ,please provide value for first_name,last_name,password and username");
            return res.status(400).json("Extra field value provided ,please provide value for first_name,last_name,password and username");
        }
        if(updated_username!=usr.username)
        {
            logger.error("we can't update the username for the user");
            return res.status(403).json("we can't update the username for the user");

        }
        else {

            var hashedPassword = await bcrypt.hash(updated_password, 10);
            await usr.update({
                        first_name: updated_first_Name,
                        last_name: updated_last_Name,
                        password: hashedPassword,
            })
            logger.info("value got updated for the user");
            return res.status(204).json("value got updated for the user")
              }
        }
     
}


exports.health = async function (req, res) {
    sdc.increment('healthz');
    logger.info("server is healthy");
    return res.status(200).json("server is healthy ");
}


