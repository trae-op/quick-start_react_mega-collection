import { type CollectionItem, Indexer } from "./core";

export type FilterCriterion<T extends CollectionItem> = {
  field: keyof T;
  values: T[keyof T][];
};

export class FilterEngine<T extends CollectionItem> {
  private indexer: Indexer<T>;

  constructor(indexer: Indexer<T>) {
    this.indexer = indexer;
  }

  filter(data: T[], criteria: FilterCriterion<T>[]): T[] {
    if (criteria.length === 0) {
      return data;
    }

    let result: T[] | null = null;

    for (const criterion of criteria) {
      const subset = this.indexer.hasIndex(criterion.field)
        ? this.indexer.getByValues(criterion.field, criterion.values)
        : data.filter((item) =>
            criterion.values.includes(item[criterion.field]),
          );

      if (result === null) {
        result = subset;
        continue;
      }

      const subsetSet = new Set(subset.map((item) => this.getStableHash(item)));
      result = result.filter((item) => subsetSet.has(this.getStableHash(item)));
    }

    return result ?? data;
  }

  private getStableHash(item: T): number {
    if (typeof item.id === "number") {
      return item.id;
    }

    return JSON.stringify(item).length;
  }
}

export { Indexer };
