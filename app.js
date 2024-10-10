const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const bannerRoutes = require("./routes/banner");
const productRouter = require("./routes/products.routes");
const userRouter = require("./routes/user");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/orderRoutes");
const categoriesRouter = require("./routes/categories");
const favoritesRoutes = require("./routes/favoritesRoutes");
const messageRoutes = require("./routes/messageRoutes");
const orderRoutes = require("./routes/orderRoutes");
const subcategoriesRouter = require("./routes/subcategories");
const path = require("path");  // Importa el módulo path

// Cargar configuraciones desde .env
dotenv.config();

// Conectar a la base de datos
mongoose.connect(process.env.MONGO_URL, {
  writeConcern: {
    w: "majority",
  },
})
  .then(() => console.log("Base de Datos conectada"))
  .catch((err) => console.log(err));

// Configurar CORS para permitir todas las solicitudes
app.use(cors());

// Configurar body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Inicializar Passport
app.use(passport.initialize());

// Limitar tamaño de JSON y URL
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Configurar ruta para archivos estáticos
app.use('/uploads', express.static(path.resolve('uploads')));

// Rutas de la aplicación
app.use("/cart", cartRouter);
app.use("/orders", orderRouter);
app.use("/favorites", favoritesRoutes);
app.use("/messages", messageRoutes);
app.use("/orders", orderRoutes);
app.use("/subcategories", subcategoriesRouter);
app.use("/categories", categoriesRouter);
app.use("/banners", bannerRoutes);
app.use("/products", productRouter);
app.use("/", userRouter);

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Node js server started on port ${port}!`);
});
