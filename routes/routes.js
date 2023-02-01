const control = require("../controllers/controller");
module.exports = (app) => {
    app.post("/v1/user", control.createUser);
     app.get("/v1/user/:userid", control.getUser);
     app.get("/v1/healthz", control.health);
     app.put("/v1/user/:userid", control.editUser);
};