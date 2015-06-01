var mongoose = require("mongoose");
mongoose.connect( process.env.MONGOLAB_URI ||
               process.env.MONGOHQ_URL ||
               "mongodb://localhost/sample_atlas");

module.exports.mongoose = mongoose;
module.exports.User = require("./user");
