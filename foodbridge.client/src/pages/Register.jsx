import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, error, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
}
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
...prev,
      [name]: value,
    }));
    setFormError('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setFormError('First name is required');
 return false;
 }
    
    if (!formData.lastName.trim()) {
   setFormError('Last name is required');
return false;
    }
    
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return false;
  }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(
    formData.email,
      formData.password,
        formData.confirmPassword,
      formData.firstName,
   formData.lastName
      );
      
      if (result.success) {
  navigate('/dashboard', { replace: true });
      } else {
        const errorMsg = result.message || 'Registration failed. Please try again.';
setFormError(errorMsg);
      }
  } catch (err) {
   console.error('[Register] Unexpected error:', err);
      setFormError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-secondary/5 dark:from-boxdark dark:via-boxdark-2 dark:to-boxdark p-4">
      <div className="w-full max-w-2xl">
        {/* Card */}
        <div className="bg-white dark:bg-boxdark rounded-2xl shadow-card dark:shadow-xl p-8 md:p-12">
          {/* Logo & Title */}
          <div className="text-center mb-8">
         <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-2xl font-bold mb-4">
           FB
            </div>
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Create Your Account
 </h1>
    <p className="text-gray-500 dark:text-gray-400">
      Join FoodBridge and start making a difference
  </p>
        </div>

   {/* Error Message */}
          {(formError || error) && (
            <div className="mb-6 rounded-lg bg-danger/10 border border-danger px-4 py-3 text-danger">
              <div className="flex items-center gap-2">
       <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
  <span className="text-sm">{formError || error}</span>
              </div>
            </div>
     )}

        {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
    <div>
  <label className="mb-2.5 block font-medium text-black dark:text-white">
First Name <span className="text-danger">*</span>
     </label>
      <div className="relative">
      <input
  type="text"
   name="firstName"
        value={formData.firstName}
     onChange={handleChange}
         required
     placeholder="John"
                disabled={isLoading}
          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary disabled:bg-gray-100 dark:disabled:bg-boxdark-2 disabled:cursor-not-allowed"
     />
             <span className="absolute right-4 top-1/2 -translate-y-1/2">
       <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
 </svg>
    </span>
          </div>
       </div>

   <div>
     <label className="mb-2.5 block font-medium text-black dark:text-white">
          Last Name <span className="text-danger">*</span>
             </label>
     <div className="relative">
         <input
 type="text"
  name="lastName"
        value={formData.lastName}
  onChange={handleChange}
   required
         placeholder="Doe"
    disabled={isLoading}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary disabled:bg-gray-100 dark:disabled:bg-boxdark-2 disabled:cursor-not-allowed"
     />
    <span className="absolute right-4 top-1/2 -translate-y-1/2">
         <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
       </span>
    </div>
              </div>
          </div>

       {/* Email */}
            <div>
  <label className="mb-2.5 block font-medium text-black dark:text-white">
          Email <span className="text-danger">*</span>
     </label>
    <div className="relative">
         <input
 type="email"
       name="email"
       value={formData.email}
      onChange={handleChange}
       required
      placeholder="you@example.com"
         disabled={isLoading}
       className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary disabled:bg-gray-100 dark:disabled:bg-boxdark-2 disabled:cursor-not-allowed"
       />
    <span className="absolute right-4 top-1/2 -translate-y-1/2">
      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
 </span>
         </div>
            </div>

            {/* Password */}
          <div>
        <label className="mb-2.5 block font-medium text-black dark:text-white">
              Password <span className="text-danger">*</span>
              </label>
   <div className="relative">
        <input
        type="password"
            name="password"
         value={formData.password}
     onChange={handleChange}
       required
      placeholder="Type you password"
   minLength={6}
          disabled={isLoading}
           className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary disabled:bg-gray-100 dark:disabled:bg-boxdark-2 disabled:cursor-not-allowed"
                />
     <span className="absolute right-4 top-1/2 -translate-y-1/2">
         <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
         </svg>
     </span>
              </div>
<p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                Must be at least 6 characters with uppercase, lowercase, and number
   </p>
            </div>

            {/* Confirm Password */}
   <div>
          <label className="mb-2.5 block font-medium text-black dark:text-white">
         Confirm Password <span className="text-danger">*</span>
              </label>
         <div className="relative">
      <input
            type="password"
       name="confirmPassword"
        value={formData.confirmPassword}
       onChange={handleChange}
              required
              placeholder="Confirm your password"
      disabled={isLoading}
          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary disabled:bg-gray-100 dark:disabled:bg-boxdark-2 disabled:cursor-not-allowed"
         />
    <span className="absolute right-4 top-1/2 -translate-y-1/2">
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
    </span>
   </div>
            </div>

            {/* Submit Button */}
        <button
      type="submit"
 disabled={isLoading}
  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
   >
      {isLoading ? (
    <>
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
     </svg>
      <span>Creating Account...</span>
         </>
) : (
                'Create Account'
              )}
            </button>

   {/* Sign In Link */}
    <div className="text-center">
  <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
           <Link 
         to="/login" 
    className="text-primary hover:underline font-medium"
   >
      Sign in
        </Link>
              </p>
   </div>
      </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
