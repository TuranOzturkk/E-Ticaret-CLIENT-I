import { Data } from "@angular/router";

export class SingleOrder {
  address: string;
  basketItems: any[];
  createdDate: Data;
  description: string;
  id: string;
  orderCode: string;
  completed: boolean;
}
