import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneToggle,
  PropertyPaneCheckbox,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneChoiceGroup,
  PropertyPaneSlider
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ConditionRenderingWebPartStrings';
import ConditionRendering from './components/ConditionRendering';
import { IConditionRenderingProps } from './components/IConditionRenderingProps';

export interface IConditionRenderingWebPartProps {
  description: string;
  showTextField: boolean;
  textFieldValue: string;
  enableFeature: boolean;
  selectedOption: string;
  choiceGroupOption: string;
  sliderValue: number;
}

export default class ConditionRenderingWebPart extends BaseClientSideWebPart<IConditionRenderingWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IConditionRenderingProps> = React.createElement(
      ConditionRendering,
      {
        description: this.properties.description,
        showTextField: this.properties.showTextField,
        textFieldValue: this.properties.textFieldValue,
        enableFeature: this.properties.enableFeature,
        selectedOption: this.properties.selectedOption,
        choiceGroupOption: this.properties.choiceGroupOption,
        sliderValue: this.properties.sliderValue
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
              groupName: 'Basic Settings',
              groupFields: [
                PropertyPaneTextField('description', {
                  label: 'Description'
                }),
                PropertyPaneToggle('showTextField', {
                  label: 'Show Text Field'
                }),
                PropertyPaneCheckbox('enableFeature', {
                  text: 'Enable Feature'
                })
              ]
            },
            {
              groupName: 'Advanced Settings',
              groupFields: [
                PropertyPaneDropdown('selectedOption', {
                  label: 'Select an Option',
                  options: [
                    { key: 'option1', text: 'Option 1' },
                    { key: 'option2', text: 'Option 2' },
                    { key: 'option3', text: 'Option 3' },
                    { key: 'option4', text: 'Option 4' }
                  ]
                }),
                PropertyPaneTextField('textFieldValue', {
                  label: 'Text Field Value'
                }),
                PropertyPaneChoiceGroup('choiceGroupOption', {
                  label: 'Choose an Option',
                  options: [
                    { key: 'choice1', text: 'Choice 1' },
                    { key: 'choice2', text: 'Choice 2' },
                    { key: 'choice3', text: 'Choice 3' },
                    { key: 'choice4', text: 'Choice 4' }
                  ]
                }),
                PropertyPaneSlider('sliderValue', {
                  label: 'Slider Value',
                  min: 0,
                  max: 100,
                  step: 1,
                  value: 50
                })
              ],
              isCollapsed: !this.properties.enableFeature
            }
          ]
        }
      ]
    };
  }
}
