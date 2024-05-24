'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ref, push } from "firebase/database";
import { db } from "../../services/firebase/firebaseAppConfig";
import { useAuthContext } from "../../context/AuthContext";
import { parseISO, isValid, isBefore } from 'date-fns';

interface INewTask {
  name: string;
  description: string;
  init_date: string;
  end_date: string;
  status: boolean;
  owner: string;
}

const Page = () => {
  const router = useRouter();
  const { userAuth } = useAuthContext();
  if (!userAuth) {
    router.push("/signIn");
    return null;
  }
  const [newTask, setNewTask] = useState<INewTask>({
    name: "",
    description: "",
    init_date: "",
    end_date: "",
    status: false,
    owner: userAuth?.uid || "",
  });

  const addNewTask = () => {
    const currentDate = new Date();
    const initDate = parseISO(newTask.init_date);
    if (isBefore(initDate, currentDate)) {
      alert("A data de início não pode ser anterior à data atual.");
      return;
    }

    let endDate = parseISO(newTask.end_date);
    let status: boolean;

    if (!newTask.end_date || !isValid(endDate) || isBefore(endDate, initDate)) {
      newTask.end_date = "----------";
      status = false;
    } else if (isBefore(endDate, initDate)) {
      alert("A data de conclusão deve ser posterior à data de início.");
      return;
    } else {
      status = true;
    }
    const taskWithStatus = { ...newTask, status };
    push(ref(db, "/tasks"), taskWithStatus);
    
    setNewTask({
      name: "",
      description: "",
      init_date: "",
      end_date: "",
      status: status,
      owner: userAuth?.uid || "",
    });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center sm:py-12">
      <div className="max-w-md mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addNewTask();
          }}
        >
          <div className="mb-4">
            <h2 className="text-center text-3xl mb-8 font-extrabold text-white">
              Create New Task
            </h2>
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Name"
              value={newTask.name}
              onChange={(e) =>
                setNewTask({ ...newTask, name: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              type="text"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="init_date"
            >
              Start Date:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="init_date"
              type="date"
              value={newTask.init_date}
              onChange={(e) =>
                setNewTask({ ...newTask, init_date: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="end_date"
            >
              End Date:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="end_date"
              type="date"
              value={newTask.end_date}
              onChange={(e) =>
                setNewTask({ ...newTask, end_date: e.target.value })
              }
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
