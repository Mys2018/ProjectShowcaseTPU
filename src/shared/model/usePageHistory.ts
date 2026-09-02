import { useEffect } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { create } from 'zustand';
import { backLabel } from '../config/backTargets';

interface PageHistoryStore {
  /** Адреса посещённых страниц вместе с хэшем — разделы различаются только им. */
  historyStack: string[];
  pushPath: (url: string) => void;
  replacePath: (url: string) => void;
  popPath: (url: string) => void;
}

export const usePageHistoryStore = create<PageHistoryStore>((set) => ({
  historyStack: [],
  pushPath: (url) => set((state) => {
    const stack = state.historyStack;
    if (stack[stack.length - 1] === url) return state;
    return { historyStack: [...stack, url] };
  }),
  replacePath: (url) => set((state) => {
    const stack = [...state.historyStack];
    if (stack.length > 0) {
       stack[stack.length - 1] = url;
    } else {
       stack.push(url);
    }
    return { historyStack: stack };
  }),
  popPath: (url) => set((state) => {
    const stack = state.historyStack;
    if (stack.length >= 2 && stack[stack.length - 2] === url) {
      return { historyStack: stack.slice(0, -1) };
    }
    const index = stack.lastIndexOf(url);
    if (index !== -1) {
      return { historyStack: stack.slice(0, index + 1) };
    }
    return { historyStack: [...stack, url] };
  })
}));

export function useHistoryTracker() {
  const location = useLocation();
  const navType = useNavigationType();
  const pushPath = usePageHistoryStore(state => state.pushPath);
  const replacePath = usePageHistoryStore(state => state.replacePath);
  const popPath = usePageHistoryStore(state => state.popPath);

  useEffect(() => {
    const url = location.pathname + location.hash;
    if (navType === 'PUSH') {
      pushPath(url);
    } else if (navType === 'REPLACE') {
      replacePath(url);
    } else if (navType === 'POP') {
      popPath(url);
    }
  }, [location.pathname, location.hash, navType, pushPath, replacePath, popPath]);
}

/**
 * Кнопка «Назад»: подпись и переход считаются из одного источника, поэтому
 * разойтись не могут — нельзя пообещать «к Моим проектам», а уйти в другое место.
 *
 * Стек живёт в памяти, и это ровно то, что нужно: пусто он бывает только при
 * заходе по прямой ссылке или после F5, то есть тогда, когда идти назад некуда
 * и navigate(-1) увёл бы из приложения. Одна проверка вместо догадок по
 * location.key.
 *
 * @param fallback куда возвращать, если истории нет. Задаёт страница: она одна
 *   знает, что для неё «уровень выше».
 */
export function useBack(fallback: string) {
  const historyStack = usePageHistoryStore(state => state.historyStack);
  const navigate = useNavigate();

  const prev = historyStack.length >= 2 ? historyStack[historyStack.length - 2] : null;
  // Страница без названия возвратом не бывает: вход, 404, раздел-редирект.
  // Такую пропускаем и уходим на фолбэк — иначе кнопка выкинула бы на экран входа.
  const prevLabel = prev ? backLabel(prev) : null;

  return {
    label: `Назад ${prevLabel ?? backLabel(fallback) ?? ''}`.trim(),
    go: () => {
      if (prevLabel) void navigate(-1);
      else void navigate(fallback);
    }
  };
}
