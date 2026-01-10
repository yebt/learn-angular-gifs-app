import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    // lazy load
    loadComponent: () =>
      // Import with name:
      // import('./gifs/pages/dashboard-page/dashboard-page.component').then(
      //   (c) => c.DashboardPageComponent,
      // ),

      // NOTE: export default the component to load without name
      import('./gifs/pages/dashboard-page/dashboard-page.component'),

    children: [
      {
        path: 'trending',
        loadComponent: () => import('./gifs/pages/trending-page/trending-page.component'),
      },
      {
        path: 'search',
        loadComponent: () => import('./gifs/pages/search-page/search-page.component'),
      },
      {
        path: "**",
        redirectTo: 'trending'
      }
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
