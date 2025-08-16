import { PrismaClient } from "../../generated/prisma"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

//                                              CRUD
// CREATE
router.post('/cadastro', async (req, res) => {
  const { modelo, numero_de_serie, data_fabricacao} = req.body;
  if (!modelo || !numero_de_serie || !data_fabricacao) {
    res.status(400).json({ erro: "Todos os dados" })

    return
  }
  
 
  try {
     // Converter a data para um objeto Date
    const dataConvertida = new Date(data_fabricacao);

    // Verifica se a data é válida
    if (isNaN(dataConvertida.getTime())) {
      res.status(400).json({ erro: "Data de fabricação inválida" });
      return 
    }
    const transaction = await prisma.$transaction(async (prisma) =>{
      const dispositivo = await prisma.dispositivo.create({
        data: 
        {modelo, numero_de_serie, data_fabricacao: dataConvertida
       }})

        res.status(201).json(dispositivo)
    })
    
    
  } catch (error) {
   
    res.status(400).json(error)
    console.log(error)
  }
})

// READ
router.get("/", async (req, res) => {
  try {
    const dispositivo = await prisma.dispositivo.findMany({
     
    })
    res.status(200).json(dispositivo)
  } catch (error) {
    res.status(400).json(error)
  }
})

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const dispositivo = await prisma.dispositivo.update({ where: { id:Number(id) }, data });
    res.json(dispositivo);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar dispositivo." });
  }
});
// DELETE USANDO SOFT DELETE(DELETA FOFO)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const usuario = await prisma.usuario.delete({ where: { id:Number(id) } });
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar usuário." });
  }
});

export default router