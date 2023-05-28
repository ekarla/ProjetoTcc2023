import express from "express";
import mainController from "../controllers/main";
import areaController from "../controllers/area";
import cursoController from "../controllers/curso";
import authCheck from "../utils/authCheck";
const router = express.Router();

//Main  controller
router.get("/", mainController.index);
router.get("/about", mainController.about);
router.get("/signup", mainController.signup);
router.post("/signup", mainController.signup);
router.get("/login", mainController.login);
router.post("/login", mainController.login);
router.get("/logout", mainController.logout);
router.get("/ui", mainController.ui);
router.get("/jogo", authCheck,mainController.jogo);

//Area Controler

router.get("/areas", areaController.index);

//Curso Controller

router.get("/curso",authCheck, cursoController.index);
router.get("/curso/create",authCheck,cursoController.create);
router.post("/curso/create",authCheck,cursoController.create);
router.post("/curso/update/:id",authCheck,cursoController.update);
router.get("/curso/update/:id",authCheck,cursoController.update);
router.get("/curso/:id",authCheck,cursoController.read);
router.delete("/curso/:id",authCheck,cursoController.remove);



export default router;