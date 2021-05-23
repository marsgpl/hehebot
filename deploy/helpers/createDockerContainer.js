export default function createDockerContainer(containerName, imageName, options) {
    const defaultOptions = [
        `--name ${containerName}`,
    ];

    return `docker run ${defaultOptions.concat(options).join(' ')} ${imageName}`;
}
