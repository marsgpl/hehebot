export default function destroyDockerContainer(containerName) {
    return [
        `(docker container stop ${containerName} || true)`,
        `(docker container rm ${containerName} || true)`,
    ].join(' && ');
}
