import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardSideComponent } from './board-side.component';

describe('BoardSideComponent', () => {
  let component: BoardSideComponent;
  let fixture: ComponentFixture<BoardSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardSideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
