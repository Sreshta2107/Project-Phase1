import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import BrowsePage from '../pages/BrowsePage';
import ArtworkDetailsPage from '../pages/ArtworkDetailsPage';
import ArtistProfilePage from '../pages/ArtistProfilePage';
import WishlistPage from '../pages/WishlistPage';
import CartPage from '../pages/CartPage';
import AuctionPage from '../pages/AuctionPage';
import ArtistDashboardPage from '../pages/ArtistDashboardPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProfilePage from '../pages/ProfilePage';
import ProtectedRoute from './ProtectedRoute';
import AuctionDetailsPage from '../pages/AuctionDetailsPage';
import OrdersPage from '../pages/OrdersPage';
import ArtistProfileManagementPage from '../pages/ArtistProfileManagementPage';
import ArtistArtworksPage from '../pages/ArtistArtworksPage';
import ArtistArtworkFormPage from '../pages/ArtistArtworkFormPage';
import ArtistInquiriesPage from '../pages/ArtistInquiriesPage';
import ArtistExhibitionsPage from '../pages/ArtistExhibitionsPage';
import ArtistExhibitionFormPage from '../pages/ArtistExhibitionFormPage';
import ArtistAuctionsPage from '../pages/ArtistAuctionsPage';
import ArtistAuctionFormPage from '../pages/ArtistAuctionFormPage';
import ExhibitionsPage from '../pages/ExhibitionsPage';
import ExhibitionDetailsPage from '../pages/ExhibitionDetailsPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/artwork/:id" element={<ArtworkDetailsPage />} />
      <Route path="/artist/:id" element={<ArtistProfilePage />} />
      <Route path="/auctions/:id" element={<AuctionDetailsPage />} />
      <Route path="/exhibitions" element={<ExhibitionsPage />} />
      <Route path="/exhibitions/:id" element={<ExhibitionDetailsPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Route>
      <Route path="/auctions" element={<AuctionPage />} />
      <Route element={<ProtectedRoute allowedRoles={['artist']} redirectTo="/" />}>
        <Route path="/artist/dashboard" element={<ArtistDashboardPage />} />
        <Route path="/artist/profile" element={<ArtistProfileManagementPage />} />
        <Route path="/artist/artworks" element={<ArtistArtworksPage />} />
        <Route path="/artist/artworks/new" element={<ArtistArtworkFormPage />} />
        <Route path="/artist/artworks/edit/:id" element={<ArtistArtworkFormPage />} />
        <Route path="/artist/inquiries" element={<ArtistInquiriesPage />} />
        <Route path="/artist/exhibitions" element={<ArtistExhibitionsPage />} />
        <Route path="/artist/exhibitions/new" element={<ArtistExhibitionFormPage />} />
        <Route path="/artist/exhibitions/edit/:id" element={<ArtistExhibitionFormPage />} />
        <Route path="/artist/auctions" element={<ArtistAuctionsPage />} />
        <Route path="/artist/auctions/new" element={<ArtistAuctionFormPage />} />
        <Route path="/artist/auctions/edit/:id" element={<ArtistAuctionFormPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
