export const normalizePhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '');
  if (!digits) {
    return '';
  }
  const normalized = digits.startsWith('7') ? digits : `7${digits}`;
  return `+${normalized}`;
};
