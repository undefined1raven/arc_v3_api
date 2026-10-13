function sortObjectKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce(
        (sorted, key) => {
          sorted[key] = sortObjectKeys(obj[key]);
          return sorted;
        },
        {} as Record<string, any>,
      );
  }

  return obj;
}

export { sortObjectKeys };
