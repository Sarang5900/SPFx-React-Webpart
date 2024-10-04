import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneToggle,
  PropertyPaneCheckbox,
  PropertyPaneSlider,
  PropertyPaneChoiceGroup,
  PropertyPaneLink,
  PropertyPaneHorizontalRule
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'SecondWebPartWebPartStrings';
import SecondWebPart from './components/SecondWebPart';
import { ISecondWebPartProps } from './components/ISecondWebPartProps';


export interface ISecondWebPartWebPartProps {
  title: string;
  description: string;
  multilineText: string;
  layout: string;
  theme: string;
  enableFeatureX: boolean;
  agreeToTerms: boolean;
  customValue: number;
  optionChoice: string;
}

export default class SecondWebPartWebPart extends BaseClientSideWebPart<ISecondWebPartWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<ISecondWebPartProps> = React.createElement(
      SecondWebPart,
      {
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,

        title: this.properties.title,
        description: this.properties.description,
        multilineText: this.properties.multilineText,
        layout: this.properties.layout,
        theme: this.properties.theme,
        enableFeatureX: this.properties.enableFeatureX,
        agreeToTerms: this.properties.agreeToTerms,
        customValue: this.properties.customValue,
        optionChoice: this.properties.optionChoice
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

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
                PropertyPaneTextField('title', { 
                  label: "Title" 
                }),
                PropertyPaneTextField('multilineText', {
                  label: "Multiline Text",
                  multiline: true,
                  resizable: true
                }),

              ]
            },
            {
              groupName: "Choice Fields",
              groupFields: [
                PropertyPaneDropdown('layout', {
                  label: "Layout",
                  options: [
                    { key: 'grid', text: 'Grid' },
                    { key: 'list', text: 'List' }
                  ]
                }),
                PropertyPaneChoiceGroup('optionChoice', {
                  label: "Choose an Option",
                  options: [
                    { key: 'option1', text: 'Option 1' },
                    { key: 'option2', text: 'Option 2' },
                    { key: 'option3', text: 'Option 3' }
                  ]
                })
              ]
            },
            {
              groupName: "Toggle & Checkbox",
              groupFields: [
                PropertyPaneToggle('enableFeatureX', {
                  label: "Enable Feature X",
                  onText: "On",
                  offText: "Off"
                }),
                PropertyPaneCheckbox('agreeToTerms', {
                  text: "I agree to the terms and conditions"
                })
              ]
            },
            {
              groupName: "Sliders and Links",
              groupFields: [
                PropertyPaneSlider('customValue', {
                  label: "Custom Value",
                  min: 0,
                  max: 100,
                  step: 1,
                  showValue: true
                }),
                PropertyPaneLink('', {
                  href: 'https://www.google.com',
                  text: 'Click Here for More Information',
                  target: '_blank'
                })
              ]
            },
            {
              groupName: "Miscellaneous",
              groupFields: [
                PropertyPaneHorizontalRule()
              ]
            }
          ]
        }
      ]
    };
  }
}
