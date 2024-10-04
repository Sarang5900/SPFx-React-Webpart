import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneButton,
  PropertyPaneButtonType,
  IPropertyPaneField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'PropertyControlWebPartStrings';
import PropertyControl from './components/PropertyControl';
import { IPropertyControlProps } from './components/IPropertyControlProps';

export interface IPropertyControlWebPartProps {
  description: string;
  page1Property: string;
  page2Property: string;
}

export default class PropertyControlWebPart extends BaseClientSideWebPart<IPropertyControlWebPartProps> {
  private currentPage: number = 1;

  public render(): void {
    const element: React.ReactElement<IPropertyControlProps> = React.createElement(
      PropertyControl,
      {
        description: this.properties.description,
        page1Property: this.properties.page1Property,
        page2Property: this.properties.page2Property
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
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
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneButton('prevPage', {
                  text: 'Previous',
                  buttonType: PropertyPaneButtonType.Primary,
                  onClick: this.goToPrevPage.bind(this),
                }),
                PropertyPaneButton('nextPage', {
                  text: 'Next',
                  buttonType: PropertyPaneButtonType.Primary,
                  onClick: this.goToNextPage.bind(this),
                }),
                ...this.getPageControls()
              ]
            }
          ]
        }
      ]
    };
  }

  private getPageControls(): IPropertyPaneField<{}>[] {
    if (this.currentPage === 1) {
      return [
        PropertyPaneTextField('page1Property', {
          label: 'Page 1 Property'
        })
      ];
    } else if (this.currentPage === 2) {
      return [
        PropertyPaneDropdown('page2Property', {
          label: 'Page 2 Property',
          options: [
            { key: 'option1', text: 'Option 1' },
            { key: 'option2', text: 'Option 2' }
          ]
        })
      ];
    }
    return [];
  }

  private goToNextPage(): void {
    if (this.currentPage < 2) {
      this.currentPage++;
    }
    this.context.propertyPane.refresh();
  }

  private goToPrevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
    this.context.propertyPane.refresh();
  }
}
