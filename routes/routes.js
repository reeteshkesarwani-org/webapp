const control = require("../controllers/controller");
const productcontroller = require("../controllers/productcontroller");

module.exports = (app) => {
    app.post("/v1/user", control.createUser);
     app.get("/v1/user/:userid", control.getUser);
     app.get("/v1/healthz", control.health);
     app.put("/v1/user/:userid", control.editUser);
     app.post("/v1/product",productcontroller.createProduct);
     app.get("/v1/product/:productid",productcontroller.getProduct);
     app.put("/v1/product/:productid",productcontroller.updateProduct);
     app.delete("/v1/product/:productid",productcontroller.deleteProduct);
};