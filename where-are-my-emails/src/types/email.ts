export interface Email {
  id: number;
  title: string;
  date: string;
  favorite: boolean;
}

export type SortField = 'title' | 'date';
export type SortDirection = 'asc' | 'desc'; 