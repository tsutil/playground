/* eslint-disable quotes */
// dev.env: API_BASE_PATH="https://tsutil-api-staging.grover.com/api"
// require('module-alias/register');
// const { dump } = require('@tsutil/utils');
const fetch = require('node-fetch').default;
const readline = require('readline');
// const util = require('ushkienota');

module.parent == null && main().catch(console.error);
async function main() {
    await checkNameCli();
}

async function checkNameCli() {
    const interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let finished = false;
    const question = 'input names to check: ';
    while (!finished) {
        const name = await getInput(interface, question);
        if (!name) {
            finished = true;
        } else {
            await checkNames(name);
        }
    }
    interface.close();
}

async function checkNames(names) {
    const arr = names.trim().split(' ');
    for (const name of arr) {
        const { exists, url } = await checkGithubUserName(name);
        console.log(`${url} ${exists ? 'exists' : 'available'}`);
    }
}

async function getInput(interface, question) {
    return new Promise((resolve, reject) => {
        interface.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function checkGithubUserName(name) {
    let url = `https://github.com/${name}`;
    const res = await fetch({ href: url });
    const exists = res.status < 500 ? res.status != 404 : null;

    return { url, exists };
}
