import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.post("/todos", async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const todo = await prisma.todos.create({
      data: {
        title: title,
        description: description,
      },
    });
    res.json(todo);
  } catch (e) {
    res.status(404).send("Not updated");
  }
});

app.get("/todos", async (req: Request, res: Response) => {
  try {
    const todos = await prisma.todos.findMany();
    res.json(todos);
  } catch (e) {
    res.status(404).send("Not Found");
  }
});
app.get("/todos/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const todo = await prisma.todos.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.json(todo);
  } catch (e) {
    res.status(404).send("there is no such id in todos");
  }
});

app.put("/todos", async (req: Request, res: Response) => {
  try {
    const { id, title, description } = req.body;
    const updatedTodo = await prisma.todos.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        description: description,
      },
    });
    res.json(updatedTodo);
  } catch (e) {
    res.status(404).send("Todos Not Updated");
  }
});

app.delete("/todos/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const deletedTodo = await prisma.todos.delete({
      where: {
        id: Number(id),
      },
    });
    res.json(deletedTodo);
  } catch (e) {
    res.status(404).send("Nothing here tto delete");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
