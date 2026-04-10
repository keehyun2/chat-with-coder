const MAX_NICKNAME_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 10000;

function sanitizeString(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .trim();
}

export function validateNickname(nickname: string): string | null {
  const sanitized = sanitizeString(nickname);
  if (!sanitized) {
    return 'Nickname is required';
  }
  if (sanitized.length > MAX_NICKNAME_LENGTH) {
    return `Nickname must be ${MAX_NICKNAME_LENGTH} characters or less`;
  }
  return null;
}

export function validateMessage(text: string): string | null {
  const sanitized = sanitizeString(text);
  if (!sanitized) {
    return 'Message is required';
  }
  if (sanitized.length > MAX_MESSAGE_LENGTH) {
    return `Message must be ${MAX_MESSAGE_LENGTH} characters or less`;
  }
  return null;
}

export { sanitizeString };
