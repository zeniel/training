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


  export function createHttpObservableCacncelable<T>(url:string){
    return new Observable<T>(observer => {
      const controller = new AbortController();
      const signal = controller.signal;

      fetch(url, {signal})
        .then(response => {

          if(response.ok){
            return response.json();
          }else{
            observer.error('Request failed with status code: ' + response.status);
          }
        })
        .then(body => {
          observer.next(body); // method to emit values to the observer
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });

      return () => controller.abort();
    });
  }
