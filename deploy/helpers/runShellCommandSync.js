import { execSync } from 'child_process';

export default function runShellCommandSync(command) {
    return execSync(command, { encoding: 'utf8' }).trim();
}
