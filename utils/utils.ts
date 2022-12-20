export const formatDuration = (seconds: number) => {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);



    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
};

export function convertSeconds(s: number): string {
    const date = new Date(s * 1000);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
    let hours = date.getHours()
    let suffix = ""
    if (hours > 12) {
        suffix = "PM"
        hours = hours - 12
    }
    else {
        suffix = "AM"
        if (hours == 0) {
            hours = 12
        }
    }
    const minutes = date.getMinutes();

    return `${month} ${day}, ${year} at ${hours}:${minutes} ${suffix} `
}


