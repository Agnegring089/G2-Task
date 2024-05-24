'use client'
import { useRouter } from 'next/navigation';
import { ref, remove } from 'firebase/database';
import { db } from '../../../services/firebase/firebaseAppConfig';

const DeleteTaskPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;

  const handleDelete = () => {
    remove(ref(db, `/tasks/${id}`))
      .then(() => {
        alert('Task deleted successfully.');
        router.push('/'); 
      })
      .catch((error) => {
        console.error('Error deleting task: ', error);
      });
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center sm:py-12">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Are you sure you want to delete this task?</h2>
        <div className="flex justify-between">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleDelete}
          >
            Yes, Delete
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTaskPage;
