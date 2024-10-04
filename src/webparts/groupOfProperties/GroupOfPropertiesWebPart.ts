import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration, 
  PropertyPaneTextField, 
  PropertyPaneDropdown, 
  PropertyPaneToggle, 
  PropertyPaneSlider, 
  PropertyPaneCheckbox, 
  PropertyPaneLink, 
  PropertyPaneLabel 
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'GroupOfPropertiesWebPartStrings';
import GroupOfProperties from './components/GroupOfProperties';
import { IGroupOfPropertiesProps } from './components/IGroupOfPropertiesProps';

export interface IGroupOfPropertiesWebPartProps {
  property1: string;
  property2: string;
  property3: string;
  property4: boolean;
  property5: number;
  property6: boolean;
  property7: string;
  property8: string;
}

export default class GroupOfPropertiesWebPart extends BaseClientSideWebPart<IGroupOfPropertiesWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IGroupOfPropertiesProps> = React.createElement(
      GroupOfProperties,
      {
        property1: this.properties.property1,
        property2: this.properties.property2,
        property3: this.properties.property3,
        property4: this.properties.property4,
        property5: this.properties.property5,
        property6: this.properties.property6,
        property7: this.properties.property7,
        property8: this.properties.property8
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
              groupName: "Group 1 - Text Fields",
              groupFields: [
                PropertyPaneTextField('property1', {
                  label: "Property 1"
                }),
                PropertyPaneTextField('property2', {
                  label: "Property 2"
                })
              ]
            },
            
            {
              groupName: "Group 2 - Dropdown and Toggle",
              groupFields: [
                PropertyPaneDropdown('property3', {
                  label: "Property 3",
                  options: [
                    { key: 'Option1', text: 'Option 1' },
                    { key: 'Option2', text: 'Option 2' }
                  ]
                }),
                PropertyPaneToggle('property4', {
                  label: "Property 4",
                  onText: "On",
                  offText: "Off"
                })
              ]
            },
            
            {
              groupName: "Group 3 - Sliders and Checkbox",
              groupFields: [
                PropertyPaneSlider('property5', {
                  label: "Property 5 (Slider)",
                  min: 0,
                  max: 100,
                  step: 5
                }),
                PropertyPaneCheckbox('property6', {
                  text: "Property 6 (Checkbox)"
                })
              ]
            },
            
            {
              groupName: "Group 4 - Links and Description",
              groupFields: [
                PropertyPaneLink('property7', {
                  href: 'https://example.com',
                  text: "Click here for more information",
                  target: '_blank'
                }),
                PropertyPaneLabel('property8', {
                  text: "This is a description label."
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
