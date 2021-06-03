const CLASS_WHIP = 1;
const CLASS_ROSE = 2;
const CLASS_MARK = 3;
const CLASS_UNKNOWN = 0;

export default function isClassAStrongerThanClassB(
    classA: number | string,
    classB: number | string
): boolean {
    classA = Number(classA) || CLASS_UNKNOWN;
    classB = Number(classB) || CLASS_UNKNOWN;

    if (classA === CLASS_WHIP && classB === CLASS_MARK) return true;
    else if (classA === CLASS_ROSE && classB === CLASS_WHIP) return true;
    else if (classA === CLASS_MARK && classB === CLASS_ROSE) return true;
    else return false;
}
