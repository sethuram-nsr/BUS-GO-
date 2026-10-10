import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BusFront, Eye, EyeOff, LockKeyhole, Phone, MapPin, Armchair, Compass } from 'lucide-react';
import styles from "./login.module.css";
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { loginUser } from '../api/busApi';
import { useAuth } from '../context/AuthContext';
import loadingGif from '../asset/busgo-loading.gif';

/** Full mobile-number login connected to live backend. */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>({});
  const [notice, setNotice] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice('');
    const nextErrors: typeof errors = {};
    const cleanedPhone = phone.replace(/\D/g, '');
    if (!cleanedPhone || cleanedPhone.length < 10) {
      nextErrors.phone = 'Enter a valid 10-digit mobile number.';
    }
    if (!password) {
      nextErrors.password = 'Enter your password.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    try {
      const response = await loginUser({
        phone: cleanedPhone,
        password,
      });

      login(response.user);
      setNotice(`Welcome back, ${response.user.name}! Redirecting...`);
      setPassword('');

      // Keep overlay visible until navigation completes
      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (err: unknown) {
      const message = (err as Error).message || 'Invalid mobile number or password.';
      setNotice('');
      setErrors({ phone: message });
      setIsSubmitting(false); // hide overlay only on error
    }
  }

  return (
    <div className={styles.shell}>
      {isSubmitting && (
        <div className={styles.loadingOverlay} role="status" aria-label="Signing in, please wait">
          <div className={styles.loadingCard}>
            <img src={loadingGif} alt="Loading…" className={styles.loadingGif} />
            <p className={styles.loadingText}>Signing you in…</p>
          </div>
        </div>
      )}
      <aside className={styles.story} aria-label="Travel with BusGo">
        <div className={styles.photograph} aria-hidden="true" />
        <Link className={styles.brand} to="/" aria-label="BusGo home">
          <span className={styles.brandIcon}><BusFront size={24} aria-hidden="true" /></span>
          BusGo<span className={styles.brandDot}>.</span>
        </Link>
        <div className={styles.storyContent}>
          <span className={styles.overline}>MORE THAN A DESTINATION</span>
          <h1>A good journey<br />starts with<br /><em>a little hello.</em></h1>
          <p>Familiar places. New adventures.<br />Find a seat for wherever life takes you.</p>
          <div className={styles.storyFeatures}>
            <span><Armchair size={19} aria-hidden="true" /> Your choice of seat</span>
            <span><Compass size={19} aria-hidden="true" /> Multiple operators</span>
          </div>
        </div>
        <div className={styles.storyBottom}>
          <span><MapPin size={16} aria-hidden="true" /> Take the scenic route</span>
          <span>THE JOURNEY BEGINS HERE</span>
        </div>
      </aside>

      <section className={styles.formSide} aria-labelledby="login-heading">
        <div className={styles.topbar}>
          <Link to="/" className={styles.mobileBrand}><BusFront size={23} aria-hidden="true" /> BusGo.</Link>
          <div className={styles.topbarActions}>
            <Link to="/signup" className={styles.browseLink}>Sign up</Link>
            {/* <Link to="/" className={styles.browseLink}>Explore buses</Link> */}
          </div>
        </div>

        <div className={styles.formContent}>
          <span className={styles.welcomeIcon}><BusFront size={27} aria-hidden="true" /></span>
          <p className={styles.smallHeading}>WELCOME TO BUSGO</p>
          <h2 id="login-heading">Good to see you.</h2>
          <p className={styles.subtitle}>Sign in with your mobile number to manage your journeys.</p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="login-phone">Mobile number</label>
              <div className={styles.inputWrap}>
                <Phone className={styles.fieldIcon} size={19} aria-hidden="true" />
                <Input
                  id="login-phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter 10-digit mobile number"
                  autoComplete="tel"
                  maxLength={15}
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    setErrors((current) => ({ ...current, phone: undefined }));
                    setNotice('');
                  }}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  className={styles.input}
                />
              </div>
              {errors.phone && <p id="phone-error" role="alert" className={styles.fieldError}>{errors.phone}</p>}
            </div>

            <div className={styles.field}>
              <label htmlFor="login-password">Password</label>
              <div className={styles.inputWrap}>
                <LockKeyhole className={styles.fieldIcon} size={19} aria-hidden="true" />
                <Input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  maxLength={128}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setErrors((current) => ({ ...current, password: undefined }));
                    setNotice('');
                  }}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className={`${styles.input} ${styles.passwordInput}`}
                />
                <button
                  type="button"
                  className={styles.visibilityButton}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
                </button>
              </div>
              {errors.password && <p id="password-error" role="alert" className={styles.fieldError}>{errors.password}</p>}
            </div>

            <Button type="submit" className={styles.submit} isLoading={isSubmitting}>Sign in</Button>

            <div className={styles.signupPrompt}>
              <span>Don't have an account?</span>
              <Link to="/signup" className={styles.signupToggleBtn}>Sign up</Link>
            </div>

            {notice && <p className={styles.feedback} role="status">{notice}</p>}
          </form>

          <div className={styles.divider}><span />or explore first<span /></div>
          <Button asChild variant="outline" className={styles.guest}>
            <Link to="/">Explore the booking demo</Link>
          </Button>
          <p className={styles.privacy}>
            <LockKeyhole size={14} aria-hidden="true" /> This preview does not send or save your credentials.
          </p>
        </div>

        <div className={styles.bottomNote}>
          <span>BusGo · Made for your next journey</span>
          <span>Demo experience</span>
        </div>
      </section>
    </div>
  );
}
