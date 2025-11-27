export const formatAmount = (value:string) => {
  return `₩ ${parseInt(value, 10).toLocaleString()}`;
}

export const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};