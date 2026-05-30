// const app=require("./app");
// const PORT =5000;
// app.listen(PORT, function(){
//     console.log("App port @5000");
// });
const app = require("./app");
const PORT = process.env.PORT || 5000;
app.listen(PORT, function(){
    console.log("App port @" + PORT);
});