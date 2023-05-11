import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_BASE_URL } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  get(url:any) {
    return this.http.get(API_BASE_URL + url);
  }

  post(url:any, data:any) {
    return this.http.post(API_BASE_URL + url, data);
  }

  uploadFile(url: string, files: File[]) {
    let filesToUpload : File[] = files;
    const formData = new FormData();

    Array.from(filesToUpload).map((file, index) => {
      return formData.append('file'+index, file, file.name);
    });

    return this.http.post(API_BASE_URL + url, formData, {reportProgress: true, observe: 'events'})
  }
}
