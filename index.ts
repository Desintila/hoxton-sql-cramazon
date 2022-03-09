import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";


const app = express()
app.use(cors())
app.use(express.json())

const prisma = new PrismaClient()

app.get('/items', async (req, res) => {
    const items = await prisma.item.findMany()
    res.send(items)
})

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany({ include: { order: { include: { item: true } } } })
    res.send(users)
})


app.get('/items/:id', async (req, res) => {
    const id = Number(req.params.id)
    try {
        const item = await prisma.item.findFirst({ where: { id }, include: { order: { include: { user: true } } } })
        if (item) {
            res.send(item)
        }
        else {
            res.status(404).send({ error: 'Item not found' })
        }
    } catch (error) {
        res.status(400).send({ error: 'Error' })
    }
})


app.get('/users/:id', async (req, res) => {
    const id = Number(req.params.id)
    try {
        const user = await prisma.user.findFirst({ where: { id }, include: { order: { include: { item: true } } } })
        if (user) {
            res.send(user)
        }
        else {
            res.status(404).send({ error: 'User not found' })
        }
    } catch (error) {
        res.status(400).send({ error: 'Error' })
    }
})

app.listen(4000, () => {
    console.log('Server running: http://localhost:4000')
})