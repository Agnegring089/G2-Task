'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../context/AuthContext';
import { db } from '../services/firebase/firebaseAppConfig';
import { ref, onValue } from 'firebase/database';
import TaskCard from './TaskCard/taskcard';

interface ITask {
  [key: string]: {
    name: string;
    description: string;
    init_date: string;
    end_date: string;
    status: boolean;
    owner: string;
  };
  }

export default function Home() {
  const { userAuth, logout } = useAuthContext();
  const router = useRouter();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndFilterTasks = () => {
      if (!userAuth) return;
      const tasksRef = ref(db, 'tasks');
      onValue(tasksRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const tasksData = Object.entries(data)
            .filter(([_, task]) => task.owner === userAuth.uid)
            .map(([id, task]) => ({ id, ...task }));
          setTasks(tasksData);
        } else {
          setTasks([]);
        }
        setLoading(false);
      }, (error) => {
        console.error('Error fetching tasks: ', error);
        setLoading(false);
      });
    };

    if (userAuth == null) {
      router.push('/signIn');
    } else {
      fetchAndFilterTasks();
    }
  }, [userAuth, router]);

  const handleCreateTaskClick = () => {
    router.push('/createTask');
  };

  return (
    <>
      {userAuth && (
        <section className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center sm:py-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-center text-3xl mb-8 font-extrabold text-white">Apenas Usuários Logados</h1>
            <div className="flex justify-end mb-4">
              <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" onClick={handleCreateTaskClick}>Create New Task</button>
            </div>
            <div>
              <h2 className="text-white">Tasks</h2>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div>
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      name={task.name}
                      description={task.description}
                      initDate={task.init_date}
                      endDate={task.end_date}
                      status={task.status}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="text-white">User ID: {String(userAuth?.uid)}</div>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => logout()}>Sign Out</button>
          </div>
        </section>
      )}
    </>
  );
}
