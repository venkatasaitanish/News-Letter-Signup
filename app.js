const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res){
    res.sendFile(__dirname + "/views/signup.html");
});

app.post("/", function(req,res){
    const email = req.body.email;
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    //console.log(email, firstName, lastName);

    const data  = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME : firstName,
                    LNAME : lastName,
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);
    const audienceId = process.env.AUDIENCE_ID;
    const apiKey = process.env.API_KEY;

    axios({
        method: "post",
        url: `https://us5.api.mailchimp.com/3.0/lists/${audienceId}`,
        auth: {
            username: "venkatasaitanish",
            password: `${apiKey}`
        },
        data: jsonData
    })
    .then(function(response) {
        console.log(response.status);
        if(response.status===200){
            res.sendFile(__dirname + "/views/success.html");
        }
        else{
            res.sendFile(__dirname + "/views/failure.html");
        }
    })
    .catch(function(error) {
        res.sendFile(__dirname + "/views/failure.html");
    });
});

app.post("/failure", function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000.");
});
