import React from 'react';
import ActivityIconPlaceholder from './ActivityIconPlaceholder';

interface ActivityImageProps {
  /** The curated/registry image URL from the backend (ignored for photo rendering; icons are primary visuals) */
  imageUrl?: string | null;
  /** The 72-concept subcategory ID (e.g. SIKH_GURUDWARA, DAM_RESERVOIR) */
  subcategoryId?: string;
  /** The activity category (e.g. Sightseeing, Food, Shopping) */
  category?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** CSS class for the container (should include sizing like w-12 h-12) */
  className?: string;
  /** Additional CSS class (preserved for compatibility) */
  imgClassName?: string;
  /** Icon size in pixels for the placeholder, defaults to 24 */
  iconSize?: number;
}

/**
 * ActivityImage: Renders the primary semantic SVG outline icon for activities.
 *
 * - The 72 semantic icons are the PRIMARY and ONLY visual representation for activities.
 * - Always renders <ActivityIconPlaceholder> using `subcategoryId` (or `category` as last resort).
 * - Never renders <img> photographs or stock photos.
 */
const ActivityImage: React.FC<ActivityImageProps> = ({
  subcategoryId,
  category,
  className = 'w-12 h-12 rounded-lg',
  iconSize = 24,
}) => {
  return (
    <ActivityIconPlaceholder
      subcategoryId={subcategoryId}
      category={category}
      className={className}
      iconSize={iconSize}
    />
  );
};

export default ActivityImage;
