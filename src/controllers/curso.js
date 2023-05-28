//const models = require("../models/index");
//const Curso = models.Curso;
import { Curso, Area} from "../models/index";

async function index(req,res) {
    const cursos = await Curso.findAll();
    res.render("curso/index",{
        cursos: cursos.map(curso=> curso.toJSON())
    });
}
async function create(req,res) {
    if(req.route.methods.get){
        res.render("curso/create",{
            csrf: req.csrfToken()
        });
    }else{
        await Curso.create({
            sigla:req.body.sigla,
            nome: req.body.nome,
            descricao: req.body.descricao,
            areaId: req.body.area
        });

        res.redirect("/curso")
    }
    
}
async function read(req,res) {
    const { id } = req.params;
    try{
        const curso = await Curso.findByPk(id, {include: Area});
        res.render("curso/read",{
            curso: curso.toJSON()
        })
    }catch(error) {
        console.log(error);
    }  
    
}
async function update(req,res) {}

async function remove(req,res){
    const {id} = req.params;
    try{
        await Curso.destroy({where: {id: id}});
        res.send("Curso apagado com sucesso!!");
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

//module.exports = {index, create, update, remove, read}

export default  {index, create, update, remove, read}