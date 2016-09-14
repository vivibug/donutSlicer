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

module powerbi.extensibility.visual {

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
        count: number;
        category: string;
        //color: string;
        //selectionId: ISelectionId;
    };

    export class DonutSlicer implements IVisual {
        private svg: d3.Selection<SVGElement>;

        constructor(options: VisualConstructorOptions) {
            let svg = this.svg = d3.select(options.element)
                .append('svg')
                .append('g')
                .classed('donutSlicer', true);
        }

        public update(options: VisualUpdateOptions) {
            let testData: DonutSlicerDataPoint[] = [
                { count: 10, category: 'Abulia' },
                { count: 20, category: 'Betelgeuse' },
                { count: 30, category: 'Cantaloupe' },
                { count: 40, category: 'Dijkstra'}
            ];

            let viewModel: DonutSlicerViewModel = { dataPoints: testData };

            let width = options.viewport.width;
            let height = options.viewport.height;
            let radius = Math.min(width, height) / 2;

            // Defines a color scale. If there are more than 20 entries in the 
            // dataset, d3 will start to re-use colors.
            let color = d3.scale.category20b;

            // Set the width, height of element.
            this.svg.attr({
                width: width,
                height: height
            }); 

            this.svg.attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');

            var arc = d3.svg.arc()
                .innerRadius(0)
                .outerRadius(radius);
        }

        public destroy(): void {
            //TODO: Perform any cleanup tasks here
        }
    }
}