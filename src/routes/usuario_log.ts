import { PrismaClient } from "../../generated/prisma";
import { Router, Request, Response } from "express";

const prisma = new PrismaClient();
const router = Router();

// CREATE - Criar um novo log de usuário
router.post("/", async (req: Request, res: Response) => {
  const { descricao, data_hora, usuarioId } = req.body;

  if (!descricao || !data_hora || !usuarioId) {
    res.status(400).json({ erro: "Campos obrigatórios: descricao, data_hora, usuarioId" })
    return ;
  }

  try {
    const log = await prisma.usuario_log.create({
      data: {
        descricao,
        data_hora: new Date(data_hora),
        usuarioId,
      },
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar log de usuário.", detalhes: error });
  }
});

// READ - Listar logs de usuários, opcionalmente filtrando por usuarioId
router.get("/", async (req: Request, res: Response) => {
  const { usuarioId, limit } = req.query;

  try {
    const logs = await prisma.usuario_log.findMany({
      where: usuarioId ? { usuarioId: Number(usuarioId) } : undefined,
      orderBy: { data_hora: "desc" },
      take: limit ? Number(limit) : undefined,
      include: { usuario: true },
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar logs de usuários.", detalhes: error });
  }
});

// UPDATE - Atualizar um log pelo ID
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { descricao, data_hora, usuarioId } = req.body;

  try {
    const log = await prisma.usuario_log.update({
      where: { id: Number(id) },
      data: {
        descricao,
        data_hora: new Date(data_hora),
        usuarioId,
      },
    });
    res.json(log);
  } catch (error) {
    res.status(400).json({ erro: "Erro ao atualizar log de usuário.", detalhes: error });
  }
});

// DELETE - Deletar um log pelo ID
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const log = await prisma.usuario_log.delete({
      where: { id: Number(id) },
    });
    res.json(log);
  } catch (error) {
    res.status(400).json({ erro: "Erro ao deletar log de usuário.", detalhes: error });
  }
});

export default router;
