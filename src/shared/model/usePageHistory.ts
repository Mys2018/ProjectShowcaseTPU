import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { create } from 'zustand';

interface PageHistoryStore {
  titles: Record<string, string>;
  setPageTitle: (pathname: string, title: string) => void;
  historyStack: string[];
  pushPath: (pathname: string) => void;
  replacePath: (pathname: string) => void;
  popPath: (pathname: string) => void;
}

export const usePageHistoryStore = create<PageHistoryStore>((set) => ({
  titles: {},
  setPageTitle: (pathname, title) => set((state) => ({ titles: { ...state.titles, [pathname]: title } })),
  historyStack: [],
  pushPath: (pathname) => set((state) => {
    const stack = state.historyStack;
    if (stack[stack.length - 1] === pathname) return state;
    return { historyStack: [...stack, pathname] };
  }),
  replacePath: (pathname) => set((state) => {
    const stack = [...state.historyStack];
    if (stack.length > 0) {
       stack[stack.length - 1] = pathname;
    } else {
       stack.push(pathname);
    }
    return { historyStack: stack };
  }),
  popPath: (pathname) => set((state) => {
    const stack = state.historyStack;
    if (stack.length >= 2 && stack[stack.length - 2] === pathname) {
      return { historyStack: stack.slice(0, -1) };
    }
    const index = stack.lastIndexOf(pathname);
    if (index !== -1) {
      return { historyStack: stack.slice(0, index + 1) };
    }
    return { historyStack: [...stack, pathname] };
  })
}));

export function useHistoryTracker() {
  const location = useLocation();
  const navType = useNavigationType();
  const pushPath = usePageHistoryStore(state => state.pushPath);
  const replacePath = usePageHistoryStore(state => state.replacePath);
  const popPath = usePageHistoryStore(state => state.popPath);

  useEffect(() => {
    if (navType === 'PUSH') {
      pushPath(location.pathname);
    } else if (navType === 'REPLACE') {
      replacePath(location.pathname);
    } else if (navType === 'POP') {
      popPath(location.pathname);
    }
  }, [location.pathname, navType, pushPath, replacePath, popPath]);
}

export function usePageTitle(title: string) {
  const location = useLocation();
  const setPageTitle = usePageHistoryStore(state => state.setPageTitle);

  useEffect(() => {
    setPageTitle(location.pathname, title);
  }, [location.pathname, title, setPageTitle]);
}

export function usePreviousPageTitle(fallback: string) {
  const historyStack = usePageHistoryStore(state => state.historyStack);
  const titles = usePageHistoryStore(state => state.titles);
  
  if (historyStack.length >= 2) {
    const prevPath = historyStack[historyStack.length - 2];
    const title = titles[prevPath];
    if (title) {
       return `Назад к ${title}`;
    }
  }
  return fallback;
}
