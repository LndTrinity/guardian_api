import { PrismaClient } from "../../generated/prisma";
import { Router, Request, Response } from "express";

const prisma = new PrismaClient();
const router = Router();

// CREATE
router.post("/", async (req: Request, res: Response) => {
  const { descricao, ativo, dispositivoId, alertaId } = req.body;

  if (!descricao || ativo === undefined || !dispositivoId || !alertaId) {
    return ;
  }

  try {
    const alerta = await prisma.alerta.create({
      data: {
        descricao,
        ativo,
        dispositivoId,
        alertaId,
      },
    });
    res.status(201).json(alerta);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar alerta", detalhes: error });
  }
});

// READ 
router.get("/", async (req: Request, res: Response) => {
  try {
    const alertas = await prisma.alerta.findMany({
      include: {
        dispositivo: true,
        alerta: true, // inclui dados do tipo de alerta (Alerta_tipo)
      },
    });
    res.status(200).json(alertas);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar alertas", detalhes: error });
  }
});

// UPDATE
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { descricao, ativo, dispositivoId, alertaId } = req.body;

  try {
    const alerta = await prisma.alerta.update({
      where: { id: Number(id) },
      data: {
        descricao,
        ativo,
        dispositivoId,
        alertaId,
      },
    });
    res.json(alerta);
  } catch (error) {
    res.status(400).json({ erro: "Erro ao atualizar alerta", detalhes: error });
  }
});

// DELETE 
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const alerta = await prisma.alerta.delete({
      where: { id: Number(id) },
    });
    res.json(alerta);
  } catch (error) {
    res.status(400).json({ erro: "Erro ao deletar alerta", detalhes: error });
  }
});

export default router;
