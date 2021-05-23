import util from 'util';
import { exec } from 'child_process';

exec = util.promisify(exec);

export default async function runShellCommand(command) {
    const { stdout, stderr } = await exec(command, { encoding: 'utf8' });

    if (stderr) {
        throw Error(`Error running command '${command}': ${stderr.trim()}`);
    }

    return stdout.trim();
}
