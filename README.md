# Bamazon
Bamazon is a command line interface app with an Amazon-like storefront that takes in orders from customers and adjusts inventory accordingly.

Bamazon was built using Node.js and MySQL.

--------------------------------------------------

## To run bamazon (after cloning repository and loading packages): 
In the command line, from the "bamazon" folder, just type "node bamazonCustomer.js" (case sensitive), then hit 'Enter'.
> $ node bamazonCustomer.js

When bamazon loads, you will see a list of the current products available. You will be asked to enter the product-id number for the item you wish to purchase, and then you will be asked to enter the quantity.

>  ?  Please enter the item-ID number of the product you would like:

>  ? Please enter the quantity you would like:


Then bamazon will check the inventory levels, to see if your item is in stock. If there is insufficient supply to fill your order, you will be given the option to modify the quantity or to choose another item. 

>  ? Do you want to modify the quantity, choose a different item or quit? 
>    (Use arrow keys)
>    CHANGE-QUANTITY
>    CHANGE-ITEM
>    QUIT

When your order is complete, you will see an order summary that includes a subtotal for your purchase.
----------------------------------------------------

## Required npm packages
These npm packages need to be installed in order to run bamazon:
 mysql / inquirer 

Use these commands to install the packages:
> $ npm install mysql

> $ npm install inquirer


-----------------------------------------------------

## Product Demonstration

Shown below is a link to a video demonstration of Bamazon in action:
