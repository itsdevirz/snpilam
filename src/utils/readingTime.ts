// Reading time calculator helper for Persian text content

export function toPersianDigits(num: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/\d/g, (w) => persianDigits[parseInt(w, 10)]);
}

export function calculateReadingTime(content: string = '', summary: string = ''): string {
  const fullText = `${summary} ${content}`.trim();
  if (!fullText) return '۱ دقیقه';
  
  // Count words separated by whitespace
  const words = fullText.split(/\s+/).filter(Boolean).length;
  
  // Average reading speed in Persian: ~150 words per minute
  const minutes = Math.max(1, Math.ceil(words / 150));
  return `${toPersianDigits(minutes)} دقیقه`;
}
