import { PrismaClient } from "../../generated/prisma"
import { Router } from "express"
import { validaSenha } from "../utils/utils"

import { enviaEmail, gerarString } from "../utils/utils"



const prisma = new PrismaClient()
const router = Router()

//                                              CRUD
// CREATE
router.post("/cadastro/token", async (req, res) => {
  const { codigo, email } = req.body

  const dezMinutosAtras = new Date(Date.now() - 10 * 60 * 1000)
  

  const cliente = await prisma.tokens.findMany({
    where: {
      codigo: codigo, email: email, deleted: false, createdAt: {
        gte: dezMinutosAtras
      }
    }
  })


  if (cliente.length == 0) {
    res.status(400).json({ erro: "Código incorreto" })

    return
  } else {
    const usuarioId = await prisma.usuario.findFirst({
      where: {email: email}, select:{ id: true}
    });
    const usuarioId_number = Number(usuarioId)
    const atualizaCliente = await prisma.usuario.update({
      where:{ id: usuarioId_number}, data:{
        deleted: false
      }
    })
    const atualizaToken = await prisma.tokens.update({
      where: {
        id: cliente[0].id, // O token que você quer atualizar
      },
      data: {
        deleted: true,  // Atualiza o campo para marcar o token como usado
      },
    });
    res.status(201).json(cliente)
  }
})

router.post('/Cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;
  const dezMinutosAtras = new Date(Date.now() - 10 * 60 * 1000)

  if (!nome || !email || !senha) {
    res.status(400).json({ erro: "Informe nome, email e senha" })

    return
  }

  const erros = validaSenha(senha)
  if (erros.length > 0) {
    res.status(400).json({ erro: erros.join("; ") })
    return
  }
  const clienteEmail = await prisma.usuario.findMany({
    where: { email: email, deleted : false }
  })

  if (clienteEmail.length > 0 ) {
    res.status(400).json({ erro: "ERRO" })
    return
  }

  // para o campo senha, atribui o hash gerado
  try {
    const transaction = await prisma.$transaction(async (prisma) =>{
      const cliente = await prisma.usuario.create({
        data: 
        {nome: nome,
        email: email,
        senha: senha,
        deleted: false
       }})

        res.status(201).json(cliente)
    })
    
    
  } catch (error) {
   
    res.status(400).json(error)
  }
})

// READ
router.get("/all", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany()
    res.status(200).json(usuarios)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      where: {deleted : false}
    })
    res.status(200).json(usuarios)
  } catch (error) {
    res.status(400).json(error)
  }
})

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const usuario = await prisma.usuario.update({ where: { id:Number(id) }, data });
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar usuário." });
  }
});
// DELETE USANDO SOFT DELETE(DELETA FOFO)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const usuario = await prisma.usuario.update({ where: { id:Number(id) }, data: {deleted: true} });
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar usuário." });
  }
});
//LOGIN
router.post("/login", async (req, res) => {
  const { email, senha } = req.body

  const mensaPadrao = "Login ou senha incorretos"
  if (!email || !senha) {
    res.status(400).json({ erro: mensaPadrao })
    return
  }

  try {
    const usuario= await prisma.usuario.findUnique({
      where: { email }
    })

    if (usuario == null) {
      res.status(400).json({ erro: mensaPadrao })
      return
    }

    // se o e-mail existe, faz-se a comparação dos hashs
    if (usuario.senha == senha){
      res.status(200).json({ id: usuario.id, nome: usuario.nome })

    } else {
      res.status(400).json({ erro: mensaPadrao })
    }
  } catch (error) {
    res.status(400).json(error)
  }
})
// VINCULA UM DISPOSITIVO A UM USUARIO
router.post('/vincula_dispositivo', async (req, res) => {
  const { numero_dispositivo, id_usuario } = req.body;
  if (!numero_dispositivo || !id_usuario) {
    res.status(400).json({ erro: "Informe todos os dados" })

    return
  }

 
  const dispositivos = await prisma.dispositivo.findMany({
    where: { numero_de_serie: numero_dispositivo }
  })
  const usuarios = await prisma.usuario.findMany({
    where: { id: id_usuario }
  })
  const usuario_dispositivos = await prisma.dispositivo.findMany({
  where: {
    usuarioId: {
      not: null, // retorna se houver um usuario vinculado
    },
  },
  // include: {
  //   usuario: true, // retorna todos os dados do usuário 
  // },
});

  if (dispositivos.length <= 0) {
    res.status(400).json({ erro: "Dispositivo não encontrado" })
    return
  }

  if (usuarios.length <= 0) {
    res.status(400).json({ erro: "Usuario não encontrado" })
    return
  }

  if (usuario_dispositivos.length > 0){
    res.status(400).json({ erro: "Dispositivo já cadastradado" })
    return
  }

  try {
    const transaction = await prisma.$transaction(async (prisma) =>{
      const vincular = await prisma.dispositivo.update({ where: { id:Number(dispositivos[0].id) }, data: {usuarioId: id_usuario} });

        res.status(201).json(vincular)
    })
    
    
  } catch (error) {
   
    res.status(400).json(error)
  }
})



export default router