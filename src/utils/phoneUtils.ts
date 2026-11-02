// Helper to convert Persian/Arabic digits to standard English digits and clean input
export function normalizePhoneDigits(input: string): string {
  if (!input) return '';
  return input
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
    .replace(/[^\d]/g, '');
}

// Check if string is a valid 11-digit Iranian phone number (mobile starting with 09 or landline starting with 0)
export function isValidIranianPhone(phone: string): boolean {
  const normalized = normalizePhoneDigits(phone);
  return /^0\d{10}$/.test(normalized);
}

// Clean phone string to max 11 digits for controlled input onChange
export function formatPhoneInput(value: string): string {
  const digits = normalizePhoneDigits(value);
  return digits.slice(0, 11);
}
