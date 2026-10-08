import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';

function AdminDashboardPage() {
  return (
    <>
      <Navbar />
      <main className="container page-shell">
        <section className="page-header">
          <h1>Admin dashboard</h1>
          <p>Monitor artists, review submissions, and manage the platform.</p>
        </section>

        <div className="dashboard-grid">
          <div className="stat-card card">
            <h3>Pending artworks</h3>
            <strong>18</strong>
          </div>
          <div className="stat-card card">
            <h3>Verified artists</h3>
            <strong>240</strong>
          </div>
          <div className="stat-card card">
            <h3>Platform revenue</h3>
            <strong>$42K</strong>
          </div>
        </div>

        <div className="dashboard-actions">
          <Button>Approve artworks</Button>
          <Button variant="secondary">Manage categories</Button>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AdminDashboardPage;
