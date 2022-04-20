import { Component, OnInit } from '@angular/core';
import { Course } from "../model/course";
import { interval, noop, Observable, of, timer } from 'rxjs';
import { catchError, delayWhen, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor() {

    }

    ngOnInit() {
        const http$ = createHttpObservable('/api/courses');

        const courses$ = http$
            .pipe(
                tap(() => console.log("HTTP REQUESTED")),
                map(response => Object.values(response["payload"] as Course[])),
                shareReplay() // Share the result among various subscribers
            );


        this.initializingCoursesAsObservables(courses$);

        // this.initilizingCoursesWithSubscribeLogic(courses$);
    }

    /******************
     * Initializing using Observables
     */
    beginnersCourses$: Observable<Course[]>; // to use it in the template file one must use the | async (pipe async) to tell template that it is a Observable
    advancedCourses$: Observable<Course[]>;

    initializingCoursesAsObservables(courses$: Observable<Course[]>){
        courses$.subscribe();

        this.beginnersCourses$ = courses$
            .pipe(
                map(courses => courses
                    .filter(
                        course => course.category == 'BEGINNER'
                    ))
            );

        this.advancedCourses$ = courses$
            .pipe(
                map(courses => courses
                    .filter(
                        course => course.category == 'ADVANCED'
                    ))
            );
    }

    /************************** */
    beginnersCourses: Course[];
    advancedCourses: Course[];

    /**
     * It is not an ideal method as it has a lot of logic implementation inside the subscribe
     * @param courses$
     */
    initilizingCoursesWithSubscribeLogic(courses$: Observable<Course[]>){
        courses$.subscribe(
            courses => {
                this.beginnersCourses = courses
                    .filter(course => course.category == 'BEGINNER');

                this.advancedCourses = courses
                    .filter(course => (course as Course).category == 'ADVANCED');

            },
            noop,
            () => {
                console.log("Et finito!!!");
            }
        );
    }
}
