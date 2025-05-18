export function errorHandler(error: any) {
  console.error('API Error:', error.message);
  return { status: 500, message: error.message };
}
