export function searchItemsByName(items, query) {
    const regex = new RegExp(query?.value?.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&"), 'i'); // Escaping special characters in the query
  return items.filter(item => regex.test(item.name));
  }