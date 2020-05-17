const core = require("@actions/core");
const { findOrCreateWorkspace } = require("./src/findOrCreateWorkspace");

try {
  const workSpaceName = core.getInput("workSpaceName");
  const organizationName = core.getInput("organizationName");
  const token = core.getInput("terraformToken");
  const terraformHost = core.getInput("terraformHost");
  findOrCreateWorkspace({
    workspaceName: "nodejs-test2",
    organizationName: "Suora",
    token:
      "t8cZ4kzpZHVrAg.atlasv1.UeKwzy2Szft7Fs2VVyzffyz2ovGmeSJzabPBCAOwxslatPFRDxIo0Qqum8KejwVPxDc",
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
