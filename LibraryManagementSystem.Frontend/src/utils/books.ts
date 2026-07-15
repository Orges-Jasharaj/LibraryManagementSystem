import { ReadingStatus } from '../types/api';

export const statusLabels: Record<ReadingStatus, string> = {
  [ReadingStatus.NotStarted]: 'Not Started',
  [ReadingStatus.Reading]: 'Reading',
  [ReadingStatus.Completed]: 'Completed',
};

export const statusClass: Record<ReadingStatus, string> = {
  [ReadingStatus.NotStarted]: 'status-idle',
  [ReadingStatus.Reading]: 'status-reading',
  [ReadingStatus.Completed]: 'status-done',
};

const genrePalette = [
  '#c17f59',
  '#5c7a6a',
  '#6b5b95',
  '#d4a574',
  '#4a6fa5',
  '#9c6644',
];

export function genreColor(genre: string) {
  let hash = 0;
  for (let i = 0; i < genre.length; i += 1) {
    hash = genre.charCodeAt(i) + ((hash << 5) - hash);
  }
  return genrePalette[Math.abs(hash) % genrePalette.length];
}
