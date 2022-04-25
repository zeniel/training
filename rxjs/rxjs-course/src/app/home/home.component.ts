import { Component, OnInit } from '@angular/core';
import { Course } from "../model/course";
import { interval, noop, Observable, of, throwError, timer } from 'rxjs';
import { catchError, delayWhen, finalize, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { createHttpObservable, createHttpObservableCacncelable } from '../common/util';
import { Store } from '../common/store.service';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    beginnerCourses$: Observable<Course[]>;

    advancedCourses$: Observable<Course[]>;

    constructor(private store:Store) {

    }

    ngOnInit() {
        const http$ = createHttpObservableCacncelable('/api/courses');

        const courses$ = http$
            .pipe(
                tap(() => console.log("HTTP REQUESTED")),
                map(response => Object.values(response["payload"] as Course[])),
                // replace the error with an offline result
            //    catchError(err => of([this.defaultResponse()])),  
                // trhow the error 
                // catchError(err => {
                //     console.log('Some error corred', err);

                //     return throwError(err);
                // }),
                finalize(() => console.log('Finalize executed....')),
                shareReplay(), // Share the result among various subscribers
                // retrylogic
                retryWhen(errors => {
                    return errors.pipe(
                        delayWhen(() => timer(2000))
                    )
                })
            );


        this.initializingCoursesAsObservables(courses$);

        // this.initilizingCoursesWithSubscribeLogic(courses$);
    }


    defaultResponse(){
        return {
            id: 1,
            description: "Angular for Beginners",
            iconUrl: 'https://angular-academy.s3.amazonaws.com/thumbnails/angular2-for-beginners-small-v2.png',
            courseListIcon: 'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png',
            longDescription: "Establish a solid layer of fundamentals, learn what's under the hood of Angular",
            category: 'BEGINNER',
            lessonsCount: 10
        };
    }

    /******************
     * Initializing using Observables
     */
    beginnersCourses$: Observable<Course[]>; // to use it in the template file one must use the | async (pipe async) to tell template that it is a Observable
    advancedCourses$: Observable<Course[]>;

    initializingCoursesAsObservables(courses$: Observable<Course[]>){
        // courses$.subscribe();

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
