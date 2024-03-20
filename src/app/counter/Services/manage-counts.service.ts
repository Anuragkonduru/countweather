import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManageCountsService {
  private counts: number[] = [0];
  private countsSubject = new BehaviorSubject<any[]>([]);

  constructor() {
    this.countsSubject.next([...this.counts]);
  }

  // getCounts: Returns an Observable for the current state of counts.
  getCounts() {
    return this.countsSubject.asObservable();
  }

  // addCount: Adds a new count initialized to 0 to the counts array and updates the BehaviorSubject.
  addCount() {
    this.counts.push(0);
    this.countsSubject.next([...this.counts]);
  }

  // incrementCount: Increments the count at the specified index by 1 and updates the BehaviorSubject.
  incrementCount(index: number) {
    this.counts[index] += 1;
    this.countsSubject.next([...this.counts]);
  }

  // decrementCount: Decrements the count at the specified index by 1 and updates the BehaviorSubject.
  decrementCount(index: number) {
    this.counts[index] -= 1;
    this.countsSubject.next([...this.counts]);
  }

  // deleteCount: Removes the count at the specified index from the counts array and updates the BehaviorSubject.
  deleteCount(index: number) {
    this.counts.splice(index, 1);
    this.countsSubject.next([...this.counts]);
  }

  // resetCounts: Resets the counts array to an empty array and updates the BehaviorSubject.
  resetCounts() {
    this.counts = [];
    this.countsSubject.next([...this.counts]);
  }
}
