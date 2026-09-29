import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// The key ends up inside a URL, so accept only YouTube-shaped values.
const YOUTUBE_KEY = /^[\w-]{6,20}$/;

/**
 * MUI unmounts a closed Dialog's content, so the iframe is destroyed on close and
 * the video stops playing. The privacy-enhanced youtube-nocookie domain is used, and a
 * "Watch on YouTube" fallback is always offered (some owners disable embedding).
 */
export default function TrailerDialog({ open, onClose, videoKey, title }) {
  if (!videoKey || !YOUTUBE_KEY.test(videoKey)) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" aria-labelledby="trailer-title">
      <DialogTitle id="trailer-title" className="!pr-14 !font-display !font-extrabold">
        {title}: Trailer
        <button
          type="button"
          onClick={onClose}
          aria-label="Close trailer"
          className="icon-btn absolute right-2 top-2"
        >
          <CloseIcon />
        </button>
      </DialogTitle>
      <DialogContent>
        <div className="aspect-video overflow-hidden rounded-lg bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0`}
            title={`${title} trailer`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="h-full w-full border-0"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <a
          href={`https://www.youtube.com/watch?v=${videoKey}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          Watch on YouTube
        </a>
      </DialogActions>
    </Dialog>
  );
}
