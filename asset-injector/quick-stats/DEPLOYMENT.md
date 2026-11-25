# Quick Stats Deployment Record

Update this each time something is pasted into Drupal. The repo does not deploy automatically, so this table is the link between Git and Drupal.

| Asset | Repo file | Drupal location | Path scope | Git commit | Deployed (date, by) | Tested |
|---|---|---|---|---|---|---|
| Quick Stats HTML | `quick-stats.html` | Open embed block (TBD) | /quick-stats | | | |
| Quick Stats CSS | `quick-stats.css` | CSS injector (TBD) | /quick-stats | | | |
| Quick Stats JS | `quick-stats.js` | JS injector (TBD) | /quick-stats | | | |
| Shared utility (existing, unchanged) | `../global-asset-injector-css-js/Global_SDO_Utilities_v2_combined.js` | Existing shared JS injector (exact Drupal label TBD) | Quick Stats and several prototype dashboards (exact paths TBD) | | Existing deployment; not changed | |

## Rollback

Git history is the rollback. To go back, open the earlier version of the file on GitHub (file History, or the `quick-stats-launch` tag once created), copy it, and paste it into Drupal. Keep the repo and Drupal matching by pasting from committed files and updating the table above after each paste.
