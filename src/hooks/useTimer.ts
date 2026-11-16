import {useEffect, useState} from 'react';

/**
 * Elapsed-time clock. Kept in its own hook so only the tiny <GameTimer>
 * component re-renders twice a second — the board never does.
 */
export function useTimer(running: boolean, startedAt: number): number {
  const [ms, setMs] = useState(0);

  useEffect(() => {
    setMs(Math.max(0, Date.now() - startedAt));
    if (!running) {
      return;
    }
    const id = setInterval(() => {
      setMs(Math.max(0, Date.now() - startedAt));
    }, 500);
    return () => clearInterval(id);
  }, [running, startedAt]);

  return ms;
}

export default useTimer;
