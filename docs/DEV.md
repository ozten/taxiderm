# Development Notes

## Application Structure

There are two main components to Taxidermy

* node-webkit app
* web server

The nw app displays the welcome screen and is the UI that allows a user to manipulate `.taxidermy` files.

The web server is what powers http://localhost:6666/. It is a Node.js http application. It pumps templates full of fake data from the `.taxidermy` files.