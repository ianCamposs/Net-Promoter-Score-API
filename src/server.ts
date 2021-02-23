import "reflect-metadata"
import express, { request, response } from 'express'
import './database/index.ts'
import { router } from "./router"

const app = express()

app.use(express.json())
app.use(router)

app.listen(3333, () => console.log('Server is running!'))