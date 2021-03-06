import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

import { SharedModule } from '../../shared';
import * as fromComponents from './components';
import { translateLoader } from '../../core/services/translate-loader.service';
import { TranslateSync } from '../../core/services/translate-sync.service';
// for AOT
export function createTranslateLoader(http: HttpClient) {
	return translateLoader(http, ['passenger']);
}

export const ROUTES: Routes = [
	{
		path: '',
		component: fromComponents.PassengersPageComponent
	}
];

@NgModule({
	imports: [
		SharedModule,
		RouterModule.forChild(ROUTES),
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useFactory: (createTranslateLoader),
				deps: [HttpClient]
			},
			isolate: true
		})
	],
	declarations: [
		...fromComponents.components
	],
	exports: [],
	providers: [TranslateSync]

})

export class PassengerModule {
	constructor(private translateSync: TranslateSync) {
		this.translateSync.sync();
	}
}
