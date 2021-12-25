// imports dependencies
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


import router from './routes.js'

const app = express()

app.use(cors())
app.use(express.json({ type: 'application/json' }))
app.use(morgan('dev'))
app.use(helmet({ contentSecurityPolicy: false }))

app.use(express.static(path.join(__dirname, '../public/dist')))

app.use('/services', router)

app.listen(process.env.PORT, () => {
	console.log('Server is running on ', process.env.PORT)
})