import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import { createHttpObservableCacncelable } from '../common/util';
import { debug, RxJSLoggingLevel } from '../common/debug';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId:string;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {

        /**
         * recupera as licoes do curso
         */
        this.courseId = this.route.snapshot.params['id'];
        this.course$ = createHttpObservableCacncelable(`/api/courses/${this.courseId}`)
            .pipe(
                debug(RxJSLoggingLevel.DEBUG, "course value "),
            );

    }

    ngAfterViewInit() {

        this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
            .pipe(
                map(event => event.target.value),
                startWith(''),
                debug(RxJSLoggingLevel.DEBUG, "search value "),
                debounceTime(300),
                debug(RxJSLoggingLevel.DEBUG, "search value debounced "),
                distinctUntilChanged(),
                switchMap(search => this.loadLessons(search)),
                debug(RxJSLoggingLevel.DEBUG, "lessons value "),
            );
    }

    loadLessons(search:string = ''): Observable<Lesson[]>{
        return createHttpObservableCacncelable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
            .pipe(
                map(res => res['payload'])
            );
    }

}
