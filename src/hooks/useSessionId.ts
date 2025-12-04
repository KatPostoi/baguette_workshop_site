import { useLayoutEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export const useSessionId = () => {
  const [sessionId, setSessionId] = useState('');

  useLayoutEffect(() => {
    const sessionIdFromUrl = new URLSearchParams(window.location.search).get('sessionId') ?? '';
    if (!sessionIdFromUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('sessionId', uuidv4());
      window.location.replace(url.toString());
      return;
    }
    setSessionId(sessionIdFromUrl);
  }, [window.location.search]);

  return sessionId;
};
