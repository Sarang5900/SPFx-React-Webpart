import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'RegistrationFormWebPartStrings';
import RegistrationForm from './components/RegistrationForm';
import { IRegistrationFormProps } from './components/IRegistrationFormProps';
import { sp } from "@pnp/sp/presets/all";
import { ISPFXContext } from './ISPFXContext'; 

export interface IRegistrationFormWebPartProps {
  description: string;
}

export default class RegistrationFormWebPart extends BaseClientSideWebPart<IRegistrationFormWebPartProps> {

  protected async onInit(): Promise<void> {
    // Set up PnPJS with the correct headers and context
    sp.setup({
      spfxContext: this.context as unknown as ISPFXContext,  // Cast to unknown first, then to ISPFXContext
    });
  
    return super.onInit();
  }
  
  

  public render(): void {
    const element: React.ReactElement<IRegistrationFormProps> = React.createElement(
      RegistrationForm,
      {
        context: this.context,
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
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
