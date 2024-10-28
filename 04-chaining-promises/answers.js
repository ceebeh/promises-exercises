/**
 *
 * EXERCISE 1
 *
 * @param {Promise} promise
 * @param {function} asyncTransformer
 */
function flatMapPromise(promise, asyncTransformer) {
  return new Promise((resolve, reject) => {
    promise
      .then((result) => asyncTransformer(result).then(resolve).catch(reject))
      .catch(reject);
  });
}

/**
 *
 * EXERCISE 2
 *
 * @param {Promise} firstPromise
 * @param {function} slowAsyncProcess
 */
function chainTwoAsyncProcesses(firstPromise, slowAsyncProcess) {
  return firstPromise.then((result) => slowAsyncProcess(result));
}

/**
 *
 * EXERCISE 3
 *
 * @param {function} getUserById
 * @param {function} getOrganizationById
 */
function makeGetUserByIdWithOrganization(getUserById, getOrganizationById) {
  return function getUserByIdWithOrganization(userId) {
    return getUserById(userId).then((user) => {
      if (!user) return undefined;
      return getOrganizationById(user.organizationId)
        .then((org) => ({ ...user, organization: org }))
        .catch(() => undefined);
    });
  };
}

/**
 *
 * EXERCISE 4
 *
 * @param {function} getUserById
 * @param {function} getOrganizationById
 */
function makeGetUserAndOrganizationById(getUserById, getOrganizationById) {
  /**
   * @param {string} userId
   * @param {string} organizationId
   */
  return function getUserByIdWithOrganization(userId, organizationId) {
    return Promise.all([
      getUserById(userId),
      getOrganizationById(organizationId),
    ]).then(([user, org]) => {
      if (!user || !org) return undefined;
      return { ...user, organization: org };
    });
  };
}

/**
 *
 * EXERCISE 5
 *
 * @param {function} getUserById
 * @param {function} getOrganizationById
 */
function makeGetUsersByIdWithOrganizations(getUserById, getOrganizationById) {
  /**
   * @param {Array<string>} userIds
   */
  return function getUserByIdWithOrganization(userIds) {
    return Promise.all(
      userIds.map((userId) =>
        getUserById(userId).then((user) => {
          if (!user) return undefined;
          return getOrganizationById(user.organizationId)
            .then((org) => ({ ...user, organization: org }))
            .catch(() => undefined);
        })
      )
    );
  };
}

module.exports = {
  flatMapPromise,
  chainTwoAsyncProcesses,
  makeGetUserByIdWithOrganization,
  makeGetUserAndOrganizationById,
  makeGetUsersByIdWithOrganizations,
};
