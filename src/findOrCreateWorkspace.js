const axios = require("axios");

/**
 *
 * @param {string} workspaceName
 * @param {string} organizationName
 * @param {string} token
 * @param {?string} host
 * @returns {Promise<string>} The workspacce id
 */
const findOrCreateWorkspace = async ({
  workspaceName,
  organizationName,
  token,
  host = "app.terraform.io",
}) => {
  const terraformBaseUrl = `https://${host}/api/v2`;
  const organizationBaseUrl = `${terraformBaseUrl}/organizations/${organizationName}`;

  const client = axios.create({
    baseURL: organizationBaseUrl,
    headers: {
      "Content-Type": "application/vnd.api+json",
      Authorization: "Bearer " + token,
    },
  });

  try {
    console.log("Trying to create workspace..");
    const response = await client.post("/workspaces", {
      data: {
        attributes: {
          name: workspaceName,
        },
        type: "workspaces",
      },
    });
    let workspaceId = response.data.data.id;
    console.log(`Found it, id: ${workspaceId}`);
    return workspaceId;
  } catch (error) {
    if (error.response.status === 422) {
      console.log("Already exists, now searching...");
      // 422 means: the workspace already exists, let's try & find it
      return findWorkspaceByName(client, workspaceName);
    }

    console.error("error:" + JSON.stringify(error.response.data));
    throw error;
  }
};

/**
 * @param {AxiosInstance} client
 * @param {string} workspaceName
 * @returns {Promise<string>}
 */
const findWorkspaceByName = async (client, workspaceName) => {
  return findWorkspaceByNameOnPage(client, workspaceName, 1);
};

/**
 * @param {AxiosInstance} client
 * @param {string} workspaceName
 * @param {number} pageNumber
 * @returns {Promise<string>}
 */
const findWorkspaceByNameOnPage = async (client, workspaceName, pageNumber) => {
  console.log(`looking on page ${pageNumber}`);
  const response = await client.get(
    encodeURI(`/workspaces?page[size]=100&page[number]=${pageNumber}`)
  );

  const matchingWorkspaces = response.data.data.filter(
    (workspace) => workspace.attributes.name === workspaceName
  );

  if (matchingWorkspaces.length > 0) {
    return matchingWorkspaces[0].id;
  }

  if (response.data.meta.pagination["next-page"]) {
    return findWorkspaceByNameOnPage(
      client,
      workspaceName,
      response.data.meta.pagination["next-page"]
    );
  }

  throw new Error(`workspace with name ${workspaceName} could not be found!`);
};

module.exports = {
  findOrCreateWorkspace,
};
