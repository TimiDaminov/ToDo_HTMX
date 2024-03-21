import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();
const app = express();
const port = 8500;
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const client = new MongoClient(
  `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.qfg36ga.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
);

const start = async () => {
  try {
    await client.connect();
    console.log("Connection set!");
    // await client.db().collection("tasks").deleteMany({});
  } catch (e) {
    console.log(e);
  }
};

const retrieveTasks = async (req, res) => {
  const tasks = await client.db().collection("tasks").find({}).toArray();
  // RESPOSE FOR HTMX SOLUTION
  // res.send(
  //   tasks
  //     .map(
  //       (task, index) =>
  //         `<div class="flex justify-between align-center mb-2 text-xl"><div>${
  //           index + 1
  //         }. ${task.text}</div><div name=${
  //           task.text
  //         }><button class="bg-green-500 text-white px-1 py-1 rounded ml-2" hx-post="/finishTask" hx-trigger="click" hx-vals='{"task": "${
  //           task.text
  //         }"}'>Finished</button></div></div>`
  //     )
  //     .join("")
  // );

  //RESPONSE FOR JAVASCRIPT SOLUTION
  res.send(
    tasks
      .map(
        (task, index) =>
          `<div class="flex justify-between align-center mb-2 text-xl"><div>${
            index + 1
          }. ${task.text}</div><div name=${
            task.text
          }><button class="bg-green-500 text-white px-1 py-1 rounded ml-2" onclick="finishTask('${
            task.text
          }')">Finished</button></div></div>`
      )
      .join("")
  );
};
app.post("/finishTask", async (req, res) => {
  const tasks = client.db().collection("tasks");
  await tasks.deleteOne({ text: req.body.task });
  const updatedTasks = await tasks.find({}).toArray();
  console.log(req.body);
  // RESPONSE FOR HTMX SOLUTION
  // res.send(
  //   updatedTasks
  //     .map(
  //       (task, index) =>
  //         `<div class="flex justify-between align-center mb-2 text-xl"><div>${
  //           index + 1
  //         }. ${task.text}</div><div name=${
  //           task.text
  //         }><button class="bg-green-500 text-white px-1 py-1 rounded ml-2" hx-post="/finishTask" hx-trigger="click"  hx-vals='{"task": "${
  //           task.text
  //         }"}'>Finished</button></div></div>`
  //     )
  //     .join("")
  // );

  //RESPONSE FOR JAVASCRIPT SOLUTION
  res.send(
    updatedTasks
      .map(
        (task, index) =>
          `<div class="flex justify-between align-center mb-2 text-xl"><div>${
            index + 1
          }. ${task.text}</div><div name=${
            task.text
          }><button class="bg-green-500 text-white px-1 py-1 rounded ml-2" onclick="finishTask('${
            task.text
          }')">Finished</button></div></div>`
      )
      .join("")
  );
});
app.get("/retrieve_tasks", retrieveTasks);
app.post("/addtask", async (req, res) => {
  try {
    const tasks = client.db().collection("tasks");
    await tasks.insertOne({ text: `${req.body.task}` });
    const tasksArray = await client.db().collection("tasks").find({}).toArray();

    // RESPONSE FOR HTMX SOLUTION
    // res.send(
    //   tasksArray
    //     .map(
    //       (task, index) =>
    //         `<div class="flex justify-between align-center mb-2 text-xl"><div>${
    //           index + 1
    //         }. ${task.text}</div><div name=${
    //           task.text
    //         }><button class="bg-green-500 text-white px-1 py-1 rounded ml-2" hx-post="/finishTask" hx-trigger="click"  hx-vals='{"task": "${
    //           task.text
    //         }"}'>Finished</button></div></div>`
    //     )
    //     .join("")
    // );

    // RESPONSE FOR JAVASCRIPT SOLUTION
    res.send(
      tasksArray
        .map(
          (task, index) =>
            `<div class="flex justify-between align-center mb-2 text-xl"><div>${
              index + 1
            }. ${task.text}</div><div name=${
              task.text
            }><button class="bg-green-500 text-white px-1 py-1 rounded ml-2" onclick="finishTask('${
              task.text
            }')">Finished</button></div></div>`
        )
        .join("")
    );
  } catch (e) {
    console.log(e);
  }
});

start();
