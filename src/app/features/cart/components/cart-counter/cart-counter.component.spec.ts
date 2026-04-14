import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CartCounterComponent } from './cart-counter.component';

describe('CartCounterComponent', () => {
  let fixture: ComponentFixture<CartCounterComponent>;
  let component: CartCounterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartCounterComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CartCounterComponent);
    component = fixture.componentInstance;
  });

  it('computes total as quantity times unit price', () => {
    fixture.detectChanges();
    expect(component.total()).toBe(0);

    component.addItem('Item A', 12.5, 2);
    fixture.detectChanges();
    expect(component.total()).toBe(25);

    component.addItem('Item A', 12.5, 1);
    fixture.detectChanges();
    expect(component.items().length).toBe(1);
    expect(component.total()).toBe(37.5);
  });

  it('removeItem drops the line', () => {
    fixture.detectChanges();
    component.addItem('X', 10);
    fixture.detectChanges();
    const id = component.items()[0].id;

    component.removeItem(id);
    fixture.detectChanges();

    expect(component.items().length).toBe(0);
    expect(component.total()).toBe(0);
  });

  it('emits totalChanged when total updates', () => {
    const values: number[] = [];
    component.totalChanged.subscribe((v) => values.push(v));

    fixture.detectChanges();
    expect(values.length).toBeGreaterThanOrEqual(1);
    expect(values[0]).toBe(0);

    component.addItem('Z', 7);
    fixture.detectChanges();
    expect(values.at(-1)).toBe(7);
  });
});
