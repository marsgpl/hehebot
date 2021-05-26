export default function formatMoney(n: number): string {
    if (n < 1e4) return Math.floor(n).toFixed(0);
    else if (n < 1e6) return (n / 1e3).toFixed(1) + 'k';
    else if (n < 1e9) return (n / 1e6).toFixed(1) + 'M';
    else if (n < 1e12) return (n / 1e9).toFixed(1) + 'B';
    else return (n / 1e12).toFixed(1) + 'T';
}
