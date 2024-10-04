'use client'

import Image from "next/image";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <Image
            alt="Background image"
            src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
            layout="fill" // Ensures the image covers the container fully
            objectFit="cover" // Ensures the image scales appropriately
            priority // Ensures the image loads faster for better LCP
          />
        </section>

        <main className="flex items-center justify-center bg-gray-200 px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <button
              onClick={() => signIn("google")}
              className="w-full py-3 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none flex items-center justify-center"
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
          </div>
        </main>
      </div>
    </section>
  );
}
