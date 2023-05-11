import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ManagementComponent } from './management.component';
import { SubjectManagementComponent } from './subject-management/subject-management.component';

const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    children: [
      { path: 'qlmh', component: SubjectManagementComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementRoutingModule {}
