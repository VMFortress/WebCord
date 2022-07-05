/**
 * crash.ts – funtion/s to report a bug on GitHub.
 */

import { app } from "electron/main";
import { shell } from "electron/common"
import { appInfo } from "../../common/modules/client"

/**
 * Generates a link to new GitHub issue, based on `bug_report.md`
 * and current hardware / software configuration. This makes it
 * easy to aquire needed details (except screenshot, because of
 * the lack of the GitHub support to do that via the CDN or using
 * 'base64' images).
 * 
 * @property reason – A bug description (app failure reason).
 * @todo Parse (commented) values to be compatible with the template.
 */
export async function createGithubIssue(reason?: string): Promise<void> {
  /** An URL to the new GitHub issue, based on YAML forms. */
  const githubIssueUrl = new URL(
    "https://github.com/"+appInfo.repository.name+"/issues/new"+
            "?assignees=SpacingBat3" + "&labels=bug" + "&template=bug.yml" +
            //'&platform='
            //'&architecture='
            "&electron_version=" + encodeURIComponent(process.versions.electron) +
            "&app_version=" + encodeURIComponent(app.getVersion()) +
            "&additional=" + encodeURIComponent("**Notice:** This issue was automatically generated by " + app.getName() + ".") +
            (reason ? "&description=" + encodeURIComponent(reason) : "")
  )

  /* Verify origin and open URL in default browser. */

  if (githubIssueUrl.origin === "https://github.com")
    return shell.openExternal(githubIssueUrl.href);
}