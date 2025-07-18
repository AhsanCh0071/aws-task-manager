import { useState, useEffect } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { getCurrentUser } from "aws-amplify/auth";
import "@aws-amplify/ui-react/styles.css";

function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const user = await getCurrentUser();
        const userId = user.userId;

        const res = await fetch(
          `https://o0tgk96lxa.execute-api.ap-south-1.amazonaws.com/default/get-tasks?userId=${userId}`
        );
        const data = await res.json();
        setTasks(data.tasks || []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!task.trim()) return;

    try {
      const user = await getCurrentUser();
      const userId = user.userId;

      const res = await fetch(
        "https://cp75fjpz78.execute-api.ap-south-1.amazonaws.com/add-task",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, taskTitle: task }),
        }
      );

      const data = await res.json();
      console.log("Task added:", data);
      setTasks((prev) => [
        ...prev,
        { title: task, completed: false, editing: false },
      ]);
      setTask("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleDeleteTask = async (index) => {
    const taskToDelete = tasks[index];

    try {
      const user = await getCurrentUser();
      const userId = user.userId;

      await fetch(
        `https://jf2jpk62cd.execute-api.ap-south-1.amazonaws.com/default/deleteTask?userId=${userId}&taskId=${taskToDelete.taskId}`,
        {
          method: "DELETE",
        }
      );

      setTasks((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const toggleEdit = (index) => {
    setTasks((prev) =>
      prev.map((t, i) =>
        i === index ? { ...t, editing: !t.editing } : { ...t, editing: false }
      )
    );
  };
  const toggleComplete = (index) => {
    setTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleEditChange = (index, newTask) => {
    setTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, title: newTask } : t))
    );
  };

  const handleEditSave = async (index) => {
    const taskToEdit = tasks[index];
    try {
      const user = await getCurrentUser();
      const userId = user.userId;

      await fetch(
        "https://74v1wd9kw3.execute-api.ap-south-1.amazonaws.com/default/editTask",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            taskId: taskToEdit.taskId,
            newTitle: taskToEdit.title,
          }),
        }
      );

      setTasks((prev) =>
        prev.map((t, i) => (i === index ? { ...t, editing: false } : t))
      );
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  return (
    <Authenticator loginMechanisms={["email"]} usernameAttributes="email">
      {({ signOut, user }) => (
        <>
          <div className="w-screen h-screen bg-gray-600 flex flex-col">
            <div>
              <button
                onClick={signOut}
                className="bg-red-700 text-white hover:cursor-pointer hover:shadow-red-700 shadow-2xl rounded-2xl mt-3 ml-70 h-5 w-14 !text-xs sm:text-sm sm-h-8 sm:w-17 sm:ml-160 md:h-10 md:w-20  md:ml-192 md:text-base lg:ml-285 lg:text-base lg:h-10 lg:w-20"
              >
                Logout
              </button>
            </div>

            <div className="font-blod text-cyan-500 mt-2 flex justify-center text-2xl sm:text-3xl md:text-4xl lg:text-4xl">
              Welcome To Task Manager!
            </div>

            <div className="flex items-center justify-center flex-row">
              <input
                value={task}
                onChange={(e) => setTask(e.target.value)}
                type="text"
                className=" rounded-2xl bg-amber-50 p-3 mt-5 w-80 text-xs break-all text-ellipsis sm:text-sm  sm:w-110 md:w-150 md:text-base lg:w-175 lg:text-base"
                placeholder="Schedule your task"
              />

              <button
                onClick={handleAddTask}
                className="bg-green-600 rounded-3xl text-white h-8 w-16 hover:cursor-pointer mt-5 ml-2 hover:shadow-green-600 shadow-2xl !text-xs  sm:text-sm sm:h-9 sm:w-18 md:text-base md:h-10 md:w-20 lg:text-base lg:h-10 lg:w-20"
              >
                Add Task
              </button>
            </div>

            <div className="mt-6 p-3 text-gray-600 flex  flex-col justify-center items-center ">
              {tasks.map((t, i) => (
                <div
                  key={i}
                  className="bg-amber-50 rounded-2xl p-3   mt-3 w-85 break-all  text-ellipsis sm:w-110 md:w-130 lg:w-150"
                >
                  <div className="flex justify-between items-center">
                    <span>
                      {t.editing ? (
                        <input
                          value={t.title}
                          onChange={(e) => handleEditChange(i, e.target.value)}
                          className="bg-amber-100 border px-2 py-1 rounded break-words overflow-hidden text-ellipsis"
                        />
                      ) : (
                        <span
                          className={
                            t.completed ? "line-through text-gray-500" : ""
                          }
                        >
                          {t.title}
                        </span>
                      )}
                    </span>
                    <div className="space-x-0.5">
                      <button
                        onClick={() =>
                          t.editing ? handleEditSave(i) : toggleEdit(i)
                        }
                        className=" bg-none text-black hover:cursor-pointer hover:shadow-yellow-400 shadow-2xl rounded-md h-4 w-6.5  !text-xs "
                      >
                        {t.editing ? "Save" : "✏️"}
                      </button>
                      <button
                        onClick={() => toggleComplete(i)}
                        className=" bg-none text-white hover:cursor-pointer hover:shadow-green-600 shadow-2xl  h-4 w-4  !text-xs "
                      >
                        ✅
                      </button>
                      <button
                        onClick={() => handleDeleteTask(i)}
                        className=" bg-none text-white hover:cursor-pointer hover:shadow-red-700 shadow-2xl h-4 w-4  !text-xs "
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Authenticator>
  );
}

export default Home;
