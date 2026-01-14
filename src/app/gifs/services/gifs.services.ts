import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';

import { environment } from '@envs/environment.development';
import { GiphyResponse } from '../interfaces/gphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';

const GIF_KEY = '_x_gifs';

const TRENDING_GIF_LIMIT = 20;

// NOTE: SAVE IN THE LOCAL STORAGE
const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
  const parsedGifs = JSON.parse(gifsFromLocalStorage);
  return parsedGifs;
};

@Injectable({ providedIn: 'root' })
export class GifService {
  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(false);
  private trendingGifsPage = signal<number>(0);

  trendingGroupedGifs = computed<Gif[][]>(() => {
    const groups: Gif[][] = [];
    for (let i = 0; i < this.trendingGifs().length; i += 3) {
      groups.push(this.trendingGifs().slice(i, i + 3));
    }
    return groups;
  });

  // searchHistory = signal<Record<string, Gif[]>>({});
  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  constructor() {
    this.loadTrendingGifs();
  }

  // NOTE: save in the local storage
  saveGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyString);
  });

  loadTrendingGifs() {
    if (this.trendingGifsLoading()) return; // avoid multiple calls
    this.trendingGifsLoading.set(true);

    this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyAPIKey,
          limit: TRENDING_GIF_LIMIT,
          offset: this.trendingGifsPage() * TRENDING_GIF_LIMIT,
        },
      })
      .pipe(map(({ data }) => GifMapper.mapGiphyItemsToGifArray(data)))
      .subscribe((gifs: Gif[]) => {
        this.trendingGifs.update((currntGifs) => [...currntGifs, ...gifs]);
        this.trendingGifsLoading.set(false); // restore the callable
        this.trendingGifsPage.update((currV) => currV + 1);
      });
  }

  searchGIf(query: string) {
    return this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
        params: {
          api_key: environment.giphyAPIKey,
          limit: 20,
          q: query,
        },
      })
      .pipe(
        map(({ data }) => data),
        map((items) => GifMapper.mapGiphyItemsToGifArray(items)),

        // History
        tap((items) => {
          this.searchHistory.update((history) => ({
            ...history,
            [query.toLocaleLowerCase()]: items,
          }));
        }),
      );
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  }
}
