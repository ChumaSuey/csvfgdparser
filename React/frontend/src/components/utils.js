/**
 * Searches for an entity by name across three lists.
 * @param {string} query - The search term.
 * @param {Array} solidEntities
 * @param {Array} pointEntities
 * @param {Array} baseEntities
 * @returns {Object} Results with matches from each list.
 */
export function searchEntities(query, solidEntities, pointEntities, baseEntities) {
  const lowerQuery = query.trim().toLowerCase();
  return {
    solid: solidEntities.filter(e => String(e).toLowerCase().includes(lowerQuery)),
    point: pointEntities.filter(e => String(e).toLowerCase().includes(lowerQuery)),
    base: baseEntities.filter(e => {
      const searchableString = `${e.name} ${e.description} ${e.properties.join(' ')}`.toLowerCase();
      return searchableString.includes(lowerQuery);
    }),
  };
}