import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  clearAuthError,
  login,
  selectAuthError,
  selectAuthStatus,
  selectUser,
} from "../features/auth/authSlice";
import { getSafeRedirect, validateLogin } from "../utils/validation";

// The one memorable detail: a strip of marquee bulbs.
const bulbs = {
  backgroundImage: "radial-gradient(circle, #f5b301 3px, transparent 3.5px)",
  backgroundSize: "22px 12px",
};

export default function LoginPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(selectUser);
  const status = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);

  const [values, setValues] = useState({ username: "", password: "" });
  const [touched, setTouched] = useState({ username: false, password: false });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(clearAuthError()); // don't greet the user with a leftover error
  }, [dispatch]);

  const errors = validateLogin(values);
  const isLoading = status === "loading";
  const fieldError = (field) => (touched[field] ? errors[field] : undefined);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (authError) dispatch(clearAuthError());
  };
  const handleBlur = (e) =>
    setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ username: true, password: true });
    if (Object.keys(errors).length > 0) return;
    dispatch(login(values));
  };

  // After all hooks (hooks can't be called conditionally). Already logged in: go where they were headed.
  if (user)
    return <Navigate to={getSafeRedirect(location.state?.from)} replace />;

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Brand panel (hidden on small screens to keep the form first) */}
      <section className="hidden flex-col justify-between bg-ink-900 p-12 text-white lg:flex">
        <div aria-hidden className="h-3 w-full max-w-md" style={bulbs} />
        <div>
          <p className="font-display text-6xl font-extrabold leading-[1.05] tracking-tight">
            Find your next
            <br />
            favorite film.
          </p>
          <p className="mt-5 max-w-sm text-white/70">
            Search thousands of movies, watch trailers and keep a list of the
            ones you love.
          </p>
        </div>
        <div aria-hidden className="h-3 w-full max-w-md" style={bulbs} />
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <h1 className="heading">Sign in</h1>

          <form noValidate onSubmit={handleSubmit} className="mt-5 space-y-4">
            {authError && (
              <div
                role="alert"
                className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
              >
                {authError}
              </div>
            )}

            <div>
              <label htmlFor="username" className="field-label">
                Username
              </label>
              <input
                id="username"
                name="username"
                className="field"
                autoFocus
                autoComplete="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
                aria-invalid={Boolean(fieldError("username"))}
                aria-describedby={
                  fieldError("username") ? "username-error" : undefined
                }
              />
              {fieldError("username") && (
                <p
                  id="username-error"
                  className="mt-1 text-xs text-red-600 dark:text-red-400"
                >
                  {fieldError("username")}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  className="field pr-11"
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  aria-invalid={Boolean(fieldError("password"))}
                  aria-describedby={
                    fieldError("password") ? "password-error" : undefined
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  onMouseDown={(e) => e.preventDefault()} // keep focus in the field
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent hover:bg-slate-200 dark:hover:bg-ink-700"
                >
                  {showPassword ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </button>
              </div>
              {fieldError("password") && (
                <p
                  id="password-error"
                  className="mt-1 text-xs text-red-600 dark:text-red-400"
                >
                  {fieldError("password")}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full !py-3"
            >
              {isLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
