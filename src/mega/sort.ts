import type { CollectionItem } from "./core";

export type SortDirection = "asc" | "desc";

export type SortDescriptor<T extends CollectionItem> = {
  field: keyof T;
  direction: SortDirection;
};

export class SortEngine<T extends CollectionItem> {
  sort(data: T[], descriptors: SortDescriptor<T>[], inPlace = false): T[] {
    const base = inPlace ? data : [...data];

    return base.sort((left, right) => {
      for (const descriptor of descriptors) {
        const leftValue = left[descriptor.field];
        const rightValue = right[descriptor.field];

        const comparison = this.compareValues(leftValue, rightValue);

        if (comparison !== 0) {
          return descriptor.direction === "asc" ? comparison : comparison * -1;
        }
      }

      return 0;
    });
  }

  private compareValues(left: unknown, right: unknown): number {
    if (typeof left === "number" && typeof right === "number") {
      return left - right;
    }

    return String(left).localeCompare(String(right));
  }
}
