import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsModalRef } from 'ngx-bootstrap';
import { BookingNotFoundModalComponent } from '../../../features/home';

class MockBsModalRef { }

describe('BookingNotFoundModalComponent', () => {
	let component: BookingNotFoundModalComponent;
	let fixture: ComponentFixture<BookingNotFoundModalComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BookingNotFoundModalComponent],
			providers: [
				{
					provide: BsModalRef,
					useClass: MockBsModalRef
				}
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BookingNotFoundModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
