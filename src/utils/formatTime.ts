export const calculateTimeLeft = (endTime: Date) => {
  const currentTime = new Date().getTime();
  const difference = endTime.getTime() - currentTime;
  const secondsSinceEpoch = difference / 1000;

  if (difference <= 0) {
    return [0, 0, 0, 0];
  }

  const days = Math.floor(secondsSinceEpoch / (60 * 60 * 24));
  const hours = Math.floor((secondsSinceEpoch / 3600) % 24);
  const minutes = Math.floor((secondsSinceEpoch / 60) % 60);
  const seconds = Math.floor(secondsSinceEpoch % 60);

  return [days, hours, minutes, seconds];
};
