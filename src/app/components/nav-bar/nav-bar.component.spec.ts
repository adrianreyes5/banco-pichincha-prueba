import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarComponent } from './nav-bar.component';
import { ActivatedRoute, RouterModule } from '@angular/router';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(() => {
    const activatedRouteMock = {
      snapshot: {
        paramMap: jasmine.createSpyObj('ParamMap', ['get']),
      },
    };
    TestBed.configureTestingModule({
      declarations: [NavBarComponent],
      imports: [RouterModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteMock }],
    });
    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
