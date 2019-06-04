/* Constructor */
TimeLine = function(_parentElement){
    this.parentElement = _parentElement;

    this.initVis();
};


// Statis parts
TimeLine.prototype.initVis = function(){
    const vis = this;

    /* SVG */
    vis.margin = { left:80, right:100, top:0, bottom:30 };
    vis.width  = 860 - vis.margin.left - vis.margin.right;
    vis.height = 100 - vis.margin.top  - vis.margin.bottom;

    vis.svg = d3.select(vis.parentElement) // "#chart-area"
        .append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)

    vis.g = vis.svg.append("g")
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);

    vis.t = () => d3.transition().duration(1000);


    /* Axis */
    vis.xAxis = vis.g.append("g")
        .attr("class", "x axistime")
        .attr("transform", `translate(0,${vis.height})`);

    /* Area */
    vis.areaPath = vis.g.append("path")
        .attr("fill", "lightgray");


/* Brush Initialize */
    vis.brush = d3.brushX()
        .handleSize(10)
        .extent([[0, 0], [vis.width, vis.height]])
        .on("brush", brushed);

/* Append Brush Component */
    vis.brushComponent = vis.g.append("g")
        .attr("class", "brush")
        .call(vis.brush);


    vis.wrangleData();
};


// Select Data
TimeLine.prototype.wrangleData = function(){
    const vis = this;

    vis.yValue = yColumn;

    vis.dataTimeFiltered = data;

    vis.updateVis();
};

// Update
TimeLine.prototype.updateVis = function(){
    const vis = this;

    /* Scales */
    vis.xScale = d3.scaleTime()
        .range([0, vis.width]);

    vis.yScale = d3.scaleLinear()
        .range([vis.height, 0]);

    /* Scales */
    vis.xScale.domain(d3.extent(vis.dataTimeFiltered, d => d.Time));
    vis.yScale.domain(d3.extent(vis.dataTimeFiltered, d => d[vis.yValue]));

    /* Axis */
    vis.xAxisCall = d3.axisBottom()
        .ticks()
        .tickFormat(d3.timeFormat('%H:%M'));

    vis.xAxisCall.scale(vis.xScale);
    vis.xAxis
        .transition(vis.t())
        .call(vis.xAxisCall);

    /* Area */
    const area = d3.area()
        .x(d => vis.xScale(d.Time))
        .y0(vis.height)
        .y1(d => vis.yScale(d[vis.yValue]));

    vis.areaPath
        .attr("d", area(vis.dataTimeFiltered));

    // vis.areaPath
    //     .data([vis.dataTimeFiltered])
    //     .attr("d", area);

};
