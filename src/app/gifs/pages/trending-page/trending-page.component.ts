import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { GifService } from '../../services/gifs.services';

const SCROLL_INF_GAP = 300;

@Component({
  selector: 'app-trending-page',
  imports: [],
  templateUrl: './trending-page.component.html',
})
export default class TrendingPageComponent {
  gifService = inject(GifService);

  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');

  onScroll(event: Event) {
    const scrollDiv = this.scrollDivRef()?.nativeElement;

    if (!scrollDiv) return;

    // scroll desde la parte de arriba, al inicio es 0
    const scrollTop = scrollDiv.scrollTop;
    // size of the viewposrt in hgeight
    const clientHeight = scrollDiv.clientHeight;
    // Size of the total element overflowed
    const scrollHeight = scrollDiv.scrollHeight;

    const isAtBottom = scrollTop + clientHeight + SCROLL_INF_GAP >= scrollHeight;

    if (isAtBottom){
      this.gifService.loadTrendingGifs()
    }
  }
}
