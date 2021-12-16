export function validateTime(time: string): boolean {
    let test = /\d{2}:\d{2}/.test(time);
    if (!test) 
        return false;

    let [h, m] = time.split(":").map(t => Number(t));
    return h >= 0 && h <= 23 && m >= 0 && m < 60;
}