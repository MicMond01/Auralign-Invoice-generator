import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useLoginMutation } from "@/redux/api/authApi";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/redux/slices/authSlice";
import { ROUTES, TOAST_CONFIG } from "@/config/baseConfig";
import { LoginFormValues, loginSchema } from "@/lib/validation";
import BrandHeader from "./components/BrandHeader";
import InputField from "./components/InputField";
import { ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";


const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await login(values).unwrap();
      
      const tokens = {
        accessToken: result.data.token, 
        refreshToken: result.data.token, 
        expiresIn: 604800,
        tokenType: "Bearer" as const,
      };

      dispatch(
        setCredentials({
          user: result.data.user,
          tokens: tokens,
        })
      );

      toast.success(TOAST_CONFIG.MESSAGES.LOGIN_SUCCESS);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(err?.data?.message || TOAST_CONFIG.MESSAGES.LOGIN_ERROR);
    }
  };

  return (
    <div>
      <BrandHeader />

      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="bg-white/70 backdrop-blur-md p-6 sm:p-8 rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/50 space-y-6"
      >
        <div className="space-y-4">
          <InputField
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            registration={register("email")}
            error={errors.email?.message}
            icon={Mail}
          />
          
          <div className="space-y-2">
            <InputField
              label="Password"
              type="password"
              placeholder="••••••••"
              registration={register("password")}
              error={errors.password?.message}
              icon={Lock}
            />
            <div className="flex justify-end">
              <Link 
                to={ROUTES.FORGOT_PASSWORD} 
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 active:opacity-70 transition-opacity px-1"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-1">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              {...register("rememberMe")}
              className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all"
            />
          </div>
          <label 
            htmlFor="rememberMe" 
            className="text-sm font-medium text-slate-600 cursor-pointer select-none"
          >
            Keep me logged in
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98] active:shadow-none"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              Sign In
              <ArrowRight size={20} />
            </>
          )}
        </button>

        <div className="text-center pt-2">
          <p className="text-slate-500 text-sm font-medium">
            New here?{" "}
            <Link 
              to={ROUTES.REGISTER} 
              className="text-blue-600 font-bold hover:underline decoration-2 underline-offset-4"
            >
              Create Account
            </Link>
          </p>
        </div>
      </form>

      <footer className="text-center animate-pulse duration-[3000ms]">
        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">
          SECURE ENCRYPTED ACCESS
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;