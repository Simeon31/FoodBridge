import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, error, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            console.log('[Login] User already authenticated, redirecting to dashboard');
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setFormError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFormError('');

        console.log('[Login] Submitting form:', { email: formData.email, rememberMe: formData.rememberMe });

        try {
            const result = await login(formData.email, formData.password, formData.rememberMe);

            console.log('[Login] Login result:', result);

            if (result.success) {
                console.log('[Login] Login successful, navigating to dashboard');
                navigate('/dashboard', { replace: true });
            } else {
                const errorMsg = result.message || 'Login failed. Please try again.';
                console.error('[Login] Login failed:', errorMsg);
                setFormError(errorMsg);
            }
        } catch (err) {
            console.error('[Login] Unexpected error:', err);
            setFormError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-white to-secondary/20 dark:from-boxdark-2 dark:via-boxdark dark:to-boxdark-2 px-4">
            <div className="w-full max-w-md">
                {/* Logo and Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white font-bold text-2xl mb-4">
                        FB
                    </div>
                    <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                        Welcome to FoodBridge
                    </h1>
                    <p className="text-gray-600 dark:text-bodydark">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white dark:bg-boxdark rounded-lg shadow-card p-8">
                    {(formError || error) && (
                        <div className="mb-6 rounded-lg bg-danger/10 border border-danger px-4 py-3">
                            <p className="text-danger text-sm font-medium">
                                {formError || error}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2.5 block font-medium text-black dark:text-white"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    disabled={isLoading}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-12 pr-4 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary disabled:bg-gray-100 dark:disabled:bg-boxdark-2"
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                                    <svg
                                        className="fill-current text-bodydark dark:text-bodydark1"
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.5344C0.585938 17.7031 1.54844 18.7 2.75156 18.7H19.2516C20.4203 18.7 21.4172 17.7375 21.4172 16.5344V5.46567C21.4172 4.29692 20.4547 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5344C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                                            fill=""
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2.5 block font-medium text-black dark:text-white"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-12 pr-4 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary disabled:bg-gray-100 dark:disabled:bg-boxdark-2"
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                                    <svg
                                        className="fill-current text-bodydark dark:text-bodydark1"
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                                            fill=""
                                        />
                                        <path
                                            d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                                            fill=""
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="sr-only"
                                />
                                <div className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${formData.rememberMe ? 'border-primary bg-primary' : 'border-stroke dark:border-strokedark'}`}>
                                    {formData.rememberMe && (
                                        <svg
                                            className="text-white"
                                            width="11"
                                            height="8"
                                            viewBox="0 0 11 8"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                                fill="currentColor"
                                                stroke="currentColor"
                                                strokeWidth="0.4"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-sm text-black dark:text-white">Remember me</span>
                            </label>

                            <button type="button" command="show-modal" commandfor="dialog" class="rounded-md bg-gray-950/5 px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-950/10">Forget password?</button>

                            <el-dialog>
                                <dialog id="dialog" aria-labelledby="dialog-title" class="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent">
                                    <el-dialog-backdrop class="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

                                    <div tabindex="0" class="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
                                        <el-dialog-panel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                                            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                                <div class="sm:flex sm:items-start">
                                                    <div class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6 text-red-600">
                                                            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" stroke-linecap="round" stroke-linejoin="round" />
                                                        </svg>
                                                    </div>
                                                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                        <h3 id="dialog-title" class="text-base font-semibold text-gray-900">Do not forget you password</h3>
                                                        <div class="mt-2">
                                                            <p class="text-sm text-gray-500">Next time try to remember your password!.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                <button type="button" command="close" commandfor="dialog" class="mt-3 inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-xs inset-ring inset-ring-gray-300 hover:bg-red-400 sm:mt-0 sm:w-auto">Cancel</button>
                                            </div>
                                        </el-dialog-panel>
                                    </div>
                                </dialog>
                            </el-dialog>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white font-medium transition hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-bodydark">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary font-medium hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    {/* Development Helper */}
                    {import.meta.env.DEV && (
                        <div className="mt-6 p-4 bg-meta-9 dark:bg-meta-4 rounded-lg border border-stroke dark:border-strokedark">
                            <p className="text-xs font-semibold text-black dark:text-white mb-2">Test Credentials:</p>
                            <p className="text-xs text-bodydark mb-1">Email: admin@foodbridge.com</p>
                            <p className="text-xs text-bodydark">Password: Admin@123</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
