/**
 *
 * EXERCISE 1
 *
 * @returns {Promise<3>}
 */
async function makePromiseResolveWith3() {
  return 3; // By returning 3, JavaScript wraps it in a resolved Promise automatically.
}

/**
 *
 * EXERCISE 2
 *
 * @returns {Promise<,"Boo!">}
 */
async function makePromiseRejectWithBoo() {
  throw "Boo!"; // `throw` in an async function creates a rejected Promise with the given error.
}

/**
 *
 * EXERCISE 3
 *
 * @param {Promise} firstPromise
 * @param {function} slowAsyncProcess
 */
async function chainTwoAsyncProcesses(firstPromise, slowAsyncProcess) {
  const firstResult = await firstPromise; // Wait for `firstPromise` to resolve
  const finalResult = await slowAsyncProcess(firstResult); // Pass result to `slowAsyncProcess`
  return finalResult; // Return the result of `slowAsyncProcess`
}

/**
 *
 * EXERCISE 4
 *
 * @param {function} getUserById
 * @param {function} getOrganizationById
 */
function makeAsyncGetUserByIdWithOrganization(
  getUserById,
  getOrganizationById
) {
  /**
   * @param {string} userId
   */
  return async function getUserByIdWithOrganization(userId) {
    const user = await getUserById(userId); // Wait for `getUserById` to resolve
    if (!user) return undefined; // Return undefined if user is not found
    const organization = await getOrganizationById(user.organizationId);
    return { ...user, organization }; // Return combined user and organization info
  };
}

/**
 *
 * EXERCISE 5
 *
 * @param {function} getUserById
 * @param {function} getOrganizationById
 */
function makeAsyncGetUserAndOrganizationById(getUserById, getOrganizationById) {
  /**
   * @param {string} userId
   * @param {string} organizationId
   */
  return async function getUserByIdWithOrganization(userId, organizationId) {
    const [user, organization] = await Promise.all([
      getUserById(userId),
      getOrganizationById(organizationId),
    ]);
    if (!user || !organization) return undefined; // Return undefined if either is missing
    return { ...user, organization }; // Return combined user and organization info
  };
}

/**
 *
 * EXERCISE 6
 *
 * @param {function} getUserById
 * @param {function} getOrganizationById
 */
function makeAsyncGetUsersByIdWithOrganizations(
  getUserById,
  getOrganizationById
) {
  /**
   * @param {Array<string>} userIds
   */
  return async function getUserByIdWithOrganization(userIds) {
    const users = await Promise.all(userIds.map((id) => getUserById(id))); // Fetch all users concurrently

    // Map over users, fetching organization data for each concurrently if user exists
    const usersWithOrganizations = await Promise.all(
      users.map(async (user) => {
        if (!user) return undefined; // If user doesn't exist, return undefined
        const organization = await getOrganizationById(user.organizationId); // Fetch organization
        return organization ? { ...user, organization } : undefined; // Return enriched user or undefined
      })
    );

    return usersWithOrganizations; // Return array with user-organization info in order
  };
}

module.exports = {
  makePromiseResolveWith3,
  makePromiseRejectWithBoo,
  chainTwoAsyncProcesses,
  makeAsyncGetUserByIdWithOrganization,
  makeAsyncGetUserAndOrganizationById,
  makeAsyncGetUsersByIdWithOrganizations,
};
