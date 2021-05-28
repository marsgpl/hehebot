import fs from 'fs';
import path from 'path';

import runShellCommandSync from './helpers/runShellCommandSync.js';
import getVersion from './helpers/getVersion.js';
import getTimestamp from './helpers/getTimestamp.js';
import createDockerContainer from './helpers/createDockerContainer.js';
import destroyDockerContainer from './helpers/destroyDockerContainer.js';

const CACHE_FILE_LOCAL = '/home/marsgpl/.hehebot.lava.cache.json';
const CACHE_FILE_CONTAINER = '/tmp/.hehebot.lava.cache.json';
const DOCKER_CONTAINER_NAME = 'hehebot';
const DOCKER_IMAGE_NAME = 'docker.marsgpl.com/hehebot:latest';
const DOCKER_LOGIN_CMD = 'echo OPqsj9d02e8nrJsoidvh44pHBV | docker login --username ewj9f4wsk3j90rghtOJ02fhig --password-stdin docker.marsgpl.com';
const DOCKER_REMOVE_DANGLING_IMAGES_CMD = 'docker images -q -f dangling=true | xargs docker image rm &>/dev/null || true';
const CWD = path.dirname(new URL(import.meta.url).pathname);

let cmd;

process.chdir(`${CWD}/..`);

console.log('Build code ...');
    runShellCommandSync('rm -rf build.prod/');
    runShellCommandSync('npm run build');

console.log('Uglify code ...');
    runShellCommandSync('rm -rf build.uglified/');
    runShellCommandSync('npm run uglify');

console.log('Patch config ...');
    const config = JSON.parse(fs.readFileSync('deploy/config.json', { encoding: 'utf8' }));
    config.bot.cacheFile = CACHE_FILE_CONTAINER;
    config.build = {
        version: getVersion(),
        timestamp: getTimestamp(),
    };
    console.log('🔸 build:', config.build);
    fs.writeFileSync(`build.uglified/config.json`, JSON.stringify(config), { encoding: 'utf8' });

console.log('Docker login ...');
    runShellCommandSync(DOCKER_LOGIN_CMD);

console.log('Build docker image ...');
    console.log('🔸 docker image name:', DOCKER_IMAGE_NAME);
    runShellCommandSync(`docker image rm -f ${DOCKER_IMAGE_NAME} || true`);
    const dockerImageId = runShellCommandSync(`docker build --file Dockerfile.prod --tag=${DOCKER_IMAGE_NAME} --quiet .`);
    console.log('🔸 docker image id:', dockerImageId);

console.log('Push docker image ...');
    runShellCommandSync(`docker push ${DOCKER_IMAGE_NAME}`);

console.log('Pull docker image ...');
    runShellCommandSync(`ssh marsgpl@workers 'docker pull ${DOCKER_IMAGE_NAME}'`);

console.log('Prepare cache ...');
    runShellCommandSync(`ssh workers 'touch ${CACHE_FILE_LOCAL} && chown root:root ${CACHE_FILE_LOCAL}'`);

console.log('Restart worker ...');
    cmd = [];
    cmd.push(destroyDockerContainer(DOCKER_CONTAINER_NAME));
    cmd.push(createDockerContainer(DOCKER_CONTAINER_NAME, DOCKER_IMAGE_NAME, [
        '--detach',
        '--restart no',
        '--read-only',
        '--network host',
        `--hostname hehebot`,
        '--stop-signal SIGUSR1',
        `--volume ${CACHE_FILE_LOCAL}:${CACHE_FILE_CONTAINER}:Z`,
    ]));
    runShellCommandSync(`ssh workers '${cmd.join(' && ')}'`);

console.log('Cleanup docker ...');
    runShellCommandSync(`ssh marsgpl@workers '${DOCKER_REMOVE_DANGLING_IMAGES_CMD}'`);
