class RocketProgressBar {
  /**
   * Creates an instance of RocketProgressBar and creates an svg for the graph
   *
   * @constructor
   * @author victoragcosta
   * @param {string} selector A CSS like selector representing the element to put the graph inside
   */
  constructor(selector) {
    this._data = 0;

    let div = d3.select(selector);

    this.width = div.node().getBoundingClientRect().width;
    this.height = 400;
    this.margin = {
      top: 150,
      bottom: 0,
      left: 0,
      right: 0,
    };

    this.svg = div.append("svg");

    // Create graph with 0,0 at the bottom center
    this.chart = this.svg
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("font-family", "sans-serif")
      .attr("fill", "steelblue")
      .style("display", "block")
      .append("g")
      .attr(
        "transform",
        `translate(${this.width / 2},${this.height - this.margin.bottom})` +
          " scale(1,-1)"
      );

    this.y = d3
      .scaleLinear()
      .clamp(false)
      .domain([0, 1])
      .rangeRound([0, this.height - this.margin.top - this.margin.bottom]);

    // Create graphical elements
    this.createElements().then(() => {
      // Render animations and positioning
      this.render();
    });
  }

  // TODO: Make compatible with transitions
  axisGenerator(scale, ticks, length = 50, thickness = 4, outerSize = 120) {
    return (chart) => {
      chart
        .selectAll("g.ticks")
        .data(ticks, (d) => d)
        .join("g")
        .attr("class", "ticks")
        .attr("opacity", "1")
        .attr("transform", (d) => `translate(0,${scale(d)})`)
        .call((g) =>
          g
            .append("rect")
            .style("fill", "currentColor")
            .attr("x", -length / 2)
            // .attr("y", -thickness / 2)
            .attr("width", length)
            .attr("height", thickness)
        )
        .call((g) =>
          g
            .append("line")
            .style("stroke", "currentColor")
            .style("stroke-width", "0.5")
            .attr("x1", (d, i) => (i % 2 ? -length / 2 : length / 2))
            .attr("y1", thickness / 2)
            .attr("x2", (d, i) => (i % 2 ? -outerSize : outerSize))
            .attr("y2", thickness / 2)
        )
        .call((g) =>
          g
            .append("text")
            .style("fill", "currentColor")
            .attr("transform", "scale(1,-1)")
            .attr("x", (d, i) => (i % 2 ? -outerSize : outerSize))
            .attr("y", 0)
            .attr("dy", "-0.35em")
            .style("text-anchor", (d, i) => (i % 2 ? "start" : "end"))

            .text(d3.format("~%"))
        );
    };
  }

  // TODO: Create Rocket
  createRocket() {
    return d3
      .xml("../img/foguete3.svg")
      .then((data) => d3.select(data).select("defs").select("path"));
  }

  createSmoke(element, scale = 1.8) {
    let smokeColor = "#cbcbcb";
    // Create path
    let path = element
      .append("path")
      .attr(
        "d",
        "m 10 0 v 10 c 0 14 -8 7 -5 4 c -6 1 -5 9 0 9 c 1 0 3 1 7 -3 c 4 4 6 3 7 3 c 5 0 6 -8 0 -9 c 3 3 -5 10 -5 -4 v -10 z "
      )
      .attr("opacity", "0.9")
      .style("mix-blend-mode", "multiply")
      .style("fill", smokeColor);

    // Get size
    let { width, height } = path.node().getBBox();

    // align 0,0 to mid bottom and scale up
    path.attr(
      "transform",
      `translate(${(-width * scale) / 2},${
        height * scale
      }) scale(${scale},${-scale})`
    );

    // Add growing bar
    element
      .append("rect")
      .style("fill", smokeColor)
      .attr("opacity", 0.9)
      .attr("x", -scale * 1.2)
      .attr("y", 23 * scale)
      .attr("width", scale * 4)
      .attr("height", 10);
  }

  createElements() {
    // Create axis Y
    let domain = this.y.domain();
    let yAxisGen = this.axisGenerator(
      this.y,
      d3.ticks(domain[0], domain[1], 4)
    );
    this.yAxis = this.chart.append("g").call(yAxisGen);

    // Create smokes
    this.smokes = this.chart.append("g").attr("class", "smokes");
    let smoke = this.smokes.append("g").attr("class", "smoke");
    let scale = 1.5;
    this.createSmoke(smoke.attr("transform", "translate(3,10)"), scale);

    smoke = this.smokes.append("g").attr("class", "rocket-smoke");
    scale = 2;
    this.createSmoke(smoke.attr("transform", "translate(15,0)"), scale);

    smoke = this.smokes.append("g").attr("class", "rocket-smoke");
    scale = 1.8;
    this.createSmoke(smoke.attr("transform", "translate(-15,3)"), scale);

    return this.createRocket().then((data) => {
      // Create rocket container
      this.rocket = this.chart.append("g");
      // Add rocket to svg
      this.rocket.node().append(data.node());

      // Calculate rocket size
      let bBox = data.node().getBBox();
      this.rocketWidth = bBox.width;
      this.rocketHeight = bBox.height;

      // Center rocket
      data.attr(
        "transform",
        `translate(${-this.rocketWidth / 2},${this.rocketHeight * 0.78})` +
          " scale(1,-1)"
      );
    });
  }

  render() {
    const y = this.y;
    const t = this.svg.transition().duration(3000).ease(d3.easeBack);

    this.rocket
      .transition(t)
      .attr("transform", `translate(0,${y(this._data)})`);

    let data = this._data;
    let oldHeight = +this.smokes.select("rect").attr("height");
    this.smokes
      .selectAll("rect")
      .transition(t)
      .attrTween("height", function (d) {
        return function (t) {
          let out = (y(data) - oldHeight) * t + oldHeight;
          if (out >= 0) return out;
          return 0;
        };
      });

    if (this._data > y.domain()[1]) {
      this.chart
        .transition(t)
        .attr(
          "transform",
          `translate(${this.width / 2},${
            this.margin.top + y(this._data) - this.margin.bottom
          })` + " scale(1,-1)"
        );
      let yAxisGen = this.axisGenerator(
        y,
        d3.ticks(y.domain()[0], y.domain()[1], 4).concat([this._data])
      );
      this.yAxis.call(yAxisGen);
    } else {
      this.chart
        .transition(t)
        .attr(
          "transform",
          `translate(${this.width / 2},${this.height - this.margin.bottom})` +
            " scale(1,-1)"
        );
      let yAxisGen = this.axisGenerator(
        y,
        d3.ticks(y.domain()[0], y.domain()[1], 4)
      );
      this.yAxis.call(yAxisGen);
    }
  }

  get data() {
    return this._data;
  }

  set data(data) {
    this._data = data;
    this.render();
  }
}
