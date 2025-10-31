import { Routes } from '@angular/router';

export const routes: Routes = [
  // {
  //   path: '',
  //   component: HomeComponent,
  // },
  //   {
  //     path: 'secure',
  //     component: SecureComponent,
  //     // canActivate: [authGuard], // protejează ruta
  //   },
  {
    path: '**',
    redirectTo: '',
  },
];
