import React from 'react';
import { Vote, LogIn, UserPlus } from 'lucide-react';


export const AuthForm = ({ type, auth, formData, setAuth, handleInputChange, handleSubmit }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <Vote className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-8">
          {type === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center"
          >
            {type === 'login' ? (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Login
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Create Account
              </>
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          {type === 'login' ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setAuth({ ...auth })}
            className="ml-1 text-indigo-600 hover:text-indigo-700"
          >
            {type === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};