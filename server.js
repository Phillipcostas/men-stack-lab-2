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


// <---------------------- middleware - routes -------------------------->

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new

//<----------------------- Get - routes --------------------------------->


app.get("/", async (req, res) => {
    res.render('index.ejs');
  });

  app.get("/foods", async (req, res) => {
    const allFood = await Food.find();
    console.log(allFood)
    res.render('foods/index.ejs', { food: allFood });
  });

  app.get('/foods/new', (req, res) => {
    res.render('foods/new.ejs');
})

// POST /foods
app.post("/foods", async (req, res) => {
  if (req.body.isYourFavortie === "on") {
    req.body.isYourFavortie = true;
  } else {
    req.body.isYourFavortie = false;
  }
  await Food.create(req.body);
  res.redirect("/foods");
});

app.get("/foods/:foodId", async (req, res) => {
  const foundFood = await Food.findById(req.params.foodId);
  res.render('foods/show.ejs', { food: foundFood });
});


app.get('/foods/:foodId/edit', async(req, res) => {
  const foundFood = await Food.findById(req.params.foodId)
  console.log(foundFood);
  res.render("foods/edit.ejs", { food: foundFood })
})
//<--------------------- Edit / Delete - Route ------------------------->

app.put("/foods/:foodId", async (req, res) => {
  if (req.body.isYourFavortie === "on") {
    req.body.isYourFavortie = true;
  } else {
    req.body.isYourFavortie = false;
  }
  await Food.findByIdAndUpdate(req.params.foodId, req.body);

  res.redirect(`/foods/${req.params.foodId}`);
});

app.delete("/foods/:foodId", async (req, res) => {
  await Food.findByIdAndDelete(req.params.foodId);
  res.redirect('/foods');
});

//<--------------------- Listening - Route --------------------------->
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
















// // // GET /food/new
// // app.get("foods/new", (req, res) => {
// //   res.render('/foods/new.ejs');
// // });

//   // app.get ('foods', (req, res) => {
//   //   res.render('/foods/allfood.ejs');
//   // })


// // GET /foods
// app.get("/foods", async (req, res) => {
//     const allFoods = await Food.find();
//     console.log(allFoods);
//     res.render("foods/allfood.ejs", { food: allFoods });
//   });

//   app.get("/foods/:foodId", async (req, res) => {
//     const foundFood = await Food.findById(req.params.fruitId);
//     res.render("foods/edit.ejs", { food: foundFood });
//   });

//   // GET localhost:3000/fruits/:fruitId/edit
//   app.get("/foods/:foodId/edit", async (req, res) => {
//     const foundFood = await Food.findById(req.params.foodId);
//     console.log(foundFood);
//     res.render("foods/edit.ejs", {
//         fruit: foundFood,
//       });
//     });


//   // POST /foods
// app.post("/foods", async (req, res) => {
//   if (req.body.isYourFavortie === "on") {
//       req.body.isYourFavortie = true;
//     } else {
//       req.body.isYourFavortie = false;
//     }
//     await Food.create(req.body);
//     res.redirect("/foods"); //redirect to index foods
//   });

//   app.put("/foods/:foodId", async (req, res) => {
//     // Handle the 'isReadyToEat' checkbox data
//     if (req.body.isYourFavortie === "on") {
//       req.body.isYourFavortie = true;
//     } else {
//       req.body.isYourFavortie = false;
//     }
    
//     // Update the food in the database
//     await Food.findByIdAndUpdate(req.params.foodId, req.body);
  
//     // Redirect to the food show page to see the updates
//     res.redirect(`/foods/${req.params.foodId}`);
//   });



//   app.delete("/foods/:foodId", async (req, res) => {
//     await Food.findByIdAndDelete(req.params.foodId);
//     res.redirect("/foods");
//   });




// app.listen(3000, () => {
//   console.log("Listening on port 3000");
// });
