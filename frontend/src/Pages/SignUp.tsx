import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BusFront, Eye, EyeOff, LockKeyhole, Mail, MapPin, Armchair, Compass, User, Phone } from 'lucide-react';
import styles from "./login.module.css";
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { signupUser } from '../api/busApi';
import { useAuth } from '../context/AuthContext';

/** Full account registration connected to live backend. */
export default function SignUpPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string; password?: string }>({});
  const [notice, setNotice] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice('');
    const nextErrors: typeof errors = {};

    if (!name.trim()) {
      nextErrors.name = 'Enter your full name.';
    }

    const cleanedPhone = phone.replace(/\D/g, '');
    if (!cleanedPhone || cleanedPhone.length < 10) {
      nextErrors.phone = 'Enter a valid 10-digit mobile number.';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!password || password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    try {
      const response = await signupUser({
        name: name.trim(),
        phone: cleanedPhone,
        email: email.trim() || undefined,
        password,
      });

      // Save user session and update context
      login(response.user);
      setNotice(`Welcome, ${response.user.name}! Your account has been created. Redirecting...`);
      setPassword('');

      setTimeout(() => {
        navigate('/');
      }, 700);
    } catch (err: unknown) {
      const message = (err as Error).message || 'Signup failed. Please try again.';
      setNotice('');
      setErrors({ phone: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.story} aria-label="Travel with BusGo">
        <div className={styles.photograph} aria-hidden="true" />
        <Link className={styles.brand} to="/" aria-label="BusGo home">
          <span className={styles.brandIcon}><BusFront size={24} aria-hidden="true" /></span>
          BusGo<span className={styles.brandDot}>.</span>
        </Link>
        <div className={styles.storyContent}>
          <span className={styles.overline}>START YOUR JOURNEY</span>
          <h1>Travel faster.<br />Ride easier.<br /><em>Join BusGo today.</em></h1>
          <p>Book seats across thousands of intercity routes with instant confirmations and live seat tracking.</p>
          <div className={styles.storyFeatures}>
            <span><Armchair size={19} aria-hidden="true" /> Easy seat selection</span>
            <span><Compass size={19} aria-hidden="true" /> Top-tier operators</span>
          </div>
        </div>
        <div className={styles.storyBottom}>
          <span><MapPin size={16} aria-hidden="true" /> Take the scenic route</span>
          <span>THE JOURNEY BEGINS HERE</span>
        </div>
      </aside>

      <section className={styles.formSide} aria-labelledby="signup-heading">
        <div className={styles.topbar}>
          <Link to="/" className={styles.mobileBrand}><BusFront size={23} aria-hidden="true" /> BusGo.</Link>
          <div className={styles.topbarActions}>
            <Link to="/login" className={styles.browseLink}>Sign in</Link>
            {/* <Link to="/" className={styles.browseLink}>Explore buses</Link> */}
          </div>
        </div>

        <div className={styles.formContent}>
          <span className={styles.welcomeIcon}><BusFront size={27} aria-hidden="true" /></span>
          <p className={styles.smallHeading}>JOIN BUSGO</p>
          <h2 id="signup-heading">Create your account.</h2>
          <p className={styles.subtitle}>Sign up with your mobile number to book your bus journeys easily.</p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="signup-name">Full name</label>
              <div className={styles.inputWrap}>
                <User className={styles.fieldIcon} size={19} aria-hidden="true" />
                <Input
                  id="signup-name"
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setErrors((current) => ({ ...current, name: undefined }));
                    setNotice('');
                  }}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className={styles.input}
                />
              </div>
              {errors.name && <p id="name-error" role="alert" className={styles.fieldError}>{errors.name}</p>}
            </div>

            <div className={styles.field}>
              <label htmlFor="signup-phone">Mobile number</label>
              <div className={styles.inputWrap}>
                <Phone className={styles.fieldIcon} size={19} aria-hidden="true" />
                <Input
                  id="signup-phone"
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
              <label htmlFor="signup-email">Email address <span style={{ fontWeight: 400, opacity: 0.7 }}>(optional)</span></label>
              <div className={styles.inputWrap}>
                <Mail className={styles.fieldIcon} size={19} aria-hidden="true" />
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  maxLength={254}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErrors((current) => ({ ...current, email: undefined }));
                    setNotice('');
                  }}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={styles.input}
                />
              </div>
              {errors.email && <p id="email-error" role="alert" className={styles.fieldError}>{errors.email}</p>}
            </div>

            <div className={styles.field}>
              <label htmlFor="signup-password">Password</label>
              <div className={styles.inputWrap}>
                <LockKeyhole className={styles.fieldIcon} size={19} aria-hidden="true" />
                <Input
                  id="signup-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password (min. 6 characters)"
                  autoComplete="new-password"
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

            <Button type="submit" className={styles.submit} isLoading={isSubmitting}>Create account</Button>

            <div className={styles.signupPrompt}>
              <span>Already have an account?</span>
              <Link to="/login" className={styles.signupToggleBtn}>Sign in</Link>
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
          {/* <span>Demo experience</span> */}
        </div>
      </section>
    </div>
  );
}
