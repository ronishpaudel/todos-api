import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Prisma, PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { v4 as uuid } from "uuid";

const prisma = new PrismaClient();
const app = express();
var cors = require("cors");

app.use(cors());
app.use(express.json());
const PORT = 3005;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.post("/todos", async (req: Request, res: Response) => {
  try {
    const { title, description, imageUrl } = req.body;

    const todo = await prisma.todo.create({
      data: {
        title: title,
        description: description,
        imageUrl: imageUrl,
      },
    });
    res.json(todo);
  } catch (e) {
    if (e instanceof Error) res.status(404).send(e.message);
  }
});

app.put("/todos", async (req: Request, res: Response) => {
  try {
    const { id, title, description, imageUrl } = req.body;
    const updatedTodo = await prisma.todo.update({
      where: {
        id: Number(id),
      },
      data: {
        title: title,
        description: description,
        imageUrl: imageUrl,
      },
    });
    res.json(updatedTodo);
  } catch (e) {
    res.status(404).send("Todos Not Updated");
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
  const { email, name, username, password, dob } =
    req.body as Prisma.UserCreateArgs["data"];

  const users = await prisma.user.create({
    data: {
      email: email,
      name: name,
      username: username,
      password: password,
      dob: dob,
    },
  });
  res.json(users);
});

app.get("/users", async (req: Request, res: Response) => {
  const currentPage = Number(req.query.page) || 1;
  const pageSize = Number(req.query.page_size) || 10;
  const offset = pageSize * (currentPage - 1);
  const searchVal = req.query.q;
  try {
    if (!searchVal) {
      const users = await prisma.user.findMany({
        skip: offset,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      });
      res.json(users);
    } else {
      const users = await prisma.user.findMany({
        skip: offset,
        take: pageSize,
        where: {
          name: {
            contains: String(searchVal),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      res.json(users);
    }
  } catch (e) {
    res.status(404).send("Not Found");
  }
});
app.put("/todos/check/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedTodo = await prisma.todo.update({
      where: {
        id: Number(id),
      },
      data: {
        completed: 1,
      },
    });
    res.json(updatedTodo);
  } catch (e) {
    res.status(404).send("Todos Not Updated");
  }
});
app.put("/todos/uncheck/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedTodo = await prisma.todo.update({
      where: {
        id: Number(id),
      },
      data: {
        completed: 0,
      },
    });
    res.json(updatedTodo);
  } catch (e) {
    res.status(404).send("Todos Not Updated");
  }
});
app.get("/todos/check/:id", async (req: Request, res: Response) => {
  const currentPage = Number(req.query.page) || 1;
  const pageSize = Number(req.query.page_size) || 10;
  const offset = pageSize * (currentPage - 1);
  const searchVal = req.params.id;
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
          completed: 1,
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
app.get("/todos/uncheck/:id", async (req: Request, res: Response) => {
  const currentPage = Number(req.query.page) || 1;
  const pageSize = Number(req.query.page_size) || 10;
  const offset = pageSize * (currentPage - 1);
  const searchVal = req.params.id;
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
          completed: 0,
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

app.post("/s3_upload_url", async (req: Request, res: Response) => {
  const BUCKET_NAME = "testing-todo";
  const BUCKET_URL = "https://testing-todo.s3.ap-south-1.amazonaws.com";
  const FOLDER_NAME = "todo_images";
  try {
    const id = uuid();
    const command = new PutObjectCommand({
      ACL: "public-read",
      Bucket: BUCKET_NAME,
      Key: `/${FOLDER_NAME}/${id}.jpg`,
    });
    // console.log(process.env.ACCESS_KEY);
    const imageClient = new S3Client({
      region: "ap-south-1",
      credentials: {
        accessKeyId: process.env.ACCESS_KEY!!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!!,
      },
    });
    const uploadUrl = await getSignedUrl(imageClient, command, {
      expiresIn: 60 * 30,
    });

    const url = `${BUCKET_URL}//${FOLDER_NAME}/${id}.jpg`;

    return res.send({
      message: "Successfully created upload URL",
      data: {
        uploadUrl,
        url,
      },
    });
  } catch (error) {
    return res.status(400).send({
      message: "Failed to create upload URL",
      error,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
