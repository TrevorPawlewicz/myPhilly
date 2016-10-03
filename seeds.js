var mongoose   = require("mongoose");
var Bar        = require("./models/bar.js");
var Comment    = require("./models/comment.js");

var data = [
    {
        name: "Dive Bar",
        image: "http://philadelphia.cities2night.com/public/article_images/129.jpg",
        description: "Constituam consectetuer nec te. Quas appetere pericula ea cum, ea vis rebum soleat omnesque.",
        cost: "$",
        rating: "5"
    },
    {
        name: "Bigfoot Lodge",
        image: "http://www.imaginelifestyles.com/luxuryliving/wp-content/uploads/blog/files/u2/PetesSake.jpg",
        description: "Pri labitur nusquam no, usu ludus nobis utinam an. Vim id iudico temporibus, eum democritum moderatius id.",
        cost: "$$$$",
        rating: "7"
    },
    {
        name: "Paddy's Pub",
        image: "http://www.sitcomsonline.com/photopost/data/1315/its-always-sunny-in-philadelphia-paddy.jpg",
        description: "Constituam consectetuer nec te. Quas appetere pericula ea cum, ea vis rebum soleat omnesque.Pri labitur nusquam no, usu ludus nobis utinam an. Vim id iudico temporibus, eum democritum moderatius id.",
        cost: "$$",
        rating: "10"
    }
];

function seedDB() {
    // clear ALL data from DB
    Bar.remove({}, function(err){
        if (err) {
            console.log(err);
        }
        console.log("=====> Removed ALL Bars!");

        // add a few bars:
        data.forEach(function(seed){
            Bar.create(seed, function(err, bar){
                if (err) {
                    console.log(err);
                } else {
                    console.log("====> Added a Bar!");

                    // add some comments:
                    Comment.create(
                        {
                            text: "You don't have to go home but you an't slepp here.",
                            author: "Yo Mama"
                        }, function(err, comment){
                            if (err) {
                                console.log(err);
                            } else {
                                bar.comments.push(comment);
                                bar.save();
                                console.log("====> Created new comment!");
                            }
                    });
                }
            });
        });
    });
};


// EXPORT module:
module.exports = seedDB;
