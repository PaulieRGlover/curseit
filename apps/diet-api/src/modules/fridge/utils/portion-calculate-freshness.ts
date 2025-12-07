import { PortionDto } from '../dto/fridge.dto';

export const portionCalculateFreshness = (
  dateAdded: Date,
  dateExpiring: Date | null,
): PortionDto['freshness'] => {
  if (!dateExpiring) {
    return null;
  }

  const timestamp = new Date().getTime();
  const dateExpiringTimestamp = dateExpiring.getTime();
  const dateAddedTimestamp = dateAdded.getTime();
  if (timestamp >= dateExpiringTimestamp) {
    return 0;
  }

  const timeSinceAdded = timestamp - dateAddedTimestamp;
  const timeUntilExpiration = dateExpiringTimestamp - dateAddedTimestamp;
  const ratio = timeSinceAdded / timeUntilExpiration;

  return 1 - ratio;
};
