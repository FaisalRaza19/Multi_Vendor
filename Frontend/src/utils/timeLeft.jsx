const timeLeft = (dateString) => {
    const targetDate = new Date(dateString);
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) return "Expired";

    let seconds = Math.floor(diff / 1000) % 60;
    let minutes = Math.floor(diff / (1000 * 60)) % 60;
    let hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    let days = Math.floor(diff / (1000 * 60 * 60 * 24)) % 30;
    let months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30)) % 12;
    let years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

    let result = "";
    if (years > 0) result += `${years}year${years > 1 ? 's' : ''},`;
    if (months > 0) result += `${months}month${months > 1 ? 's' : ''},`;
    if (days > 0) result += `${days}day${days > 1 ? 's' : ''},`;
    if (hours > 0) result += `${hours}h,`;
    if (minutes > 0) result += `${minutes}m,`;
    if (seconds > 0) result += `${seconds}sec`;

    return result.replace(/, $/, "");
};

const formatDate = (date) => {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid Date');
    }

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const hours = String(parsedDate.getHours()).padStart(2, '0');
    const minutes = String(parsedDate.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};
export { timeLeft, formatDate };