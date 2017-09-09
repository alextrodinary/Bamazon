var mysql = require("mysql");
var inquirer = require("inquirer");

//connection
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Heyhihoe!1",
    database: "bamazon"
})

//initialize connection
connection.connect(function(err){
    if (err) throw err;
    console.log ("works!");

    //collect all data from sql database and print on screen
    makeTable();   
})

var makeTable = function(){
    connection.query("SELECT * FROM products", function (err,response){
        for (var i = 0; i < response.length; i++){
            console.log(response[i].itemid+". " + response[i].productname+" $" + response[i].price+" -- " + response[i].quantity+" Available");

        }
    customerSelection(response);
    })
}

var customerSelection = function (response){
    inquirer.prompt({
        type: "input",
        name: "selection",
        message: "What would you like to buy?" 
    }).then(function(answer){
        var correct = false;
        for(var i = 0; i < response.length; i++){
            if(response[i].productname==answer.choice){
                correct=true;
                var product=answer.choice;
                var id=i;
                inquirer.prompt({
                    type: "input",
                    name: "quantity",
                    message: "How many would you like?",
                    validate: function (value){
                        if(isNaN(value)==false){
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(function(answer){
                    if((reponse[id].quantity-answer.quantity)>0){
                        connection.query("UPDATE prodcuts SET quantity ='" +(response[id].quantity-answer.quantity)+"' WHERE productname = '" + product +"'", function(err, response2){
                            console.log("Going Once....Going Twice...SOLD!!!!")
                            makeTable()
                        })
                    } else {
                        console.log("Please try again");
                        customerSelection(response);
                    }
                })    
            }
        }
    })
}