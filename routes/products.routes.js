const router = require("express").Router();
const upload = require('../config/multer');
const productController = require("../controllers/productControllers");

router.get("/", productController.getAllProduct);
router.get("/:id", productController.getProduct);
router.get("/search/:key", productController.searchProduct);
router.post("/", upload.single('imageUrl'), productController.createProduct);
router.delete("/:id", productController.deleteProduct); // Nueva ruta para eliminar producto

module.exports = router;
