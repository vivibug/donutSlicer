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
    };

    /**
    * Function that converts queried data into a view model that will be used by the visual.
    *
    * @function
    * @param {VisualUpdateOptions} options              - Contains references to the size of the container and the dataView which contains all the data the visual has queried.
    * @param {IVisualHost} host                         - Contains references to the host which contains services
    *
    **/
    function visualTransform(options: VisualUpdateOptions, host: IVisualHost): DonutSlicerViewModel {
        // Return null if the data we are expecting is null.
        if (!options
            || !options.dataViews
            || !options.dataViews[0])
            return null;

        let donutDataPoints: DonutSlicerDataPoint[] = [];
        let objects = options.dataViews[0].metadata.objects;

        for (let slice of options.dataViews[0].table.rows) {
            if (slice[1]) {
                donutDataPoints.push({
                    count: slice[0],
                    category: slice[1]
                });
            }
        }

        let viewModel: DonutSlicerViewModel = {
            dataPoints: donutDataPoints
        };

        return viewModel;
    }

    export class DonutSlicer implements IVisual {
        private svg: d3.Selection<SVGElement>;
        private host: IVisualHost;
        private donutDataPoints: DonutSlicerDataPoint[];

        constructor(options: VisualConstructorOptions) {
            this.host = options.host;
            let svg = this.svg = d3.select(options.element)
                .append('svg');
        }

        /**
        * Updates the state of the visual. Every sequential databinding and resize will
        * call update.
        * 
        * @function
        * @param {VisualUpdateOptions} options             - Contains references to the size of the container and the dataView which contains all the data the visual had queried.
        *
        **/
        public update(options: VisualUpdateOptions) {
            /**let data: DonutSlicerDataPoint[] = [
                { count: 10, category: 'Abulia' },
                { count: 20, category: 'Betelgeuse' },
                { count: 30, category: 'Cantaloupe' },
                { count: 40, category: 'Dijkstra'}
            ];**/

            let viewModel: DonutSlicerViewModel = visualTransform(options, this.host);
            let width = options.viewport.width;
            let height = options.viewport.height;
            let radius = Math.min(width, height) / 2;
            var donutWidth = 50;
            var legendRectSize = 18;
            var legendSpacing = 4;

            // Defines a color scale. If there are more than 20 entries in the 
            // dataset, d3 will start to re-use colors.
            let color = d3.scale.category20b();

            var arc = d3.svg.arc()
                .innerRadius(radius - donutWidth)
                .outerRadius(radius);

            // Set the width, height of element.
            var donut = this.svg
                .attr("width", width)
                .attr("height", height)
                .append('g')
                .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');
            
            // Define the start and end angles of the segments in the donut slicer.
            var pie = d3.layout.pie()
                .value(function(d) { return d; });

            var path = donut.selectAll('path')
                .data(pie(viewModel.dataPoints.map(function(n) {
                    return n.count;
                })))
                .enter()
                .append('path')
                .attr('d', <any>arc)
                .attr({
                    d: <any>arc,
                    fill: function(d, i) {
                    return color(<any>i);
                }
            }); 

            var legend = donut.selectAll('.legend')
                .data(color.domain())
                .enter()
                .append('g')
                .attr('class', 'legend')
                .attr('transform', function(d, i) {
                    var height = legendRectSize + legendSpacing;
                    var offset = height * color.domain().length / 2;
                    var horz = -2 * legendRectSize;
                    var vert = i * height - offset;
                    return 'translate('+ horz + ',' + vert + ')';
                });

            // Appending the colored squares for the legend.
            // The fill and stroke are each passed color, from which they can retrieve
            // the appropriate color for the background and border. Each legend element
            // will pass its label into color(); for instance, the first will call
            // color('Abulia') and be given #000000 in return.
            legend.append('rect')
                .attr('width', legendRectSize)
                .attr('height', legendRectSize)
                .style('fill', color)
                .style('stroke', color);

            // Appending the text label for each element of the legend.
            legend.append('text')
                .attr('x', legendRectSize + legendSpacing)
                .attr('y', legendRectSize)
                .text(function(d) { return d; });
        }

        public destroy(): void {
            //TODO: Perform any cleanup tasks here
        }
    }
}