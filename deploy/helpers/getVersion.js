import runShellCommandSync from './runShellCommandSync.js';

export default function getVersion() {
    return runShellCommandSync('git rev-parse HEAD');
}
