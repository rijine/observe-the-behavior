import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitComponent } from './unit.component';
import { SharedTestingModule, NgxBootstrapTestingModule } from '../../../../testing';

describe('UnitComponent', () => {
	let component: UnitComponent;
	let fixture: ComponentFixture<UnitComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UnitComponent],
			imports: [SharedTestingModule, NgxBootstrapTestingModule]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UnitComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
