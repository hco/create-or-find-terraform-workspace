const core = require("@actions/core");
const { findOrCreateWorkspace } = require("./src/findOrCreateWorkspace");

try {
  const workspaceName = core.getInput("workSpaceName");
  const organizationName = core.getInput("organizationName");
  const token = core.getInput("terraformToken");
  const terraformHost = core.getInput("terraformHost");
  findOrCreateWorkspace({
    workspaceName,
    organizationName,
    token,
    terraformHost,
  })
    .then((workspaceId) => {
      core.setOutput("workSpaceId", workspaceId);
    })
    .catch((error) => {
      console.error("error:" + JSON.stringify(error));
      core.setFailed(error.message);
    });
} catch (error) {
  core.setFailed(error.message);
}
