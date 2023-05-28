import { Area} from "../models/index";
//const Op = models.Sequelize.Op;
import { Op} from "sequelize";

const index = async(req,res)=>{
    const areas = await Area.findAll({where: true});
    console.log(areas);
    res.render("area/index",{ 
        areas: areas.map((area)=> area.toJSON())
     });
}

export default{index}
