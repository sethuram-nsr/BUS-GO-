import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BusFront, Eye, EyeOff, LockKeyhole, Phone, Mail, MapPin, Armchair, Compass } from 'lucide-react';
import styles from "./login.module.css";
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { loginUser } from '../api/busApi';
import { useAuth } from '../context/AuthContext';
import { checkBackendHealth } from '../api/demoMode';
import loadingGif from '../asset/busgo-loading.gif';

/** Login page — supports phone (backend) or email (demo / offline mode). */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Toggle between phone login (backend) and email login (demo)
  const [loginMode, setLoginMode] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [notice, setNotice] = useState('');
  const [isOfflineHint, setIsOfflineHint] = useState(false);

  // Check backend on mount to show the demo-login hint
  useEffect(() => {
    checkBackendHealth().then(setIsOfflineHint);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice('');
    const nextErrors: typeof errors = {};

    let cleanedPhone = '';
    if (loginMode === 'phone') {
      cleanedPhone = phone.replace(/\D/g, '');
      if (!cleanedPhone || cleanedPhone.length < 10) {
        nextErrors.identifier = 'Enter a valid 10-digit mobile number.';
      }
    } else {
      if (!email || !email.includes('@')) {
        nextErrors.identifier = 'Enter a valid email address.';
      }
    }

    if (!password) {
      nextErrors.password = 'Enter your password.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    try {
      const payload =
        loginMode === 'phone'
          ? { phone: cleanedPhone, password }
          : { email, password };

      const response = await loginUser(payload);

      login(response.user);
      setNotice(`Welcome back, ${response.user.name}! Redirecting...`);
      setPassword('');

      // Keep overlay visible until navigation completes
      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (err: unknown) {
      const message = (err as Error).message || 'Invalid credentials.';
      setNotice('');
      setErrors({ identifier: message });
      setIsSubmitting(false);
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
          </div>
        </div>

        <div className={styles.formContent}>
          <span className={styles.welcomeIcon}><BusFront size={27} aria-hidden="true" /></span>
          <p className={styles.smallHeading}>WELCOME TO BUSGO</p>
          <h2 id="login-heading">Good to see you.</h2>
          <p className={styles.subtitle}>
            Sign in with your mobile number.
          </p>

          {/* Offline demo hint */}
          {/* {isOfflineHint && (
            <div className={styles.demoHint} role="note">
              <span>🔌</span>
              <span>
                Backend offline — use{' '}
                <button
                  type="button"
                  className={styles.demoFillBtn}
                  onClick={() => {
                    setLoginMode('email');
                    setEmail('sethuram2407@gmail.com');
                    setPassword('Sethu@123');
                  }}
                >
                  fill demo credentials
                </button>
              </span>
            </div>
          )} */}

          {/* Mode toggle */}
          <div className={styles.modeToggle}>
            <button
              type="button"
              className={`${styles.modeBtn} ${loginMode === 'phone' ? styles.modeBtnActive : ''}`}
              onClick={() => { setLoginMode('phone'); setErrors({}); }}
            >
              <Phone size={14} /> Phone
            </button>
            <button
              type="button"
              className={`${styles.modeBtn} ${loginMode === 'email' ? styles.modeBtnActive : ''}`}
              onClick={() => { setLoginMode('email'); setErrors({}); }}
            >
              <Mail size={14} /> Email
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>

            {/* Phone or Email field */}
            {loginMode === 'phone' ? (
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
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setErrors((c) => ({ ...c, identifier: undefined }));
                      setNotice('');
                    }}
                    aria-invalid={Boolean(errors.identifier)}
                    aria-describedby={errors.identifier ? 'identifier-error' : undefined}
                    className={styles.input}
                  />
                </div>
                {errors.identifier && (
                  <p id="identifier-error" role="alert" className={styles.fieldError}>
                    {errors.identifier}
                  </p>
                )}
              </div>
            ) : (
              <div className={styles.field}>
                <label htmlFor="login-email">Email address</label>
                <div className={styles.inputWrap}>
                  <Mail className={styles.fieldIcon} size={19} aria-hidden="true" />
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="e.g. sethuram2407@gmail.com"
                    autoComplete="email"
                    maxLength={254}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((c) => ({ ...c, identifier: undefined }));
                      setNotice('');
                    }}
                    aria-invalid={Boolean(errors.identifier)}
                    aria-describedby={errors.identifier ? 'identifier-error' : undefined}
                    className={styles.input}
                  />
                </div>
                {errors.identifier && (
                  <p id="identifier-error" role="alert" className={styles.fieldError}>
                    {errors.identifier}
                  </p>
                )}
              </div>
            )}

            {/* Password */}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((c) => ({ ...c, password: undefined }));
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
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" role="alert" className={styles.fieldError}>
                  {errors.password}
                </p>
              )}
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
