import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import CustomTask from './components/CustomTask';
import { ICustomTaskProps } from './components/ICustomTaskProps';

export interface ICustomTaskWebPartProps {
  description: string;
}

export default class CustomTaskWebPart extends BaseClientSideWebPart<ICustomTaskWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ICustomTaskProps> = React.createElement(
      CustomTask,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
}
