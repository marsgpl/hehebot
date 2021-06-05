import fs from 'fs';
import path from 'path';

import runShellCommandSync from './helpers/runShellCommandSync.js';
import getVersion from './helpers/getVersion.js';
import getTimestamp from './helpers/getTimestamp.js';
import createDockerContainer from './helpers/createDockerContainer.js';
import destroyDockerContainer from './helpers/destroyDockerContainer.js';

const DOCKER_LOGIN_CMD = 'echo OPqsj9d02e8nrJsoidvh44pHBV | docker login --username ewj9f4wsk3j90rghtOJ02fhig --password-stdin docker.marsgpl.com';
const DOCKER_REMOVE_DANGLING_IMAGES_CMD = 'docker images -q -f dangling=true | xargs docker image rm &>/dev/null || true';

const DOCKER_IMAGE_NAME = 'docker.marsgpl.com/hehebot:latest';
const DOCKER_CONTAINER_NAME = 'hehebot';

const HOST = 'workers-2';

let cacheFiles = [];

const CWD = path.dirname(new URL(import.meta.url).pathname);
process.chdir(`${CWD}/..`);

console.log('Build code ...');
{
    runShellCommandSync('rm -rf build.prod/');
    runShellCommandSync('npm run build');
}
console.log('Uglify code ...');
{
    runShellCommandSync('rm -rf build.uglified/');
    runShellCommandSync('npm run uglify');
}
console.log('Patch config ...');
{
    const config = JSON.parse(fs.readFileSync('./deploy/config.json', { encoding: 'utf8' }));
    config.build = {
        version: getVersion(),
        timestamp: getTimestamp(),
    };
    cacheFiles = config.bots.map(bot => {
        const dockerPath = bot.cacheFile;
        const osPath = dockerPath.replace('/tmp/', '/home/marsgpl/');
        return {
            dockerPath,
            osPath,
        };
    });
    console.log('🔸 build:', config.build);
    console.log('🔸 cacheFiles:', cacheFiles);
    fs.writeFileSync(`build.uglified/config.json`, JSON.stringify(config), { encoding: 'utf8' });
}
console.log('Docker login ...');
{
    runShellCommandSync(DOCKER_LOGIN_CMD);
}
console.log('Build docker image ...');
{
    console.log('🔸 docker image name:', DOCKER_IMAGE_NAME);
    runShellCommandSync(`docker image rm -f ${DOCKER_IMAGE_NAME} || true`);
    const dockerImageId = runShellCommandSync(`docker build --file Dockerfile.prod --tag=${DOCKER_IMAGE_NAME} --quiet .`);
    console.log('🔸 docker image id:', dockerImageId);
}
console.log('Push docker image ...');
{
    runShellCommandSync(`docker push ${DOCKER_IMAGE_NAME}`);
}
console.log('Pull docker image ...');
{
    runShellCommandSync(`ssh marsgpl@${HOST} 'docker pull ${DOCKER_IMAGE_NAME}'`);
}
console.log('Prepare cache ...');
{
    const cmd = cacheFiles.map(({ dockerPath, osPath }) =>
        `touch ${osPath} && chown root:root ${osPath}`);
    runShellCommandSync(`ssh ${HOST} '${cmd.join(' && ')}'`);
}
console.log('Restart workers ...');
{
    const cmd = [];
    cmd.push(destroyDockerContainer(DOCKER_CONTAINER_NAME));
    cmd.push(createDockerContainer(DOCKER_CONTAINER_NAME, DOCKER_IMAGE_NAME, [
        '--detach',
        '--restart no',
        '--read-only',
        '--network host',
        `--hostname hehebot`,
        '--stop-signal SIGUSR1',
        ...cacheFiles.map(({ dockerPath, osPath }) =>
            `--volume ${osPath}:${dockerPath}:Z`),
    ]));
    runShellCommandSync(`ssh ${HOST} '${cmd.join(' && ')}'`);
}
console.log('Cleanup docker ...');
{
    runShellCommandSync(`ssh marsgpl@${HOST} '${DOCKER_REMOVE_DANGLING_IMAGES_CMD}'`);
}
