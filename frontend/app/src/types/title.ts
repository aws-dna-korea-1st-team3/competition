export interface NextEpisode {
  text: string;
  reservedAt: string;
  thumbnailImageUrl: string;
}

export interface Creator {
  name: string;
  id: number;
  profileImageUrl: string;
  description: string;
}

export interface AgeRating {
  type: string;
  label: string;
}

export interface Title {
  updated: boolean;
  listThumbnailImageUrl: string;
  lastNumberName: string;
  genres: string[];
  nextEpisode?: NextEpisode;
  introImageUrls: string[];
  firstNumberName: string;
  name: string;
  badges: any[];
  coverImageUrl: string;
  shortDescription: string;
  nickname: string;
  notice: string;
  isbn: string;
  description: string;
  likesCount: number;
  bgColor: string;
  status: string;
  id: number;
  gridThumbnailImageUrl: string;
  createdAt: string;
  creator: Creator;
  type: string;
  ageRating: AgeRating;
  thumbnailImageUrl: string;
}
