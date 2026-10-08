import { galleryArtworks } from './sampleData';

export function createSampleAuctions() {
  const now = Date.now();
  const byId = (id) => galleryArtworks.find((artwork) => artwork.id === id);
  const makeAuction = ({
    id,
    artworkId,
    startingBid,
    currentBid,
    highestBidderId,
    highestBidderName,
    minimumIncrement = 25,
    startOffset,
    endOffset,
  }) => {
    const artwork = byId(artworkId);
    const startTime = new Date(now + startOffset).toISOString();
    const endTime = new Date(now + endOffset).toISOString();

    return {
      id,
      artworkId,
      artworkTitle: artwork.title,
      artworkImage: artwork.image,
      artistId: artwork.artistId,
      artistName: artwork.artist,
      description: artwork.description,
      startingBid,
      currentBid,
      highestBidderId,
      highestBidderName,
      minimumIncrement,
      startTime,
      endTime,
      status: startOffset > 0 ? 'Upcoming' : endOffset < 0 ? 'Ended' : 'Live',
    };
  };

  return [
    makeAuction({
      id: 'auction-live-1', artworkId: 2, startingBid: 300, currentBid: 390,
      highestBidderId: 'sample-artist', highestBidderName: 'Gallery Artist',
      startOffset: -86_400_000, endOffset: 259_200_000,
    }),
    makeAuction({
      id: 'auction-live-2', artworkId: 9, startingBid: 450, currentBid: 600,
      highestBidderId: 'sample-admin', highestBidderName: 'Gallery Admin',
      startOffset: -172_800_000, endOffset: 172_800_000,
    }),
    makeAuction({
      id: 'auction-upcoming-1', artworkId: 5, startingBid: 250, currentBid: 250,
      highestBidderId: null, highestBidderName: '',
      startOffset: 172_800_000, endOffset: 432_000_000,
    }),
    makeAuction({
      id: 'auction-ended-won', artworkId: 7, startingBid: 500, currentBid: 760,
      highestBidderId: 'sample-visitor', highestBidderName: 'Gallery Visitor',
      startOffset: -691_200_000, endOffset: -172_800_000,
    }),
    makeAuction({
      id: 'auction-ended-lost', artworkId: 12, startingBid: 600, currentBid: 920,
      highestBidderId: 'sample-artist', highestBidderName: 'Gallery Artist',
      startOffset: -777_600_000, endOffset: -259_200_000,
    }),
  ];
}

export function createSampleBids() {
  const now = Date.now();
  return [
    {
      id: 'sample-bid-live-1', auctionId: 'auction-live-1', artworkId: 2,
      userId: 'sample-artist', userName: 'Gallery Artist', amount: 390,
      createdAt: new Date(now - 3_600_000).toISOString(),
    },
    {
      id: 'sample-bid-live-2', auctionId: 'auction-live-2', artworkId: 9,
      userId: 'sample-admin', userName: 'Gallery Admin', amount: 600,
      createdAt: new Date(now - 7_200_000).toISOString(),
    },
    {
      id: 'sample-bid-ended-1', auctionId: 'auction-ended-won', artworkId: 7,
      userId: 'sample-visitor', userName: 'Gallery Visitor', amount: 760,
      createdAt: new Date(now - 345_600_000).toISOString(),
    },
    {
      id: 'sample-bid-ended-2', auctionId: 'auction-ended-lost', artworkId: 12,
      userId: 'sample-artist', userName: 'Gallery Artist', amount: 920,
      createdAt: new Date(now - 432_000_000).toISOString(),
    },
  ];
}