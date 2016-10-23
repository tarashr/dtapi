import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app.module';
import "./assets/style/style.css";

if (process.env.ENV === 'production') {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .then(success => console.log(`Bootstrap success`))
    .catch(err => console.error(err));