/**
 * 날짜 문자열을 받아 D-Day를 계산합니다. 항상 오늘(현재 날짜) 기준입니다.
 * @param dateStr 'YYYY-MM-DD' 형식의 문자열
 * @returns 'D-DAY', 'D-n' 형식의 문자열, 또는 지난 날짜는 null
 */
export const getDDay = (dateStr: string): string | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [y, m, d] = dateStr.split('-').map(Number);
    const target = new Date(y, m - 1, d);
    target.setHours(0, 0, 0, 0);

    const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diff < 0) return null; // 지난 경기는 표시 안 함
    if (diff === 0) return "D-DAY";
    return `D-${diff}`;
};
