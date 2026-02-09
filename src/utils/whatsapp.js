export const normalizeIsraeliPhone = (phoneNumber) => {
  const digitsOnly = (phoneNumber || '').replace(/[^\d]/g, '');
  return digitsOnly.startsWith('0') ? digitsOnly.substring(1) : digitsOnly;
};

export const buildIndividualWhatsappUrl = (phoneNumber, message) => {
  const normalized = normalizeIsraeliPhone(phoneNumber);
  return `https://wa.me/972${normalized}?text=${encodeURIComponent(message)}`;
};
