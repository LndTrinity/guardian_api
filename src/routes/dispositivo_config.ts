import { PrismaClient } from "../../generated/prisma"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()


// CREATE

router.post('/signin', async (req, res) => {
  const { intervalo_envio, standby, dispositivoId } = req.body;

  if (!intervalo_envio || !standby  || !dispositivoId) {
    return
  }

  try {
    const config = await prisma.dispositivo_config.create({
      data: {
        intervalo_envio,
        standby,
        dispositivoId,
      },
    });
    res.status(201).json(config);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar configuração", detalhes: error });
  }
});

// READ 
router.get("/", async (req, res) => {
  try {
    const configs = await prisma.dispositivo_config.findMany({
      include: {
        dispositivo: true, // opcional: incluir detalhes do dispositivo
      },
    });
    res.json(configs);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar configurações", detalhes: error });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { intervalo_envio, standby, dispositivoId } = req.body;

  try {
    const config = await prisma.dispositivo_config.update({
      where: { id: Number(id) },
      data: {
        intervalo_envio,
        standby,
        dispositivoId,
      },
    });
    res.json(config);
  } catch (error) {
    res.status(400).json({ erro: "Erro ao atualizar configuração", detalhes: error });
  }
});

// DELETE 
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const config = await prisma.dispositivo_config.delete({
      where: { id: Number(id) },
    });
    res.json(config);
  } catch (error) {
    res.status(400).json({ erro: "Erro ao deletar configuração", detalhes: error });
  }
});

export default router;
