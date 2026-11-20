const express = require("express");
function createUserRouter(authenticate) {
  const router = express.Router();
  router.get("/me", authenticate, (req, res) => {
    res.status(200).json({
      success: true,
      message: "Authenticated user profile.",
      data: { user: req.user }
    });
  });
  return router;
}
module.exports = { createUserRouter };
