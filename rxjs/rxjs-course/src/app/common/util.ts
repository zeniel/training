import { Observable } from "rxjs";
import { Course } from "../model/course";

export function createHttpObservable(url:string){
    return new Observable(observer => {
      fetch(url)
        .then(response => {
          return response.json();
        })
        .then(body => {
          observer.next(body); // method to emit values to the observer
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }


