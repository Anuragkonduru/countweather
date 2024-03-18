import { Component, OnInit } from '@angular/core';
import { ManageCountsService } from './Services/manage-counts.service';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css'],
})
export class CounterComponent implements OnInit {
  counts: number[] = [0];
  constructor(private managecounts: ManageCountsService) {}
  ngOnInit() {
    this.managecounts.getCounts().subscribe((counts) => {
      this.counts = counts;
      console.log('Initial load', this.counts);
    });
  }
  Reset() {
    this.managecounts.resetCounts();
  }
  AddNew() {
    this.managecounts.addCount();
  }
  Increment(index: number) {
    this.managecounts.incrementCount(index);
  }
  Decrement(index: number) {
    this.managecounts.decrementCount(index);
  }
  Delete(index: number) {
    this.managecounts.deleteCount(index);
  }
}
