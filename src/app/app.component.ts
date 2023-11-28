import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';
import { PizzaService } from './services/pizza.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from './core/core.service';
import { Pizza } from './core/pizza';
import { interval, Subscription } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  displayedColumns: string[] = [
    // 'img',
    'id',
    'flavor',
    'border',
    'price',
    'action',
  ];
  dataSource!: MatTableDataSource<Pizza>;
  pizzas: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private pizzaService: PizzaService,
    private _coreService: CoreService
  ) {}

  ngOnInit(): void {
    this.getPizzas();
    this.subscription = interval(5000).subscribe(() => {
      this.getPizzas();
    });
  }

  getPizzas() {
    this.pizzaService.getPizzas().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.pizzas = res;
        console.log(this.pizzas);
      },
      error: (err) => {
        console.log('Error when fetching pizzas:', err);
      },
    });
  }

  deletePizza(id: number) {
    this.pizzaService.deletePizza(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBarNotification(
          'Pizza successfully deleted!',
          'Done'
        );
        this.getPizzas();
      },
      error: (err) => {
        console.error('Error when deleting pizza:', err);
      },
    });
  }

  updatePizza(data: any) {
    const dialogRef = this._dialog.open(EmpAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getPizzas();
        }
      },
    });
  }

  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(EmpAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getPizzas();
        }
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy() {
    // Certifique-se de cancelar a assinatura ao destruir o componente
    this.subscription.unsubscribe();
  }
}
