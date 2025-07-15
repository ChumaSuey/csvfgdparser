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
  const filterEntity = (e) => {
    if (typeof e === 'string') {
      return e.toLowerCase().includes(lowerQuery);
    } else {
      const searchableString = `${e.name} ${e.description} ${e.properties.join(' ')}`.toLowerCase();
      return searchableString.includes(lowerQuery);
    }
  };
  return {
    solid: solidEntities.filter(filterEntity),
    point: pointEntities.filter(filterEntity),
    base: baseEntities.filter(filterEntity),
  };
}