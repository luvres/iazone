/** Constructor **/
LineChart = function(_parentElement){
    this.parentElement = _parentElement;

    this.initVis();
};


/** Static parts **/ 
LineChart.prototype.initVis = function(){
    const vis = this;

    /* SVG */
    vis.margin = { left:80, right:100, top:30, bottom:50 };
    vis.width  = 860 - vis.margin.left - vis.margin.right;
    vis.height = 380 - vis.margin.top  - vis.margin.bottom;

    vis.svg = d3.select(vis.parentElement) // "#chart-area"
        .append('svg')
        .attr('width', vis.width + vis.margin.left + vis.margin.right)
        .attr('height', vis.height + vis.margin.top + vis.margin.bottom)

    vis.g = vis.svg.append('g')
            .attr('transform', `translate(${vis.margin.left}, ${vis.margin.top})`);

    vis.t = () => d3.transition().duration(750);


    /* Axis */
    vis.xAxis = vis.g.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${vis.height})`);

    vis.yAxis = vis.g.append('g')
        .attr('class', 'y axis');


    /* Line */
    vis.g.append('path').attr('class', 'line');


    /* Labels */
    vis.xLabel = vis.g.append('text')
        .attr('class', 'x axisLabel')

    vis.yLabel = vis.g.append('text')
        .attr('class', 'y axisLabel')
        .attr('transform', 'rotate(-90)')


    vis.wrangleData();
};


/** Select Data **/ 
LineChart.prototype.wrangleData = function(){
    const vis = this;

    vis.xValue = xColumn;
    vis.yValue = yColumn;

    vis.sliderValues = $('#date-slider').slider('values');
    vis.dataTimeFiltered = data.filter(d => (
        (d.Time >= vis.sliderValues[0]) && (d.Time <= vis.sliderValues[1]))
    );

    vis.updateVis();
};


/** Update **/ 
LineChart.prototype.updateVis = function(){
    const vis = this;

    /* Scales */
    vis.xScale = ((xColumn === 'Time')
                   ? d3.scaleTime()
                   : d3.scaleLinear())
        .range([0, vis.width])
        .domain(d3.extent(vis.dataTimeFiltered, d => d[vis.xValue]));

    vis.yScale = ((yColumn === 'Time')
                   ? d3.scaleTime()
                   : d3.scaleLinear())
        .range([vis.height, 0])
        .domain(d3.extent(vis.dataTimeFiltered, d => d[vis.yValue]));


    /* Axis */
    vis.xAxisCall = d3.axisBottom()
            .ticks(5)
            .tickSizeInner(-vis.height)
            .tickSizeOuter(-vis.height)
            .tickPadding(10)
        .tickFormat(
            (xColumn === 'Time')
                ? d3.timeFormat('%H:%M')
                : d3.format('.2f')
        );

    vis.xAxisCall.scale(vis.xScale);
    vis.xAxis
        .transition(vis.t())
        .call(vis.xAxisCall);


    vis.yAxisCall = d3.axisLeft()
            .ticks()
            .tickSizeInner(-vis.width)
            .tickSizeOuter(-vis.width)
            .tickPadding(10)
        .tickFormat(
            (yColumn === 'Time')
                ? d3.timeFormat('%H:%M')
                : d3.format('.2f')
        )

    vis.yAxisCall.scale(vis.yScale);
    vis.yAxis
        .transition(vis.t())
        .call(vis.yAxisCall);


    /* Labels */
    vis.xLabel.attr('y', vis.height + vis.margin.bottom*.8)
        .attr('x', vis.width / 2)
        .attr('font-size', '15px')
        .attr('text-anchor', 'middle')
        .text(xColumn);

    vis.yLabel
        .attr('y', -60).attr('x', -170)
        .attr('font-size', '15px').attr('text-anchor', 'middle')
        .text(yColumn)


    vis.line();

    vis.scatter();
};


/** Plot Line **/
LineChart.prototype.line = function(){
    const vis = this;

    const line = d3.line()
        .x(d => vis.xScale(d[vis.xValue]))
        .y(d => vis.yScale(d[vis.yValue]));

    vis.g.select(".line")
        .attr('opacity', (flagLinha) ? 1.0 : 0.0)
        .transition()
        .attr("d", line(vis.dataTimeFiltered));
};


/** Plot Scatter **/
LineChart.prototype.scatter = function(){
    const vis = this;

    circle = vis.g.selectAll('circle').data(vis.dataTimeFiltered);

    circle.exit().remove()

    circle
        .enter().append('circle')
        .merge(circle)
            .attr('opacity', (flagCirculo) ? 0.5 : 0.0)
            .attr('cx', vis.width / 2)
            .attr('cy', vis.height / 2)
            .attr('r', 0)
          .transition().delay((d, i) => i * 0.5)
            .attr('cx', d => vis.xScale(d[vis.xValue]))
            .attr('cy', d => vis.yScale(d[vis.yValue]))
            .attr('r', 7);
};