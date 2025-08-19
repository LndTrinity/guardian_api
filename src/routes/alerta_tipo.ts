import { error } from "console";
import { PrismaClient } from "../../generated/prisma";
import { Router, Request, Response } from "express";

const prisma = new PrismaClient();
const router = Router();

/**
 * CREATE - Cria um novo tipo de alerta
 */
router.post("/", async (req, res) => {
  const { nome, regra } = req.body;



  try {
    if (!nome || !regra) {
      throw error;
    }
    // Verifica duplicidade de nome
    const nomeExiste = await prisma.alerta_tipo.findFirst({
      where: { nome },
    });

    if (nomeExiste) {
      throw error;
    }

    const tipo = await prisma.alerta_tipo.create({
      data: {
        nome,
        regra,
      },
    });

    res.status(201).json(tipo);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar tipo de alerta.", detalhes: error });
  }
});

// READ 

router.get("/", async (_req: Request, res: Response) => {
  try {
    const tipos = await prisma.alerta_tipo.findMany({
      include: {
        alerta: true, // inclui os alertas relacionados
      },
    });
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar tipos de alerta.", detalhes: error });
  }
});

// UPDATE 

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, regra } = req.body;

  try {
  
    const tipo = await prisma.alerta_tipo.update({
      where: { id: Number(id) },
      data: { nome, regra },
    });

    res.json(tipo);
  } catch (error) {
    res.status(400).json({ erro: "Erro ao atualizar tipo de alerta.", detalhes: error });
  }
});

// DELETE

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const tipo = await prisma.alerta_tipo.delete({
      where: { id: Number(id) },
    });

    res.json(tipo);
  } catch (error) {
    res.status(400).json({ erro: "Erro ao deletar tipo de alerta.", detalhes: error });
  }
});

export default router;
