import {Injectable} from '@angular/core';
import {ApiService} from '../../api/api.service';
import {Storage} from '@ionic/storage';
import {ProjectDto, ProjectsDto} from './project.dto';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private api: ApiService, private storage: Storage) {
  }

  public async getProjects(organizationId?: string) {
    if (!organizationId) {
      organizationId = await this.storage.get('currentOrganization');
    }

    // tslint:disable-next-line:max-line-length
    const result = await this.api.get<ProjectsDto>(`${this.api.getApiUrl()}/account-private/v1beta1/projects?organization_id=${organizationId}&page_size=50&page=1`);
    return result.projects;
  }

  public setCurrentProject(project: ProjectDto): Promise<any> {
    return this.storage.set('currentProject', project);
  }

  public getCurrentProject(): Promise<ProjectDto> {
    return this.storage.get('currentProject');
  }

  public async setDefaultProject(organizationId?: string) {
    if (!organizationId) {
      organizationId = await this.storage.get('currentOrganization');
    }

    const projects = await this.getProjects(organizationId);
    const currentProject = projects.find(project => project.id === organizationId);
    await this.setCurrentProject(currentProject);
  }
}
