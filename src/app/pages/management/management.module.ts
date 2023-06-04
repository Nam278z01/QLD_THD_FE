import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatepickerModule, InputNumberModule, PaginationModule, TooltipModule, ToastModule } from 'ng-devui';

import { DialogService, BackTopModule } from 'ng-devui';
import { SharedModule } from '../../@shared/shared.module';
import { DaLayoutModule } from '../../@shared/layouts/da-layout';

import { NgxDropzoneModule } from 'ngx-dropzone';

import { ManagementRoutingModule } from './management-routing.module';
import { SubjectManagementComponent } from './subject-management/subject-management.component';
import { StudentManagementComponent } from './student-management/student-management.component';
import { ClassManagementComponent } from './class-management/class-management.component';
import { GradeManagementComponent } from './grade-management/grade-management.component';
import { TeacherManagementComponent } from './teacher-management/teacher-management.component';
import { PointTypeManagementComponent } from './point-type-management/point-type-management.component';
import { AccountManagementComponent } from './account-management/account-management.component';
import { PointManagementComponent } from './point-management/point-management.component';


@NgModule({
  imports: [
    SharedModule,
    BackTopModule,
    DaLayoutModule,
    PaginationModule,
    TooltipModule,
    SharedModule,
    DatepickerModule,
    InputNumberModule,
    ToastModule,
    FormsModule,
    NgxDropzoneModule,
    ManagementRoutingModule
  ],
  declarations: [
    SubjectManagementComponent,
    StudentManagementComponent,
    ClassManagementComponent,
    GradeManagementComponent,
    TeacherManagementComponent,
    PointTypeManagementComponent,
    AccountManagementComponent,
    PointManagementComponent
  ],
  providers: [DialogService],
})
export class ManagementModule {}
