export type CollectionItem = Record<string, unknown>;
export type IndexableKey = string | number | boolean;

export class Indexer<T extends CollectionItem> {
  private indexes = new Map<keyof T, Map<IndexableKey, T[]>>();

  buildIndex<K extends keyof T>(data: T[], field: K): void {
    const fieldMap = new Map<IndexableKey, T[]>();

    for (const item of data) {
      const rawValue = item[field];

      if (
        typeof rawValue !== "string" &&
        typeof rawValue !== "number" &&
        typeof rawValue !== "boolean"
      ) {
        continue;
      }

      const bucket = fieldMap.get(rawValue) ?? [];
      bucket.push(item);
      fieldMap.set(rawValue, bucket);
    }

    this.indexes.set(field, fieldMap);
  }

  getByValue<K extends keyof T>(field: K, value: T[K]): T[] {
    const fieldMap = this.indexes.get(field);

    if (!fieldMap) {
      return [];
    }

    return fieldMap.get(value as IndexableKey) ?? [];
  }

  getByValues<K extends keyof T>(field: K, values: T[K][]): T[] {
    const fieldMap = this.indexes.get(field);

    if (!fieldMap) {
      return [];
    }

    const result = new Map<number, T>();

    for (const value of values) {
      const items = fieldMap.get(value as IndexableKey) ?? [];

      for (const item of items) {
        result.set(this.getStableHash(item), item);
      }
    }

    return [...result.values()];
  }

  hasIndex<K extends keyof T>(field: K): boolean {
    return this.indexes.has(field);
  }

  clear(): void {
    this.indexes.clear();
  }

  private getStableHash(item: T): number {
    if (typeof item.id === "number") {
      return item.id;
    }

    return JSON.stringify(item).length;
  }
}
