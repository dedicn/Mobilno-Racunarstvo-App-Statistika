import { Injectable } from '@angular/core';
import { User } from '../user.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserSimple } from '../user-simple.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
}

export interface UserData {
  email: string;
  password: string;
  role: string;
}


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isUserAuthenticated = false;
  private user!: User | null;
  private isAdmin: boolean = false;
  constructor(private http: HttpClient) {}

  private usersSubject = new BehaviorSubject<UserSimple[]>([]);
  users = this.usersSubject.asObservable();

  getUser() {
    return this.user;
  }

  get isUserAuthenticated(): boolean {
    if (this.user) {
      return !!this.user.token;
    } else {
      return false;
    }
  }

  get isUserAdmin(): boolean {
    return this.isAdmin;
  }

  getAllStats(): Observable<UserSimple[]> {
    return this.http
      .get<{ [key: string]: UserSimple }>(
        `https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/users.json`
      )
      .pipe(
        map((usersData) => {
          const users: UserSimple[] = [];
          for (const key in usersData) {
            if (usersData.hasOwnProperty(key)) {
              const user = usersData[key];
              if (user.isActive) {
                users.push({ ...user, id: key });
              }
            }
          }
          console.log(usersData)
          return users;
        }),
        tap((users) => {
          this.usersSubject.next(users)
        })
      );
  }

  deleteUser(userUpdate: UserSimple): Observable<void> {
    console.log(userUpdate.isActive);
    console.log(userUpdate.id);
    return this.http
      .patch<void>(
        `https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/users/${userUpdate.id}.json`,
         userUpdate 
      )
      .pipe(
        tap(() => {
          const updatedUsers = this.usersSubject
            .getValue()
            .filter((user) => user.id !== userUpdate.id);
          this.usersSubject.next(updatedUsers);
        })
      );
  }

  updateUser(
    userId: string,
    userData: Partial<UserSimple>
  ): Observable<UserSimple> {
    return this.http
      .patch<UserSimple>(
        `https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json`,
        userData
      )
      .pipe(
        map((updatedData) => {
          return { ...updatedData, id: userId };
        }),
        tap((updatedUser) => {
          const updatedUsers = this.usersSubject
            .getValue()
            .map((user) => (user.id === userId ? updatedUser : user));
          this.usersSubject.next(updatedUsers);
        })
      );
  }

  getUserByToken(token: string): Observable<boolean> {
    return this.http
      .get<{ [key: string]: UserSimple }>(
        `https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/users.json?orderBy="token"&equalTo="${token}"`
      )
      .pipe(
        map((usersData) => {
          const userId = Object.keys(usersData)[0]; // ID korisnika
          console.log(userId);
          const userData = usersData[userId]; // Podaci o kor
          if (userData) {
            console.log("Tacno")
            return true;
          }
          console.log('NeTacno');
          return false;
        })
      );
  }

  register(
    user: UserSimple,
    role: 'admin' | 'user'
  ): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
        { email: user.email, password: user.password, returnSecureToken: true }
      )
      .pipe(
        tap((userData) => {
          const newUser = {
            id: userData.localId,
            name: user.name,
            surname: user.surname,
            email: userData.email,
            password: user.password,
            isActive: true,
          };

          this.http
            .put(
              `https://statistics-3x3-default-rtdb.europe-west1.firebasedatabase.app/users/${userData.localId}.json`,
              newUser
            )
            .subscribe();

          const updatedUsers = this.usersSubject.getValue();
          updatedUsers.push(newUser);
          this.usersSubject.next(updatedUsers);
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

          if (
            (this.isAdmin && userData.email === 'admin@gmail.com') ||
            (!this.isAdmin && userData.email !== 'admin@gmail.com')
          ) {

            if (role === 'admin') {
              this.isAdmin = true;
              localStorage.setItem("isAdmin", "true");
            } else {
              this.isAdmin = false;
            }

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
          } else {
            throw new Error('Neispravne autentifikacione informacije.');
          }
        })
      );
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    this.user = null;
  }
}
