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
  const { title, description } = req.body;
  const todo = await prisma.todos.create({
    data: {
      title: title,
      description: description,
    },
  });
  res.json(todo);
});

app.get("/todos", async (req: Request, res: Response) => {
  const todos = await prisma.todos.findMany({});
  res.json(todos);
});
app.get("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const todo = await prisma.todos.findUnique({
    where: {
      id: Number(id),
    },
  });
  res.json(todo);
});

app.put("/todos", async (req: Request, res: Response) => {
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
});

app.delete("/todos/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const deletedTodo = await prisma.todos.delete({
    where: {
      id: Number(id),
    },
  });
  res.json(deletedTodo);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
