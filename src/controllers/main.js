import { Curso, Usuario} from "../models/index";
import bcrypt from "bcryptjs";

const index = (req, res)=>{
    const username = "Elenkarla";
    res.render("main/index",{
        username: username,
        isRyan: username ==='Ryan'
        
    });
}

const signup = async (req,res)=>{
    const cursos = await Curso.findAll();
    if(req.route.methods.get){
        res.render("main/signup",{
            curso: cursos.map(c =>c.toJSON()),
            csrf: req.csrfToken()
        });
    }else{ 
        const usuario = req.body;
        try{
            bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS), (errorSalt, salt) =>{
                bcrypt.hash(usuario.senha, salt, async (error, hash)=>{
                    await Usuario.create({
                        nome: usuario.nome,
                        email: usuario.email,
                        senha: hash,
                        cursoId: usuario.cursoId
                    });
                    res.redirect("/")
                })
            })
            //await Usuario.create(usuario);    
        }catch(error){
         console.log (error)    
        }
    }  
}

const login = async (req, res)=>{
    if(req.route.methods.get){
        res.render("main/login", {
            csrf: req.csrfToken()
        })
    }else {
        const credenciais = req.body;
        const user = await Usuario.findOne({where:{email:credenciais.email}});
        if(user){
            bcrypt.compare(credenciais.senha, user.senha, (error, sucesso)=>{
                if (error) console.log(error);
                else if (sucesso){
                    req.session.uid = user.id;
                    res.redirect("/");
                }
                else {
                    res.render("main/login", {
                        csrf: req.csrfToken()
                    })
                }
            });
        }  
    }
}

const logout = (req, res)=>{
    req.session.destroy((error)=>{
        if(error) console.log(error);
        else res.redirect("/");
    })
}

const about = (req, res)=>{
    res.render("main/about");
}

const jogo = (req, res)=>{
    res.render("main/jogo");
}

const ui = (req,res)=>{
    res.render("main/ui");
}

export default {index, about,signup, login , logout, ui, jogo}