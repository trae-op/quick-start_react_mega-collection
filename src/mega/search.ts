import { type CollectionItem, type IndexableKey, Indexer } from "./core";

type IndexedTextItem<T> = {
  original: T;
  normalized: string;
};

export class TextSearchEngine<T extends CollectionItem> {
  private textStore = new Map<keyof T, IndexedTextItem<T>[]>();
  private trigramIndex = new Map<keyof T, Map<string, Set<number>>>();

  buildIndex<K extends keyof T>(data: T[], field: K): void {
    const store: IndexedTextItem<T>[] = [];
    const trigramMap = new Map<string, Set<number>>();

    data.forEach((item, index) => {
      const rawValue = item[field];

      if (typeof rawValue !== "string") {
        return;
      }

      const normalized = rawValue.toLowerCase();
      store.push({ original: item, normalized });

      for (const trigram of this.getTrigrams(normalized)) {
        const bucket = trigramMap.get(trigram) ?? new Set<number>();
        bucket.add(index);
        trigramMap.set(trigram, bucket);
      }
    });

    this.textStore.set(field, store);
    this.trigramIndex.set(field, trigramMap);
  }

  search<K extends keyof T>(field: K, query: string): T[] {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return this.textStore.get(field)?.map((item) => item.original) ?? [];
    }

    const store = this.textStore.get(field) ?? [];
    const index = this.trigramIndex.get(field);

    if (!index) {
      return store
        .filter((item) => item.normalized.includes(normalizedQuery))
        .map((item) => item.original);
    }

    const queryTrigrams = this.getTrigrams(normalizedQuery);

    if (queryTrigrams.length === 0) {
      return store
        .filter((item) => item.normalized.includes(normalizedQuery))
        .map((item) => item.original);
    }

    let candidates: Set<number> | null = null;

    for (const trigram of queryTrigrams) {
      const bucket = index.get(trigram);

      if (!bucket) {
        return [];
      }

      if (candidates === null) {
        candidates = new Set(bucket);
      } else {
        candidates = new Set<number>(
          [...candidates].filter((value: number) => bucket.has(value)),
        );
      }

      if (candidates.size === 0) {
        return [];
      }
    }

    return [...(candidates ?? new Set<number>())]
      .map((value) => store[value])
      .filter((item): item is IndexedTextItem<T> => Boolean(item))
      .filter((item) => item.normalized.includes(normalizedQuery))
      .map((item) => item.original);
  }

  hasIndex<K extends keyof T>(field: K): boolean {
    return this.textStore.has(field);
  }

  clear(): void {
    this.textStore.clear();
    this.trigramIndex.clear();
  }

  private getTrigrams(input: string): string[] {
    if (input.length < 3) {
      return [input];
    }

    const trigrams = new Set<string>();

    for (let i = 0; i <= input.length - 3; i += 1) {
      trigrams.add(input.slice(i, i + 3));
    }

    return [...trigrams.values()];
  }
}

export { Indexer };
export type { CollectionItem, IndexableKey };
