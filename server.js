
const dotenv = require("dotenv"); // require package
    dotenv.config(); // Loads the environment variables from .env file
const express = require("express");
const mongoose = require("mongoose"); 
const methodOverride = require("method-override"); // new
const morgan = require("morgan"); //new

const app= express();


mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


const Food = require("./models/food.js");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new

// <----------------------- Routes -------------->
app.get("/", async (req, res) => {
    res.render('index.ejs');
  });
  
// GET /food/new
app.get("/foods/new", (req, res) => {
    res.render('/foods/new.ejs');
});

// POST /foods
app.post("/foods", async (req, res) => {
    if (req.body.isYourFavortie === "on") {
        req.body.isYourFavortie = true;
      } else {
        req.body.isYourFavortie = false;
      }
      await Food.create(req.body);
      res.redirect("/foods"); //redirect to index frutis 
    });


// GET /foods
app.get("/foods", async (req, res) => {
    const allFoods = await Food.find();
    console.log(allFoods);
    res.render("foods/index.ejs", { food: allFoods });
  });

  app.get("/foods/:foodId", async (req, res) => {
    const foundFood = await Food.findById(req.params.fruitId);
    res.render("foods/show.ejs", { fruit: foundFood });
  });
  
  app.delete("/foods/:foodId", async (req, res) => {
    await Food.findByIdAndDelete(req.params.foodId);
    res.redirect("/foods");
  });

  // GET localhost:3000/fruits/:fruitId/edit
app.get("/foods/:foodId/edit", async (req, res) => {
    const foundFood = await Food.findById(req.params.foodId);
    console.log(foundFood);
    res.render("fruits/edit.ejs", {
        fruit: foundFruit,
      });
    });

    // server.js

app.put("/fruits/:fruitId", async (req, res) => {
    // Handle the 'isReadyToEat' checkbox data
    if (req.body.isReadyToEat === "on") {
      req.body.isReadyToEat = true;
    } else {
      req.body.isReadyToEat = false;
    }
    
    // Update the fruit in the database
    await Food.findByIdAndUpdate(req.params.foodId, req.body);
  
    // Redirect to the fruit's show page to see the updates
    res.redirect(`/foods/${req.params.foodId}`);
  });
  

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
