import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  format,
} from "date-fns";

export const getFormattedDateString = (date) => {
  const now = new Date();
  const givenDate = new Date(date);
  const diffInMinutes = differenceInMinutes(now, givenDate);
  const diffInHours = differenceInHours(now, givenDate);
  const diffInDays = differenceInDays(now, givenDate);

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 365) {
    return format(givenDate, "MMM dd HH:mm");
  } else {
    return format(givenDate, "MMM dd yyyy HH:mm");
  }
};
