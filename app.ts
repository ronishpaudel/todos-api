import { Prisma, PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
const PORT = 3001;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.post("/todos", async (req: Request, res: Response) => {
  try {
    const { title, description, username } = req.body;
    if (!title || !description || !username) {
      res.status(400).send({
        message: "payload error",
      });
      return;
    }
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (user?.id) {
      const todo = await prisma.todo.create({
        data: {
          title: title,
          description: description,
          userId: user?.id,
        },
      });
      res.json(todo);
    } else {
      res.status(404).send(" user error");
    }
  } catch (e) {
    if (e instanceof Error) res.status(404).send(e.message);
  }
});

app.get("/todos", async (req: Request, res: Response) => {
  const currentPage = Number(req.query.page) || 1;
  const pageSize = Number(req.query.page_size) || 10;
  const offset = pageSize * (currentPage - 1);
  const searchVal = req.query.q;
  try {
    if (!searchVal) {
      const todos = await prisma.todo.findMany({
        skip: offset,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      });
      res.json(todos);
    } else {
      const todos = await prisma.todo.findMany({
        skip: offset,
        take: pageSize,
        where: {
          title: {
            contains: String(searchVal),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      res.json(todos);
    }
  } catch (e) {
    res.status(404).send("Not Found");
  }
});
app.get("/todos/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const todo = await prisma.todo.findUnique({
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
    const updatedTodo = await prisma.todo.update({
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
    const deletedTodo = await prisma.todo.delete({
      where: {
        id: Number(id),
      },
    });
    res.json(deletedTodo);
  } catch (e) {
    res.status(404).send("Nothing here tto delete");
  }
});
app.post("/user", async (req, res) => {
  const { email, name, username } = req.body as Prisma.UserCreateArgs["data"];
  const users = await prisma.user.create({
    data: {
      email: email,
      name: name,
      username: username,
    },
  });
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
