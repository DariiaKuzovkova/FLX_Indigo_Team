import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf
} from '@angular/core';
import {
  MatButtonModule,
  MatToolbarModule,
  MatMenuModule,
  MatDialogModule,
  MatInputModule,
  MatSnackBarModule,
} from '@angular/material';

import { HeaderComponent } from './header/header.component';

import { LogoComponent } from './header/logo/logo.component';
import { NavbarComponent } from './header/navbar/navbar.component';
import { LoginDialogComponent } from './header/navbar/login-dialog/login-dialog.component';

@NgModule({
    declarations: [
      HeaderComponent,
      LogoComponent,
      NavbarComponent,
      LoginDialogComponent
    ],
    imports: [
      BrowserAnimationsModule,
      RouterModule,
      MatToolbarModule,
      MatButtonModule,
      MatMenuModule,
      MatDialogModule,
      MatInputModule,
      MatSnackBarModule,
      FormsModule,
      ReactiveFormsModule
    ],
    exports: [
      HeaderComponent,
    ],
    entryComponents: [
      LoginDialogComponent
    ]
})
export class CoreModule {
    constructor(
    @Optional() @SkipSelf() private parentModule: CoreModule
    ) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only');
        }
    }
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: []
        };
    }
}
