import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import { StoreModule, Store } from '@ngrx/store';

import { CoreState, AppSetLoading, reducers, AuthGetTokenData, AuthSetTokenData } from '../store';
import { ApiInterceptorService } from './api-interceptor.service';
import { LocalStorageService } from './local-storage.service';
import { MockLocalStorageService } from '../../testing';


describe('ApiInterceptorService', () => {
	let injector: TestBed;
	let service: ApiInterceptorService;
	let httpClient: HttpClient;
	let httpTestingController: HttpTestingController;
	let store: Store<CoreState>;
	let storage: LocalStorageService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				StoreModule.forRoot(reducers)
			],
			providers: [
				ApiInterceptorService,
				{
					provide: HTTP_INTERCEPTORS,
					useClass: ApiInterceptorService,
					multi: true
				},
				{
					provide: LocalStorageService,
					useClass: MockLocalStorageService
				}
			]
		});

		injector = getTestBed();
		service = injector.get(ApiInterceptorService);
		httpClient = injector.get(HttpClient);
		httpTestingController = injector.get(HttpTestingController);
		storage = injector.get(LocalStorageService);

		store = TestBed.get(Store);
		spyOn(store, 'dispatch').and.callThrough();
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	it('is created', () => {
		expect(service).toBeTruthy();
	});

	it('does nothing to non-dotrez requests', () => {
		store.dispatch(new AuthSetTokenData({
			token: 'test'
		}));
		storage.setItem('lastTokenUsageTime', String(new Date().getTime()));

		httpClient.get('http://test/').subscribe(response => {
			expect(response).toBeTruthy();
		});

		const req = httpTestingController.expectOne('http://test/');
		expect(req.request.headers.get('Ocp-Apim-Subscription-Key')).toBeNull();
		expect(req.request.headers.get('Authorization')).toBeNull();
		req.flush({});

		expect(store.dispatch).not.toHaveBeenCalledWith(new AppSetLoading(true));
		expect(store.dispatch).not.toHaveBeenCalledWith(new AppSetLoading(false));
	});

	it('dispatches loading actions', () => {
		store.dispatch(new AuthSetTokenData({
			token: 'test'
		}));
		storage.setItem('lastTokenUsageTime', String(new Date().getTime()));

		httpClient.get(environment.dotRezApiBaseUrl + '7').subscribe(response => {
			expect(response).toBeTruthy();
		});

		const req = httpTestingController.expectOne(environment.dotRezApiBaseUrl + '7');
		req.flush({});

		expect(store.dispatch).toHaveBeenCalledWith(new AppSetLoading(true));
		expect(store.dispatch).toHaveBeenCalledWith(new AppSetLoading(false));
	});

	it('gets new token if expired', () => {
		store.dispatch(new AuthSetTokenData({
			token: 'test2',
			idleTimeoutInMinutes: 15
		}));
		storage.setItem('lastTokenUsageTime', String(moment(new Date()).subtract(16, 'minutes').toDate().getTime()));

		httpClient.get(environment.dotRezApiBaseUrl + '2').subscribe(response => {
			expect(response).toBeTruthy();
		});

		expect(store.dispatch).toHaveBeenCalledWith(new AuthGetTokenData());
		store.dispatch(new AuthSetTokenData({
			token: 'test3'
		}));

		const req = httpTestingController.expectOne(environment.dotRezApiBaseUrl + '2');
		expect(req.request.headers.get('Authorization')).toEqual('Bearer test3');
	});

	it('uses existing token if not expired', () => {
		store.dispatch(new AuthSetTokenData({
			token: 'test4'
		}));
		storage.setItem('lastTokenUsageTime', String(new Date().getTime()));

		httpClient.get(environment.dotRezApiBaseUrl + '4').subscribe(response => {
			expect(response).toBeTruthy();
		});

		const req = httpTestingController.expectOne(environment.dotRezApiBaseUrl + '4');
		expect(req.request.headers.get('Authorization')).toEqual('Bearer test4');
	});

	it('sets token to null on 401 response', () => {
		store.dispatch(new AuthSetTokenData({
			token: 'test5'
		}));
		storage.setItem('lastTokenUsageTime', String(new Date().getTime()));

		httpClient.get(environment.dotRezApiBaseUrl + '5').subscribe(response => {
			expect(response).toBeTruthy();
		}, error => {
			expect(error).toBeTruthy();
		});

		const req = httpTestingController.expectOne(environment.dotRezApiBaseUrl + '5');
		req.flush({}, { status: 401, statusText: 'unauthorized' });

		expect(store.dispatch).toHaveBeenCalledWith(new AuthSetTokenData({}));
	});

	it('sets token to null on 440 response', () => {
		store.dispatch(new AuthSetTokenData({
			token: 'test6'
		}));
		storage.setItem('lastTokenUsageTime', String(new Date().getTime()));

		httpClient.get(environment.dotRezApiBaseUrl + '6').subscribe(response => {
			expect(response).toBeTruthy();
		}, error => {
			expect(error).toBeTruthy();
		});

		const req = httpTestingController.expectOne(environment.dotRezApiBaseUrl + '6');
		req.flush({}, { status: 440, statusText: 'timeout' });

		expect(store.dispatch).toHaveBeenCalledWith(new AuthSetTokenData({}));
	});

	it('sets token to null on 400 response', () => {
		store.dispatch(new AuthSetTokenData({
			token: 'test8'
		}));
		storage.setItem('lastTokenUsageTime', String(new Date().getTime()));

		httpClient.get(environment.dotRezApiBaseUrl + '8').subscribe(response => {
			expect(response).toBeTruthy();
		}, error => {
			expect(error).toBeTruthy();
		});

		const req = httpTestingController.expectOne(environment.dotRezApiBaseUrl + '8');
		req.flush(
			{ errors: [{ rawMessage: 'Session token authentication failure.' }] },
			{ status: 400, statusText: 'error' }
		);

		expect(store.dispatch).toHaveBeenCalledWith(new AuthSetTokenData({}));
	});
});
