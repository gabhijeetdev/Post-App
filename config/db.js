const mongoose = require("mongoose");
console.log(process.env.DB_URL);
const connectwithDb = () => {
  mongoose
    .connect("mongodb+srv://gabhijeet0909:ZuEpaWn5zw3NJlSl@cluster0.jj7ev0i.mongodb.net/?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("DB GOT CONNECTED"))
    .catch((error) => {
      console.log(`DB CONNECTION ISSUE`);
      console.log(error);
      process.exit(1);
    });
};

module.exports = connectwithDb;