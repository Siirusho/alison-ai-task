import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

class TimeHelpers {
  static formatTimestamp = (timestamp: number): string => {
    return dayjs(timestamp).format("HH:mm");
  };

  static formatRelativeTime = (timestamp: number): string => {
    return dayjs(timestamp).fromNow();
  };

  static getExpirationText = (expiresAt?: number): string | null => {
    if (!expiresAt) return null;

    const now = dayjs();
    const expiration = dayjs(expiresAt);
    const remainingSeconds = expiration.diff(now, "second");

    if (remainingSeconds <= 0) return "Expired...";
    if (remainingSeconds < 60) return `Expires in ${remainingSeconds}s...`;
    return `Expires in ${Math.ceil(remainingSeconds / 60)}m...`;
  };

  static isMessageExpired = (expiresAt?: number): boolean => {
    if (!expiresAt) return false;
    return dayjs(expiresAt).isBefore(dayjs());
  };

  static generateId = (prefix: string = "random-id"): string => {
    return `${prefix}-${dayjs().valueOf()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  };
}

export { TimeHelpers };
