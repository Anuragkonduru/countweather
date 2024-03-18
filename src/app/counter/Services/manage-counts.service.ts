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
  getCounts() {
    return this.countsSubject.asObservable();
  }
  addCount() {
    this.counts.push(0);
    this.countsSubject.next([...this.counts]);
  }
  incrementCount(index: number) {
    this.counts[index] += 1;
    this.countsSubject.next([...this.counts]);
  }
  decrementCount(index: number) {
    this.counts[index] -= 1;
    this.countsSubject.next([...this.counts]);
  }
  deleteCount(index: number) {
    this.counts.splice(index, 1);
    this.countsSubject.next([...this.counts]);
  }
  resetCounts() {
    this.counts = [];
    this.countsSubject.next([...this.counts]);
  }
}
