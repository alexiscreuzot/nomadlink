function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  get calendarId(): string {
    return required("CALENDAR_ID");
  },
  get googleApiKey(): string {
    return required("GOOGLE_API_KEY");
  },
};
