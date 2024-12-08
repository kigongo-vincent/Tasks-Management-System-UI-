// Function to get the value of a nested key from an object
function getNestedValue(obj: any, key: string): any {
  return key.split('.').reduce((acc, part) => {
    return acc && acc[part] !== undefined ? acc[part] : undefined;
  }, obj);
}

// Function to sort an array of objects based on a given key and order
export function sortArray(arr: any[], key: string, order: 'asc' | 'desc' = 'asc'): any[] {
  return arr.sort((a, b) => {
    let comparison = 0;

    // Retrieve the values of the key in both objects
    let aValue = getNestedValue(a, key);
    let bValue = getNestedValue(b, key);

    // If the key is "duration", cast the values to numbers
    if (key === 'duration') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }

    // If both values are available, proceed with comparison
    if (aValue !== undefined && bValue !== undefined) {
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        // Perform case-insensitive comparison for strings
        comparison = aValue.trim().localeCompare(bValue.trim(), undefined, { sensitivity: 'accent' });
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue; // For numeric comparison
      }
    } else if (aValue === undefined && bValue !== undefined) {
      comparison = -1; // Treat undefined as "less than" defined values
    } else if (aValue !== undefined && bValue === undefined) {
      comparison = 1; // Treat defined values as "greater than" undefined
    }

    // Reverse comparison if order is 'desc'
    if (order === 'desc') {
      comparison = -comparison;
    }

    return comparison;
  });
}
