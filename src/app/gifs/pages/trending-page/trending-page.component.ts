import { AfterViewInit, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { GifService } from '../../services/gifs.services';
import { ScrollStateService } from 'src/app/shared/service/scroll-state.service';

const SCROLL_INF_GAP = 300;

@Component({
  selector: 'app-trending-page',
  imports: [],
  templateUrl: './trending-page.component.html',
})
export default class TrendingPageComponent implements AfterViewInit {
  gifService = inject(GifService);
  scrollStateService = inject(ScrollStateService);

  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');

  // NOTE: restore scroll
  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (!scrollDiv) return;
    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();
  }

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
    // WARNING: This is a bad practice, is better make a set
    this.scrollStateService.trendingScrollState.set(scrollTop);

    if (isAtBottom) {
      this.gifService.loadTrendingGifs();
    }
  }
}
