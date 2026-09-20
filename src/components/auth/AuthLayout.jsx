function AuthLayout({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-blue-600 text-center">
          {title}
        </h1>
        {children}
      </div>
    </div>
  )
}

export default AuthLayout