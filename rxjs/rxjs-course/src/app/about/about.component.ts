import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { concat, from, fromEvent, interval, noop, Observable, of, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    // const interval$ = interval(1000);
    // const timer$ = timer(3000, 1000);

    // interval$.subscribe(item => {
    //   console.log(item);
    // });

    // timer$.subscribe(item => {
    //   console.log(item);
    // });

    // const click$ = fromEvent(document, 'click');

    // click$.subscribe(evt => {
    //   console.log(evt);
    // });

    const source1$ = of(1, 2, 3);

    const source2$ = of(4, 5, 6);

    const source3$ = of(7, 8, 9);

    const concat$ = concat(source1$, source2$, source3$);

    concat$.subscribe(value => console.log(value));

    concat$.subscribe(console.log);

  }


}
