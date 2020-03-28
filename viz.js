var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

function rt_to_obj(rt) {
    var x = rt.x;
    var y = rt.y;
    var n = y.length;
    var p = x.length;
    var obj = []

    for(var i=0; i < n; i++) {
        obj[i] = {'y': y[i]}

        for(var j=0; j < p; j++) {
            obj[i]['x_' + j] = x[j][i]
        }
    }
    return(obj);
}

var tree_data = rt_to_obj(rt);

var xScale = d3.scaleLinear()
    .domain([d3.min(rt.x[0]), d3.max(rt.x[0])])
    .range([0, width])

var yScale = d3.scaleLinear()
    .domain([d3.min(rt.y), d3.max(rt.y)])
    .range([height, 0])

var svg = d3.select('body')
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.selectAll('circle')
    .data(tree_data)
    .enter()
    .append('circle')
    .attr("r", 3.5)
    .attr("cx", function(d) { return(xScale(d.x_0)) })
    .attr("cy", function(d) { return(yScale(d.y)) })

function update_plot(svg, split, x_ix, p_ix) {
    d3.select('#left-mean')
        .remove()

    d3.select('#right-mean')
        .remove()

    d3.select('#part')
        .remove()

    svg.append('svg:line')
        .attr('id', 'left-mean')
        .attr('x1', xScale(d3.min(rt.x[p_ix]))) // left end
        .attr('x2', xScale(tree_data[x_ix]['x_' + p_ix])) // right end
        .attr('y1', yScale(split.left_mean))
        .attr('y2', yScale(split.left_mean))
        .style('stroke', 'black')

    // Visualize the right mean
    svg.append('svg:line')
        .attr('id', 'right-mean')
        .attr('x1', xScale(tree_data[x_ix]['x_' + p_ix])) // right end
        .attr('x2', xScale(d3.max(rt.x[p_ix]))) // left end
        .attr('y1', yScale(split.right_mean))
        .attr('y2', yScale(split.right_mean))
        .style('stroke', 'black')

    // Visualize the partition
    svg.append('svg:line')
        .attr('id', 'part')
        .attr('x1', xScale(tree_data[x_ix].x_0)) // left end
        .attr('x2', xScale(tree_data[x_ix].x_0)) // left end
        .attr('y1', yScale(0))
        .attr('y2', yScale(d3.max(rt.y)))
        .style('stroke', 'black')
}

function Redrawer() {
    var timeout;

    var it = 0;
    this.start = start;
    this.stop = stop;

    function start() {
        timeout = setTimeout(loop, 0);
    }

    function stop() {
        clearTimeout(timeout);
    }

    function loop() {
        timeout = setTimeout(loop, 300);
        var node = rt.get_node(0);
        var split = node.get_ss_split(it);
        update_plot(svg, split, it, 0);
        it += 1;
    }
}

var redrawer = new Redrawer();
redrawer.start()