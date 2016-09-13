/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual.PBI_CV_E6C67BB3_785C_4D89_88DB_DA2618987482  {

    /**
    *
    * Interface for DonutSlicer viewmodel.
    *
    * @interface
    * @property {DonutSlicerDataPoint[]} dataPoints     - Set of data points in the visual will render.
    * 
    **/
    interface DonutSlicerViewModel {
        dataPoints: DonutSlicerDataPoint[];
    };


    /**
    *
    * Interface for DonutSlicer data points.
    *
    * @interface
    * @property {number} value                          - Data value for point
    * @property {string} category                       - Corresponding category of data value
    * @property {string} color                          - Color corresponding to data point
    * @property {ISelectionId} selectionId              - Id assigned to data point for crossfiltering and visual interaction
    * 
    **/
    interface DonutSlicerDataPoint {
        value: number;
        category: string;
        color: string;
        selectionId: ISelectionId;
    };

    export class DonutSlicer implements IVisual {
        private target: HTMLElement;
        private updateCount: number;

        constructor(options: VisualConstructorOptions) {
            console.log('Visual constructor', options);
            this.target = options.element;
            this.updateCount = 0;
        }

        public update(options: VisualUpdateOptions) {
            console.log('Visual update', options);
            this.target.innerHTML = `<p>Update count: <em>${(this.updateCount++)}</em></p>`;
        }

        public destroy(): void {
            //TODO: Perform any cleanup tasks here
        }
    }
}