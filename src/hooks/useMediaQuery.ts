import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

    // Use addEventListener instead of addListener
    media.addEventListener('change', listener);

    return () => {
      // Use removeEventListener instead of removeListener
      media.removeEventListener('change', listener);
    };
  }, [matches, query]);

  return matches;
}
