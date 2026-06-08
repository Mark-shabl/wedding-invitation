export function QueryError({ message }: { message: string }) {
  return (
    <p className="text-red-600 text-sm">
      Ошибка загрузки: {message}. Проверьте, что backend запущен.
    </p>
  );
}
