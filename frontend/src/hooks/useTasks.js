import { useState, useEffect } from 'react';
import { fetchTasks } from '../api';

export function useTasks(query, status, page, pageSize) {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;
    setLoading(true);
    setError(null);

    fetchTasks({ query, status, page, pageSize })
      .then((data) => {
        if (!isCurrent) return;
        setTasks(data.items);
        setTotal(data.total);
        setLoading(false);
      })
      .catch((err) => {
        if (!isCurrent) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [query, status, page, pageSize]);

  return { tasks, total, loading, error };
}
