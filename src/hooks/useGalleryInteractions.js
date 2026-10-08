import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from './useAuth';
import {
  addToWishlist,
  getArtistFollowerCount,
  getFollowing,
  getLikes,
  getWishlist,
  isFollowing,
  isInWishlist,
  isLiked,
  getArtworkLikeCount,
  removeFromWishlist,
  toggleFollow,
  toggleLike,
} from '../utils/storage';

function useGalleryInteractions() {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = currentUser?.id ?? null;
  const [interactionState, setInteractionState] = useState(() => ({
    userId,
    wishlistIds: getWishlist(userId).artworkIds,
    likedArtworkIds: getLikes(userId).artworkIds,
    followedArtistIds: getFollowing(userId).artistIds,
  }));

  const refresh = useCallback(() => {
    setInteractionState({
      userId,
      wishlistIds: getWishlist(userId).artworkIds,
      likedArtworkIds: getLikes(userId).artworkIds,
      followedArtistIds: getFollowing(userId).artistIds,
    });
  }, [userId]);

  useEffect(() => {
    window.addEventListener('artGalleryStorageChange', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('artGalleryStorageChange', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

  const currentInteractionState = interactionState.userId === userId
    ? interactionState
    : {
      userId,
      wishlistIds: getWishlist(userId).artworkIds,
      likedArtworkIds: getLikes(userId).artworkIds,
      followedArtistIds: getFollowing(userId).artistIds,
    };
  const { wishlistIds, likedArtworkIds, followedArtistIds } = currentInteractionState;

  const requireLogin = useCallback(() => {
    if (isAuthenticated && userId != null) return true;
    navigate('/login', { state: { from: location } });
    return false;
  }, [isAuthenticated, location, navigate, userId]);

  const toggleWishlistForArtwork = useCallback((artworkId) => {
    if (!requireLogin()) return false;
    const wasSaved = isInWishlist(userId, artworkId);
    if (wasSaved) removeFromWishlist(userId, artworkId);
    else addToWishlist(userId, artworkId);
    refresh();
    return !wasSaved;
  }, [refresh, requireLogin, userId]);

  const toggleLikeForArtwork = useCallback((artworkId) => {
    if (!requireLogin()) return false;
    toggleLike(userId, artworkId);
    refresh();
    return isLiked(userId, artworkId);
  }, [refresh, requireLogin, userId]);

  const toggleFollowForArtist = useCallback((artistId) => {
    if (!requireLogin()) return false;
    toggleFollow(userId, artistId);
    refresh();
    return isFollowing(userId, artistId);
  }, [refresh, requireLogin, userId]);

  return {
    wishlistIds,
    likedArtworkIds,
    followedArtistIds,
    isArtworkSaved: (artworkId) => wishlistIds.includes(String(artworkId)),
    isArtworkLiked: (artworkId) => likedArtworkIds.includes(String(artworkId)),
    isArtistFollowed: (artistId) => followedArtistIds.includes(String(artistId)),
    toggleWishlistForArtwork,
    toggleLikeForArtwork,
    toggleFollowForArtist,
    getLikeCount: (artwork) => getArtworkLikeCount(artwork.id, artwork.likes),
    getFollowerCount: (artist) => getArtistFollowerCount(
      artist.id,
      artist.followersCount ?? artist.followers ?? 0
    ),
  };
}

export default useGalleryInteractions;