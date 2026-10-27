import AsyncStorage from "@react-native-async-storage/async-storage";

import { createExpenseStore, STORAGE_KEY, type KeyValueStorage } from "../expense-store";
import { createSeedExpenses } from "../seed";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

const NOW = new Date("2026-10-27T18:00:00.000Z");
const valid = { amount: 100, categoryId: "comida", note: "  Café  ", date: "2026-10-26T12:00:00.000Z" } as const;

function memoryStorage(initial?: string): KeyValueStorage & { data: Map<string, string> } {
  const data = new Map<string, string>();
  if (initial !== undefined) data.set(STORAGE_KEY, initial);
  return {
    data,
    getItem: async (k) => data.get(k) ?? null,
    setItem: async (k, v) => void data.set(k, v),
  };
}

const newStore = (storage: KeyValueStorage = memoryStorage()) => createExpenseStore(storage, () => NOW);

describe("primera vez", () => {
  it("siembra datos de ejemplo y los guarda", async () => {
    const storage = memoryStorage();
    const store = newStore(storage);
    await store.load();
    expect(store.getState().status).toBe("ready");
    expect(store.getState().expenses).toHaveLength(createSeedExpenses(NOW).length);
    expect(JSON.parse(storage.data.get(STORAGE_KEY)!).expenses).toHaveLength(8);
  });

  it("no vuelve a sembrar si el usuario borró todo", async () => {
    const storage = memoryStorage();
    const first = newStore(storage);
    await first.load();
    for (const e of first.getState().expenses) await first.remove(e.id);

    const second = newStore(storage);
    await second.load();
    expect(second.getState().expenses).toHaveLength(0);
  });
});

describe("agregar, editar, borrar", () => {
  it("agrega, normaliza y ordena por fecha descendente", async () => {
    const store = newStore(memoryStorage(JSON.stringify({ version: 1, expenses: [] })));
    const older = await store.add({ ...valid, date: "2026-01-01T00:00:00.000Z" });
    const newer = await store.add({ ...valid, amount: 10.456, date: "2026-02-01T00:00:00.000Z" });
    expect(newer.amount).toBe(10.46);
    expect(newer.note).toBe("Café");
    expect(store.getState().expenses.map((e) => e.id)).toEqual([newer.id, older.id]);
    expect(store.getById(older.id)).toEqual(older);
  });

  it("edita solo los campos indicados", async () => {
    const store = newStore(memoryStorage(JSON.stringify({ version: 1, expenses: [] })));
    const e = await store.add(valid);
    const updated = await store.update(e.id, { amount: 55, categoryId: "ocio" });
    expect(updated).toEqual({ ...e, amount: 55, categoryId: "ocio" });
    expect(store.getById(e.id)).toEqual(updated);
  });

  it("borra y es idempotente", async () => {
    const store = newStore(memoryStorage(JSON.stringify({ version: 1, expenses: [] })));
    const e = await store.add(valid);
    await store.remove(e.id);
    await store.remove(e.id);
    expect(store.getState().expenses).toHaveLength(0);
  });

  it("clear borra todo y no vuelve a sembrar", async () => {
    const storage = memoryStorage();
    const store = newStore(storage);
    await store.clear();
    expect(store.getState().expenses).toHaveLength(0);

    const again = newStore(storage);
    await again.load();
    expect(again.getState().expenses).toHaveLength(0);
  });

  it("rechaza datos inválidos sin tocar el estado", async () => {
    const store = newStore(memoryStorage(JSON.stringify({ version: 1, expenses: [] })));
    await expect(store.add({ ...valid, amount: 0 })).rejects.toThrow("mayor que cero");
    await expect(store.add({ ...valid, amount: NaN })).rejects.toThrow();
    await expect(store.add({ ...valid, categoryId: "nope" as any })).rejects.toThrow("Categoría");
    await expect(store.add({ ...valid, date: "ayer" })).rejects.toThrow("fecha");
    await expect(store.update("no-existe", { amount: 1 })).rejects.toThrow("No existe");
    expect(store.getState().expenses).toHaveLength(0);
  });
});

describe("persistencia", () => {
  it("un store nuevo recupera lo guardado (con AsyncStorage)", async () => {
    await AsyncStorage.clear();
    const a = createExpenseStore(AsyncStorage, () => NOW);
    await a.load();
    const added = await a.add(valid);

    const b = createExpenseStore(AsyncStorage, () => NOW);
    await b.load();
    expect(b.getById(added.id)).toEqual(added);
    expect(b.getState().expenses).toHaveLength(9);
  });

  it("ignora registros inválidos y datos corruptos", async () => {
    const good = { id: "1", amount: 5, categoryId: "otros", note: "", date: "2026-10-01T00:00:00.000Z" };
    const mixed = newStore(
      memoryStorage(JSON.stringify({ version: 1, expenses: [good, { id: "2", amount: "x" }, null] })),
    );
    await mixed.load();
    expect(mixed.getState().expenses).toEqual([good]);

    const corrupt = newStore(memoryStorage("{no es json"));
    await corrupt.load();
    expect(corrupt.getState()).toEqual({ status: "ready", expenses: [] });
  });

  it("notifica a los suscriptores en cada cambio", async () => {
    const store = newStore(memoryStorage(JSON.stringify({ version: 1, expenses: [] })));
    const listener = jest.fn();
    const unsubscribe = store.subscribe(listener);
    await store.load();
    const e = await store.add(valid);
    await store.remove(e.id);
    const calls = listener.mock.calls.length;
    expect(calls).toBeGreaterThanOrEqual(3);
    unsubscribe();
    await store.add(valid);
    expect(listener.mock.calls.length).toBe(calls);
  });
});
