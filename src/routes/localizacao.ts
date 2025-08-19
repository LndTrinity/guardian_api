import { error } from "console";
import { PrismaClient } from "../../generated/prisma";
import { Router, Request, Response } from "express";

const prisma = new PrismaClient();
const router = Router();

// CREATE

router.post("/", async (req: Request, res: Response) => {
  const jsonString = JSON.stringify(req.body);
  const { longitude, latitude,  dispositivoId, descricao, status_bateria, banda_dados } = req.body;
  

  var banda_dados_ = 0  
  const bytes_quant = Buffer.byteLength(jsonString, "utf8");
  const kilobytes = Number(bytes_quant / 1024);
  banda_dados_ = kilobytes


  
  // salva no log
  try {
    if (
    longitude === undefined ||
    latitude === undefined ||
    !dispositivoId
  ) {
    throw error
  }
    const log = await prisma.dispositivo_log.create({
      data: {
        data_hora: new Date(),
        status_bateria,
        descricao,
        banda_dados: banda_dados_.toString(),
        dispositivoId,
      },
    });
    
  } catch (error) {
    console.log("erro: Erro ao criar log.", error)
  
  }

  try {
    const bateria_statu = await prisma.dispositivo.update({
      where: {id: dispositivoId}, data: {bateria: Number(status_bateria)}
    })
    const localizacao = await prisma.localizacao.create({
      data: {
        longitude,
        latitude,
        data_hora: new Date(),
        dispositivoId,
      },
    });
    
    res.status(201).json(localizacao);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao registrar localização.", detalhes: error });
  }


});
;

// READ
router.get("/", async (req: Request, res: Response) => {
  const { dispositivoId } = req.query;

  try {
    const localizacoes = await prisma.localizacao.findMany({
      where: dispositivoId ? { dispositivoId: Number(dispositivoId) } : undefined,
      include: {
        dispositivo: true, // incluir dados do dispositivo, opcional
      },
      orderBy: {
        data_hora: "desc",
      },
    });

    res.json(localizacoes);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar localizações.", detalhes: error });
  }
});

// UPDATE

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { longitude, latitude, data_hora, dispositivoId } = req.body;

  try {
    const localizacao = await prisma.localizacao.update({
      where: { id: Number(id) },
      data: {
        longitude,
        latitude,
        data_hora: new Date(data_hora),
        dispositivoId,
      },
    });

    res.json(localizacao);
  } catch (error) {
    res.status(400).json({ erro: "Erro ao atualizar localização.", detalhes: error });
  }
});

// DELETE

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const localizacao = await prisma.localizacao.delete({
      where: { id: Number(id) },
    });

    res.json(localizacao);
  } catch (error) {
    res.status(400).json({ erro: "Erro ao deletar localização.", detalhes: error });
  }
});

// READ - Lista localizações com filtros opcionais
router.get("/", async (req: Request, res: Response) => {
  const { dispositivoId, start, end, limit } = req.query;

  // Monta filtro condicionalmente
  const where: any = {};

  if (dispositivoId) {
    where.dispositivoId = Number(dispositivoId);
  }

  if (start || end) {
    where.data_hora = {};
    if (start) where.data_hora.gte = new Date(start as string);
    if (end) where.data_hora.lte = new Date(end as string);
  }

  try {
    const localizacoes = await prisma.localizacao.findMany({
      where,
      include: {
        dispositivo: true,
      },
      orderBy: {
        data_hora: "desc",
      },
      take: limit ? Number(limit) : undefined,
    });

    res.json(localizacoes);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar localizações.", detalhes: error });
  }
});


export default router;

/* 
Últimas 10 localizações de um dispositivo:

    GET /localizacao?dispositivoId=1&limit=10

Localizações de 1º a 30 de junho de 2025:

    GET /localizacao?start=2025-06-01T00:00:00Z&end=2025-06-30T23:59:59Z

Últimas 5 localizações de um dispositivo dentro de um período:

    GET /localizacao?dispositivoId=2&start=2025-07-01&end=2025-07-02&limit=5

OBS: 
Os parâmetros start e end devem estar no formato ISO (ex: 2025-07-01T00:00:00Z), mas strings tipo 2025-07-01 também funcionam.
*/
