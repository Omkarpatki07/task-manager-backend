const router = require("express").Router();
const { signup, login,refreshToken, forgotPassword} = require("../controllers/auth.controller");

router.post("/signup", signup);
router.post("/login", login);

router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
module.exports = router;
