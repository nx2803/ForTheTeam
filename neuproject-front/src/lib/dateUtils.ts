/**
 * 날짜 문자열을 받아 D-Day를 계산합니다.
 * @param dateStr 'YYYY-MM-DD' 형식의 문자열
 * @returns 'D-DAY', 'D+n', 'D-n' 형식의 문자열
 */
export const getDDay = (dateStr: string): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [y, m, d] = dateStr.split('-').map(Number);
    const target = new Date(y, m - 1, d);
    target.setHours(0, 0, 0, 0);

    const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diff === 0) return "D-DAY";
    if (diff < 0) return `D+${Math.abs(diff)}`;
    return `D-${diff}`;
};
