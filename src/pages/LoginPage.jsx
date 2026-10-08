import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = login(email, password);
    if (!result.success) {
      setError(result.error);
      return;
    }
    navigate(location.state?.from?.pathname ?? '/profile', { replace: true });
  };

  return (
    <>
      <Navbar />
      <main className="container page-shell auth-page">
        <section className="auth-card card">
          <h1>Welcome back</h1>
          <p>Login to continue exploring and collecting art.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(''); }} autoComplete="email" required />
            </label>

            <label>
              Password
              <input type="password" value={password} onChange={(event) => { setPassword(event.target.value); setError(''); }} autoComplete="current-password" required />
            </label>

            {error && <p className="form-message form-message--error" role="alert">{error}</p>}
            <Button type="submit">Login</Button>
          </form>
          <p className="auth-switch">New to the gallery? <Link to="/register">Create an account</Link></p>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default LoginPage;
