/* Data */

// const files = ['P52_RO09_100.json','P52_RO12_100.json','P52_RO66_100.json'];
const files = $('#list_of_files').data().name
    .replace(/\[/g, '').replace(/\]/g, '')
    .replace(/'/g, '')
    .replace(/ /g, '')
        .split(',').sort();


// const path = '../static/data/';
const path = './data/';

let fileName = 'P52_RO66_1000.json';

Data = () => {
    d3.selectAll('svg').remove();

    // d3.json(path+fileName).then( loadData => {
    d3.json(path+fileName).then( loadData => {

        data = loadData;

        data.forEach(d => {
            d.Time = new Date(d.Time);
        });

        columns = d3.keys(data[0]);
        xColumn = d3.keys(data[0])[0];
        yColumn = d3.keys(data[0])[1];


        slider();

        lineChart = new LineChart("#chart-area");
        timeLine  = new TimeLine("#timeline-area");

        Menu();

    });
};

Data();


const onROColumnClicked = file => {
    fileName = file;
    Data();
};
const onXColumnClicked = column => {
    xColumn = column;
    lineChart.wrangleData();
    timeLine.wrangleData();
};
const onYColumnClicked = column => {
    yColumn = column;
    lineChart.wrangleData();
    timeLine.wrangleData();
};


let flagLinha   = true;
let flagCirculo = false;

const Menu = () => {
    d3.select('#ro-menu').call(dropdownMenu, {
        options: files,
        onOptionClicked: onROColumnClicked,
        selectedOption: fileName
    });

    d3.select('#x-menu').call(dropdownMenu, {
        options: columns,
        onOptionClicked: onXColumnClicked,
        selectedOption: xColumn
    });

    d3.select('#y-menu').call(dropdownMenu, {
        options: columns,
        onOptionClicked: onYColumnClicked,
        selectedOption: yColumn
    });

    d3.select('#linha')
        .on('click', function() {
            flagLinha = !flagLinha
            lineChart.updateVis();
    });

    d3.select('#circulo')
        .on('click', function() {
            flagCirculo = !flagCirculo
            lineChart.updateVis();
    });
};

const dropdownMenu = (selection, props) => {
    const {
        options,
        onOptionClicked,
        selectedOption
    } = props

    let select = selection.selectAll('select')
        .data([null])

    select = select.enter().append('select')
        .attr('class','form-control')
        .merge(select)
            .on('change', function() {
                onOptionClicked(this.value);
            });

    const option = select.selectAll('option').data(options);
    option.enter().append('option')
        .merge(option)
            .attr('value', d => d)
            .property('selected', d => d === selectedOption)
            .text(d => d);
};


/* Slider */
const slider = () => {

    const begin = data[0].Time,
          end   = data[data.length-1].Time;

    // Add jQuery UI slider
    $("#date-slider").slider({
        range: true,
        min: begin.getTime(),
        max: end.getTime(),
        step: 1,
        values: [begin.getTime(), end.getTime()],

        slide: (event, ui) => {

        /* Brush */
            dates = ui.values.map(val => new Date(val));
            xVals = dates.map(date => timeLine.xScale(date));

            timeLine.brushComponent
                .call(timeLine.brush.move, xVals);
        }
    });
};


/* Brush */
const brushed = () => {
    const selection  = d3.event.selection || timeLine.xScale.range(),
          newValues  = selection.map(timeLine.xScale.invert),
          formatTime = d3.timeFormat("[ %H:%M ]");
          formatTimeDay = d3.timeFormat("Dia: %d/%m [ %H:%M ]");

    $("#date-slider")
        .slider('values', 0, newValues[0])
        .slider('values', 1, newValues[1]);
    $("#dateLabel1").text(formatTimeDay(newValues[0]));
    $("#dateLabel2").text(formatTimeDay(newValues[1]));

    lineChart.wrangleData();
};