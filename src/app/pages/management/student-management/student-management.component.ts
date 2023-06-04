import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subscription, Observable, combineLatest } from 'rxjs';
import { DataTableComponent } from 'ng-devui/data-table';

import { DialogService } from 'ng-devui/modal';
import { ToastService } from 'ng-devui/toast';

import { ApiService } from 'src/app/api.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.scss'],
})
export class StudentManagementComponent {
  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  @ViewChild('EditorTemplate', { static: true }) EditorTemplate: TemplateRef<any>;
  @ViewChild('ImportTemplate', { static: true }) ImportTemplate: TemplateRef<any>;
  basicDataSource = [];

  insert = true;
  doneSetup: Subscription;
  isSubmitting = false;
  editRowIndex = -1;
  deleteList: any[] = [];
  student: any;

  _search = {
    tenlop: '',
    tenhocsinh: '',
  };

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  searchForm: {
    borderType: '' | 'borderless' | 'bordered';
    size: 'sm' | 'md' | 'lg';
    layout: 'auto' | 'fixed';
  } = {
    borderType: 'bordered',
    size: 'md',
    layout: 'auto',
  };

  busy: Subscription;

  year: any = {
    selectedDate: new Date(),
  };

  date: any = {
    selectedDate: new Date(),
  };

  editForm: any = null;
  importForm: any = null;
  file: any[] = [];

  constructor(private api: ApiService, private dialogService: DialogService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.getList();
  }

  search() {
    this.getList();
  }

  getList() {
    const data = {
      page: this.pager.pageIndex,
      pageSize: this.pager.pageSize,
      ...this._search,
    };

    this.busy = this.api.post('api/HocSinh/search', data).subscribe((res: any) => {
      let a = JSON.parse(JSON.stringify(res));
      this.basicDataSource = a.data;
      this.pager.total = a.totalItems;
    });
  }

  public exportToExcel() {
    const data = {
      page: this.pager.pageIndex,
      pageSize: this.pager.pageSize,
      ...this._search,
    };

    this.busy = this.api.postForExport('api/HocSinh/export-to-excel', data).subscribe((res: any) => {
      saveAs(res, "hoc_sinh.xlsx");
    });

  }

  openImportModal() {
    this.importForm = this.dialogService.open({
      id: 'import-dialog',
      width: '400px',
      title: 'Import Excel',
      showAnimate: false,
      contentTemplate: this.ImportTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  closeImportModal() {
    this.importForm!.modalInstance.hide();
    this.file = [];
  }

  onSelectFiles(event: any) {
    this.file = event.addedFiles;
    console.log(this.file)
    console.log(this.file[0].name)
  }

  importExcel({ valid, directive, data, errors }: any) {
    console.log('Valid:', valid, 'Directive:', directive, 'data', data, 'errors', errors);
    if (!this.file[0]) {
      return false;
    }
    if (this.isSubmitting) {
      return false;
    }

    this.isSubmitting = true;

    this.api.importFile(this.file[0], 'api/HocSinh/upload').subscribe((res: any) => {
      if (res.body) {
        this.toastService.open({
          value: [{ severity: 'success', summary: 'Thành công', content: `Import excel thành công!` }],
        });

        this.isSubmitting = false;
        this.getList();
        this.file = [];
      }
    });

    return true;
  }

  addRow() {
    this.insert = true;
    this.student = {};
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '65%',
      title: 'Thêm học sinh',
      showAnimate: false,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  editRow(index: number, id: any) {
    this.student = {};
    this.doneSetup = this.getSubjectById(id).subscribe((res: any) => {
      this.student.HoTen = res.data.hoTen;
      this.student.MaLop = res.data.maLop;
      this.student.NgaySinh = res.data.ngaySinh;
      this.student.GioiTinh = res.data.gioiTinh;
    });
    this.insert = false;
    this.editRowIndex = index;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '65%',
      title: 'Cập nhập học sinh',
      showAnimate: false,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  getSubjectById(id: string) {
    return this.api.get('api/HocSinh/get-by-id/' + id);
  }

  onSubmitted({ valid, directive, data, errors }: any) {
    console.log('Valid:', valid, 'Directive:', directive, 'data', data, 'errors', errors);
    if (!valid) {
      this.toastService.open({
        value: [{ severity: 'warn', summary: 'Chú ý', content: `Chưa điền đủ thông tin được yêu cầu!` }],
      });
      return false;
    }
    if (this.isSubmitting) {
      return false;
    }

    this.isSubmitting = true;

    if (this.insert) {
      this.api.post('api/HocSinh/create', this.student).subscribe((res: any) => {
        this.student = {};
        this.toastService.open({
          value: [{ severity: 'success', summary: 'Thành công', content: `Thêm học sinh thành công!` }],
        });

        this.isSubmitting = false;
        this.getList();
      });
    } else {

      this.api.post('api/HocSinh/update', this.student).subscribe((res: any) => {
        this.toastService.open({
          value: [{ severity: 'success', summary: 'Thành công', content: `Cập nhập học sinh thành công!` }],
        });

        this.isSubmitting = false;
        this.getList();
      });
    }
    return true;
  }

  batchDelete(deleteList: any[]) {
    if (deleteList.length > 0) {
      const results = this.dialogService.open({
        id: 'delete-dialog',
        width: '600px',
        maxHeight: '600px',
        title: 'Xóa sản phẩm',
        showAnimate: true,
        content: `Bạn có chắc chắn muốn xóa ${deleteList.length} bản ghi?`,
        backdropCloseable: true,
        onClose: () => {},
        buttons: [
          {
            cssClass: 'primary',
            text: 'Ok',
            disabled: false,
            handler: ($event: Event) => {
              if (!this.isSubmitting) {
                this.isSubmitting = true;
                this.deleteRows(deleteList).subscribe((res) => {
                  results.modalInstance.hide();
                  this.reset();
                  this.toastService.open({
                    value: [{ severity: 'success', summary: 'Thành công', content: `Xóa học sinh thành công!` }],
                  });
                  this.isSubmitting = false;
                });
              }
            },
          },
          {
            id: 'btn-cancel',
            cssClass: 'common',
            text: 'Hủy',
            handler: ($event: Event) => {
              results.modalInstance.hide();
            },
          },
        ],
      });

      console.log(results);
    }
  }

  deleteRows(deleteList: any[]) {
    let ids: any[] = [];
    deleteList.forEach((item: any) => {
      ids.push(item.maHocSinh)
    })

    return this.api.post('api/HocSinh/delete', ids)
  }

  onCanceled() {
    this.editForm!.modalInstance.hide();
    this.editRowIndex = -1;
  }

  onRowCheckChange(checked: any, rowIndex: any, nestedIndex: any, rowItem: any) {
    console.log(rowIndex, nestedIndex, rowItem.$checked);
    rowItem.$checked = checked;
    rowItem.$halfChecked = false;
    this.datatable.setRowCheckStatus({
      rowIndex: rowIndex,
      nestedIndex: nestedIndex,
      rowItem: rowItem,
      checked: checked,
    });

    this.deleteList = this.datatable.getCheckedRows();
    console.log(this.deleteList);
  }

  onCheckAllChange() {
    this.deleteList = this.datatable.getCheckedRows();
  }

  reset() {
    this.searchForm = {
      borderType: 'bordered',
      size: 'md',
      layout: 'auto',
    };
    this.pager.pageIndex = 1;
    this.getList();
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.getList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.getList();
  }
}
