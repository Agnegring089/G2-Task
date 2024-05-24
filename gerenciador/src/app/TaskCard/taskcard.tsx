import React from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../services/firebase/firebaseAppConfig';
import { update, ref } from 'firebase/database';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  id: string; 
  name: string;
  description: string;
  initDate: string;
  endDate: string;
  status: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ id, name, description, initDate, endDate, status }) => {
  const router = useRouter();

  const handleDeleteClick = () => {
    router.push('/deleteTask/${id}'); 
  };

  const updateTaskStatus = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    update(ref('/tasks/${id}'), { status: true, end_date: currentDate });
  };

  return (
    <div className={`${styles.card} ${status ? styles.completed : styles.incomplete}`}>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.id}>ID: {id}</p>
      <p className={styles.dates}>
        <span>{initDate}</span>
        <span>{endDate}</span>
      </p>
      <p className={styles.description}>{description}</p>
      <div className="flex space-x-2 mt-4">
        {!status && (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={updateTaskStatus}
          >
            Complete
          </button>
        )}
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleDeleteClick}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
