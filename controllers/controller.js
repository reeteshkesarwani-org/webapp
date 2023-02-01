var userService = require("../services/services");
var bcrypt = require('bcrypt');
var config = require("../config")
var mysql = require("mysql");
const { response } = require("express");




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
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var username = req.body.username;
    var password = req.body.password;
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
            return res.status(400).send({ message: "Enter Valid first_Name or last_name" });
        }

        if (validateEmail(username)) {
            val_Username = true;
        }
        else {
            val_Username = false;
            return res.status(400).send({ message: "Enter Valid UserName" });
        }

        if (validatePassword(password)) {
            val_Password = true;
        }
        else {
            val_Password = false;
            return res.status(400).send({ message: "Enter Valid Password(Minimum 6 chars along with 1 special char)." });
        }
        if (valfirst_Name && vallast_Name && val_Username && val_Password) {
            console.log("before query");
            config.query('SELECT count(*) as cnt FROM users WHERE username = ?', [username], async (err, response) => {
                if (response[0].cnt != 0) {
                    return res.status(400).json('bad request email already present');
                }
                else {
                    config.query('insert into users values(null,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)', [username, first_name, last_name, hashedPassword], (err, result) => {
                        if (err) {
                            throw err;
                        }
                        else{
                            config.query('SELECT * FROM users WHERE username = ?', [username], async (err, response) => {
                                delete response[0].password;
                                return res.status(201).json(response[0]);
                            });
                        }
                    })
                }

            });


        }
    }
    catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }



};

exports.getUser = async function (req, res) {
    const auth = req.headers.authorization;
    if (!auth || auth.indexOf('Basic ') === -1) return res.status(403).json("Forbidden Request")
    const base64Credentials = auth.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    if (!username || !password) {
        return res.status(403).json("Invalid Authentication Details");
    }

    config.query('select * from users where username=?', [username], async (err, result) => {
       
       
        if (err) {
            return res.status(400).json('Invalid Authentication Details');

        }

        console.log(req.params.userid);
        console.log(result[0].id);
        let passcheck = false;

        let pass = result[0].password;

        //console.log(await bcrypt.compare(password, pass));
        if (await bcrypt.compare(password, pass)) {
            passcheck = true;
        }
        console.log(passcheck);

        if (req.params.userid != result[0].id) {
            return res.status(403).json("Invalid Authentication Details");
        }
        if (passcheck == false) {
            return res.status(401).json('Invalid Credentials');
        }
        else {
            delete result[0].password;
            return res.status(200).json(result);
        }
    })
};



exports.editUser = async function (req, res) {
    console.log('hello from edit user');
    const auth = req.headers.authorization;
    if (!auth || auth.indexOf('Basic ') === -1) return res.status(403).json("Forbidden Request")
    const base64Credentials = auth.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    if (!username || !password) {
        return res.status(403).json("Invalid Authentication Details");
    }

    config.query('select * from users where username=?', [username], async (err, result) => {

        console.log(req.params.userid);
        //console.log(result[0].id);
        let passcheck = false;
        let updated_first_Name = req.body.first_name;
        let updated_last_Name = req.body.last_name;
        let updated_password = req.body.password;
        let updated_username = req.body.username;

        let pass = result[0].password;

        //console.log(await bcrypt.compare(password, pass));
        if (!updated_first_Name || !updated_last_Name || !updated_password || !updated_username) {
            return res.status(403).json("partial content provided ,please provide value for first_name,last_name,password and username");
        }
        if (updated_username != result[0].username) {
            return res.status(401).json("invalid username provided, we can't update the value for username");
        }
        if (await bcrypt.compare(password, pass)) {
            passcheck = true;
        }
        console.log(passcheck);

        if (req.params.userid != result[0].id) {
            return res.status(403).json("Invalid Authentication Details");
        }
        if (err) {
            console.log(err);
            return res.status(400).json('Invalid Authentication Details');

        }
        if (passcheck == false) {
            return res.status(401).json('Invalid Credentials');
        }
        else {

            var hashedPassword = await bcrypt.hash(updated_password, 10);
            console.log(pass);
            console.log(hashedPassword);
            console.log(updated_password);
            console.log("just before the update user service in the controller");
            /*config.query('UPDATE users SET values(null,?,?,?,?,?,CURRENT_TIMESTAMP) WHERE username = ?',[updatedemail,updatedfirstNamestr,updatedlastnamestr,hashedPassword,result[0].created_on,updatedemail],(error,result)=>{*/
            config.query('UPDATE users SET first_name = ?,last_name = ?,password = ?,account_updated  = CURRENT_TIMESTAMP WHERE username = ?', [updated_first_Name, updated_last_Name, hashedPassword, updated_username], (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(400).json("Error creating user in Database.");
                }
                else {
                    return res.status(204).json("Updated.");

                }
            });
            // if(await (updatedfirstNamestr!=result[0].firstname) || await (updatedlastnamestr!=result[0].lastname))
            // {
            //    return userService.UpdateFirstNameLastName(updatedfirstNamestr,updatedlastnamestr,result[0].email);
            // }

        }
        //return user;
    })
}

exports.health = async function (req, res) {
    return res.status(200).json("server is healthy ");
}



