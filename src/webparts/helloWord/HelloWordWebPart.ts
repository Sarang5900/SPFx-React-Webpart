import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './HelloWordWebPart.module.scss';
import * as strings from 'HelloWordWebPartStrings';

import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';

export interface IHelloWordWebPartProps {
  description: string;
  test: string;
  test1: boolean;
  test2: string;
  test3: boolean;
}

export interface ISPLists {
  value: ISPList[]
}

export interface ISPList {
  Title: string;
  Id: string;
}

export default class HelloWordWebPart extends BaseClientSideWebPart<IHelloWordWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {

    console.log(this.context.pageContext);

    this.domElement.innerHTML = `
    <section class="${styles.helloWord} ${!!this.context.sdks.microsoftTeams ? styles.teams : ''}">
      <div class="${styles.welcome}">
        <img alt="" src="${this._isDarkTheme ? require('./assets/welcome-dark.png') : require('./assets/welcome-light.png')}" class="${styles.welcomeImage}" />
        <h2>Well done, ${escape(this.context.pageContext.user.displayName)}!</h2>
        <div>${this._environmentMessage}</div>
      </div>
      <div>
        <h3>Welcome to SharePoint Framework!</h3>
        <div>Web part description: <strong>${escape(this.properties.description)}</strong></div>
        <div>Web part test: <strong>${escape(this.properties.test)}</strong></div>
        <div>Loading from: <strong>${escape(this.context.pageContext.web.title)}</strong></div>
        <div>CheckBox value: <strong> ${this.properties.test1} </strong></div>
        <div>Dropdown Value: <strong>${escape(this.properties.test2)} </strong></div>
        <div>Toggle Value: <strong>${this.properties.test3} </strong></div>
      </div>
    </section>
    <div id="spListContainer"></div>`;

    this._renderListAsync().catch(error => console.error('Error in rendering list:', error));

  }

  protected async onInit(): Promise<void> {
    this._environmentMessage = await this._getEnvironmentMessage();
  }

  private async _getListData(): Promise<ISPLists> {
    try {
      const response: SPHttpClientResponse = await this.context.spHttpClient.get(
        `${this.context.pageContext.web.absoluteUrl}/_api/web/lists?$filter=Hidden eq false`,
        SPHttpClient.configurations.v1
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching list data', error);
      throw error;
    }
  }

  private async _renderListAsync(): Promise<void> {
    try {
      const listData = await this._getListData();
      this._renderList(listData.value);
    } catch (error) {
      console.error('Error rendering list', error);
      this._renderError('Failed to load list data.');
    }
  }

  private _renderList(items: ISPList[]): void {
    let html: string = '';
    items.forEach((item: ISPList) => {
      html += `
      <ul class="${styles.list}">
        <li class="${styles.listItem}">
          <span class="ms-font-l">${item.Title}</span>
        </li>
      </ul>`;
    });

    const listContainer = this.domElement.querySelector('#spListContainer');
    if (listContainer) {
      listContainer.innerHTML = html;
    }
  }

  private _renderError(message: string): void {
    const errorContainer = this.domElement.querySelector('#spListContainer');
    if (errorContainer) {
      errorContainer.innerHTML = `<div style="color:red; font-weight:bold;">${message}</div>`;
    }
  }

  private async _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) {
      const context = await this.context.sdks.microsoftTeams.teamsJs.app.getContext();
      switch (context.app.host.name) {
        case 'Office':
          return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
        case 'Outlook':
          return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
        case 'Teams':
        case 'TeamsModern':
          return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
        default:
          return strings.UnknownEnvironment;
      }
    }
    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || '');
      this.domElement.style.setProperty('--link', semanticColors.link || '');
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || '');
    }
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', { 
                  label: 'Description' 
                }),
                PropertyPaneTextField('test', { 
                  label: 'Multi-Line text field', multiline: true 
                }),
                PropertyPaneCheckbox('test1', { 
                  text: 'Checkbox' 
                }),
                PropertyPaneDropdown('test2', {
                  label: 'Dropdown',
                  options: [
                    { key: 1, text: 'one' },
                    { key: 2, text: 'two' },
                    { key: 3, text: 'three' },
                    { key: 4, text: 'four' }
                  ]
                }),
                PropertyPaneToggle('test3', { 
                  label: 'Toggle', 
                  onText: 'On', 
                  offText: 'Off' 
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
