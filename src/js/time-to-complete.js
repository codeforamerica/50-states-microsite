const programCombinationAbbr = {
  'SNAP': 'S',
  'Medicaid': 'M',
  'WIC': 'W',
  'LIHEAP': 'L',
  'SNAP + TANF': 'S + T',
  'SNAP + Medicaid': 'M + S',
  'SNAP + Medicaid + TANF': 'M + S + T', 
  'SNAP + Medicaid + LIHEAP': 'M + S + L',
  'SNAP + TANF + WIC': 'S + T + W',
  'SNAP + TANF + LIHEAP': 'S + T + L',
  'SNAP + Medicaid + TANF + WIC + LIHEAP': 'M + S + T + W + L',
  'SNAP + Medicaid + TANF + LIHEAP': 'M + S + T + L',
  'SNAP + Medicaid + TANF + WIC': 'M + S + T + W',
}

d3.csv("static/completion-time.csv", function(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
  }, function(error, data) {
    if (error) throw error;
    drawChart(data);
});

function drawChart(data) {

  var chartContainer = document.getElementById("time-completion-chart");
  var chartWidth = chartContainer.clientWidth;
  var svg = d3.select(chartContainer).append("svg").attr("width", chartWidth).attr("height", "1400");

  d3.select(chartContainer).select("svg"),
    margin = {top: 20, right: 40, bottom: 0, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var y = d3.scaleBand()
    .rangeRound([0, height])
    .paddingInner(0.05)
    .align(0.1);

  var x = d3.scaleLinear()
    .rangeRound([0, width]);

  var keys = data.columns.slice(1);

  y.domain(data.map(function(d) { return d.State; }));
  x.domain([0, d3.max(data, function(d) { return d.total; })]).nice();

  // Stack the data
  var stackedData = d3.stack().keys(keys)(data);

  // Draw the bars
  var bars = g.append("g")
    .selectAll("g")
    .data(stackedData)
    .enter().append("g")
      .attr("class", function(d) { return "barchart__bar" })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("y", function(d) { return y(d.data.State); })
        .attr("x", function(d) { return x(d[0]); })
        .attr("width", function(d) { return x(d[1]) - x(d[0]); })
        .attr("fill", "#ccc")
        .attr("stroke", "#fff")
        .attr("height", y.bandwidth());
        
  // Show the labels
  g.append("g")
    .selectAll("g")
    .data(stackedData)
    .enter().append("g")
      .attr("class", "barchart__label")
      .selectAll("text")
      .data(function(d) { return d; })
      .enter().append("text")
        .attr("y", function(d) { 
          return y(d.data.State) + y.bandwidth() / 2; 
        })
        .attr("x", function(d) { return x(d[0]); })
        .attr("dx", "5px")
        .attr("dy", "0.3em")
        .attr("style", "font-size: 12px;")
        .text(function(d) {
          if (x(d[1]) - x(d[0]) > 0) {
            return programCombinationAbbr[d3.select(this.parentNode).datum().key];
          }
        });

  // Create the axis
  g.append("g")
    .attr("class", "barchart__axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(y));
}
