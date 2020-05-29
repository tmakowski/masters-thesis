let IAOReader = class {
    width = 1280;
    height = 720;
    margin = 30;

    constructor() {
        var plot_div = d3.select("div#plot");
        var svg = plot_div.select("svg");

        // Creating the SVG if it does not exist.
        if (svg.empty()) {
            // TODO: remove redundant parameters
            svg = plot_div.append("svg")
                .attr("_x", this.width)
                .attr("_y", this.height)
                .attr("_margin", this.margin)
                .attr("viewBox", "0 0 " + this.width + " " + this.height);
        }

        this.plot_settings = new PlotSettings(svg, this.margin);
        this.svg = svg;
    }

    draw_data(plot_info) {
        var svg = this.svg;
        var x = svg.attr("_x"), y = svg.attr("_y"), margin = svg.attr("_margin");
        // Unpacking informations from plot_info JSON.
        var seq_len = plot_info.seq_len;
        var plot_data = plot_info.plot_data;


        // Transforming and preparing the data.
        var n = plot_data.Start.length;
        // TODO: account for varying number of files (modify colors of lines too).
        var plot_data_transformed = d3
            .range(n)
            .map(
                function(i) {
                    return {
                        Start: plot_data.Start[i],
                        End: plot_data.End[i],
                        FileName: plot_data.FileName[i],
                        y: i + 1
                    }
                }
            );


        // Creating X axis if it does not exist.
        var g_x_axis = svg.select("g#x_axis");
        if (g_x_axis.empty()) {
            g_x_axis = svg
                .append("g")
                    .attr("id", "x_axis")
                    .attr(
                        "transform",
                        "translate(0, " + (y - margin) + ")"
                    );
        }

        var x_scale = d3.scaleLinear()
            .domain([1, seq_len])
            .range([0 + margin, x - margin]);

        var x_axis = d3.axisBottom().scale(x_scale);

        g_x_axis.call(x_axis);


        // Creating Y axis if it does not exist.
        var g_y_axis = svg.select("g#y_axis");
        if (g_y_axis.empty()) {
            g_y_axis = svg
                .append("g")
                    .attr("id", "y_axis")
                    .attr("transform", "translate(" + margin + ", 0)");
        }

        var y_scale = d3.scaleLinear()
            .domain([1, n])
            .range([y - margin, 0 + margin]);

        var y_axis = d3.axisLeft().scale(y_scale);

        g_y_axis.call(y_axis);


        // Creating lines g if it does not exist
        var g_lines = svg.select("g#lines");
        if (g_lines.empty()) {
            g_lines = svg
                .append("g")
                    .attr("id", "lines");
        }


        // Drawing the lines.
        g_lines
            .selectAll("line")
                .data(plot_data_transformed)
                .join("line")
                    .attr("x1", d => x_scale(d.Start))
                    .attr("y1", d => y_scale(d.y))
                    .attr("x2", d => x_scale(d.End))
                    .attr("y2", d => y_scale(d.y))
                    .style("stroke-width", 2)
                    .style("stroke", "black");


    }


    // TODO: add plot settings parameters object.
    // TODO: move axis creation, scales, max_seq_len etc. to this class.
}


// This variable has valueu assigned by Shiny main server function.
var iaoreader;

//    x_axis = {
//        domain: {
//            min: 1,
//            max: 2
//        },
//        scale: function() {
//            return d3.scaleLinear().domain([this.x_axis.domain.min, this.x_axis.domain.max]).range([this.margin, this.width - this.margin]);
//        }
//    }
//    get x_scale() {
//        // TODO: on scale update redraw the data.
//        return d3.scaleLinear().domain([this.x_axis.domain.min, this.x_axis.domain.max]).range([this.margin, this.width - this.margin]);
//    }
