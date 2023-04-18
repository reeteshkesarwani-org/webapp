const control = require("../controllers/controller");
const productcontroller = require("../controllers/productcontroller");
const imagecontroller=require("../controllers/imageController");
const upload=require("../upload");

module.exports = (app) => {
    app.post("/v2/user", control.createUser);
     app.get("/v2/user/:userid", control.getUser);
     app.get("/healthz", control.health);
     app.put("/v2/user/:userid", control.editUser);
     app.post("/v2/product",productcontroller.createProduct);
     app.get("/v2/product/:productid",productcontroller.getProduct);
     app.put("/v2/product/:productid",productcontroller.updateProduct);
     app.patch("/v2/product/:productid",productcontroller.patchProduct);
     app.delete("/v2/product/:productid",productcontroller.deleteProduct);
     app.post("/v2/product/:productid/image" ,upload.single("image"),imagecontroller.addImage);
     app.get("/v2/product/:productid/image" ,imagecontroller.getAllImages);
     app.get("/v2/product/:productid/image/:imageid" ,imagecontroller.getImage);
     app.delete("/v2/product/:productid/image/:imageid" ,imagecontroller.deleteImage);
};
