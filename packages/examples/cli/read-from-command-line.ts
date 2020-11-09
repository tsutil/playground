import * as readline from 'readline';

module.parent == null && main().catch(console.error);
async function main() {
    const inputInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    while (true) {
        const name = await askInput(inputInterface, 'input names to check: ');
        if (!name) {
            break;
        }
        console.log(`processing: ${name}`);
    }
    inputInterface.close();
}

async function askInput(inputInterface, question) {
    return new Promise((resolve, reject) => {
        inputInterface.question(question, (answer) => {
            resolve(answer);
        });
    });
}
