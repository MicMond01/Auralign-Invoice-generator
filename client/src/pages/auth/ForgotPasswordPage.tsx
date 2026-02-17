import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/redux/api/authApi";
import { ROUTES, TOAST_CONFIG } from "@/config/baseConfig";
import FormInput from "@/components/forms/FormInput";
import LoadingButton from "@/components/common/LoadingButton";

const schema = z.object({ email: z.string().email("Enter a valid email") });
type FormValues = z.infer<typeof schema>;

const ForgotPasswordPage = () => {
  const [forgotPassword, { isLoading, isSuccess }] = useForgotPasswordMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await forgotPassword(values).unwrap();
      toast.success("Reset link sent! Check your email.");
    } catch {
      toast.error(TOAST_CONFIG.MESSAGES.NETWORK_ERROR);
    }
  };

  if (isSuccess) return (
    <div className="text-center">
      <p className="text-green-400 mb-4">✓ Check your inbox for the reset link</p>
      <Link to={ROUTES.LOGIN} className="text-blue-400 hover:text-blue-300 text-sm">Back to Sign In</Link>
    </div>
  );

  return (
    <div         className="bg-white/70 backdrop-blur-md p-6 sm:p-8 rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/50 space-y-6"
>
      <h2 className="text-2xl font-bold text-white mb-1">Forgot password?</h2>
      <p className="text-slate-400 text-sm mb-6">We'll send a reset link to your email.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormInput label="Email" type="email" placeholder="you@example.com"
          registration={register("email")} error={errors.email?.message} />
        <LoadingButton type="submit" loading={isLoading} className="w-full">Send Reset Link</LoadingButton>
      </form>
      <p className="text-center mt-4">
        <Link to={ROUTES.LOGIN} className="text-sm text-blue-400 hover:text-blue-300">Back to Sign In</Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
