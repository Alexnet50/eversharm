import express from 'express';
require("dotenv").config();

const app = express()

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.use(express.static(__dirname + '/'));
app.listen(port, () => {
  console.log(`Server is running on the port ${port}.`);
});