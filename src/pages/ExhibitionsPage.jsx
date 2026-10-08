import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SectionTitle from '../components/common/SectionTitle';
import Button from '../components/common/Button';
import { formatLocalDate } from '../utils/helpers';
import { getExhibitions } from '../utils/storage';

function ExhibitionsPage() {
  const exhibitions = getExhibitions().filter((exhibition) => ['Active', 'Upcoming'].includes(exhibition.status));

  return (
    <>
      <Navbar />
      <main className="container page-shell">
        <SectionTitle title="Virtual Exhibitions" subtitle="Explore curated shows from artists in the gallery." />
        {exhibitions.length ? (
          <div className="exhibition-grid">
            {exhibitions.map((exhibition) => (
              <article className="exhibition-card card" key={exhibition.id}>
                <Link to={`/exhibitions/${exhibition.id}`}><img src={exhibition.coverImage} alt={exhibition.title} /></Link>
                <div className="exhibition-card__body">
                  <div className="exhibition-card__heading"><h2>{exhibition.title}</h2><span className={`exhibition-status exhibition-status--${exhibition.status.toLowerCase()}`}>{exhibition.status}</span></div>
                  <p>{exhibition.description}</p>
                  <div className="exhibition-card__dates"><span>{formatLocalDate(exhibition.startDate)}</span><span>to</span><span>{formatLocalDate(exhibition.endDate)}</span></div>
                  <Link to={`/exhibitions/${exhibition.id}`}><Button variant="primary">View Exhibition</Button></Link>
                </div>
              </article>
            ))}
          </div>
        ) : <section className="empty-state card"><h2>No exhibitions are open right now.</h2><p>Check back soon for new virtual shows.</p></section>}
      </main>
      <Footer />
    </>
  );
}

export default ExhibitionsPage;