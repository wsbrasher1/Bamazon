//To add in the needed packages for data input and storage//
var inquirer = require("inquirer");
var mysql = require("mysql");

//Setting up the MySQL connection//

var connection = mysql.createConnection({
    host: 'localHost',
    port: 3306,
    user: 'root',
    password: 'kenmore71',
    database: 'bamazon_DB'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.log("========================");
    console.log("   Welcome to Bamazon   ");
    console.log("========================");
    console.log("");
    console.log("View our products below");
    console.log("");

    displayProducts();
});

var itemOneId;
var itemOneQty = 0;
var stockQty = 0;
var itemOrdered = "";
var itemPrice = 0;
var totalPrice = 0;

function displayProducts() {
    console.log("Our current inventory: ");

    connection.query("SELECT * FROM products", function(error, results){
        if (error) throw error;
        console.table(results);
        promptItemSelection();
    });
}

function promptItemSelection() {
    inquirer.prompt([
        {
            name: "itemID",
            type: "input",
            message: "Please enter the Item ID number of the product you would like to purchase: "
        }
    ])
    .then(function(answer1) {
        if(answer1.itemID > 0) {
            console.log("You have selected item: " + answer1.itemID + ".\n");
            itemOneId = answer1.itemID;
            promptItemQty();
        }
        else {
            console.log("You haven't entered a valid item ID number");
            retryItemSelection();
        }
    });
}

function retryItemSelection() {
    inquirer.prompt([
        {
        name: "tryAgain",
        type: "list",
        message: "Do you want to try again or quit?",
        choices: ["Try-ID-Again", "Quit"]
        }
    ])
    .then(function(answer2){
        if(answer2.tryAgain == "Try-ID-Again"){
            promptItemSelection();
        }
        if(answer2.tryAgain == "Quit") {
            console.log("Your transaction is now canceled. Good-bye.");
            connection.end();
        }
    });
}
//Function to prompt users on order quantity//
function promptItemQty() {
    inquirer.prompt([
        {
            name: "quantity",
            type: "number",
            message: "Please enter the quantity you would like to order: "
        }

    ])
    .then(function(answer3){
        if(answer3.quantity > 0){
            console.log("Your quantity is: " + answer3.quantity + ".\n");
            itemOneQty = parseInt(answer3.quantity);
            console.log(
                ">>>Checking inventory...\n");
                inventoryCheck();
        }
        else {
            console.log("\nYou didn't enter a quantity\n");
            retryItemQty();
        }
    });
}

function retryItemQty() {
    inquirer.prompt([
        {
            name: "tryQtyAgain",
            type: "list",
            message: "Would you like to try again or quit?",
            choices: ["Try-Qty-Again", "Quit"]
        }
    ])
    .then(function(answer4){
        if(answer4.tryQtyAgain == "Try-Qty-Again"){
            promptItemQty();
        }
        if(answer4.tryQtyAgain == "Quit") {
            console.log("Your transaction is now canceled. Good-bye.");
            connection.end();
        }
    });
}

//To check the inventory amt in DB//
function inventoryCheck() {
    connection.query("SELECT stock_quantity FROM products WHERE ?", [{item_id : itemOneId}], function(error, quantityResult){
        if(error) throw error;
        stockQty = parseInt(quantityResult[0].stock_quantity);
        if(stockQty == undefined) {
            console.log("Sorry, no items are available with this item ID: " + itemOneId);
        }
        else if(stockQty === 0) {
            console.log("Sorry, but this item is currently out of stock.\n");
            noInventoryOptions();
        }
        else if(stockQty >= itemOneQty) {
            console.log("Your item is in stock!");
            orderProcess();
        }
        else {
            console.log(`
    \n================================
    \nOur apologies! Our inventory is
    \ntoo low to fulfill your order.
    \nTotal available is: ${stockQty}.
    \n================================`);
            inventoryOptions();
        }
    });
}

function inventoryOptions() {
    inquirer.prompt([
        {
        type: "list",
        message: "Do you want to modify the quantity, choose a different item or quit?",
        choices: ["CHANGE-QUANTITY", "CHANGE-ITEM", "QUIT"],
        name: "retryOptions"
        }
    ])
    .then(function(answer5) {
        if (answer5.retryOptions == "CHANGE-QUANTITY") {
            console.log(">>>>>>>>>>>>");
            promptItemQuantity(); 
        }
        if (answer5.retryOptions == "CHANGE-ITEM") {
            console.log(">>>>>>>>>>>>");
            displayProducts(); 
        }
        if (answer5.retryOptions == "QUIT") {
            console.log("Your transaction is now canceled. Good-bye.");
            connection.end();
        }
    });
}

//To provide customer options if the item is out of stock
function noInventoryOptions() {
    inquirer.prompt([
        {
        type: "list",
        message: "Do you want to choose a new item or quit?",
        choices: ["NEW-ITEM", "QUIT"],
        name: "startAgain"
        }
    ])
    .then(function(answer6) {
        if (answer6.startAgain == "NEW-ITEM") {
          displayProducts(); 
        }
        if (answer6.startAgain == "QUIT") {
          console.log("Thank you. Good-bye!");
          connection.end();
        }
    });
}

function orderProcess() {

    console.log("\n======ORDER SUMMARY======")

    connection.query("SELECT product_name FROM products WHERE ?", [{item_id : itemOneId}], function(error, itemName){
        if(error) throw error;
        //console.log(itemName);
        itemOrdered = itemName[0].product_name;
        console.log("Item ordered: " + itemOrdered);
    });
    connection.query("SELECT price FROM products WHERE ?", [{item_id : itemOneId}], function(error, priceResult){
        if(error) throw error;
        //console.log(priceResult)
        itemPrice = priceResult[0].price;
        console.log("Item price: " + itemPrice.toFixed(2));
        console.log("Quantity ordered: " + itemOneQty);

        totalPrice = itemPrice * itemOneQty;
        console.log("ORDER SUBTOTAL: " + totalPrice.toFixed(2));

        dbQuantityUpdate();
    });
}

//after order is complete, update the quantity in the database
function dbQuantityUpdate() {   
    var newStockQuantity;

    connection.query("SELECT stock_quantity FROM products WHERE ?", [{item_id : itemOneId}], function(error, quantityResult){
        if(error) throw error;
        stockQty = parseInt(quantityResult[0].stock_quantity);
        newStockQuantity = stockQty - itemOneQty;
        //console.log(newStockQuantity);
        connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newStockQuantity}, {item_id: itemOneId}], function(err, res) {
            connection.query("SELECT stock_quantity FROM products WHERE ?", [{item_id : itemOneId}], function(error, quantityResult){
                console.log("\n\n\nUpdated quantity for this item in database: " + quantityResult[0].stock_quantity);
                connection.end();

            });  
        });
    });

}
