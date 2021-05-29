export default function fail(...errors: any[]): string {
    const result: string[] = [
        (new Date).toString(),
    ];

    errors.forEach(error => {
        if (!error) return;

        if (typeof error === 'string') {
            result.push(error);
        } else if (error instanceof Error) {
            result.push(error.name, error.message);

            if (error.stack) {
                result.push(error.stack);
            }

            for (let key in error) {
                result.push(`${key}=${(error as any)[key]}`);
            }
        } else {
            result.push(JSON.stringify(error));
        }
    });

    if (result.length === 1) {
        return '';
    }

    return result.join('; ');
}
