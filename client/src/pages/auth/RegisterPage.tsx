import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRegisterMutation } from "@/redux/api/authApi";
import { ROUTES, TOAST_CONFIG } from "@/config/baseConfig";
import FormInput from "@/components/forms/FormInput";
import LoadingButton from "@/components/common/LoadingButton";

const registerSchema = z.object({
  firstName:       z.string().min(1, "First name is required"),
  lastName:        z.string().min(1, "Last name is required"),
  email:           z.string().min(1, "Email is required").email("Enter a valid email"),
  password:        z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((d) => d.password === d.confirmPassword, {
  path:    ["confirmPassword"],
  message: "Passwords do not match",
});
type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const navigate  = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const { register: reg, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await register(values).unwrap();
      toast.success(TOAST_CONFIG.MESSAGES.REGISTER_SUCCESS);
      navigate(ROUTES.LOGIN);
    } catch {
      toast.error(TOAST_CONFIG.MESSAGES.REGISTER_ERROR);
    }
  };

  return (
    <div         className="bg-white/70 backdrop-blur-md p-6 sm:p-8 rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/50 space-y-6"
>
      <h2 className="text-2xl font-bold text-white mb-1">Create account</h2>
      <p className="text-slate-400 text-sm mb-6">Start your free trial today</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <FormInput label="First name" placeholder="John" registration={reg("firstName")} error={errors.firstName?.message} />
          <FormInput label="Last name" placeholder="Doe" registration={reg("lastName")} error={errors.lastName?.message} />
        </div>
        <FormInput label="Email" type="email" placeholder="you@example.com" registration={reg("email")} error={errors.email?.message} />
        <FormInput label="Password" type="password" placeholder="••••••••" registration={reg("password")} error={errors.password?.message} />
        <FormInput label="Confirm password" type="password" placeholder="••••••••" registration={reg("confirmPassword")} error={errors.confirmPassword?.message} />

        <LoadingButton type="submit" loading={isLoading} className="w-full">
          Create Account
        </LoadingButton>
      </form>

      <p className="text-slate-400 text-sm text-center mt-4">
        Already have an account?{" "}
        <Link to={ROUTES.LOGIN} className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
