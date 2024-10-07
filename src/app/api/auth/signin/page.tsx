'use client'

import Image from "next/image";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const callbackUrl = process.env.URL || 'http://localhost:3000/';

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12 bg-white shadow-lg rounded-lg overflow-hidden max-w-6xl mx-auto">
        {/* Image Section */}
        <section className="relative hidden lg:flex items-end bg-gray-900 lg:col-span-5 xl:col-span-6">
          <Image
            alt="Background image"
            src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
          <div className="relative z-10 p-8">
            <h2 className="text-4xl font-semibold text-white">
              Welcome Back!
            </h2>
            <p className="mt-2 text-lg text-gray-300">
              Sign in to access your account and manage your preferences.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <main className="flex items-center justify-center px-8 py-16 bg-white lg:col-span-7 xl:col-span-6">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800">
                Sign in to Your Account
              </h2>
              <p className="mt-2 text-gray-600">
                Use your Google account to get started.
              </p>
            </div>
            <button
              onClick={() => signIn("google", { callbackUrl })}
              className="relative w-full py-3 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 ease-in-out flex items-center justify-center"
            >
              <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.39 0 6.32 1.14 8.7 3.38l6.43-6.43C34.99 2.6 29.84 0 24 0 14.64 0 6.83 5.54 3.18 13.6l7.56 5.88C12.85 14.1 17.97 9.5 24 9.5z"
                />
                <path
                  fill="#34A853"
                  d="M46.65 24.5c0-1.44-.12-2.81-.34-4.14H24v8.12h12.8c-.53 2.6-2.06 4.78-4.32 6.24l6.43 5.02c3.76-3.46 5.74-8.57 5.74-15.24z"
                />
                <path
                  fill="#4A90E2"
                  d="M12.74 28.06C10.74 27.14 9.26 25.5 8.4 23.36l-7.56 5.88C3.3 33.94 8.86 38.5 16 38.5c4.86 0 9.01-1.6 11.94-4.34l-7.57-5.88c-1.06.6-2.29.94-3.57.94-2.74 0-5.16-1.44-6.57-3.66z"
                />
                <path
                  fill="#FBBC05"
                  d="M24 48c6.48 0 11.92-2.16 15.89-5.88l-6.43-5.02c-2.17 1.46-4.88 2.32-7.86 2.32-6.03 0-11.15-4.6-12.81-10.7l-7.56 5.88C7.07 43.8 14.93 48 24 48z"
                />
              </svg>
              Sign in with Google
            </button>
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Don’t have an account?{' '}
                <a
                  href="#"
                  onClick={() => signIn("google", { callbackUrl })}
                  className="text-blue-500 hover:underline cursor-pointer"
                >
                  Sign up
                </a>
              </p>

            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
