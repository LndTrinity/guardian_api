import express from 'express';

import usuariosRoutes from './src/routes/usuario'
import usuarios_logRoutes from './src/routes/usuario_log'
import alertaRoutes from './src/routes/alerta'
import alerta_tipoRoutes from './src/routes/alerta_tipo'
import dispositivoRoutes from './src/routes/dispositivo'
import dispositivo_logsRoutes from './src/routes/dispositivo_logs'
import dispositivo_configRoutes from './src/routes/dispositivo_config'
import localizacaoRoutes from './src/routes/localizacao'


const app = express()
const port = 3004

app.use(express.json())

app.use("/usuario", usuariosRoutes)
app.use("/usuario_log", usuarios_logRoutes)
app.use("/alerta", alertaRoutes)
app.use("/alerta_tipo", alerta_tipoRoutes)
app.use("/dispositivo", dispositivoRoutes)
app.use("/dispositivo_log", dispositivo_logsRoutes)
app.use("/dispositivo_config", dispositivo_configRoutes)
app.use("/localizacao", localizacaoRoutes)

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})