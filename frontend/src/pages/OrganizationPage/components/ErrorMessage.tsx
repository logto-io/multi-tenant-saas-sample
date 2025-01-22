interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4">
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-center">{message}</p>
        </div>
      </div>
    </div>
  );
}; 