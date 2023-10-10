# Senso Mobile App 👴📱
## Getting started
1. Install prerequisites:
    - **Node.js** `v20.5.x` (preferably through nvm)
        - Install **nvm** ([installation guide](https://github.com/nvm-sh/nvm#installing-and-updating))
            - Make sure you do not have any standalone Node.js installations when using nvm
            - Make sure you run the nvm installation with administrative rights 
        - Run `nvm install`
        - Run `node --version` to verify
    - **npm** `v9.8.x`
        - It should have been installed alongside Node.js
        - Run `npm --version` to verify
    - **Visual Studio Code** ([download link](https://code.visualstudio.com/download))
        - When opening the project, you should receive a prompt to install recommended extensions
            - Manually install extensions from `.vscode/extensions.json` if you skipped this
    - **Expo** app on your smartphone ([download link](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. Install project dependencies:
    - Run `npm install`
        - You should see a message verifying that husky was set up
            - If that was not the case, run `npx husky install`
3. Run the app:
    - Run `npm run start` (optionally with the `IP` environment variable to set the server address)
    - Scan the QR code with the Expo Go app
    - Wait for the app to compile

You should now be ready to go 🎉

## Delivering features in this repository
> ⚠️ The following description is extended to include all common troubleshooting steps. Feel free to skip some steps if you know what you are doing.

1. **Assign yourself** to an issue in this repository
    - All issues should be created from the [project page](https://github.com/orgs/zpi-2023/projects/1)
    - Ensure the issue has specified labels, status and priority
2. Create a new branch, either by
    - **(or)** `git checkout -b <branch-name>` from an up-to-date `main` branch
    - **(or)** Going to the issue, and clicking "Create new branch" in the "Development" section in the sidebar
3. Ensure you are using the the correct Node.js/npm version: `nvm use`
4. Ensure you are using up-to-date dependencies: `npm install`
5. Develop your feature
    - Move your task to the **"In Progress"** column
    - Make sure to add test coverage whenever possible
    - Check that you did not violate any conventions with `npm run lint`, `npm run format`
    - Make sure that all tests are passing with `npm run test`
6. Commit your changes
    - husky should ensure that your commit does not violate any coding conventions
    - Feel free to add multiple commits to your feature, they will get squashed anyway
7. Create a PR
    - Move your task to the **"In Review"** column
    - Notify the team that your change is pending review
    - Feel free to create the PR before finishing and include "DRAFT" in its name
8. Make sure your PR is ready to merge
    - **Wait for at least one review from another team member**
    - Wait for all CI actions to pass successfully
9. Squash and merge! 🚀
