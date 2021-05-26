export default function lowest(...nums: number[]): number | undefined {
    let lowest: number | undefined = undefined;

    nums.forEach(n => {
        if (!isNaN(n)) {
            lowest = lowest === undefined ? n : Math.min(lowest, n);
        }
    });

    return lowest;
}
