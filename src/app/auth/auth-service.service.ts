import { Injectable } from '@angular/core';
import { User } from '../user.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
}

export interface UserData {
  name?: string;
  surname?: string;
  email: string;
  password: string;
}


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isUserAuthenticated = false;
  user!: User | null;
  constructor(private http: HttpClient) {}

  get isUserAuthenticated(): boolean {
    if (this.user) {
      return !!this.user.token;
    } else {
      return false;
    }
  }

  register(user: UserData, role: 'admin' | 'user') {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
        { email: user.email, password: user.password, returnSecureToken: true }
      )
      .pipe(
        tap((userData) => {
          const expirationTime = new Date(
            new Date().getTime() + +userData.expiresIn * 1000
          );
          const newUser = new User(
            userData.localId,
            userData.email,
            userData.idToken,
            expirationTime,
            role
          );
          this.user = newUser;
        })
      );
  }

  logIn(user: UserData, role: 'admin' | 'user') {
    this._isUserAuthenticated = true;
    const userRole = role;
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
        { email: user.email, password: user.password, returnSecureToken: true }
      )
      .pipe(
        tap((userData) => {
          const expirationTime = new Date(
            new Date().getTime() + +userData.expiresIn * 1000
          );
          const user = new User(
            userData.localId,
            userData.email,
            userData.idToken,
            expirationTime,
            userRole
          );
          this.user = user;
        })
      );
  }

  logOut() {
    //TODO: vrv mora token da se brise posle ako ga dodam tu
    this.user = null;
  }
}
