import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ManagementComponent } from './management.component';
import { SubjectManagementComponent } from './subject-management/subject-management.component';
import { GradeManagementComponent } from './grade-management/grade-management.component';
import { StudentManagementComponent } from './student-management/student-management.component';
import { ClassManagementComponent } from './class-management/class-management.component';
import { TeacherManagementComponent } from './teacher-management/teacher-management.component';
import { PointTypeManagementComponent } from './point-type-management/point-type-management.component';
import { PointManagementComponent } from './point-management/point-management.component';

const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    children: [
      { path: 'qlmh', component: SubjectManagementComponent },
     
    ],

  },
  {
    path: '',
    component: ManagementComponent,
    children: [
      { path: 'qlkh', component: GradeManagementComponent },  
    ],
  },
  {
    path: '',
    component: ManagementComponent,
    children: [
      { path: 'qlhs', component: StudentManagementComponent },
    ],
  },
  {
    path: '',
    component: ManagementComponent,
    children: [
      { path: 'qllh', component: ClassManagementComponent },
    ],
  },
  {
    path: '',
    component: ManagementComponent,
    children: [
      { path: 'qlgv', component: TeacherManagementComponent },
    ],
  },
  {
    path: '',
    component: ManagementComponent,
    children: [
      { path: 'qlld', component: PointTypeManagementComponent },
    ],
  },
  {
    path: '',
    component: ManagementComponent,
    children: [
      { path: 'qldiem', component: PointManagementComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementRoutingModule {}
