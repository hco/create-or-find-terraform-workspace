# Github Action for creating workspaces
This action creates or finds a Terraform Workspace in the  Terraform Cloud and returns the workspace id.
It does not error if the workspace already exists.

It can be used to have preview environments per branch.

## Documentation
### Inputs

#### `workSpaceName`

**Required** The name of the workspace you want to create/find.

#### `organizationName`

**Required** Your terraform cloud Organization.

#### `terraformToken`

**Required** Your terraform cloud token. Needs to be a token that is actually allowed to create workspaces.

#### `terraformHost`

**Optional** This is the terraform cloud hostname. Defaults to `app.terraform.io`. Overwrite it for Terraform Enterprise.

### Outputs

#### `workSpaceId`

 The workspaceId for the workspace created.

### Example usage

```
uses: sarathkrish/terraform-workspace@v1.2   
with:  
  workSpaceName: MyTestWorkspace  
  organizationName: {{env.organization}}  
  terraformToken: {{secrets.Terraform_Token}}
  terraformHost: 'app.terraform.io'

```
## Attribution
This is heavily inspired by https://github.com/sarathkrish/create-terraform-workspace, but I also needed it to work when the workspace already exists.
