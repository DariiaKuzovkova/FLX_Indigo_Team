import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class AuthService {
  public user: Observable<any>;
  public userDetails: firebase.User = null;
  public db: any = firebase.firestore();
  public uid: string;
  public data: any;
  public avatar: string = 'https://cdn0.iconfinder.com/data/icons/avatar-profile/452/pikachu_pokemon_profile_avatar_people-512.png';

  constructor(
    private _firebaseAuth: AngularFireAuth,
    private router: Router
  ) {
    this.user = this._firebaseAuth.authState
      .pipe(
        filter(Boolean)
      );
    this.user.subscribe(
      (user: firebase.User) => {
        // console.log(user);
        if (user) {
          this.userDetails = user;
          this.uid = this.userDetails.uid;

          this.db.collection('players')
            .doc(this.uid)
            .get()
            .then((player: any) => {
              // console.log(player);
              if (!player.data()) {
                this.writePlayerData(this.userDetails.uid, this.userDetails.displayName, this.userDetails.email, this.userDetails.photoURL);
              }
            });
        } else {
          this.userDetails = null;
        }
      }
    );
  }

  public isLoggedIn(): boolean {
    return this.userDetails !== null;
  }

  public logout(): void {
    this._firebaseAuth.auth.signOut()
    .then(() => this.userDetails = null)
    .then(() => this.router.navigate(['/']));
  }

  public signInWithGoogle(): Promise<firebase.auth.UserCredential> {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );
  }

  public signInWithEmailAndPassword(email: string, password: string): void {
    firebase.auth()
    .signInWithEmailAndPassword(email, password)
      .catch((error: any) => {
        const errorCode: string = error.code;
        const errorMessage: string = error.message;
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
        }
      });
  }

  public createUserWithEmailAndPassword(email: string, password: string, nickname: string): void {
    firebase.auth()
    .createUserWithEmailAndPassword(email, password)
      .then((player: any) => {
        player.user.updateProfile({
          displayName: nickname
        });
        this.writePlayerData(player.user.uid, nickname, email);
      })
      .catch((error: any) => {
        const errorCode: string = error.code;
        const errorMessage: string = error.message;
        if (errorCode === 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
      });
  }

  public writePlayerData(playerId: string, name: string, email: string, avatar: string = this.avatar): void {
    this.db.collection('players')
      .doc(playerId)
      .set({
        name,
        email,
        avatar: avatar,
        money: 500,
        battles: {
          all: 0,
          wins: 0,
          defeats: 0
        }
      });

    this.db.collection('players')
      .doc(playerId)
      .collection('pokemons')
      .doc('chikorita')
      .set({
        name: 'chikorita',
        battles: {
          all: 0,
          wins: 0,
          defeats: 0
        }
      });
  }
  public setUserStatistic(playerId: string,info: any): void {
    this.db.collection('players')
      .doc(playerId)
      .set({
        name: info.name,
        email: info.email,
        avatar: info.avatar,
        money: info.money,
        battles: {
          all: info.battles.all,
          defeats: info.battles.defeats,
          wins: info.battles.wins
        }
      });
  }
}
