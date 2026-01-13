import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@envs/environment.development';
import { GiphyResponse } from '../interfaces/gphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';

@Injectable({ providedIn: 'root' })
export class GifService {
  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true)

  searchingGifs = signal<Gif[]>([]);
  searchGifsLoading = signal(true)

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {
    this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyAPIKey,
          limit: 20,
        },
      })
      .subscribe((resp) => {
        const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false)
      });
  }

  searchGIf(query: string) {
    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: environment.giphyAPIKey,
        limit: 20,
        q: query,
      },
    }).subscribe( (resp) => {
        const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data)
        this.searchingGifs.set(gifs)
        this.searchGifsLoading.set(false)
        console.log({resp})
      } )
  }
}
