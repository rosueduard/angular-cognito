import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.css'],
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="!isAuthenticated">
      <h1 class="title">Nu esti autentificat!</h1>
      <button (click)="login()">Login</button>
    </div>

    <div *ngIf="isAuthenticated">
      <p>
        Bine ai venit, <b>{{ userName || 'user' }}! </b>
      </p>
      <p>Email: {{ email }}</p>
      <button (click)="logout()">Logout</button>
    </div>
  `,
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
  userName: string | null = null;
  email: string | null = null;

  private cognitoDomain = environment.cognitoDomain;
  private clientId = environment.clientId;
  private postLogoutRedirectUri = environment.logoutUri;

  constructor(private oidcSecurityService: OidcSecurityService) {}

  ngOnInit() {
    // verificare sesiune la start
    this.oidcSecurityService.checkAuth().subscribe((response) => {
      const { isAuthenticated, userData } = response;

      console.log('User Details:' + response);

      this.isAuthenticated = isAuthenticated;
      this.email = userData?.email || userData?.sub || null;
      this.userName = userData?.username || null;

      console.log('Auth status:', isAuthenticated, 'User:', userData);
    });
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.isAuthenticated = false;
    // șterge storage local
    localStorage.clear();
    sessionStorage.clear();

    // redirect către Cognito logout
    const logoutUrl = `https://${this.cognitoDomain}/logout?client_id=${
      this.clientId
    }&logout_uri=${encodeURIComponent(this.postLogoutRedirectUri)}`;
    window.location.href = logoutUrl;

    this.userName = null;
  }
}
