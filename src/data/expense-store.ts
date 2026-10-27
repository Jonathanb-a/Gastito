import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useSyncExternalStore } from "react";

import { isCategoryId } from "./categories";
import { createSeedExpenses } from "./seed";
import type { Expense, ExpenseInput } from "./types";

export const STORAGE_KEY = "gastos:expenses:v1";

export type KeyValueStorage = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
};

export type StoreStatus = "loading" | "ready";

export type ExpenseState = {
  status: StoreStatus;
  /** Ordenados del más reciente al más antiguo. */
  expenses: readonly Expense[];
};

function roundMoney(n: number) {
  return Math.round(n * 100) / 100;
}

function newId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/** Valida y normaliza un gasto; lanza si no es válido. */
function normalize(input: ExpenseInput): ExpenseInput {
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("El monto debe ser un número mayor que cero.");
  }
  if (!isCategoryId(input.categoryId)) {
    throw new Error(`Categoría desconocida: ${String(input.categoryId)}`);
  }
  if (Number.isNaN(Date.parse(input.date))) {
    throw new Error("La fecha no es válida.");
  }
  return {
    amount: roundMoney(input.amount),
    categoryId: input.categoryId,
    note: input.note.trim(),
    date: new Date(input.date).toISOString(),
  };
}

function isStoredExpense(v: any): v is Expense {
  return (
    v != null &&
    typeof v.id === "string" &&
    typeof v.amount === "number" &&
    Number.isFinite(v.amount) &&
    isCategoryId(v.categoryId) &&
    typeof v.note === "string" &&
    typeof v.date === "string" &&
    !Number.isNaN(Date.parse(v.date))
  );
}

function sortByDateDesc(list: readonly Expense[]): Expense[] {
  return [...list].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

export function createExpenseStore(storage: KeyValueStorage, now: () => Date = () => new Date()) {
  let state: ExpenseState = { status: "loading", expenses: [] };
  const listeners = new Set<() => void>();
  let writeQueue: Promise<void> = Promise.resolve();
  let loadPromise: Promise<void> | null = null;

  const emit = (next: ExpenseState) => {
    state = next;
    listeners.forEach((l) => l());
  };

  /** Guarda en orden; un fallo de escritura no bloquea las siguientes. */
  const persist = () => {
    const snapshot = JSON.stringify({ version: 1, expenses: state.expenses });
    writeQueue = writeQueue
      .then(() => storage.setItem(STORAGE_KEY, snapshot))
      .catch((e) => console.warn("No se pudieron guardar los gastos", e));
    return writeQueue;
  };

  const mutate = (next: readonly Expense[]) => {
    emit({ status: "ready", expenses: sortByDateDesc(next) });
    return persist();
  };

  /** Carga de disco una sola vez; la primera vez (sin datos) siembra ejemplos. */
  const load = () => {
    loadPromise ??= (async () => {
      let raw: string | null = null;
      try {
        raw = await storage.getItem(STORAGE_KEY);
      } catch (e) {
        console.warn("No se pudieron leer los gastos", e);
      }
      if (raw === null) {
        const seeded = createSeedExpenses(now()).map((e) => ({ ...normalize(e), id: newId() }));
        await mutate(seeded);
        return;
      }
      let parsed: Expense[] = [];
      try {
        const data = JSON.parse(raw);
        if (Array.isArray(data?.expenses)) parsed = data.expenses.filter(isStoredExpense);
      } catch {
        // Datos corruptos: se arranca vacío en memoria, sin sembrar.
      }
      emit({ status: "ready", expenses: sortByDateDesc(parsed) });
    })();
    return loadPromise;
  };

  return {
    load,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getState: () => state,
    getById: (id: string) => state.expenses.find((e) => e.id === id),
    /** Agrega un gasto y devuelve el creado. Lanza si los datos no son válidos. */
    async add(input: ExpenseInput): Promise<Expense> {
      await load();
      const expense: Expense = { ...normalize(input), id: newId() };
      await mutate([...state.expenses, expense]);
      return expense;
    },
    /** Edita campos de un gasto. Lanza si no existe o si el resultado no es válido. */
    async update(id: string, changes: Partial<ExpenseInput>): Promise<Expense> {
      await load();
      const current = state.expenses.find((e) => e.id === id);
      if (!current) throw new Error(`No existe el gasto ${id}.`);
      const updated: Expense = { ...normalize({ ...current, ...changes }), id };
      await mutate(state.expenses.map((e) => (e.id === id ? updated : e)));
      return updated;
    },
    /** Borra todos los gastos. No se vuelven a sembrar ejemplos. */
    async clear(): Promise<void> {
      await load();
      await mutate([]);
    },
    /** Borra un gasto; no hace nada si no existe. */
    async remove(id: string): Promise<void> {
      await load();
      if (!state.expenses.some((e) => e.id === id)) return;
      await mutate(state.expenses.filter((e) => e.id !== id));
    },
  };
}

export type ExpenseStore = ReturnType<typeof createExpenseStore>;

/** AsyncStorage usa localStorage en web, así que el mismo código sirve en todas las plataformas. */
export const expenseStore = createExpenseStore(AsyncStorage);

/**
 * Hook principal: lista reactiva de gastos y acciones.
 * `loading` es true hasta leer del dispositivo.
 */
export function useExpenses(store: ExpenseStore = expenseStore) {
  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);
  useEffect(() => {
    void store.load();
  }, [store]);
  const getById = useCallback((id: string) => state.expenses.find((e) => e.id === id), [state]);
  return {
    expenses: state.expenses,
    loading: state.status === "loading",
    getById,
    add: store.add,
    update: store.update,
    remove: store.remove,
    clear: store.clear,
  };
}
