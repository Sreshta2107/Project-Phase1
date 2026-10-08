import { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';
import { getInquiriesForArtist, updateOwnedInquiryStatus } from '../utils/storage';

function ArtistInquiriesPage() {
  const { currentUser } = useAuth();
  const [inquiries, setInquiries] = useState(() => getInquiriesForArtist(currentUser.id));
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    const refresh = () => setInquiries(getInquiriesForArtist(currentUser.id));
    window.addEventListener('artGalleryStorageChange', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('artGalleryStorageChange', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [currentUser.id]);

  const updateStatus = (inquiryId, status) => {
    updateOwnedInquiryStatus(currentUser.id, inquiryId, status);
    setInquiries(getInquiriesForArtist(currentUser.id));
    setSelectedInquiry((current) => current?.id === inquiryId ? { ...current, status } : current);
  };

  return (
    <>
      <Navbar />
      <main className="container page-shell">
        <section className="page-header">
          <p className="eyebrow">Artist workspace</p>
          <h1>Buyer Inquiries</h1>
          <p>Messages visitors have sent about your artwork.</p>
        </section>

        {inquiries.length ? (
          <div className="inquiry-list">
            {inquiries.map((inquiry) => (
              <article className="inquiry-card card" key={inquiry.id}>
                <div className="inquiry-card__main">
                  <div className="inquiry-card__heading">
                    <div><h2>{inquiry.buyerName}</h2><a href={`mailto:${inquiry.buyerEmail}`}>{inquiry.buyerEmail}</a></div>
                    <span className={`inquiry-status inquiry-status--${inquiry.status.toLowerCase()}`}>{inquiry.status}</span>
                  </div>
                  <p className="inquiry-card__artwork">Regarding: <strong>{inquiry.artworkTitle}</strong></p>
                  <p className="inquiry-card__message">{inquiry.message}</p>
                  <time dateTime={inquiry.createdAt}>{new Date(inquiry.createdAt).toLocaleString()}</time>
                </div>
                <div className="inquiry-card__actions">
                  <Button variant="outline" onClick={() => setSelectedInquiry(inquiry)}>View</Button>
                  <Button variant="secondary" disabled={inquiry.status === 'Replied'} onClick={() => updateStatus(inquiry.id, 'Replied')}>Mark as Replied</Button>
                  <Button variant="outline" disabled={inquiry.status === 'Closed'} onClick={() => updateStatus(inquiry.id, 'Closed')}>Close</Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <section className="empty-state card"><h2>No buyer inquiries yet.</h2><p>Messages about your artworks will appear here.</p></section>
        )}

        {selectedInquiry && (
          <div className="dialog-backdrop" role="presentation" onClick={() => setSelectedInquiry(null)}>
            <section className="inquiry-dialog card" role="dialog" aria-modal="true" aria-labelledby="inquiry-dialog-title" onClick={(event) => event.stopPropagation()}>
              <button type="button" className="dialog-close" aria-label="Close inquiry" onClick={() => setSelectedInquiry(null)}>×</button>
              <p className="eyebrow">Buyer message</p>
              <h2 id="inquiry-dialog-title">{selectedInquiry.artworkTitle}</h2>
              <p><strong>{selectedInquiry.buyerName}</strong> · <a href={`mailto:${selectedInquiry.buyerEmail}`}>{selectedInquiry.buyerEmail}</a></p>
              <p>{selectedInquiry.message}</p>
              <Button onClick={() => setSelectedInquiry(null)}>Done</Button>
            </section>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default ArtistInquiriesPage;